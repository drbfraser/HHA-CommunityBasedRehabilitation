import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";

import schema from "../models/schema";
import migrations from "../models/migrations";
import { dbModels } from "../models";

const adapter = new SQLiteAdapter({
    schema,
    migrations,
    jsi: false,
    //onsetuperror does not work with ts, must use js to use
    /*
    onSetUpError: (_error) => {
        // Database failed to load -- offer the user to reload the app or log out
    },
    */
});

export const database = new Database({
    adapter,
    modelClasses: dbModels,
});
