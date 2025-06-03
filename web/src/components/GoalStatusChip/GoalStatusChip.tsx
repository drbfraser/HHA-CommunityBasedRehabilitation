import { Chip, ChipProps } from "@mui/material";
import { OutcomeGoalMet } from "@cbr/common/util/visits";
import { goalStatuses } from "@cbr/common/util/risks";
import React from "react";
import { goalStatusChipStyles } from "./GoalStatusChip.styles";
interface GoalChipProps extends ChipProps {
    goalStatus: OutcomeGoalMet;
}

export default function GoalStatusChip(props: GoalChipProps) {
    // taken from front end branch as of now
    const goalStatus = goalStatuses[props.goalStatus];

    return (
        <Chip
            // TODO: Change Label
            label={goalStatus ? goalStatus.name : "In Progress"}
            // TODO: Change colour depending on label type
            style={{ backgroundColor: goalStatus ? goalStatus.color : "primary" }}
            size="small"
            variant="filled"
            sx={goalStatusChipStyles.chip}
        />
    );
}