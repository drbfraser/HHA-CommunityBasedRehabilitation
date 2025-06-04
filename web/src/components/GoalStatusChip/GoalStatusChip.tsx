import { Chip } from "@mui/material";
import React from "react";

export default function GoalStatusChip() {
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
