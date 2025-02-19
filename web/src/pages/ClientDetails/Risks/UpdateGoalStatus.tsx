import { handleSubmit } from "@cbr/common/forms/Risks/riskFormFieldHandler";
import { fieldLabels, FormField, validationSchema } from "@cbr/common/forms/Risks/riskFormFields";
import { RiskGoalOptions, RiskRequirementOptions } from "@cbr/common/types/translationKeys";
import { IRisk, RiskType } from "@cbr/common/util/risks";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    RadioGroup,
    Typography,
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-mui";
import React from "react";
import { useTranslation } from "react-i18next";

interface IModalProps {
    risk: IRisk;
    setRisk: (risk: IRisk) => void;
    close: () => void;
    transKey: RiskRequirementOptions | RiskGoalOptions;
}

export default function UpdateGoalStatus(props: IModalProps) {
    const { t } = useTranslation();

    const canonicalFields: string[] = Object.values(
        t(props.transKey, { returnObjects: true, lng: "en" })
    );
    const localizedFields: string[] = Object.values(t(props.transKey, { returnObjects: true }));
    // console.assert(canonicalFields.length === localizedFields.length);

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
                        </DialogTitle>
                        <DialogContent>
                            <Grid container direction="column" spacing={1}>
                                <Grid item>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        Update Goal Status
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <FormControl fullWidth variant="outlined">
                                        <RadioGroup
                                            aria-labelledby="radio-buttons-goal-status"
                                            name="radio-buttons-group"
                                        >
                                            {/* TODO: Update Value and figure out how to integrate with Formik  */}
                                            {localizedFields.map((label, index) => (
                                                <FormControlLabel
                                                    value={label}
                                                    control={<Radio />}
                                                    label={label}
                                                />
                                            ))}
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                                <Grid item>
                                    <Field
                                        component={TextField}
                                        fullWidth
                                        required
                                        variant="outlined"
                                        margin="dense"
                                        label="Goal Name"
                                        name={FormField.goal}
                                    />
                                </Grid>
                            </Grid>
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
                                color="success"
                                variant="outlined"
                                type="reset"
                                disabled={isSubmitting}
                            >
                                {t("general.save")}
                            </Button>
                        </DialogActions>
                    </Form>
                </Dialog>
            )}
        </Formik>
    );
}
