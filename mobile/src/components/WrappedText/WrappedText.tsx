import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { Icon } from "react-native-elements";
import { Text } from "react-native-paper";
import useStyles from "./WrappedText.style";

export const WrappedText = (props: { text: string; icon?: string }) => {
    const styles = useStyles();
    return (
        <View style={styles.wrappedView}>
            <Text style={styles.text}>
                {props.icon ? <Icon type="material" name={props.icon} /> : <></>}
                {props.text}
            </Text>
        </View>
    );
};
