import React, { useEffect } from "react";
import { useDatabase } from "@nozbe/watermelondb/hooks";
import { Q } from "@nozbe/watermelondb";
import { Text, View } from "react-native";
import { modelName } from "../../models/constant";
import { isSyncableModel } from "../../models/interfaces/SyncableModel";

export default function LocalChangeList() {
    const database = useDatabase();

    const getLocalChanges = async () => {
        try {
            for (const model of Object.values(modelName)) {
                const changedRows = await database.get(model).query(
                    Q.where("_status", Q.notEq("synced"))
                ).fetch();
    
                changedRows.forEach((row) => {
                    if (isSyncableModel(row)) {
                        console.log(row.getBriefIdentifier());
                    }
                });
            }
        } catch (e) {

        }
    }

    useEffect(() => {
        getLocalChanges();
    }, []);

    return (
        <View>
            
        </View>
    );
}
