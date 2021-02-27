import RiskChip from 'components/RiskChip/RiskChip';
import React from 'react';
import { IRisk, riskTypes } from 'util/risks';
import { useStyles } from './RiskHistory.styles';

interface IProps {
    risk: IRisk
}

const RiskHistoryEntry = ({risk}: IProps) => {
    const styles = useStyles();
    const riskType = riskTypes[risk.risk_type];

    return <div className={styles.container}>
        <b>{riskType.name}</b> risk changed to <RiskChip risk={risk.risk_level} />
    </div>
}

export default RiskHistoryEntry;