import { Chip, ChipProps } from "@mui/material";
import { OutcomeGoalMet } from "@cbr/common/util/visits";
import { goalStatuses } from "@cbr/common/util/risks";
import React from "react";
import { goalStatusChipStyles } from "./GoalStatusChip.styles";
interface GoalChipProps extends ChipProps {
    goalStatus: OutcomeGoalMet;
}

export default function GoalStatusChip(props: GoalChipProps) {
    const goalStatus = goalStatuses[props.goalStatus];

    return (
        <Chip
            label={goalStatus ? goalStatus.name : "In Progress"}
            style={{ backgroundColor: goalStatus ? goalStatus.color : "primary" }}
            size="small"
            variant="filled"
            sx={goalStatusChipStyles.chip}
        />
    );
}

