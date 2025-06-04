import { Chip, ChipProps } from "@mui/material";
import { OutcomeGoalMet } from "@cbr/common/util/visits";
import React from "react";

interface GoalChipProps extends ChipProps {
    goalStatus: OutcomeGoalMet;
}

export default function GoalStatusChip(props: GoalChipProps) {
    // taken from front end branch as of now
    return (
        <Chip
            // TODO: Change Label
            label="In Progress"
            // TODO: Change colour depending on label type
            color="primary"
            size="small"
            variant="filled"
            sx={{ borderRadius: 0 }}
        />
    );
}