import React from "react";
import Chip, { ChipProps } from "@material-ui/core/Chip";
import { RiskType, riskTypes } from "util/risks";

interface IProps extends ChipProps {
    risk: RiskType;
}

const RiskTypeChip = (props: IProps) => {
    const riskType = riskTypes[props.risk];

    return (
        <Chip
            icon={<riskType.Icon />}
            variant="outlined"
            color="primary"
            label={riskType.name}
            {...props}
        />
    );
};

export default RiskTypeChip;
