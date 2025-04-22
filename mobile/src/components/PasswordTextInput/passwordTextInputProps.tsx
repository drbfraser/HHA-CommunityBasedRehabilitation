import React, { ComponentPropsWithRef } from "react";
import { TextInput } from "react-native";

const passwordTextInputProps: Pick<
    ComponentPropsWithRef<typeof TextInput>,
    "secureTextEntry" | "autoCapitalize" | "autoCorrect" | "autoComplete" | "textContentType"
> = {
    secureTextEntry: true,
    autoCapitalize: "none",
    autoCorrect: false,
    autoComplete: "password",
    textContentType: "password",
};

export default passwordTextInputProps;
