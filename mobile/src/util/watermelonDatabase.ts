import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";
import { getI18nInstance } from "@cbr/common";

import schema from "../models/schema";
import migrations from "../models/migrations";
import { dbModels } from "../models";
import { isReadOnly, isWriteBypassed, ReadOnlyModeError } from "./readOnlyMode";
import { showGenericAlert } from "./genericAlert";

const adapter = new SQLiteAdapter({
    schema,
    migrations,
    jsi: false,
});

export const database = new Database({
    adapter,
    modelClasses: dbModels,
});

// Read-only guard (see docs/DESIGN-mobile-version-check-and-readonly.md §5.2).
// Every local mutation in the app runs inside `database.write()`, so wrapping
// this single method blocks all creates/updates/deletes/batches when the app is
// in read-only mode. Reads and queries are untouched. We reject rather than
// silently drop the work so callers never record a false success, and surface
// one standard message from here instead of editing every write call site.
//
// The sync engine is exempt: it wraps its own writes in `runWithWriteBypass()`
// (see readOnlyMode.ts) so pulling data / resetting the DB during a sync is
// allowed even in read-only mode — that resync is how the user leaves read-only.
type WriteFn = typeof database.write;
const originalWrite: WriteFn = database.write.bind(database);
database.write = ((work, description) => {
    if (isReadOnly() && !isWriteBypassed()) {
        const t = getI18nInstance().t;
        showGenericAlert(t("alert.readOnlyModeTitle"), t("alert.readOnlyModeMessage"));
        return Promise.reject(new ReadOnlyModeError());
    }
    return originalWrite(work, description);
}) as WriteFn;

export type dbType = typeof database;
