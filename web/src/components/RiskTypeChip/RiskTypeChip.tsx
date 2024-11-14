import React from "react";
import { useTranslation } from "react-i18next";
import Chip, { ChipProps } from "@mui/material/Chip";
import { RiskType } from "@cbr/common/util/risks";
import { getTranslatedRiskName, riskTypes } from "util/risks";

interface IProps extends ChipProps {
    risk: RiskType;
}

const RiskTypeChip = (props: IProps) => {
    const { t } = useTranslation();

    const riskType = riskTypes[props.risk];
    return (
        <Chip
            icon={<riskType.Icon />}
            variant="outlined"
            color="primary"
            label={getTranslatedRiskName(t, props.risk)}
            {...props}
        />
    );
};

export default RiskTypeChip;
