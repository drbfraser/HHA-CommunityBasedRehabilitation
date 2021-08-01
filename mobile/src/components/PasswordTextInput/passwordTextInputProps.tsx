import React, { ComponentPropsWithRef } from "react";
import { TextInput } from "react-native";

const passwordTextInputProps: Pick<
    ComponentPropsWithRef<typeof TextInput>,
    "secureTextEntry" | "autoCapitalize" | "autoCorrect" | "autoCompleteType" | "textContentType"
> = {
    secureTextEntry: true,
    autoCapitalize: "none",
    autoCorrect: false,
    autoCompleteType: "password",
    textContentType: "password",
};

export default passwordTextInputProps;
