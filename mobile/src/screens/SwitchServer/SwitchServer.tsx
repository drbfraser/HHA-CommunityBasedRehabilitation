import React, { useState } from "react";
import useStyles from "./SwitchServer.styles";
import { Text, Card, Chip, Button, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { View } from "react-native";

const SwitchServer = () => {
    enum ServerOption {
        LIVE = "Live", 
        TEST = "Test", 
        NONE = "None"
    }

    const styles = useStyles();
    const [selectedServer, setSelectedServer] = useState(ServerOption.NONE);
    const [testServerURL, setTestServerURL] = useState("");

    const switchServer = (server: ServerOption) => {
        alert("Switching to server: " + server);
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
                {value} Server
            </Button>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.groupContainer}>
                <Text style={styles.cardSectionTitle}>Current Status</Text>
                <Card style={styles.CardStyle}>
                    <View style={styles.row}>
                        <Text>Connected to server: </Text>
                        <Chip 
                            textStyle={styles.chipText}
                            style={styles.chipLive}>Live Server</Chip>
                    </View>
                    <View style={styles.row}>
                        <Text>Server URL: </Text>
                        <Text>https://testurl.com</Text>
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
                    onPress={ () => switchServer(selectedServer) }
                >
                    Switch Servers
                </Button>
            </ScrollView>
        </SafeAreaView>
    )
}

export default SwitchServer;
