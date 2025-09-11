import {
    Button,
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    MenuItem,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Field, Form, Formik, FormikProps } from "formik";
import { TextField } from "formik-mui";
import { useTranslation } from "react-i18next";
import { RiskLevel, riskDropdownOptions, riskTypeKeyMap } from "@cbr/common/util/risks";
import { handleSubmit } from "@cbr/common/forms/Risks/riskFormFieldHandler";
import { fieldLabels, FormField, validationSchema } from "@cbr/common/forms/Risks/riskFormFields";
import { getRiskGoalsTranslationKey, IRisk, riskLevels, RiskType } from "@cbr/common/util/risks";
import EditNoteTwoToneIcon from "@mui/icons-material/EditNoteTwoTone";
import React, { useState } from "react";
import UpdateGoalStatus from "./UpdateGoalStatus";
import GoalStatusChip from "components/GoalStatusChip/GoalStatusChip";
import { OutcomeGoalMet } from "@cbr/common/util/visits";
import ModalDropdown from "./ModalDropdown";
interface IModalProps {
    risk: IRisk;
    setRisk: (risk: IRisk) => void;
    close: () => void;
    newGoal: boolean;
}

const ClientRisksModal = (props: IModalProps) => {
    const { t } = useTranslation();
    const [openEditGoals, setOpenEditGoals] = useState<boolean>(false);
    const [editedRisk, setEditedRisk] = useState<IRisk>(() => {
        if (props.newGoal) {
            return {
                ...props.risk,
                goal_name: "",
                requirement: "",
                goal_status: OutcomeGoalMet.ONGOING,
                cancellation_reason: "",
                comments: RiskLevel.LOW,
                risk_level: RiskLevel.LOW,
            };
        }
        return props.risk;
    });

    const handleEditGoalsClick = () => {
        setOpenEditGoals((prevOpen: boolean) => !prevOpen);
    };

    const capitalizeFirstLetter = (str: string): string => {
        if (typeof str !== "string" || str.length === 0) {
            return str;
        }
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    const getDialogTitleText = (riskType: RiskType): string => {
        if (!props.newGoal) {
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
        } else {
            switch (riskType) {
                case RiskType.HEALTH:
                    return `${capitalizeFirstLetter(t("general.create"))} ${t(
                        "clientFields.healthRisk"
                    )}`;
                case RiskType.EDUCATION:
                    return `${capitalizeFirstLetter(t("general.create"))} ${t(
                        "clientFields.educationRisk"
                    )}`;
                case RiskType.SOCIAL:
                    return `${capitalizeFirstLetter(t("general.create"))} ${t(
                        "clientFields.socialRisk"
                    )}`;
                case RiskType.NUTRITION:
                    return `${capitalizeFirstLetter(t("general.create"))} ${t(
                        "clientFields.nutritionRisk"
                    )}`;
                case RiskType.MENTAL:
                    return `${capitalizeFirstLetter(t("general.create"))} ${t(
                        "clientFields.mentalRisk"
                    )}`;
                default:
                    console.error("Unknown risk type.");
                    return "";
            }
        }
    };

    return (
        <>
            {openEditGoals && (
                <UpdateGoalStatus
                    risk={editedRisk}
                    setRisk={setEditedRisk}
                    close={() => handleEditGoalsClick()}
                    transKey={getRiskGoalsTranslationKey(props.risk.risk_type)}
                />
            )}

            <Formik
                onSubmit={(values) => {
                    console.log("values", values);
                    handleSubmit(values, props.risk, props.setRisk);
                    props.close();
                }}
                enableReinitialize
                initialValues={editedRisk}
                validationSchema={validationSchema}
            >
                {({ isSubmitting, values }: FormikProps<IRisk>) => {
                    const handleEditGoalsClick = () => {
                        setEditedRisk(values);
                        setOpenEditGoals(true);
                    };
                    return (
                        <Dialog fullWidth open={true} aria-labelledby="form-dialog-title">
                            <Form>
                                <DialogTitle id="form-dialog-title">
                                    {getDialogTitleText(props.risk.risk_type)}
                                </DialogTitle>
                                <DialogContent>
                                    <Grid container direction="column" spacing={3}>
                                        <Grid item>
                                            <Stack direction="row" spacing={1}>
                                                <Typography variant="subtitle1" fontWeight="bold">
                                                    {t("goals.goalStatus")}:
                                                </Typography>
                                                <Box
                                                    onClick={handleEditGoalsClick}
                                                    sx={{
                                                        cursor: "pointer",
                                                        display: "inline-flex",
                                                    }}
                                                >
                                                    <GoalStatusChip
                                                        goalStatus={editedRisk.goal_status}
                                                    />
                                                </Box>
                                                <Box
                                                    onClick={handleEditGoalsClick}
                                                    sx={{
                                                        cursor: "pointer",
                                                        display: "inline-flex",
                                                    }}
                                                >
                                                    <EditNoteTwoToneIcon
                                                        color="action"
                                                        fontSize="medium"
                                                    />
                                                </Box>
                                            </Stack>
                                        </Grid>
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
                                                    {Object.entries(riskLevels)
                                                        .filter(
                                                            ([_, { isDropDownOption }]) =>
                                                                isDropDownOption
                                                        )
                                                        .map(([value, { name }]) => (
                                                            <MenuItem key={value} value={value}>
                                                                {name}
                                                            </MenuItem>
                                                        ))}
                                                </Field>
                                            </FormControl>
                                        </Grid>
                                        <Grid item>
                                            <ModalDropdown
                                                name={FormField.requirement}
                                                label={fieldLabels[FormField.requirement]}
                                                options={riskDropdownOptions[riskTypeKeyMap[props.risk.risk_type]]?.requirement || {}}
                                                isCustom={!Object.values(riskDropdownOptions[riskTypeKeyMap[props.risk.risk_type]].requirement).includes(props.risk.requirement)}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <ModalDropdown
                                                name={FormField.goal_name}
                                                label={fieldLabels[FormField.goal_name]}
                                                options={riskDropdownOptions[riskTypeKeyMap[props.risk.risk_type]]?.goal || {}}
                                                isCustom={!Object.values(riskDropdownOptions[riskTypeKeyMap[props.risk.risk_type]].goal).includes(props.risk.goal_name)}
                                            />
                                        </Grid>
                                    </Grid>
                                </DialogContent>
                                <DialogActions>
                                    <Button
                                        color={props.newGoal ? "success" : "primary"}
                                        variant="contained"
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        {props.newGoal ? t("general.create") : t("general.update")}
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
                    );
                }}
            </Formik>
        </>
    );
};

export default ClientRisksModal;
