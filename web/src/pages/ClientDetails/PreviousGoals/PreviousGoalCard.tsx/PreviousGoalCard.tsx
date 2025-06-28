import { fieldLabels, FormField } from "@cbr/common/forms/Risks/riskFormFields";
import { RiskType } from "@cbr/common/util/risks";
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
            </DialogTitle>
            <DialogContent>
                <Stack direction="column" spacing={1} sx={{ mb: 3 }}>
                    {/* TODO: Replace with Translation */}
                    <Typography variant="subtitle1">
                        <b>Goal Status: </b> <GoalStatusChip goalStatus={props.risk.goal_status} />
                    </Typography>
                    <Typography variant="subtitle1">
                        <b>Type:</b> {getDialogTitleText(props.risk.risk_type)}
                    </Typography>
                    <Typography variant="subtitle1">
                        <b>Start Date:</b> {timestampToFormDate(props.risk.timestamp, true)}
                    </Typography>
                    <Typography variant="subtitle1">
                        <b>End Date:</b> {timestampToFormDate(props.risk.end_date, true)}
                    </Typography>
                </Stack>
                <Grid container direction="column" spacing={2}>
                    <Grid item>
                        <FormControl fullWidth variant="outlined">
                            <TextField
                                id="risk-level-readonly"
                                label={fieldLabels[FormField.risk_level]}
                                defaultValue={props.risk.risk_level}
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
                                defaultValue={props.risk.requirement}
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
                    <Grid item>
                        <FormControl fullWidth variant="outlined">
                            <TextField
                                id="outlined-read-only-input"
                                label="Comments"
                                defaultValue={props.risk.risk_level}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </FormControl>
                    </Grid>
                    {props.risk.goal_status === OutcomeGoalMet.CANCELLED && (
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
