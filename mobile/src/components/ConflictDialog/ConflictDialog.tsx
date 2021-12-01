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

const ConflictDialog = () => {
    const styles = useStyles();
    const dispatch = useDispatch();
    const database = useDatabase();

    const currState: RootState = useSelector((state: RootState) => state);
    const noConflicts: boolean = currState.conflicts.cleared;

    const [clientConflicts, setClientConflicts] = useState<Object>({});
    const [numClientConflicts, setNumClientConflicts] = useState<Number>(0);
    const [userConflicts, setUserConflicts] = useState<Object>({});
    const [numUserConflicts, setNumUserConflicts] = useState<Number>(0);

    const [dialogVisible, setDialogVisible] = useState<boolean>(false);

    const updateNames = async () => {
        const clientIds = Object.keys(currState.conflicts.clientConflicts);
        const clients = currState.conflicts.clientConflicts;
        Promise.all(clientIds.map(async (key) => {
            if (!clients[key].name) {
                /* Entry was added without name ie. Referral conflict */
                const client = await database.get(modelName.clients).find(key);
                clients[key].name = client.full_name;
            }
        })).then(() => {
            setClientConflicts(clients);
            setNumClientConflicts(Object.keys(clients).length);
            setUserConflicts(currState.conflicts.userConflicts);
            setNumUserConflicts(Object.keys(currState.conflicts.userConflicts).length);
        });
    }
    
    useEffect(() => {
        if (!noConflicts) {
            if (numClientConflicts > 0 || numUserConflicts > 0) {
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
        setClientConflicts({});
        setNumClientConflicts(0);
        setUserConflicts({});
        setNumUserConflicts(0);
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
                            {numClientConflicts > 0 && <List.Accordion
                                theme={{ colors: { background: themeColors.blueBgLight } }}
                                title={"Client Conflicts"}
                            >
                                {Object.keys(clientConflicts).map((key) => {
                                    return (
                                        <View>
                                        <Text style={styles.conflictName} key={clientConflicts[key]}>{clientConflicts[key].name}</Text>
                                        {clientConflicts[key].rejected.map((rej) => {
                                            return <Text style={styles.conflictContent} key={rej.column}>{rej.column}: {rej.rejChange}</Text>
                                        })}
                                        </View>
                                    );
                                })}
                                <Text></Text>
                            </List.Accordion>}
                            {numUserConflicts > 0 && <List.Accordion
                                theme={{ colors: { background: themeColors.blueBgLight } }}
                                title={"User Conflicts"}
                            >
                                {Object.keys(userConflicts).map((key) => {
                                    return (
                                        <View>
                                        <Text style={styles.conflictName} key={userConflicts[key]}>{userConflicts[key].name}</Text>
                                        {userConflicts[key].rejected.map((rej) => {
                                            return <Text style={styles.conflictContent} key={rej.column}>{rej.column}: {rej.rejChange}</Text>
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