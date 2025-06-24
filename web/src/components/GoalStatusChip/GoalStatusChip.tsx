import { Chip, ChipProps } from "@mui/material";
import { OutcomeGoalMet } from "@cbr/common/util/visits";
import { goalStatuses } from "@cbr/common/util/risks";
import React from "react";
import i18n from "i18next";
import { goalStatusChipStyles } from "./GoalStatusChip.styles";
interface GoalChipProps extends ChipProps {
    goalStatus: OutcomeGoalMet;
}

export default function GoalStatusChip(props: GoalChipProps) {
    const goalStatus = goalStatuses[props.goalStatus];

    return (
        <Chip
            label={goalStatus ? goalStatus.name : i18n.t("newVisit.PLACEHOLDER-socialGoals.1")}
            style={{ backgroundColor: goalStatus ? goalStatus.color : "primary" }}
            size="small"
            variant="filled"
            sx={goalStatusChipStyles.chip}
        />
    );
}
