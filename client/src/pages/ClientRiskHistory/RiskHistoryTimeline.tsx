import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@material-ui/core";
import {
    Timeline,
    TimelineItem,
    TimelineOppositeContent,
    TimelineSeparator,
    TimelineConnector,
    TimelineDot,
    TimelineContent,
} from "@material-ui/lab";
import RiskChip from "components/RiskChip/RiskChip";
import React, { useState } from "react";
import { IClient } from "util/clients";
import { IRisk, riskTypes } from "util/risks";
import { useStyles } from "./RiskHistory.styles";

interface IEntryProps {
    risk: IRisk;
    isInitial: boolean;
}

const RiskEntry = ({ risk, isInitial }: IEntryProps) => {
    const styles = useStyles();
    const [expanded, setExpanded] = useState(false);
    const riskType = riskTypes[risk.risk_type];
    const date = new Date(risk.timestamp * 1000);

    const Summary = ({ clickable }: { clickable?: boolean }) => (
        <>
            <b>{riskType.name}</b> risk {isInitial ? "set" : "changed"} to{" "}
            <RiskChip risk={risk.risk_level} clickable={clickable ?? false} />
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
                        <Summary clickable={true} />
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

interface IProps {
    client: IClient;
}

const RiskHistoryTimeline = ({ client }: IProps) => {
    const styles = useStyles();

    const riskSort = (a: IRisk, b: IRisk) => {
        if (a.timestamp === b.timestamp) {
            return b.risk_type.localeCompare(a.risk_type);
        }

        return b.timestamp - a.timestamp;
    };

    return (
        <Timeline className={styles.timeline}>
            {client.risks
                .slice()
                .sort(riskSort)
                .map((risk) => (
                    <RiskEntry
                        key={risk.id}
                        risk={risk}
                        isInitial={risk.timestamp === client.created_date}
                    />
                ))}
            <TimelineItem>
                <TimelineOppositeContent className={styles.timelineDate}>
                    {new Date(client.created_date * 1000).toLocaleDateString()}
                </TimelineOppositeContent>
                <TimelineSeparator>
                    <TimelineConnector />
                    <TimelineDot />
                    <TimelineConnector className={styles.hidden} />
                </TimelineSeparator>
                <TimelineContent>
                    <div className={styles.timelineEntry}>Client created</div>
                </TimelineContent>
            </TimelineItem>
        </Timeline>
    );
};

export default RiskHistoryTimeline;
