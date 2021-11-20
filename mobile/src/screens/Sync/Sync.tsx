import React from "react";
import { View } from "react-native";
import { Title } from "react-native-paper";
import useStyles from "./Sync.styles";

const Sync = () => {
    const styles = useStyles();

    return (
        <View style={styles.container}>
            <Title> Sync Title Page</Title>
        </View>
    );
};

export default Sync;
