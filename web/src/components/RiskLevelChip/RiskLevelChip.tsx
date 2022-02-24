import React from "react";
import { Chip, ChipProps } from "@material-ui/core";
import { RiskLevel, riskLevels } from "@cbr/common/util/risks";
import { useStyles } from "./RiskLevelChip.styles";

interface RiskChipProps extends ChipProps {
    risk: RiskLevel;
}

const RiskLevelChip = (props: RiskChipProps) => {
    const styles = useStyles();
    const riskLevel = riskLevels[props.risk];

    return (
        <Chip
            className={styles.chip}
            label={riskLevel.name?riskLevel.name:'High'}
            style={{ backgroundColor: riskLevel.color }}
            {...props}
        />
    );
};

export default RiskLevelChip;
