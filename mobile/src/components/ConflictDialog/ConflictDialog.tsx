import React, { useEffect } from "react";
import { useState } from "react";
import { Text, View } from "react-native";
import { Button, Portal, List, Dialog } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import { themeColors } from "@cbr/common";
import useStyles from "./ConflictDialog.styles";
import { RootState } from "../../redux/index";
import { clearSyncConflicts } from "../../redux/actions";
import { useSelector, useDispatch } from 'react-redux';
import { useDatabase } from "@nozbe/watermelondb/hooks";
import { modelName } from "../../models/constant";
import { SyncConflict, clientConflictKey, userConflictKey } from "../../util/syncConflictFields";

const ConflictDialog = () => {
    const styles = useStyles();
    const dispatch = useDispatch();
    const database = useDatabase();

    const currState: RootState = useSelector((state: RootState) => state);
    const noConflicts: boolean = currState.conflicts.cleared;

    const [clientConflicts, setClientConflicts] = useState<Map<string, SyncConflict>>(new Map());
    const [userConflicts, setUserConflicts] = useState<Map<string, SyncConflict>>(new Map());
    const [dialogVisible, setDialogVisible] = useState<boolean>(false);

    const updateNames = async () => {
        const clientIds: Array<string> = [...currState.conflicts.clientConflicts.keys()];
        const clients: Map<string, SyncConflict> = currState.conflicts.clientConflicts;

        Promise.all(clientIds.map(async (id) => {
            if (!clients.get(id)?.name) {
                /* We may need to retrieve client name for referral conflicts
                   since that is not stored in the local referral table */
                const client = await database.get(modelName.clients).find(id);
                clients.get(id)!.name = client.full_name;
            }
        })).then(() => {
            setClientConflicts(clients);
            setUserConflicts(currState.conflicts.userConflicts);
        });
    }
    
    useEffect(() => {
        if (!noConflicts) {
            if (clientConflicts.size > 0 || userConflicts.size > 0) {
                setDialogVisible(true);
            } else {
                updateNames();
            }
        }
    }, [currState, clientConflicts, userConflicts]);

    const onClose = () => {
        dispatch(clearSyncConflicts());

        /* Reset state defaults */
        setDialogVisible(false);
        setClientConflicts(new Map());
        setUserConflicts(new Map());
    }

    return (
        <Portal>
            <Dialog visible={dialogVisible} style={styles.conflictDialog} onDismiss={onClose}>
                <Dialog.Title style={styles.conflictDialogTitle}>
                    <Text>Sync Conflicts</Text>
                </Dialog.Title>
                <Dialog.Content style={styles.conflictDialogContent}>
                        <Text style={styles.conflictMessage}>
                            The following changes could not be saved to the server due to change conflict.
                        </Text>
                        <ScrollView>
                            {clientConflicts.size > 0 && <List.Accordion
                                theme={{ colors: { background: themeColors.blueBgLight } }}
                                title={"Client Conflicts"}
                            >
                                {[...clientConflicts.keys()].map((id) => {
                                    return (
                                        <View key={clientConflictKey}>
                                        <Text style={styles.conflictName} key={id}>{clientConflicts.get(id)?.name}</Text>
                                        {clientConflicts.get(id)!.rejected.map((rej) => {
                                            const keyId = `${id}+${rej.column}`;
                                            return <Text style={styles.conflictContent} key={keyId}>{rej.column}: {rej.rejChange}</Text>
                                        })}
                                        </View>
                                    );
                                })}
                                <Text></Text>
                            </List.Accordion>}
                            {userConflicts.size > 0 && <List.Accordion
                                theme={{ colors: { background: themeColors.blueBgLight } }}
                                title={"User Conflicts"}
                            >
                                {[...userConflicts.keys()].map((id) => {
                                    return (
                                        <View key={userConflictKey}>
                                        <Text style={styles.conflictName} key={id}>{userConflicts.get(id)?.name}</Text>
                                        {userConflicts.get(id)!.rejected.map((rej) => {
                                            const keyId = `${id}+${rej.column}`;
                                            return <Text style={styles.conflictContent} key={keyId}>{rej.column}: {rej.rejChange}</Text>
                                        })}
                                        </View>
                                    );
                                })}
                                <Text></Text>
                            </List.Accordion>}
                        </ScrollView>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button
                        style={styles.closeBtn}
                        onPress={onClose}
                        color={themeColors.blueBgDark}
                    >
                        OK
                    </Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
}

export default ConflictDialog;