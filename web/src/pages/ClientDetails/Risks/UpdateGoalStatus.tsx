import { RiskGoalOptions, RiskRequirementOptions } from "@cbr/common/types/translationKeys";
import { cancellationOptions, IRisk, RiskType } from "@cbr/common/util/risks";
import { OutcomeGoalMet } from "@cbr/common/util/visits";
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
import ModalDropdown from "./ModalDropdown";
import { validationSchema } from "@cbr/common/forms/Risks/riskFormFields";

interface IModalProps {
    risk: IRisk;
    setRisk: (risk: IRisk) => void;
    close: () => void;
    transKey: RiskRequirementOptions | RiskGoalOptions;
}

export default function UpdateGoalStatus(props: IModalProps) {
    const { t } = useTranslation();
    const goalStatusOptions = [
        { value: "GO", label: t("newVisit.ongoing") },
        { value: "CON", label: t("newVisit.concluded") },
        { value: "CAN", label: t("newVisit.cancelled") },
    ];

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
            initialValues={{
                ...props.risk,
            }}
            validationSchema={validationSchema}
        >
            {({ isSubmitting, values, errors, touched }: FormikProps<IRisk>) => {
                return (
                    <Dialog fullWidth open={true} aria-labelledby="form-dialog-title">
                        <Form>
                            <DialogTitle id="form-dialog-title">
                                {getDialogTitleText(props.risk.risk_type)}
                            </DialogTitle>
                            <DialogContent>
                                <Grid container direction="column" spacing={1}>
                                    <Grid item>
                                        <Typography variant="subtitle1" fontWeight="bold">
                                            {t("goals.updateGoalStatus")}
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <FormControl fullWidth variant="outlined">
                                            <Field name="goal_status">
                                                {({ field }: FieldProps) => (
                                                    <>
                                                        <RadioGroup {...field}>
                                                            {goalStatusOptions.map(
                                                                (label, index) => (
                                                                    <FormControlLabel
                                                                        key={index}
                                                                        value={label.value}
                                                                        control={<Radio />}
                                                                        label={label.label}
                                                                    />
                                                                ),
                                                            )}
                                                        </RadioGroup>
                                                    </>
                                                )}
                                            </Field>
                                            {values.goal_status === OutcomeGoalMet.CANCELLED && (
                                                <Grid item>
                                                    <ModalDropdown
                                                        name="cancellation_reason"
                                                        modalType="cancellation"
                                                        requirementOrGoal="goal"
                                                        riskType={props.risk.risk_type}
                                                        label={t("risks.cancelReason")}
                                                        options={cancellationOptions}
                                                        isCustom={
                                                            !Object.keys(
                                                                cancellationOptions,
                                                            ).includes(
                                                                values.cancellation_reason,
                                                            ) && values.cancellation_reason !== ""
                                                        }
                                                        error={errors.cancellation_reason}
                                                        touched={touched.cancellation_reason}
                                                    />
                                                </Grid>
                                            )}
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    color="success"
                                    variant="outlined"
                                    type="submit"
                                    disabled={isSubmitting}
                                >
                                    {t("general.save")}
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
                                    {t("general.goBack")}
                                </Button>
                            </DialogActions>
                        </Form>
                    </Dialog>
                );
            }}
        </Formik>
    );
}
