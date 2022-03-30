import React, { useState } from "react";
import { Modal, Text, View, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { themeColors } from "@cbr/common";

export default function SyncUpdateAlert({ visibility, dismissAlert, onConfirm }) {
    const [syncConfirmed, setSyncConfirmed] = useState<boolean>(false);

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
        modalText: {
            marginTop: 10,
            paddingHorizontal: 10,
            color: "black",
        },
    });

    const KEY = "clear local data";

    const shutdownModal = () => {
        setSyncConfirmed(false);
        dismissAlert(false);
    };

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
                        <Text
                            style={{
                                fontSize: 28,
                                marginTop: 10,
                                fontWeight: "bold",
                                color: "black",
                            }}
                        >
                            HHA CBR is Updating!
                        </Text>
                        <Text style={styles.modalText}>
                            Our servers are undergoing major changes. As a result, any old data is
                            now obsolete and cannot be synced. If you would still like to sync, then
                            any local changes on your device must first be destroyed.
                        </Text>
                        <Text style={styles.modalText}>
                            You should use the web app to recreate your local changes, but the
                            following will be lost:
                        </Text>
                        <Text style={styles.modalText}>
                            Note that this will only affect local data, any settings you have
                            previously will be unaffected.
                        </Text>
                        <Text style={styles.modalText}>
                            This action may take awhile, and a considerable amount of cellular data
                            may be used.
                        </Text>
                        <Text style={styles.modalText}>
                            If you understand and would still like to proceed with the sync, type
                            "clear local data" to confirm.
                        </Text>
                        <TextInput
                            style={{
                                marginTop: 10,
                                borderWidth: 1,
                                borderColor: themeColors.borderGray,
                                borderRadius: 4,
                                fontSize: 16,
                                width: "90%",
                                paddingVertical: 4,
                            }}
                            onChangeText={(text) => setSyncConfirmed(text == KEY)}
                        />
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
                                        <Text style={{ color: "white" }}>CANCEL</Text>
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
                                        <Text style={{ color: "white" }}>CONFIRM</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
