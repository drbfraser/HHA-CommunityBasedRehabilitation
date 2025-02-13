import {
    Button,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import React from "react";
import { useTranslation } from "react-i18next";

interface UnsavedChangesProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    title?: string | undefined;
    description?: string | undefined;
    saveBtnMsg?: string | undefined;
    cancelBtnMsg?: string | undefined;
    onSave?: () => void;
    onCancel?: () => void;
}

export default function UnsavedChanges({
    open,
    setOpen,
    title,
    description,
    saveBtnMsg,
    cancelBtnMsg,
    onSave,
    onCancel,
}: UnsavedChangesProps) {
    const { t } = useTranslation();
    const openDialog = open;
    const setOpenDialog = setOpen;
    const dialogTitle = title ? title : "Unsaved Changes";
    const dialogDescription = description
        ? description
        : "You have unsaved changes. Do you want to Save the changes?";
    const dialogSaveBtnMsg = saveBtnMsg ? saveBtnMsg : t("general.save");
    const dialogCancelBtnMsg = cancelBtnMsg ? cancelBtnMsg : t("general.cancel");

    const handleClose = () => {
        if (onCancel) {
            onCancel();
        } else {
            setOpenDialog(false);
        }
    };

    const handleSave = () => {
        if (onSave) {
            onSave();
        } else {
            setOpenDialog(false);
        }
    };

    return (
        <>
            <Dialog
                open={openDialog}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{dialogTitle}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {dialogDescription}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>{dialogCancelBtnMsg}</Button>
                    <Button onClick={handleSave} autoFocus>
                        {dialogSaveBtnMsg}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
