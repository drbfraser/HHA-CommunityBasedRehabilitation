import { apiFetch, Endpoint, ClientField, updateClientfieldLabels, AdminField, adminUserFieldLabels } from "@cbr/common";
import { synchronize } from "@nozbe/watermelondb/src/sync";
import { dbType } from "./watermelonDatabase";

//@ts-ignore
import SyncLogger from "@nozbe/watermelondb/sync/SyncLogger";

import { store } from '../redux/store';
import { addSyncConflicts } from '../redux/actions';

export const logger = new SyncLogger(10 /* limit of sync logs to keep in memory */);

export async function SyncDB(database: dbType) {
    await synchronize({
        database,
        pullChanges: async ({ lastPulledAt }) => {
            const urlParams = `?last_pulled_at=${lastPulledAt}`;
            const response = await apiFetch(Endpoint.SYNC, urlParams);
            if (!response.ok) {
                throw new Error(await response.text());
            }

            const { changes, timestamp } = await response.json();
            console.log(JSON.stringify({ changes, timestamp }));
            await getImage(changes);
            return { changes, timestamp };
        },
        pushChanges: async ({ changes, lastPulledAt }) => {
            console.log("starting push");
            console.log(JSON.stringify(changes));
            const urlParams = `/?last_pulled_at=${lastPulledAt}`;
            const init: RequestInit = {
                method: "POST",
                body: JSON.stringify(changes),
            };
            const response = await apiFetch(Endpoint.SYNC, urlParams, init);
            console.log("pushed");
            console.log(JSON.stringify(response));
            if (!response.ok) {
                throw new Error(await response.text());
            }
        },
        migrationsEnabledAtVersion: 1,
        log: logger.newLog(),
        conflictResolver: conflictResolver,
    });
}

async function getImage(changes) {
    await getImageData(changes["clients"]["created"], Endpoint.CLIENT_PICTURE);
    await getImageData(changes["clients"]["updated"], Endpoint.CLIENT_PICTURE);
    await getImageData(changes["referrals"]["created"], Endpoint.REFERRAL_PICTURE);
    await getImageData(changes["referrals"]["updated"], Endpoint.REFERRAL_PICTURE);
}

async function getImageData(changes, endpoint) {
    await Promise.all(
        changes.map(async (element) => {
            if (element.picture != null) {
                await apiFetch(endpoint, `${element.id}`)
                    .then((resp) => resp.blob())
                    .then((blob) => {
                        let reader = new FileReader();
                        reader.onload = () => {
                            element.picture = reader.result as string;
                        };
                        reader.readAsDataURL(blob);
                    });
            }
        })
    );
}

function riskResolver(raw, dirtyRaw, newRaw, column, timestamp) {
    if (raw[timestamp] > dirtyRaw[timestamp]) {
        return true;
    } else {
        newRaw[column] = dirtyRaw[column];
        newRaw[timestamp] = dirtyRaw[timestamp];
        return false;
    }
}

const referralConflictFields = new Set(["outcome"]);
const clientConflictFields = new Set([
    ClientField.birth_date,
    ClientField.caregiver_email,
    ClientField.caregiver_name,
    ClientField.caregiver_phone,
    ClientField.caregiver_present,
    ClientField.disability,
    ClientField.educat_risk_level,
    ClientField.first_name,
    ClientField.gender,
    ClientField.health_risk_level,
    ClientField.last_name,
    ClientField.other_disability,
    ClientField.phone_number,
    ClientField.social_risk_level,
    ClientField.village,
    ClientField.zone,
]);

const userConflictFields = new Set([
    AdminField.first_name,
    AdminField.last_name,
    AdminField.phone_number,
    AdminField.role,
    AdminField.zone,
]);

const conflictFields = {
    clients: clientConflictFields,
    referrals: referralConflictFields,
    users: userConflictFields,
};

function conflictResolver(tableName, raw, dirtyRaw, newRaw) {
    let localChange = false;

    let clientConflicts = {};
    let userConflicts = {};

    const recordConflict = (column, raw, newRaw) => {
        if (conflictFields[tableName].has(column)) {
            if (tableName == "clients") {
                if (!clientConflicts[raw.id]) {
                    clientConflicts[raw.id] = {
                        name: raw.full_name,
                        rejected: [],
                    };
                }

                clientConflicts[raw.id].rejected.push({
                    column: updateClientfieldLabels[column],
                    rejChange: newRaw[column],
                });
            } else if (tableName == "users") {
                if (!userConflicts[raw.id]) {
                    userConflicts[raw.id] = {
                        name: `${raw.first_name} ${raw.last_name}`,
                        rejected: [],
                    };
                }

                userConflicts[raw.id].rejected.push({
                    column: adminUserFieldLabels[column],
                    rejChange: newRaw[column],
                });
            }
        }
    };

    raw._changed.split(",").forEach((column) => {
        if (
            ["health_timestamp", "educat_timestamp", "social_timestamp"].some((a) => a !== column)
        ) {
            if (
                ["health_risk_level", "educat_risk_level", "social_risk_level"].some(
                    (a) => a === column
                )
            ) {
                let riskType = column.split("_")[0];
                if (riskResolver(raw, dirtyRaw, newRaw, column, `${riskType}_timestamp`)) {
                    localChange = true;
                } else {
                    recordConflict(column, raw, newRaw);
                }
            } else if (column === "last_visit_date") {
                // if local last visit date is greater than server last visit date, then take local version
                if (raw[column] > dirtyRaw[column]) {
                    localChange = true;
                } else {
                    newRaw[column] = dirtyRaw[column];
                    recordConflict(column, raw, newRaw);
                }
            } else if (column === "picture") {
                // if server image is null, then will push local changes up instead
                if (dirtyRaw[column] == null) {
                    localChange = true;
                } else {
                    newRaw[column] = dirtyRaw[column];
                    recordConflict(column, raw, newRaw);
                }
            } else if (column === "disability") {
                /* Server stores disabilities as [1, 2, ....] whereas
                   local stores disabilities as [1,2,...] so there is 
                   always a 'conflict' */
                if (newRaw[column].replace(",", ", ") == dirtyRaw[column]) {
                    localChange = true;
                } else {
                    newRaw[column] = dirtyRaw[column];
                    recordConflict(column, raw, newRaw);

                    
                }
            } else {
                /* This is always server-side wins unless in cases specified above */
                newRaw[column] = dirtyRaw[column];
                recordConflict(column, raw, newRaw);
            }
        }
    });

    if (!localChange) {
        if (newRaw["_changed"] !== "") {
            newRaw["_changed"] = "";
        }
        if (newRaw["_status"] == "updated") {
            newRaw["_status"] = "synced";
        }
    }

    store.dispatch(addSyncConflicts(clientConflicts, userConflicts));

    return newRaw;
}
