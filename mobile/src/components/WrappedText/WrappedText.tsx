import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { Text } from "react-native-paper";

export const WrappedText = (props: {
    text: string;
    viewStyle: StyleProp<ViewStyle>;
    textStyle: StyleProp<ViewStyle>;
}) => {
    return (
        <View style={props.viewStyle}>
            <Text style={props.textStyle}>{props.text}</Text>
        </View>
    );
};
