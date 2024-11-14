import React from "react";
import { Chip, ChipProps } from "@mui/material";
import { priorityLevelChipStyles } from "./PriorityLevelChip.styles";
import { PriorityLevel, priorityLevels } from "@cbr/common/util/alerts";

interface PriorityChipProps extends ChipProps {
    priority: PriorityLevel;
}

const PriorityLevelChip = (props: PriorityChipProps) => {
    const priorityLevel = priorityLevels[props.priority];

    return (
        <Chip
            sx={priorityLevelChipStyles.chip}
            label={priorityLevel ? priorityLevel.name : "High"}
            style={{ backgroundColor: priorityLevel ? priorityLevel.color : "red" }}
            {...props}
        />
    );
};

export default PriorityLevelChip;
