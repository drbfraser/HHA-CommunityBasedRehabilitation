import { useDatabase } from "@nozbe/watermelondb/hooks";
import React, { useState } from "react";
import { Alert, SafeAreaView, ScrollView, View } from "react-native";
import { Button, Title } from "react-native-paper";
import SyncAlert from "../../components/SyncAlert/SyncAlert";
import { SyncDB } from "../../util/syncHandler";
import useStyles from "./Sync.styles";

const Sync = () => {
    const styles = useStyles();
    const database = useDatabase();
    const [alertMessage, setAlertMessage] = useState<string>();
    const [alertStatus, setAlertStatus] = useState<boolean>();
    const [showSyncModal, setSyncModal] = useState<boolean>(false);

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

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.groupContainer}>
                <Title>Sync Functions</Title>
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
                <SyncAlert
                    displayMode={alertStatus ? "success" : "failed"}
                    displayMsg={alertMessage}
                    visibility={showSyncModal}
                    dismissAlert={setSyncModal}
                />
            </View>
            <View style={styles.groupContainer}></View>
        </SafeAreaView>
    );
};

export default Sync;
