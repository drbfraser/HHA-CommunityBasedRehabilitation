import React, { useState, useEffect } from "react";
import { useDatabase } from "@nozbe/watermelondb/hooks";
import { Q } from "@nozbe/watermelondb";
import { Text, View } from "react-native";
import { modelName } from "../../models/constant";
import { isSyncableModel } from "../../models/interfaces/SyncableModel";
import { useTranslation } from "react-i18next";

export default function LocalChangeList() {
    const [error, setError] = useState<boolean>(false);
    const [localChanges, setLocalChanges] = useState<Array<string>>();
    
    const { t } = useTranslation();

    const database = useDatabase();

    const getLocalChanges = async () => {
        try {
            let allLocalChanges: Array<string> = [];

            for (const model of Object.values(modelName)) {
                const changedRows = await database
                    .get(model)
                    .query(Q.where("_status", Q.notEq("synced")))
                    .fetch();

                await changedRows.forEach(async (row) => {
                    if (isSyncableModel(row)) {
                        const identifier: string = await row.getBriefIdentifier();
                        allLocalChanges.push(identifier);
                    }
                });
            }

            setLocalChanges(allLocalChanges);
        } catch (e) {
            setError(true);
        }
    };

    useEffect(() => {
        getLocalChanges();
    }, []);

    return (
        <View style={{ marginTop: 5 }}>
            {localChanges && localChanges.length > 0 && !error ? (
                <View>
                    {localChanges.map((change, index) => (
                        <Text
                            style={{ paddingHorizontal: 10, marginTop: 5, color: "black" }}
                            key={index}
                        >
                            {"\u2B24"} {change}
                        </Text>
                    ))}
                </View>
            ) : (
                <Text
                    style={{
                        paddingHorizontal: 10,
                        marginTop: 5,
                        color: "black",
                        fontSize: 15,
                        fontWeight: "bold",
                    }}
                >
                    {t("alert.missingLocalChanges")}
                </Text>
            )}
            {error ? (
                <Text style={{ paddingHorizontal: 10, marginTop: 5, color: "red" }}>
                    {t("alert.actionFailure", {action: t("general.fetch"), object: "general.localChanges"})}
                </Text>
            ) : (
                <></>
            )}
        </View>
    );
}
