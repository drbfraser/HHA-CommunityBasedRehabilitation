import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Button, SxProps, Theme } from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";

interface IProps {
    sx?: SxProps<Theme> | undefined;
}

const GoBackButton = ({ sx }: IProps) => {
    const { t } = useTranslation();
    const history = useHistory();

    return (
        <Button sx={sx} onClick={history.goBack}>
            <ArrowBack />
            {t("general.goBack")}
        </Button>
    );
};

export default GoBackButton;
