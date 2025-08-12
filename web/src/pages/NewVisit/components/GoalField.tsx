import React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Box, FormLabel, Typography, Grid } from "@mui/material";
import { useFormikContext } from "formik";
import {
    VisitFormField,
    getVisitGoalLabel,
    getVisitGoalStatusLabel,
    getVisitGoalRequirementLabel,
    visitFieldLabels,
} from "@cbr/common/forms/newVisit/visitFormFields";
import { getRiskGoalsTranslationKey, IRisk, RiskType } from "@cbr/common/util/risks";
import UpdateGoalStatus from "../../../pages/ClientDetails/Risks/UpdateGoalStatus";
import { RiskLevel } from "@cbr/common/util/risks";
import { OutcomeGoalMet } from "@cbr/common/util/visits";
import GoalStatusChip from "components/GoalStatusChip/GoalStatusChip";
import Stack from "@mui/material/Stack";
import { clientRiskStyles } from "pages/ClientDetails/Risks/ClientRisks.styles";
import RiskLevelChip from "components/RiskLevelChip/RiskLevelChip";

interface IModalProps {
    risk: IRisk;
    setRisk: (risk: IRisk) => void;
    close: () => void;
    newGoal: boolean;
    visitType: VisitFormField;
    risks: IRisk[];
}

const GoalField = (props: IModalProps) => {
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
            <FormLabel focused={false}>
                {t("newVisit.clients")} {visitFieldLabels[props.visitType]} {t("risks.riskLevel")}
            </FormLabel>
            {matchingRisk && (
                <Box sx={clientRiskStyles.riskCardButtonAndBadge}>
                    <RiskLevelChip risk={matchingRisk.risk_level} />
                </Box>
            )}
            <Box mt={1} />

            <FormLabel focused={false}>{getVisitGoalLabel(t, props.visitType)}</FormLabel>
            <Typography variant={"body1"}>{matchingRisk?.goal_name}</Typography>
            <Box mt={1} />

            <FormLabel focused={false}>{getVisitGoalStatusLabel(t, props.visitType)}</FormLabel>
            <Grid container direction="column" spacing={3}>
                <Grid item>
                    <Stack direction="row" spacing={1}>
                        <GoalStatusChip goalStatus={editedRisk.goal_status} />
                    </Stack>
                </Grid>
            </Grid>
            <Box mt={1} />

            <div>
                <FormLabel focused={false}>
                    {getVisitGoalRequirementLabel(t, props.visitType)}
                </FormLabel>
                <Typography variant={"body1"}>{matchingRisk?.requirement}</Typography>
            </div>
        </>
    );
};

export default GoalField;
