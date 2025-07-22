import React, { FC, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Button, Dialog, Divider, Portal } from "react-native-paper";
import useStyles from "../ModalForm.styles";

interface IProps {
    label: string;
    visible: boolean;
    onClose: () => void;
    children: ReactNode;
    isDismissable?: boolean;
}

const ModalWindow: FC<IProps> = ({ label, visible, onClose, children, isDismissable = false }) => {
    const { t } = useTranslation();
    const styles = useStyles();

    return (
        <Portal>
            <Dialog visible={visible} dismissable={isDismissable} style={styles.modal}>
                <Dialog.Title>{label}</Dialog.Title>
                <Divider />

                <Dialog.Content style={styles.modalContent}>{children}</Dialog.Content>

                <Dialog.Actions>
                    <Button onPress={onClose} labelStyle={styles.closeButtonText}>
                        {t("general.ok")}
                    </Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
};

export default ModalWindow;
