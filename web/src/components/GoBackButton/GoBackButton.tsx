import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { ArrowBack } from "@material-ui/icons";

const GoBackButton = () => {
    const { t } = useTranslation();
    const history = useHistory();

    return (
        <Button onClick={history.goBack}>
            <ArrowBack />
            {t("general.goBack")}
        </Button>
    );
};

export default GoBackButton;
