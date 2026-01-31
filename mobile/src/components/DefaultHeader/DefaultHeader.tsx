import React from "react";
import { StackHeaderProps } from "@react-navigation/stack/lib/typescript/src/types";
import { Appbar } from "react-native-paper";

function DefaultHeader(
    title: string,
    subtitle?: React.ReactNode,
): (props: StackHeaderProps) => React.ReactNode {
    return (props: StackHeaderProps) => (
        <Appbar.Header statusBarHeight={0}>
            <Appbar.BackAction onPress={props.navigation.goBack} />
            <Appbar.Content title={title} subtitle={subtitle} />
        </Appbar.Header>
    );
}

export default DefaultHeader;
