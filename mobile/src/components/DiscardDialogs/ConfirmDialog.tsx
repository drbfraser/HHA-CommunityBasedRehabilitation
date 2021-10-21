import { Button, Dialog, Portal, Text } from "react-native-paper";
import React from "react";

export type Props = {
    /** Whether the dialog is visible. This should be changed by {@link onDismiss}. */
    visible: boolean;
    /** Callback for when the dialog is dismissed. This should update the {@link visible} prop. */
    onDismiss: () => void;
    /** Callback for when the confirms discard. */
    onConfirm: () => void;
    cancelButtonText?: string;
    confirmButtonText: string;
    dialogTitle?: string;
    dialogContent: string;
};

/**
 *
 * @param props
 * @constructor
 */
const ConfirmDialog = (props: Props) => (
    <Portal>
        <Dialog visible={props.visible} onDismiss={props.onDismiss}>
            {props.dialogTitle && <Dialog.Title>{props.dialogTitle}</Dialog.Title>}
            <Dialog.Content>
                <Text>{props.dialogContent}</Text>
            </Dialog.Content>
            <Dialog.Actions>
                <Button onPress={props.onDismiss}>{props.cancelButtonText ?? "Cancel"}</Button>
                <Button onPress={props.onConfirm}>{props.confirmButtonText}</Button>
            </Dialog.Actions>
        </Dialog>
    </Portal>
);

export default ConfirmDialog;
