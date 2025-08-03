import { handleSubmit } from "@cbr/common/forms/Risks/riskFormFieldHandler";
import { validationSchema } from "@cbr/common/forms/Risks/riskFormFields";
import { IRisk, RiskType } from "@cbr/common/util/risks";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { Form, Formik } from "formik";
import React from "react";
import { useTranslation } from "react-i18next";

interface IModalProps {
    risk: IRisk;
    setRisk: (risk: IRisk) => void;
    close: () => void;
}

export default function CancelRisk(props: IModalProps) {
    const { t } = useTranslation();

    const getDialogTitleText = (riskType: RiskType): string => {
        switch (riskType) {
            case RiskType.HEALTH:
                return t("riskAttr.update_health");
            case RiskType.EDUCATION:
                return t("riskAttr.update_education");
            case RiskType.SOCIAL:
                return t("riskAttr.update_social");
            case RiskType.NUTRITION:
                return t("riskAttr.update_nutrition");
            case RiskType.MENTAL:
                return t("riskAttr.update_mental");
            default:
                console.error("Unknown risk type.");
                return "";
        }
    };

    return (
        <Formik
            onSubmit={(values) => {
                handleSubmit(values, props.risk, props.setRisk);
                props.close();
            }}
            initialValues={props.risk}
            validationSchema={validationSchema}
        >
            {({ isSubmitting }) => (
                <Dialog fullWidth open={true} aria-labelledby="form-dialog-title">
                    <Form>
                        <DialogTitle id="form-dialog-title">
                            {getDialogTitleText(props.risk.risk_type)}
                            <Stack direction="row" spacing={1}>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    {t("general.cancel")} {t("general.goal")}
                                </Typography>
                            </Stack>
                        </DialogTitle>
                        <DialogContent>
                            <Typography variant="subtitle1" fontWeight="bold">
                                {t("risks.cancelReason")}
                            </Typography>
                            <FormControl fullWidth variant="outlined">
                                <TextField fullWidth placeholder="Duplicate Goal" />
                            </FormControl>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                variant="outlined"
                                color="primary"
                                type="reset"
                                disabled={isSubmitting}
                                onClick={() => {
                                    props.close();
                                }}
                            >
                                {t("general.goBack")}
                            </Button>
                            <Button
                                color="error"
                                variant="outlined"
                                type="reset"
                                disabled={isSubmitting}
                            >
                                {t("general.cancel")}
                            </Button>
                        </DialogActions>
                    </Form>
                </Dialog>
            )}
        </Formik>
    );
}
