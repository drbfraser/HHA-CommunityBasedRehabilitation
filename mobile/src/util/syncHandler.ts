import { apiFetch, Endpoint } from "@cbr/common";
import { synchronize } from "@nozbe/watermelondb/src/sync";
import { dbType } from "./watermelonDatabase";

//@ts-ignore
import SyncLogger from "@nozbe/watermelondb/sync/SyncLogger";

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

function conflictResolver(tableName, raw, dirtyRaw, newRaw) {
    let riskChange = false;

    raw._changed.split(",").forEach((column) => {
        if (column == "health_risk_level" || "educat_risk_level" || "social_risk_level") {
            riskChange = true;
        } else {
            newRaw[column] = dirtyRaw[column];
        }
    });

    if (!riskChange) {
        if (newRaw["_changed"] !== "") {
            newRaw["_changed"] = "";
        }
        if (newRaw["_status"] == "updated") {
            newRaw["_status"] = "synced";
        }
    }

    return newRaw;
}
