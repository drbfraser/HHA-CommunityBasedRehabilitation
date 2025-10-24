import React from "react";
import type { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { Appbar } from "react-native-paper";

function DefaultHeader(
    title: string,
    subtitle?: React.ReactNode
): (props: NativeStackHeaderProps) => React.ReactNode {
    return (props: NativeStackHeaderProps) => (
        <Appbar.Header statusBarHeight={0}>
            <Appbar.BackAction onPress={props.navigation.goBack} />
            <Appbar.Content title={title} subtitle={subtitle} />
        </Appbar.Header>
    );
}

export default DefaultHeader;
