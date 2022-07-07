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

const SwitchServer = () => {
    enum ServerOption {
        LIVE = "Live", 
        TEST = "Test", 
        NONE = "None"
    };

    const styles = useStyles();
    const socket = useContext(SocketContext);
    const database = useDatabase();
    const navigator = useNavigation();
    const [selectedServer, setSelectedServer] = useState(ServerOption.NONE);
    const [testServerURL, setTestServerURL] = useState("");

    const switchServer = async (server: ServerOption) => {
        if (server !== ServerOption.NONE) {
            const baseUrl = server === ServerOption.LIVE ? BASE_URL : testServerURL;
            const apiUrl = `${baseUrl}/api/`;

            if (baseUrl === socket.ioUrl) {
                alert("Already connected to server: " + baseUrl);
                return;
            }

            await NetInfo.fetch().then(async (connectionInfo: NetInfoState) => {
                if (connectionInfo?.isConnected && connectionInfo.isWifiEnabled) {
                    confirmSwitchServer(apiUrl, baseUrl);
                } else {
                    showGenericAlert(
                        "Your device is not connected to the internet", 
                        "You must have an internet connection via wifi to switch servers.");
                }
            })
        }
    };

    const confirmSwitchServer = (apiUrl: string, baseUrl: string) => {
        Alert.alert("Alert", "Switching servers will clear all local data. Are you sure you want to proceed?", [
            { text: "Cancel", style: "cancel" }, 
            {
                text: "Confirm", 
                onPress: async () => {
                    await database.write(async () => {
                        await database.unsafeResetDatabase();
                    });

                    terminateCurrentConnection();
                    updateCommonApiUrl(apiUrl, baseUrl);
                    navigator.navigate("Login");
                }
            }
        ]);
    };

    const terminateCurrentConnection = () => {
        if (socket.connected) {
            socket.disconnect();
        }
    }

    const renderCurrentServer = () => {
        const isPointingAtLive = socket.ioUrl === BASE_URL;
        const isConnected = socket.connected;
        const chipStyle = isConnected ? 
            isPointingAtLive ? styles.chipLive : styles.chipTest
            : styles.chipDisconnected;
        const chipText = isConnected ? 
            isPointingAtLive ? "Live" : "Test"
            : "No Connection"

        return (
            <Chip
                textStyle={styles.chipText}
                style={chipStyle}
            >
                {chipText}
            </Chip>
        )
    }

    const radioButton = (value: ServerOption) => {
        const style = value === selectedServer ? styles.radioButtonSelected : styles.radioButtonPassive;
        return (
            <Button
                style={style}
                mode="outlined"
                icon={ value === selectedServer ? "check" : "" }
                onPress={ () => setSelectedServer(value) }
            >
                {value} server
            </Button>
        )
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.groupContainer}>
                <Text style={styles.cardSectionTitle}>Current Status</Text>
                <Card style={styles.CardStyle}>
                    <View style={styles.row}>
                        <Text>Connected to server: </Text>
                        {renderCurrentServer()}
                    </View>
                    <View style={styles.row}>
                        <Text>Server URL: </Text>
                        <Text>{socket.ioUrl}</Text>
                    </View>
                </Card>

                <Text style={styles.cardSectionTitle}>Select Server</Text>
                <View>
                    {radioButton(ServerOption.LIVE)}
                    {radioButton(ServerOption.TEST)}
                </View>
                { selectedServer === ServerOption.TEST ? (
                    <View>
                        <TextInput 
                            label="Test Server URL"
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
                            onSubmitEditing={ () => switchServer(selectedServer) }
                        />
                    </View>
                ) : (<View></View>)}

                <Button 
                    style={styles.switchServerButton}
                    mode="contained"
                    disabled={ selectedServer === ServerOption.NONE || (selectedServer === ServerOption.TEST && testServerURL === "") }
                    onPress={ () => switchServer(selectedServer) }
                >
                    Switch Servers
                </Button>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SwitchServer;
