import { Chip, ChipProps } from "@material-ui/core";
import { IRisk } from "util/riskOptions";
import { useStyles } from "./RiskChip.styles";

interface RiskChipProps extends ChipProps {
    risk: IRisk;
}

const RiskChip = (props: RiskChipProps) => {
    const styles = useStyles();

    return (
        <Chip
            className={styles.chip}
            label={props.risk.value}
            style={{ backgroundColor: props.risk.color }}
            {...props}
        />
    );
};

export default RiskChip;
