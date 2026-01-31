import React, { useEffect, useState } from "react";
import { Text, View, Image } from "react-native";
import { Button, Portal, List, Dialog } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import { themeColors } from "@cbr/common";
import useStyles from "./ConflictDialog.styles";
import { RootState } from "../../redux";
import { clearSyncConflicts } from "../../redux/actions";
import { useSelector, useDispatch } from "react-redux";
import { useDatabase } from "@nozbe/watermelondb/hooks";
import { modelName } from "../../models/constant";
import {
    RejectedColumn,
    SyncConflict,
    userConflictTitle,
    clientConflictTitle,
} from "../../util/syncConflictConstants";
import { objectFromMap } from "../../util/ObjectFromMap";
import { useDisabilities } from "@cbr/common/src/util/hooks/disabilities";
import { useTranslation } from "react-i18next";
import Client from "@/src/models/Client";

const ConflictDialog = () => {
    const styles = useStyles();
    const dispatch = useDispatch();
    const database = useDatabase();
    const { t } = useTranslation();

    const disabilityMap = useDisabilities(t);
    const disabilityObj = objectFromMap(disabilityMap);

    const {
        cleared,
        clientConflicts: storeClientConflicts,
        userConflicts: storeUserConflicts,
    } = useSelector((state: RootState) => state.conflicts);

    const [clientConflicts, setClientConflicts] = useState<Map<string, SyncConflict>>(new Map());
    const [userConflicts, setUserConflicts] = useState<Map<string, SyncConflict>>(new Map());
    const [dialogVisible, setDialogVisible] = useState<boolean>(false);

    const updateNames = async () => {
        const clientIds: string[] = Array.from(storeClientConflicts.keys());
        const clients: Map<string, SyncConflict> = new Map(storeClientConflicts);

        await Promise.all(
            clientIds.map(async (id) => {
                const conflict = clients.get(id);
                if (!conflict) return;

                // Fetch missing client name if necessary
                if (!conflict.name) {
                    const client = await database.get<Client>(modelName.clients).find(id);
                    conflict.name = client.full_name;
                }

                // Replace disability IDs with names
                const disabilities = conflict.rejected.find((rej) => rej.column === "Disabilities");

                if (disabilities) {
                    const disabilitiesArr = disabilities.rejChange.slice(1, -1).split(",");
                    disabilities.rejChange = disabilitiesArr
                        .map((d) => disabilityObj[d])
                        .join(", ");
                }
            }),
        );

        setClientConflicts(clients);
        setUserConflicts(new Map(storeUserConflicts));
    };

    useEffect(() => {
        if (!cleared) {
            if (storeClientConflicts.size > 0 || storeUserConflicts.size > 0) {
                updateNames().then(() => setDialogVisible(true));
            }
        } else {
            setDialogVisible(false);
        }
    }, [cleared, storeClientConflicts, storeUserConflicts]);

    const onClose = () => {
        dispatch(clearSyncConflicts());
        setDialogVisible(false);
        setClientConflicts(new Map());
        setUserConflicts(new Map());
    };

    return (
        <Portal>
            <Dialog visible={dialogVisible} style={styles.conflictDialog} onDismiss={onClose}>
                <Dialog.Title style={styles.conflictDialogTitle}>
                    <Text>Sync Conflicts</Text>
                </Dialog.Title>
                <Dialog.Content style={styles.conflictDialogContent}>
                    <Text style={styles.conflictMessage}>{t("alert.unsyncedFailure")}</Text>
                    <ScrollView>
                        {clientConflicts.size > 0 && (
                            <List.Accordion
                                theme={{ colors: { background: themeColors.blueBgLight } }}
                                title={clientConflictTitle}
                            >
                                {Array.from(clientConflicts.keys()).map((id, ind) => (
                                    <View
                                        key={`client_${id}`}
                                        style={{
                                            marginBottom: ind === clientConflicts.size - 1 ? 15 : 0,
                                        }}
                                    >
                                        <Text style={styles.conflictName}>
                                            {clientConflicts.get(id)?.name}
                                        </Text>
                                        {clientConflicts.get(id)?.rejected.map((rej) => {
                                            const keyId = `${id}_${rej.column}`;
                                            return rej.column === "Picture" ? (
                                                <View key={keyId}>
                                                    <Text style={styles.conflictContentBold}>
                                                        {t("clientAttr.picture")}:{" "}
                                                    </Text>
                                                    <Image
                                                        style={styles.conflictPicture}
                                                        source={{ uri: rej.rejChange }}
                                                    />
                                                </View>
                                            ) : (
                                                <View key={keyId}>
                                                    <Text>
                                                        <Text style={styles.conflictContentBold}>
                                                            {rej.column}:{" "}
                                                        </Text>
                                                        <Text style={styles.conflictContent}>
                                                            {rej.rejChange}
                                                        </Text>
                                                    </Text>
                                                </View>
                                            );
                                        })}
                                    </View>
                                ))}
                            </List.Accordion>
                        )}

                        {userConflicts.size > 0 && (
                            <List.Accordion
                                theme={{ colors: { background: themeColors.blueBgLight } }}
                                title={userConflictTitle}
                            >
                                {Array.from(userConflicts.keys()).map((id, ind) => (
                                    <View
                                        key={`user_${id}`}
                                        style={{
                                            marginBottom: ind === userConflicts.size - 1 ? 15 : 0,
                                        }}
                                    >
                                        <Text style={styles.conflictName}>
                                            {userConflicts.get(id)?.name}
                                        </Text>
                                        {userConflicts.get(id)?.rejected.map((rej) => {
                                            const keyId = `${id}_${rej.column}`;
                                            return (
                                                <View key={keyId}>
                                                    <Text>
                                                        <Text style={styles.conflictContentBold}>
                                                            {rej.column}:{" "}
                                                        </Text>
                                                        <Text style={styles.conflictContent}>
                                                            {rej.rejChange}
                                                        </Text>
                                                    </Text>
                                                </View>
                                            );
                                        })}
                                    </View>
                                ))}
                            </List.Accordion>
                        )}
                    </ScrollView>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button
                        style={styles.closeBtn}
                        onPress={onClose}
                        color={themeColors.blueBgDark}
                    >
                        {t("general.ok")}
                    </Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
};

export default ConflictDialog;
