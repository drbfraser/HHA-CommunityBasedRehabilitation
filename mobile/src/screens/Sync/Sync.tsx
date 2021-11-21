import { timestampToDateTime } from "@cbr/common";
import { useDatabase } from "@nozbe/watermelondb/hooks";
import React, { useState } from "react";
import { Alert, SafeAreaView, ScrollView, View } from "react-native";
import { Button, Divider, Title, Text, Card } from "react-native-paper";
import { color } from "react-native-reanimated";
import SyncAlert from "../../components/SyncAlert/SyncAlert";
import { SyncDB, logger } from "../../util/syncHandler";
import useStyles from "./Sync.styles";

const Sync = () => {
    const styles = useStyles();
    const database = useDatabase();
    const [alertMessage, setAlertMessage] = useState<string>();
    const [alertStatus, setAlertStatus] = useState<boolean>();
    const [showSyncModal, setSyncModal] = useState<boolean>(false);
    let lastPulledTime = 0;
    let RemoteChanges = 0;
    let LocalChanges = 0;

    const resetDatabase = async () => {
        Alert.alert("Alert", "Are you sure you want to reset local database", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Reset",
                onPress: async () => {
                    await database.write(async () => {
                        await database.unsafeResetDatabase();
                        setAlertStatus(true);
                        setAlertMessage("Database Reset");
                        setSyncModal(true);
                    });
                },
            },
        ]);
    };

    const len = logger.logs.length;
    console.log(logger.logs);
    console.log(logger.logs[len - 1]);
    if (len != 0) {
        lastPulledTime = logger.logs[len - 1].newLastPulledAt;
        RemoteChanges = logger.logs[len - 1].remoteChangeCount;
        LocalChanges = logger.logs[len - 1].localChangeCount;
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.groupContainer}>
                <Text style={styles.cardSectionTitle}>Database Synchronization</Text>
                <Button
                    icon="database-sync"
                    mode="contained"
                    onPress={() => {
                        try {
                            SyncDB(database).then(() => {
                                setAlertStatus(true);
                                setAlertMessage("Synchronization Complete");
                                setSyncModal(true);
                            });
                        } catch (e) {
                            setAlertStatus(false);
                            setAlertMessage("Synchronization Failure");
                            setSyncModal(true);
                        }
                    }}
                >
                    Server Sync
                </Button>
                <Button
                    icon="lock-reset"
                    mode="contained"
                    labelStyle={styles.resetBtnLabel}
                    style={styles.resetBtbContainer}
                    onPress={resetDatabase}
                >
                    Reset Local Database
                </Button>
            </View>
            <Divider />

            <Text style={styles.cardSectionTitle}>Sync Statistics</Text>
            <Card style={styles.CardStyle}>
                <View style={styles.row}>
                    <Text style={styles.stats}> Last Pulled at:</Text>
                    {len != 0 ? (
                        <Text>{timestampToDateTime(lastPulledTime)}</Text>
                    ) : (
                        <Text>Never Synced</Text>
                    )}
                </View>
                <View style={styles.row}>
                    <Text style={styles.stats}> Local Changes:</Text>
                    <Text> {LocalChanges}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.stats}> Remote Changes:</Text>
                    <Text>{RemoteChanges}</Text>
                </View>
            </Card>

            <SyncAlert
                displayMode={alertStatus ? "success" : "failed"}
                displayMsg={alertMessage}
                visibility={showSyncModal}
                dismissAlert={setSyncModal}
            />
        </SafeAreaView>
    );
};

export default Sync;
