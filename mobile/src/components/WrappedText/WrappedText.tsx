import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

export const WrappedText = (props: { item; viewStyle; textStyle }) => {
    return (
        <View style={props.viewStyle}>
            <Text style={props.textStyle}>{props.item}</Text>
        </View>
    );
};
