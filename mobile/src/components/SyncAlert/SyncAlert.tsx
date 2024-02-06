import React from "react";
import { Modal, Text, View, TouchableOpacity } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { themeColors } from "@cbr/common";
import { useTranslation } from "react-i18next";

export default function SyncAlert({
    displayMode,
    displayMsg,
    displaySubtitle,
    visibility,
    dismissAlert,
}) {
    const { t } = useTranslation();
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
                            height: 235,
                            width: "90%",
                            borderWidth: 1,
                            borderColor: "#fff",
                            borderRadius: 7,
                            elevation: 10,
                        }}
                    >
                        <View style={{ alignItems: "center", margin: 10 }}>
                            {displayMode == "success" ? (
                                <>
                                    <Ionicons
                                        name="checkmark-done-circle"
                                        color={"green"}
                                        size={80}
                                    />
                                </>
                            ) : (
                                <>
                                    <MaterialIcons name="cancel" color={"red"} size={80} />
                                </>
                            )}
                            {displaySubtitle !== "" ? (
                                <>
                                    <Text style={{ fontSize: 18, marginTop: 5 }}>{displayMsg}</Text>
                                    <Text
                                        style={{ fontSize: 14, marginTop: 5, textAlign: "center" }}
                                    >
                                        {displaySubtitle}
                                    </Text>
                                </>
                            ) : (
                                <Text style={{ fontSize: 18, marginTop: 24 }}>{displayMsg}</Text>
                            )}
                        </View>

                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => dismissAlert(false)}
                            style={{
                                width: "95%",
                                borderRadius: 0,
                                alignItems: "center",
                                justifyContent: "center",
                                position: "absolute",
                                backgroundColor: themeColors.blueBgDark,
                                borderColor: "#ddd",
                                borderBottomWidth: 0,
                                bottom: 0,
                                marginBottom: 10,
                            }}
                        >
                            <Text style={{ color: "white", margin: 15 }}>{t("commons.ok")}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
