import { validationSchema } from "@cbr/common/forms/Risks/riskFormFields";
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
import { Field, Form, Formik, FieldProps, FormikProps } from "formik";
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
    // TODO: Update translations file to replace placeholders
    const goalStatusOptions = [
        { value: "GO", label: t("newVisit.PLACEHOLDER-healthGoals.1") },
        { value: "CON", label: t("newVisit.PLACEHOLDER-healthGoals.0") },
        { value: "CAN", label: t("newVisit.PLACEHOLDER-healthGoals.2") },
    ];

    /* TODO: Add back in if we need to use canonical/localized fields
    const canonicalFields: string[] = Object.values(
        t(props.transKey, { returnObjects: true, lng: "en" })
    );
    const localizedFields: string[] = Object.values(t(props.transKey, { returnObjects: true }));
    */

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
                props.setRisk(values);
                props.close();
            }}
            enableReinitialize
            initialValues={props.risk}
        >
            {({ isSubmitting }: FormikProps<IRisk>) => (
                <Dialog fullWidth open={true} aria-labelledby="form-dialog-title">
                    <Form>
                        <DialogTitle id="form-dialog-title">
                            {getDialogTitleText(props.risk.risk_type)}
                        </DialogTitle>
                        <DialogContent>
                            <Grid container direction="column" spacing={1}>
                                <Grid item>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        {/* TODO: Add Translation */}
                                        Update Goal Status
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <FormControl fullWidth variant="outlined">
                                        <Field name="goal_status">
                                            {({ field }: FieldProps) => (
                                                <RadioGroup {...field}>
                                                    {goalStatusOptions.map((label, index) => (
                                                        <FormControlLabel
                                                            key={index}
                                                            value={label.value}
                                                            control={<Radio />}
                                                            label={label.label}
                                                        />
                                                    ))}
                                                </RadioGroup>
                                            )}
                                        </Field>
                                    </FormControl>
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
                                type="submit"
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
