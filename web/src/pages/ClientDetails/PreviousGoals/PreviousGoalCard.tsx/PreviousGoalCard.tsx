import { fieldLabels, FormField } from "@cbr/common/forms/Risks/riskFormFields";
import { RiskLevel, RiskType } from "@cbr/common/util/risks";
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
import RiskLevelChip from "components/RiskLevelChip/RiskLevelChip";
import React from "react";
import { useTranslation } from "react-i18next";
import { FormControl } from "@mui/material";
import GoalStatusChip from "components/GoalStatusChip/GoalStatusChip";
import { OutcomeGoalMet } from "@cbr/common/util/visits";

// TODO: Replace with IRisk once changes are made
interface ITempRisk {
    id: number;
    risk_level: RiskLevel;
    risk_type: RiskType;
    goal: string;
    timestamp: string;
    end_date: string;
    // maybe use an ENUM here instead?
    goal_status: string;
}

interface IModalProps {
    // TODO: Switch from ITempRisk
    risk: ITempRisk;
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

    return (
        <Dialog
            fullWidth
            open={props.open}
            onClose={props.close}
            ria-labelledby="form-dialog-title"
        >
            <DialogTitle id="form-dialog-title">
                {/* TODO: Change with Translation */}
                Viewing Previous Goal
                <Stack direction="column" spacing={1}>
                    {/* TODO: Replace with Translation */}
                    <Typography variant="subtitle1">
                        <b>Goal Status:</b> {props.risk.goal_status}
                        {/* TODO: Update with status logic */}
                        <GoalStatusChip goalStatus={OutcomeGoalMet.ONGOING} />
                    </Typography>
                    <Typography variant="subtitle1">
                        <b>Type:</b> {getDialogTitleText(props.risk.risk_type)}
                    </Typography>
                    <Typography variant="subtitle1">
                        <b>Start Date:</b> {props.risk.timestamp}
                    </Typography>
                    <Typography variant="subtitle1">
                        <b>End Date:</b> {props.risk.end_date}
                    </Typography>
                </Stack>
            </DialogTitle>
            <DialogContent>
                <Grid container direction="column" spacing={2}>
                    <Grid item>
                        <FormControl fullWidth variant="outlined">
                            <TextField
                                id="outlined-read-only-input"
                                label={fieldLabels[FormField.risk_level]}
                                defaultValue="need to update"
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item>
                        <FormControl fullWidth variant="outlined">
                            <TextField
                                id="outlined-read-only-input"
                                label={fieldLabels[FormField.requirement]}
                                defaultValue="need to be updated"
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item>
                        <FormControl fullWidth variant="outlined">
                            <TextField
                                id="outlined-read-only-input"
                                label="Comments"
                                defaultValue="need to be updated "
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item>
                        <FormControl fullWidth variant="outlined">
                            <TextField
                                id="outlined-read-only-input"
                                label={fieldLabels[FormField.goal]}
                                defaultValue={props.risk.goal}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </FormControl>
                    </Grid>
                    {props.risk.goal_status === "Cancelled" && (
                        <Grid item>
                            <FormControl fullWidth variant="outlined">
                                <TextField
                                    id="outlined-read-only-input"
                                    label="Cancellation Reason"
                                    defaultValue="need to be updated"
                                    InputProps={{
                                        readOnly: true,
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
