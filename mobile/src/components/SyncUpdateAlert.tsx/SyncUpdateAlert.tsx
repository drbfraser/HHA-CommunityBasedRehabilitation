import React, { useState, useEffect } from "react";
import { apiFetch, APIFetchFailError, Endpoint } from "@cbr/common";
import { mobileApiVersion } from "../../util/syncHandler";
import { Modal, Text, View, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { themeColors } from "@cbr/common";
import LocalChangeList from "./LocalChangeList";
import { ScrollView } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";

export default function SyncUpdateAlert({ visibility, dismissAlert, onConfirm }) {
    const [syncConfirmed, setSyncConfirmed] = useState<boolean>(false);
    const [upToDateWithServer, setUpToDateWithServer] = useState<boolean>(false);
    const { t } = useTranslation();

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

    const validateConfirmationText = (textInput: string) => {
        let parsedInput = textInput.trim();
        parsedInput = parsedInput.toLowerCase();

        const confirmTextIsValid = parsedInput == KEY;
        setSyncConfirmed(confirmTextIsValid);
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
                                    {t("alert.obsoleteDataForServerUpdating")}
                                </Text>
                                <Text style={styles.modalText}>
                                    {t("alert.directUserToWebapp")}
                                </Text>
                                <LocalChangeList />
                                <Text style={styles.modalText}>
                                    {t("alert.localDataAffectOnlyNotice")}
                                </Text>
                                <Text style={styles.modalText}>
                                    {t("alert.timeDataUsageNotice")}
                                </Text>
                                <Text style={styles.modalText}>
                                    {t("alert.clearLocalDataConfirmation")}
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
                                        onChangeText={validateConfirmationText}
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
                                                <Text style={styles.buttonText}>{t("general.cancel")}</Text>
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
                                                <Text style={styles.buttonText}>{t("general.confirm")}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </ScrollView>
                        ) : (
                            <>
                                <Text style={styles.headerText}>{t("alert.outdatedApp")}</Text>
                                <Text style={styles.modalText}>
                                    {t("alert.newVersionAvailability")}
                                </Text>
                                <Text style={styles.modalText}>
                                    {t("alert.reinstallingSuggestion")}
                                </Text>
                                <TouchableOpacity
                                    style={[
                                        styles.enabledButton,
                                        { width: 100, marginVertical: 10 },
                                    ]}
                                    onPress={() => shutdownModal()}
                                >
                                    <Text style={styles.buttonText}>{t("general.ok")}</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
}
