import { Chip, ChipProps } from "@material-ui/core";
import { Risk } from "util/riskOptions";

interface RiskChipProps extends ChipProps {
    risk: Risk | undefined;
}

const RiskChip = (props: RiskChipProps) => {
    return (
        <Chip
            label={props.risk?.value}
            style={{ backgroundColor: props.risk?.color }}
            color={"primary"}
            {...props}
        />
    );
};

export default RiskChip;
