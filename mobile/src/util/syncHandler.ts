import { apiFetch, Endpoint } from "@cbr/common";
import { synchronize } from "@nozbe/watermelondb/sync";
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
            const response = await fetch(`https://my.backend/sync?last_pulled_at=${lastPulledAt}`, {
                method: "POST",
                body: JSON.stringify(changes),
            });
            if (!response.ok) {
                throw new Error(await response.text());
            }
        },
        migrationsEnabledAtVersion: 1,
        log: logger.newLog(),
    });
}
