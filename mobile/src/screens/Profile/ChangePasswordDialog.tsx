import { Button, Dialog, HelperText, TextInput } from "react-native-paper";
import React, { Reducer, useEffect, useReducer, useRef } from "react";
import { TextInput as NativeTextInput } from "react-native";

interface ActionWithoutValue {
    actionType: "clear";
}

interface ActionWithValue {
    actionType: "old" | "new" | "confirmNew";
    newValue: string;
}

type Action = ActionWithoutValue | ActionWithValue;

interface FormState {
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

const reducer: Reducer<FormState, Action> = (state: FormState, action: Action): FormState => {
    switch (action.actionType) {
        case "clear":
            return emptyState;
        case "old":
            return { ...state, oldPassword: action.newValue };
        case "new":
            return { ...state, newPassword: action.newValue };
        case "confirmNew":
            return { ...state, confirmNewPassword: action.newValue };
        default:
            return state;
    }
};

const emptyState: FormState = {
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
};

export type Props = {
    /**
     * Callback that is called when the dialog is dimissed (user cancels or password successfully
     * changed).
     */
    onDismiss: () => void;
    /** Determines whether the dialog is visible. */
    visible: boolean;
};

const ChangePasswordDialog = ({ onDismiss, visible }: Props) => {
    const [formState, dispatch] = useReducer(reducer, emptyState);

    const newPassRef = useRef<NativeTextInput>(null);
    const confirmNewPassRef = useRef<NativeTextInput>(null);

    useEffect(() => {
        dispatch({ actionType: "clear" });
    }, [visible]);

    // Pass dismissable={false} to prevent the user from tapping on the outside to dismiss.
    return (
        <Dialog dismissable={false} visible={visible} onDismiss={onDismiss}>
            <Dialog.Title>Change password</Dialog.Title>
            <Dialog.Content>
                <TextInput
                    label="Old password"
                    value={formState.oldPassword}
                    onChangeText={(pass) => dispatch({ actionType: "old", newValue: pass })}
                    mode="outlined"
                    secureTextEntry
                    blurOnSubmit={false}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoCompleteType="password"
                    textContentType="password"
                    onSubmitEditing={() => newPassRef.current?.focus()}
                />
                <HelperText visible={false} type="error">
                    unused
                </HelperText>
                <TextInput
                    ref={newPassRef}
                    label="New password"
                    value={formState.newPassword}
                    onChangeText={(pass) => dispatch({ actionType: "new", newValue: pass })}
                    mode="outlined"
                    secureTextEntry
                    blurOnSubmit={false}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoCompleteType="password"
                    textContentType="password"
                    onSubmitEditing={() => confirmNewPassRef.current?.focus()}
                />
                <HelperText type="error">What</HelperText>
                <TextInput
                    ref={confirmNewPassRef}
                    label="Confirm new password"
                    value={formState.confirmNewPassword}
                    onChangeText={(pass) => dispatch({ actionType: "confirmNew", newValue: pass })}
                    mode="outlined"
                    secureTextEntry
                    blurOnSubmit={false}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoCompleteType="password"
                    textContentType="password"
                    onSubmitEditing={() => {
                        console.log("TODO: submit password");
                    }}
                />
                <HelperText type="error">What</HelperText>
            </Dialog.Content>
            <Dialog.Actions>
                <Button onPress={onDismiss}>Cancel</Button>
                <Button onPress={onDismiss}>Change</Button>
            </Dialog.Actions>
        </Dialog>
    );
};

export default ChangePasswordDialog;
