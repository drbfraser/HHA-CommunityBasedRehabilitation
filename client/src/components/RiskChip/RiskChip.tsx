import { Chip, ChipProps } from "@material-ui/core";
import { RiskLevel, riskLevels } from "util/risks";
import { useStyles } from "./RiskChip.styles";

interface RiskChipProps extends ChipProps {
    risk: RiskLevel;
}

const RiskChip = (props: RiskChipProps) => {
    const styles = useStyles();
    const riskLevel = riskLevels[props.risk];

    return (
        <Chip
            className={styles.chip}
            label={riskLevel.name}
            style={{ backgroundColor: riskLevel.color }}
            {...props}
        />
    );
};

export default RiskChip;
