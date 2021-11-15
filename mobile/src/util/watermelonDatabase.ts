import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";

import schema from "../models/schema";
import migrations from "../models/migrations";
import { dbModels } from "../models";

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
