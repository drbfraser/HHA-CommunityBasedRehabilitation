import React, { useContext, useState } from "react";
import useStyles from "./SwitchServer.styles";
import { Text, Card, Chip, Button, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { View, Alert } from "react-native";
import { BASE_URL } from "../../..";
import { baseServicesTypes, SocketContext, updateCommonApiUrl } from "@cbr/common";
import { useDatabase } from "@nozbe/watermelondb/hooks";
import { SyncDB } from "../../util/syncHandler";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";
import { showGenericAlert } from "../../util/genericAlert";
import { useNavigation } from "@react-navigation/native";
import i18n from "i18next";
import { useTranslation } from "react-i18next";

const SwitchServer = () => {
    enum ServerOption {
        LIVE = "Live",
        TEST = "Test",
        NONE = "None",
    }

    const styles = useStyles();
    const socket = useContext(SocketContext);
    const database = useDatabase();
    const navigator = useNavigation();
    const [selectedServer, setSelectedServer] = useState(ServerOption.NONE);
    const [testServerURL, setTestServerURL] = useState("");
    const { t } = useTranslation();

    const switchServer = async (server: ServerOption) => {
        if (server !== ServerOption.NONE) {
            const baseUrl = server === ServerOption.LIVE ? BASE_URL : testServerURL;
            const apiUrl = `${baseUrl}/api/`;

            if (baseUrl === socket.ioUrl) {
                Alert.alert(
                    i18n.t("general.alert"),
                    i18n.t("login.alreadyConnectedToServer") + baseUrl,
                    [
                        { text: i18n.t("general.ok"), style: "cancel" },
                    ]
                );
                return;
            }

            await NetInfo.fetch().then(async (connectionInfo: NetInfoState) => {
                if (connectionInfo?.isConnected && connectionInfo.isWifiEnabled) {
                    confirmSwitchServer(apiUrl, baseUrl);
                } else {
                    showGenericAlert(
                        i18n.t("login.noInternetConnection"),
                        i18n.t("login.switchServerNoInternetConnection")
                    );
                }
            });
        }
    };

    const confirmSwitchServer = (apiUrl: string, baseUrl: string) => {
        Alert.alert(
            i18n.t("general.alert"),
            i18n.t("login.switchClearData"),
            [
                { text: i18n.t("general.cancel"), style: "cancel" },
                {
                    text: i18n.t("general.confirm"),
                    onPress: async () => {
                        await database.write(async () => {
                            await database.unsafeResetDatabase();
                        });

                        terminateCurrentConnection();
                        updateCommonApiUrl(apiUrl, baseUrl);
                        navigator.navigate("Login");
                    },
                },
            ]
        );
    };

    const terminateCurrentConnection = () => {
        if (socket.connected) {
            socket.disconnect();
        }
    };

    const renderCurrentServer = () => {
        const isPointingAtLive = socket.ioUrl === BASE_URL;
        const isConnected = socket.connected;
        const chipStyle = isConnected
            ? isPointingAtLive
                ? styles.chipLive
                : styles.chipTest
            : styles.chipDisconnected;
        const chipText = isConnected ? 
                (isPointingAtLive ? i18n.t("login.live") : i18n.t("login.test")) 
                : i18n.t("login.noConnection");

        return (
            <Chip textStyle={styles.chipText} style={chipStyle}>
                {chipText}
            </Chip>
        );
    };

    const radioButton = (value: ServerOption) => {
        const style =
            value === selectedServer ? styles.radioButtonSelected : styles.radioButtonPassive;
        return (
            <Button
                style={style}
                mode="outlined"
                icon={value === selectedServer ? "check" : ""}
                onPress={() => setSelectedServer(value)}
            >
                {value === ServerOption.LIVE ? t('login.liveServer') : t('login.testServer')} 
            </Button>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.groupContainer}>
                <Text style={styles.cardSectionTitle}>{t('login.currentStatus')}</Text>
                <Card style={styles.CardStyle}>
                    <View style={styles.row}>
                        <Text>{t('login.connectedToServer')} </Text>
                        {renderCurrentServer()}
                    </View>
                    <View style={styles.row}>
                        <Text>{t('login.serverURL')} </Text>
                        <Text>{socket.ioUrl}</Text>
                    </View>
                </Card>

                <Text style={styles.cardSectionTitle}>{t('login.selectServer')}</Text>
                <View>
                    {radioButton(ServerOption.LIVE)}
                    {radioButton(ServerOption.TEST)}
                </View>
                {selectedServer === ServerOption.TEST ? (
                    <View>
                        <TextInput
                            label={t('login.testServerURL')}
                            error={false}
                            value={testServerURL}
                            onChangeText={(newURL) => setTestServerURL(newURL)}
                            mode="outlined"
                            blurOnSubmit={false}
                            autoCapitalize="none"
                            autoCorrect={false}
                            autoCompleteType="off"
                            textContentType="URL"
                            returnKeyType="next"
                            onSubmitEditing={() => switchServer(selectedServer)}
                        />
                    </View>
                ) : (
                    <View></View>
                )}

                <Button
                    style={styles.switchServerButton}
                    mode="contained"
                    disabled={
                        selectedServer === ServerOption.NONE ||
                        (selectedServer === ServerOption.TEST && testServerURL === "")
                    }
                    onPress={() => switchServer(selectedServer)}
                >
                    {t('login.switchServers')}
                </Button>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SwitchServer;
