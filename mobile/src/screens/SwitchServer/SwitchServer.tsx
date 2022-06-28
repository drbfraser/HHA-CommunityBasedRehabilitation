import React from "react";
import useStyles from "./SwitchServer.styles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Text } from "react-native-paper";

const SwitchServer = () => {
    const styles = useStyles();

    return (
        <KeyboardAwareScrollView style={styles.container}>
            <Text>This is the switch server screen</Text>
        </KeyboardAwareScrollView>
    )
}

export default SwitchServer;
