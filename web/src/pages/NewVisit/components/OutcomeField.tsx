import React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Box, FormLabel, Typography, Grid } from "@mui/material";
import { Field, useFormikContext } from "formik";
import { TextField } from "formik-mui";
import {
    visitFieldLabels,
    VisitFormField,
    OutcomeFormField,
    getVisitGoalLabel,
    getVisitGoalStatusLabel,
} from "@cbr/common/forms/newVisit/visitFormFields";
import { getRiskGoalsTranslationKey, IRisk, RiskType } from "@cbr/common/util/risks";
import EditNoteTwoToneIcon from "@mui/icons-material/EditNoteTwoTone";
import UpdateGoalStatus from "/Users/buimaikhanh/Downloads/415-HHA-CBR/web/src/pages/ClientDetails/Risks/UpdateGoalStatus";
import { RiskLevel } from "@cbr/common/util/risks";
import { OutcomeGoalMet } from "@cbr/common/util/visits";
import GoalStatusChip from "components/GoalStatusChip/GoalStatusChip";
import Stack from "@mui/material/Stack";

interface IModalProps {
    risk: IRisk;
    setRisk: (risk: IRisk) => void;
    close: () => void;
    newGoal: boolean;
    visitType: VisitFormField;
    risks: IRisk[];
}

const OutcomeField = (props : IModalProps) => {
    const { t } = useTranslation();
    const fieldName = `${VisitFormField.outcomes}.${props.visitType}`;
    const { setFieldValue } = useFormikContext<any>();
    const matchingRisk = props.risks.find(
        (risk) => risk.risk_type === (props.visitType as unknown as RiskType)
    );

    const [openEditGoals, setOpenEditGoals] = useState<boolean>(false);
    const handleEditGoalsClick = () => {
        setOpenEditGoals((prevOpen: boolean) => !prevOpen);
    };

    const [editedRisk, setEditedRisk] = useState<IRisk>(() => {
            if (props.newGoal) {
                return {
                    ...props.risk,
                    goal_name: "",
                    requirement: "",
                    goal_status: OutcomeGoalMet.ONGOING,
                    comments: RiskLevel.LOW,
                    risk_level: RiskLevel.LOW,
                };
            }
            return props.risk;
        });

    useEffect(() => {
        if (matchingRisk?.goal_status) {
            setFieldValue(`${fieldName}.goal_status`, matchingRisk.goal_status);
        }
    }, [matchingRisk, fieldName, setFieldValue]);

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
        
            <FormLabel focused={false}>{getVisitGoalLabel(t, props.visitType)}</FormLabel>
            <Typography variant={"body1"}>{matchingRisk?.goal_name}</Typography>
            <br />

            <FormLabel focused={false}>{getVisitGoalStatusLabel(t, props.visitType)}</FormLabel>
            <br />
            <Grid container direction="column" spacing={3}>
                <Grid item>
                    <Stack direction="row" spacing={1}>
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
            </Grid>                                              
            <br />
            <br />
            <div>
                <FormLabel focused={false}>{t("newVisit.outcomeOfGoal")}</FormLabel>
                <Field
                    type="text"
                    component={TextField}
                    variant="outlined"
                    name={`${fieldName}.${OutcomeFormField.outcome}`}
                    label={visitFieldLabels[OutcomeFormField.outcome]}
                    required
                    fullWidth
                    multiline
                />
                <br />
            </div>
            </>
);
};

export default OutcomeField;
