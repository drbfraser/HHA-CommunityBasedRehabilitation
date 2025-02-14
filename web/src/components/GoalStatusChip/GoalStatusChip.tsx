import { Chip } from "@mui/material";
import React from "react";
export default function GoalStatusChip() {
    return (
        <Chip
            label="In Progress"
            color="primary"
            size="small"
            variant="filled"
            sx={{ borderRadius: 0 }}
        />
    );
}
