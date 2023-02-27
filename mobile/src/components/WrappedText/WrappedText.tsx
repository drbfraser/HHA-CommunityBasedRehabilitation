import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { Text } from "react-native-paper";
import useStyles from "./WrappedText.style";

interface TextProps {
    text: string;
    is_active?: boolean;
}

export const WrappedText = (props: TextProps) => {
    const styles = useStyles();
    return (
        <View style={styles.wrappedView}>
            <Text
                style={
                    props.is_active === undefined || props.is_active
                        ? styles.primaryText
                        : styles.secondaryText
                }
            >
                {props.text}
            </Text>
        </View>
    );
};
