import React, { useEffect } from "react";
import { useState } from "react";
import { Text, View, Image } from "react-native";
import { Button, Portal, List, Dialog } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import { themeColors } from "@cbr/common";
import useStyles from "./ConflictDialog.styles";
import { RootState } from "../../redux/index";
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

    const currState: RootState = useSelector((state: RootState) => state);
    const noConflicts: boolean = currState.conflicts.cleared;

    const [clientConflicts, setClientConflicts] = useState<Map<string, SyncConflict>>(new Map());
    const [userConflicts, setUserConflicts] = useState<Map<string, SyncConflict>>(new Map());
    const [dialogVisible, setDialogVisible] = useState<boolean>(false);

    const updateNames = async () => {
        const clientIds: Array<string> = [...currState.conflicts.clientConflicts.keys()];
        const clients: Map<string, SyncConflict> = currState.conflicts.clientConflicts;

        Promise.all(
            clientIds.map(async (id) => {
                if (!clients.get(id)?.name) {
                    /* We may need to retrieve client name for referral conflicts
                   since that is not stored in the local referral table */
                    const client = await database.get<Client>(modelName.clients).find(id);
                    clients.get(id)!.name = client.full_name;
                }

                let disabilities: RejectedColumn | undefined = clients
                    .get(id)
                    ?.rejected.find((rej) => {
                        return rej.column == "Disabilities";
                    });

                /* Get actual disability names rather than numerical array */
                if (disabilities) {
                    let disabilitiesArr: Array<string> = disabilities.rejChange
                        .substr(1, disabilities.rejChange.length - 2) // todo: deprecated
                        .split(",");
                    disabilities.rejChange = disabilitiesArr
                        .map((disability) => {
                            return disabilityObj[disability];
                        })
                        .join(", ");
                }
            })
        ).then(() => {
            setClientConflicts(clients);
            setUserConflicts(currState.conflicts.userConflicts);
        });
    };

    useEffect(() => {
        if (!noConflicts) {
            if (clientConflicts.size > 0 || userConflicts.size > 0) {
                setDialogVisible(true);
            } else {
                updateNames();
            }
        } else {
            setDialogVisible(false);
        }
    }, [currState, clientConflicts, userConflicts]);

    const onClose = () => {
        dispatch(clearSyncConflicts());

        /* Reset state defaults */
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
                                {[...clientConflicts.keys()].map((id, ind) => {
                                    return (
                                        <View
                                            key={`client_${id}`}
                                            style={{
                                                marginBottom:
                                                    ind == clientConflicts.size - 1 ? 15 : 0,
                                            }}
                                        >
                                            <Text style={styles.conflictName}>
                                                {clientConflicts.get(id)?.name}
                                            </Text>
                                            {clientConflicts.get(id)!.rejected.map((rej) => {
                                                const keyId = `${id}_${rej.column}`;
                                                return rej.column == "Picture" ? (
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
                                                            <Text
                                                                style={styles.conflictContentBold}
                                                            >
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
                                    );
                                })}
                            </List.Accordion>
                        )}
                        {userConflicts.size > 0 && (
                            <List.Accordion
                                theme={{ colors: { background: themeColors.blueBgLight } }}
                                title={userConflictTitle}
                            >
                                {[...userConflicts.keys()].map((id, ind) => {
                                    return (
                                        <View
                                            key={`user_${id}`}
                                            style={{
                                                marginBottom:
                                                    ind == userConflicts.size - 1 ? 15 : 0,
                                            }}
                                        >
                                            <Text style={styles.conflictName}>
                                                {userConflicts.get(id)?.name}
                                            </Text>
                                            {userConflicts.get(id)!.rejected.map((rej) => {
                                                const keyId = `${id}_${rej.column}`;
                                                return (
                                                    <View key={keyId}>
                                                        <Text>
                                                            <Text
                                                                style={styles.conflictContentBold}
                                                            >
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
                                    );
                                })}
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
