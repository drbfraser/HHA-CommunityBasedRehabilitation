import { apiFetch, Endpoint } from "@cbr/common";
import { synchronize } from "@nozbe/watermelondb/src/sync";
import { dbType } from "./watermelonDatabase";

//@ts-ignore
import SyncLogger from "@nozbe/watermelondb/sync/SyncLogger";
import { stringify } from "querystring";

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
    await getClientImage(changes["clients"]["created"]);
    await getClientImage(changes["clients"]["updated"]);
}

async function getClientImage(changes) {
    await Promise.all(
        changes.map(async (element) => {
            if (element.picture != null) {
                await apiFetch(Endpoint.CLIENT_PICTURE, `${element.id}`)
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

function conflictResolver(tableName, raw, dirtyRaw, newRaw) {
    let localChange = false;
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
                }
            } else if (column === "last_visit_date") {
                // if local last visit date is greater than server last visit date, then take local version
                if (raw[column] > dirtyRaw[column]) {
                    localChange = true;
                } else {
                    newRaw[column] = dirtyRaw[column];
                }
            } else if (column === "picture") {
                // if server image is null, then will push local changes up instead
                if (dirtyRaw[column] == null) {
                    localChange = true;
                } else {
                    newRaw[column] = dirtyRaw[column];
                }
            } else {
                newRaw[column] = dirtyRaw[column];
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

    return newRaw;
}
