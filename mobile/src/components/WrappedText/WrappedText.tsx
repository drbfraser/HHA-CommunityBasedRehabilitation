import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

export const returnWrappedView = (item, viewStyle, textStyle) => {
    return (
        <View style={viewStyle}>
            <Text style={textStyle}>{item}</Text>
        </View>
    );
};
