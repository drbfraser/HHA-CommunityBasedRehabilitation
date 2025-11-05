import { fieldLabels, FormField } from "@cbr/common/forms/Risks/riskFormFields";
import {
    getRiskGoalsTranslationKey,
    getRiskRequirementsTranslationKey,
    riskLevels,
    RiskType,
} from "@cbr/common/util/risks";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { FormControl } from "@mui/material";
import GoalStatusChip from "components/GoalStatusChip/GoalStatusChip";
import { IRisk } from "@cbr/common/util/risks";
import { OutcomeGoalMet } from "@cbr/common/util/visits";
import { timestampToFormDate } from "@cbr/common/util/dates";

interface IModalProps {
    risk: IRisk;
    close: () => void;
    open: boolean;
}

const PreviousGoalCard = (props: IModalProps) => {
    const { t } = useTranslation();

    const getDialogTitleText = (riskType: RiskType): string => {
        switch (riskType) {
            case RiskType.HEALTH:
                return t("general.health");
            case RiskType.EDUCATION:
                return t("general.education");
            case RiskType.SOCIAL:
                return t("general.social");
            case RiskType.NUTRITION:
                return t("general.nutrition");
            case RiskType.MENTAL:
                return t("general.mental");
            default:
                console.error("Unknown risk type.");
                return "";
        }
    };

    const risk = props.risk;
    const translatedRequirement = t(
        `${getRiskRequirementsTranslationKey(risk.risk_type)}.${risk.requirement}`,
        { defaultValue: risk.requirement }
    );
    const translatedGoalName = t(
        `${getRiskGoalsTranslationKey(risk.risk_type)}.${risk.goal_name}`,
        { defaultValue: risk.goal_name }
    );

    return (
        <Dialog
            fullWidth
            open={props.open}
            onClose={props.close}
            ria-labelledby="form-dialog-title"
        >
            <DialogTitle id="form-dialog-title">{t("goals.viewingPreviousGoals")}</DialogTitle>
            <DialogContent>
                <Stack direction="column" spacing={1} sx={{ mb: 3 }}>
                    <Typography variant="subtitle1">
                        <b>{t("goals.goalStatus")}: </b>{" "}
                        <GoalStatusChip goalStatus={props.risk.goal_status} />
                    </Typography>
                    <Typography variant="subtitle1">
                        <b>{t("general.type")}:</b> {getDialogTitleText(props.risk.risk_type)}
                    </Typography>
                    <Typography variant="subtitle1">
                        <b>{t("general.startDate")}:</b>{" "}
                        {timestampToFormDate(props.risk.timestamp, true)}
                    </Typography>
                    <Typography variant="subtitle1">
                        <b>{t("general.endDate")}:</b>{" "}
                        {timestampToFormDate(props.risk.end_date, true)}
                    </Typography>
                </Stack>
                <Grid container direction="column" spacing={2}>
                    <Grid item>
                        <FormControl fullWidth variant="outlined">
                            <TextField
                                id="risk-level-readonly"
                                label={fieldLabels[FormField.risk_level]}
                                defaultValue={riskLevels[props.risk.risk_level].name}
                                InputProps={{
                                    readOnly: true,
                                }}
                                sx={{
                                    pointerEvents: "none",
                                    cursor: "default",
                                }}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item>
                        <FormControl fullWidth variant="outlined">
                            <TextField
                                id="requirement-readonly"
                                label={fieldLabels[FormField.requirement]}
                                defaultValue={translatedRequirement}
                                InputProps={{
                                    readOnly: true,
                                }}
                                sx={{
                                    pointerEvents: "none",
                                    cursor: "default",
                                }}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item>
                        <FormControl fullWidth variant="outlined">
                            <TextField
                                id="goal-name-readonly"
                                label={fieldLabels[FormField.goal_name]}
                                defaultValue={translatedGoalName}
                                InputProps={{
                                    readOnly: true,
                                }}
                                sx={{
                                    pointerEvents: "none",
                                    cursor: "default",
                                }}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item>
                        <FormControl fullWidth variant="outlined">
                            <TextField
                                id="comment-readonly"
                                label={fieldLabels[FormField.comments]}
                                defaultValue={riskLevels[props.risk.risk_level].name}
                                variant="outlined"
                                InputProps={{
                                    readOnly: true,
                                }}
                                sx={{
                                    pointerEvents: "none",
                                    cursor: "default",
                                }}
                            />
                        </FormControl>
                    </Grid>
                    {props.risk.goal_status === OutcomeGoalMet.CANCELLED && (
                        <Grid item>
                            <FormControl fullWidth variant="outlined">
                                <TextField
                                    id="cancellation-reason-readonly"
                                    label={fieldLabels[FormField.cancellation_reason]}
                                    defaultValue={props.risk.cancellation_reason}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    sx={{
                                        pointerEvents: "none",
                                        cursor: "default",
                                    }}
                                />
                            </FormControl>
                        </Grid>
                    )}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" color="primary" type="reset" onClick={props.close}>
                    {t("general.goBack")}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PreviousGoalCard;
