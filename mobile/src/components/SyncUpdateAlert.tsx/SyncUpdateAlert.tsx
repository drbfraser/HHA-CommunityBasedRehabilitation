import React, { useState, useEffect } from "react";
import { apiFetch, APIFetchFailError, Endpoint } from "@cbr/common";
import { mobileApiVersion } from "../../util/syncHandler";
import { Modal, Text, View, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { themeColors } from "@cbr/common";
import LocalChangeList from "./LocalChangeList";
import { ScrollView } from "react-native-gesture-handler";

export default function SyncUpdateAlert({ visibility, dismissAlert, onConfirm }) {
    const [syncConfirmed, setSyncConfirmed] = useState<boolean>(false);
    const [upToDateWithServer, setUpToDateWithServer] = useState<boolean>(false);

    const styles = StyleSheet.create({
        disabledButton: {
            padding: 10,
            alignItems: "center",
            backgroundColor: themeColors.borderGray,
        },
        enabledButton: {
            padding: 10,
            alignItems: "center",
            backgroundColor: themeColors.blueBgDark,
        },
        buttonText: {
            color: "white",
            fontSize: 15,
        },
        modalText: {
            fontSize: 15,
            marginTop: 10,
            paddingHorizontal: 10,
            color: "black",
        },
        headerText: {
            fontSize: 28,
            marginTop: 10,
            fontWeight: "bold",
            color: "black",
            marginHorizontal: 10,
        },
    });

    const KEY = "clear local data";

    const shutdownModal = () => {
        setSyncConfirmed(false);
        dismissAlert(false);
    };

    const compareServerVersion = async () => {
        const versionCheckBody = {
            api_version: mobileApiVersion,
        };

        const init: RequestInit = {
            method: "POST",
            body: JSON.stringify(versionCheckBody),
        };

        try {
            const response = await apiFetch(Endpoint.VERSION_CHECK, "", init);

            if (response.ok) {
                setUpToDateWithServer(true);
            }
        } catch (e) {
            if (e instanceof APIFetchFailError && e.status === 403) {
                setUpToDateWithServer(false);
            }
        }
    };

    useEffect(() => {
        compareServerVersion();
    });

    return (
        <View>
            <Modal visible={visibility} animationType={"fade"} transparent={true}>
                <View
                    style={{
                        flex: 1,
                        backgroundColor: "rgba(52, 52, 52, 0.8)",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <View
                        style={{
                            alignItems: "center",
                            backgroundColor: "white",
                            width: "90%",
                            borderWidth: 1,
                            borderColor: "#fff",
                            borderRadius: 7,
                            elevation: 10,
                        }}
                    >
                        {upToDateWithServer ? (
                            <ScrollView>
                                <Text style={styles.headerText}>HHA CBR is Updating!</Text>
                                <Text style={styles.modalText}>
                                    Our servers are undergoing major changes. As a result, any old
                                    data is now obsolete and cannot be synced. If you would still
                                    like to sync, then any local changes on your device must first
                                    be destroyed.
                                </Text>
                                <Text style={styles.modalText}>
                                    You should use the web app to recreate any local changes, any
                                    changes on the following entities will be lost:
                                </Text>
                                <LocalChangeList />
                                <Text style={styles.modalText}>
                                    Note that this will only affect local data, any settings that
                                    have previously been set will be unaffected.
                                </Text>
                                <Text style={styles.modalText}>
                                    This action may take awhile, and a considerable amount of
                                    cellular data may be used.
                                </Text>
                                <Text style={styles.modalText}>
                                    If you understand and would still like to proceed with the sync,
                                    type "clear local data" to confirm.
                                </Text>
                                <View style={{ alignItems: "center" }}>
                                    <TextInput
                                        style={{
                                            marginTop: 20,
                                            marginBottom: 10,
                                            borderWidth: 1,
                                            borderColor: themeColors.borderGray,
                                            borderRadius: 4,
                                            fontSize: 16,
                                            width: "90%",
                                            paddingVertical: 4,
                                        }}
                                        onChangeText={(text) => setSyncConfirmed(text == KEY)}
                                    />
                                </View>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        marginBottom: 10,
                                        marginTop: 10,
                                    }}
                                >
                                    <View style={{ flex: 1, alignItems: "center" }}>
                                        <View style={{ width: "90%" }}>
                                            <TouchableOpacity
                                                style={styles.enabledButton}
                                                onPress={() => shutdownModal()}
                                            >
                                                <Text style={styles.buttonText}>CANCEL</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={{ flex: 1, alignItems: "center" }}>
                                        <View style={{ width: "90%" }}>
                                            <TouchableOpacity
                                                style={
                                                    syncConfirmed
                                                        ? styles.enabledButton
                                                        : styles.disabledButton
                                                }
                                                disabled={!syncConfirmed}
                                                onPress={() => onConfirm()}
                                            >
                                                <Text style={styles.buttonText}>CONFIRM</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </ScrollView>
                        ) : (
                            <>
                                <Text style={styles.headerText}>
                                    Your Version of HHA CBR is Out of Date
                                </Text>
                                <Text style={styles.modalText}>
                                    A new version of HHA CBR is available on the Google Play Store.
                                    Please update your app to be able to use this feature.
                                </Text>
                                <TouchableOpacity
                                    style={[
                                        styles.enabledButton,
                                        { width: 100, marginVertical: 10 },
                                    ]}
                                    onPress={() => shutdownModal()}
                                >
                                    <Text style={styles.buttonText}>OK</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
}
