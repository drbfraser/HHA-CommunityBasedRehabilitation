import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";

import schema from "../model/schema";
import migrations from "../model/migrations";
import { dbModels } from "../model";

const adapter = new SQLiteAdapter({
    schema,
    migrations,
    jsi: false,
});

export const database = new Database({
    adapter,
    modelClasses: dbModels,
});

export type dbType = typeof database;
