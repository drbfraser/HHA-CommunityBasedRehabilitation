import { Chip } from "@mui/material";
import React from "react";

export default function GoalStatusChip(label: string) {
    return (
        <Chip
            label={label}
            // TODO: Change colour depending on label type
            color="primary"
            size="small"
            variant="filled"
            sx={{ borderRadius: 0 }}
        />
    );
}
