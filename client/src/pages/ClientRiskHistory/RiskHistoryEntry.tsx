import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@material-ui/core";
import {
    TimelineItem,
    TimelineOppositeContent,
    TimelineSeparator,
    TimelineConnector,
    TimelineDot,
    TimelineContent,
} from "@material-ui/lab";
import RiskChip from "components/RiskChip/RiskChip";
import React, { useState } from "react";
import { IRisk, riskTypes } from "util/risks";
import { useStyles } from "./RiskHistory.styles";

interface IProps {
    risk: IRisk;
    isInitial: boolean;
}

const RiskHistoryEntry = ({ risk, isInitial }: IProps) => {
    const styles = useStyles();
    const [expanded, setExpanded] = useState(false);
    const riskType = riskTypes[risk.risk_type];
    const date = new Date(risk.timestamp * 1000);

    const Summary = () => (
        <>
            <b>{riskType.name}</b> risk {isInitial ? "set" : "changed"} to{" "}
            <RiskChip risk={risk.risk_level} />
        </>
    );

    return (
        <>
            <TimelineItem key={risk.id}>
                <TimelineOppositeContent className={styles.timelineDate}>
                    {date.toLocaleDateString()}
                </TimelineOppositeContent>
                <TimelineSeparator>
                    <TimelineConnector />
                    <TimelineDot />
                    <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                    <div
                        className={`${styles.timelineEntry} ${styles.riskEntry}`}
                        onClick={() => setExpanded(true)}
                    >
                        <Summary />
                    </div>
                </TimelineContent>
            </TimelineItem>
            <Dialog fullWidth maxWidth="sm" open={expanded} onClose={() => setExpanded(false)}>
                <DialogTitle>
                    <Summary />
                </DialogTitle>
                <DialogContent>
                    <b>Time:</b> {date.toLocaleString()}
                </DialogContent>
                <DialogContent>
                    <b>Requirements:</b> {risk.requirement}
                </DialogContent>
                <DialogContent>
                    <b>Goals:</b> {risk.goal}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setExpanded(false)} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default RiskHistoryEntry;
