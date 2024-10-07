import React from "react";
import Chip, { ChipProps } from "@mui/material/Chip";
import { RiskType } from "@cbr/common/util/risks";
import { riskTypes } from "util/riskIcon";

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
