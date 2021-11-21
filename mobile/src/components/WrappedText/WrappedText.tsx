import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { Text } from "react-native-paper";
import useStyles from "./WrappedText.style";

export const WrappedText = (props: { text: string }) => {
    const styles = useStyles();
    return (
        <View style={styles.wrappedView}>
            <Text style={styles.text}>{props.text}</Text>
        </View>
    );
};
