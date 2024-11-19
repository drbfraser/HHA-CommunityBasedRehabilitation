import React, { FC, ReactNode } from "react";
import { Button, Dialog, Divider, Portal } from "react-native-paper";
import useStyles from "../ModalForm.styles";

interface IProps {
    label: string;
    visible: boolean;
    onClose: () => void;
    children: ReactNode;
}

const ModalWindow: FC<IProps> = ({ label, visible, onClose, children }) => {
    const styles = useStyles();

    return (
        <Portal>
            <Dialog visible={visible} dismissable={false} style={styles.modal}>
                <Dialog.Title>{label}</Dialog.Title>
                <Divider />

                <Dialog.Content style={styles.modalContent}>{children}</Dialog.Content>

                <Dialog.Actions>
                    <Button onPress={onClose} labelStyle={styles.closeButtonText}>
                        Ok
                    </Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
};

export default ModalWindow;
