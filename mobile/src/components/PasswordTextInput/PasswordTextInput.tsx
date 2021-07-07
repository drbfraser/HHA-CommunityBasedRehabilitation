import { TextInput } from "react-native-paper";
import React, { forwardRef } from "react";
import { TextInputProps } from "react-native-paper/lib/typescript/components/TextInput/TextInput";
import { TextInput as NativeTextInput } from "react-native";

/**
 * A {@link TextInput} with the appropriate password props applied (e.g.
 * {@link TextInputProps.secureTextEntry}
 */
const PasswordTextInput = forwardRef<NativeTextInput, Omit<TextInputProps, "theme">>(
    (props, ref) => (
        <TextInput
            {...props}
            ref={ref}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            autoCompleteType="password"
            textContentType="password"
        />
    )
);

export default PasswordTextInput;
