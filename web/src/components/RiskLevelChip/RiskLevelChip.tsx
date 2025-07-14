import React from "react";
import { Chip, ChipProps } from "@mui/material";
import { RiskLevel, riskLevels } from "@cbr/common/util/risks";
import { riskLevelChipStyles } from "./RiskLevelChip.styles";

interface RiskChipProps extends ChipProps {
    risk: RiskLevel;
}

const RiskLevelChip = (props: RiskChipProps) => {
    const riskLevel = riskLevels[props.risk];

    return (
        <Chip
            sx={riskLevelChipStyles.chip}
            label={riskLevel ? riskLevel.name : "High"}
            style={{ backgroundColor: riskLevel ? riskLevel.color : "red" }}
            {...props}
        />
    );
};

export default RiskLevelChip;
