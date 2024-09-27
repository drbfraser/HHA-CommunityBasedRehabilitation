import React from "react";
import { useTranslation } from "react-i18next";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import {
    Grid,
    Button,
    Dialog,
    DialogContent,
    DialogActions,
    DialogTitle,
    MenuItem,
    FormControl,
} from "@material-ui/core";

import { IRisk, riskLevels, RiskType } from "@cbr/common/util/risks";
import { fieldLabels, FormField, validationSchema } from "@cbr/common/forms/Risks/riskFormFields";
import { handleSubmit } from "@cbr/common/forms/Risks/riskFormFieldHandler";

interface IModalProps {
    risk: IRisk;
    setRisk: (risk: IRisk) => void;
    close: () => void;
}

const ClientRisksModal = (props: IModalProps) => {
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
                // TODO: translate
                return "Update Mental Risk";
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
                        </DialogTitle>
                        <DialogContent>
                            <Grid container direction="column" spacing={2}>
                                <Grid item>
                                    <FormControl fullWidth variant="outlined">
                                        <Field
                                            component={TextField}
                                            select
                                            required
                                            variant="outlined"
                                            label={fieldLabels[FormField.risk_level]}
                                            name={FormField.risk_level}
                                        >
                                            {Object.entries(riskLevels).map(([value, { name }]) => (
                                                <MenuItem key={value} value={value}>
                                                    {name}
                                                </MenuItem>
                                            ))}
                                        </Field>
                                    </FormControl>
                                </Grid>
                                <Grid item>
                                    <Field
                                        component={TextField}
                                        fullWidth
                                        multiline
                                        required
                                        rows={4}
                                        variant="outlined"
                                        margin="dense"
                                        label={fieldLabels[FormField.requirement]}
                                        name={FormField.requirement}
                                    />
                                </Grid>
                                <Grid item>
                                    <Field
                                        component={TextField}
                                        fullWidth
                                        margin="dense"
                                        multiline
                                        required
                                        rows={4}
                                        variant="outlined"
                                        label={fieldLabels[FormField.goal]}
                                        name={FormField.goal}
                                    />
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                color="primary"
                                variant="contained"
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {t("general.update")}
                            </Button>
                            <Button
                                variant="outlined"
                                color="primary"
                                type="reset"
                                disabled={isSubmitting}
                                onClick={() => {
                                    props.close();
                                }}
                            >
                                {t("general.cancel")}
                            </Button>
                        </DialogActions>
                    </Form>
                </Dialog>
            )}
        </Formik>
    );
};

export default ClientRisksModal;
