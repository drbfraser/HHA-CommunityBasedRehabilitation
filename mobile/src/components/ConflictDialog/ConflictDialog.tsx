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

const ConflictDialog = () => {
    const styles = useStyles();

    const currState: RootState = useSelector((state: RootState) => state);
    const noConflicts: boolean = currState.conflicts.cleared;
    let clientConflicts: Object = currState.conflicts.clientConflicts;
    const userConflicts: Object = currState.conflicts.userConflicts;

    useEffect(() => {
        if (!noConflicts) {
            setDialogVisible(true);
        }
    }, [currState]);

    const dispatch = useDispatch();
    const [dialogVisible, setDialogVisible] = useState(!noConflicts);

    const onClose = () => {
        dispatch(clearSyncConflicts());
        setDialogVisible(false);
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
                            <List.Accordion
                                theme={{ colors: { background: themeColors.blueBgLight } }}
                                title={"Client Conflicts"}
                            >
                                {Object.keys(clientConflicts).map((key) => {
                                    return (
                                        <View>
                                        <Text style={styles.conflictName} key={clientConflicts[key]}>{clientConflicts[key].name}</Text>
                                        {clientConflicts[key].rejected.map((rej) => {
                                            return <Text style={styles.conflictContent}>{rej.column}: {rej.rejChange}</Text>
                                        })}
                                        </View>
                                    );
                                })}
                                
                                <Text style={styles.conflictName}>John Smith</Text>
                                <Text style={styles.conflictContent}>First Name: Johnny</Text>
                                <Text style={styles.conflictContent}>Last Name: Smithe</Text>
                                <Text style={styles.conflictName}>Jane Smith</Text>
                                <Text style={styles.conflictContent}>First Name: Johnny</Text>
                                <Text style={styles.conflictContent}>Last Name: Smithe</Text>
                                <Text></Text>
                            </List.Accordion>
                            <List.Accordion
                                theme={{ colors: { background: themeColors.blueBgLight } }}
                                title={"User Conflicts"}
                            >
                                {Object.keys(userConflicts).map((key) => {
                                    return (
                                        <View>
                                        <Text style={styles.conflictName} key={userConflicts[key]}>{userConflicts[key].name}</Text>
                                        {userConflicts[key].rejected.map((rej) => {
                                            return <Text style={styles.conflictContent}>{rej.column}: {rej.rejChange}</Text>
                                        })}
                                        </View>
                                    );
                                })}

                                <Text style={styles.conflictName}>John Smith</Text>
                                <Text style={styles.conflictContent}>First Name: Johnny</Text>
                                <Text style={styles.conflictContent}>Last Name: Smithe</Text>
                                <Text style={styles.conflictName}>Jane Smith</Text>
                                <Text style={styles.conflictContent}>First Name: Johnny</Text>
                                <Text style={styles.conflictContent}>Last Name: Smithe</Text>
                                <Text></Text>
                            </List.Accordion>
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