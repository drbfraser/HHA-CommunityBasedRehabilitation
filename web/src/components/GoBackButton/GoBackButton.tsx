import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Button, SxProps, Theme } from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";
import UnsavedChanges from "components/Dialogs/UnsavedChanges";

interface IProps {
    sx?: SxProps<Theme> | undefined;
}

const GoBackButton = ({ sx }: IProps) => {
    const { t } = useTranslation();
    const history = useHistory();
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleBack = () => {
        setDialogOpen(true);
    };

    const handleConfirm = () => {
        setDialogOpen(false);
        history.goBack();
    };

    const handleCancel = () => {
        setDialogOpen(false);
    };

    return (
        <>
            <Button sx={sx} onClick={handleBack}>
                <ArrowBack />
                {t("general.goBack")}
            </Button>
            <UnsavedChanges
                open={dialogOpen}
                setOpen={setDialogOpen}
                onSave={handleConfirm}
                onCancel={handleCancel}
                description={t("general.goBackWarning")}
                saveBtnMsg={t("general.confirm")}
            />
        </>
    );
};

export default GoBackButton;
