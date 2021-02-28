import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@material-ui/core";
import {
    Timeline,
    TimelineItem,
    TimelineOppositeContent,
    TimelineSeparator,
    TimelineConnector,
    TimelineDot,
    TimelineContent,
    Skeleton,
} from "@material-ui/lab";
import RiskChip from "components/RiskChip/RiskChip";
import React, { useState } from "react";
import { IClient } from "util/clients";
import { IRisk, riskTypes } from "util/risks";
import { useStyles } from "./RiskHistory.styles";

interface IProps {
    client?: IClient;
    dateFormatter: (timestamp: number) => string;
}

const RiskHistoryTimeline = ({ client, dateFormatter }: IProps) => {
    const styles = useStyles();

    interface IEntryProps {
        risk: IRisk;
        isInitial: boolean;
    }

    const RiskEntry = ({ risk, isInitial }: IEntryProps) => {
        const [expanded, setExpanded] = useState(false);
        const riskType = riskTypes[risk.risk_type];

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
                        {dateFormatter(risk.timestamp)}
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
                        <b>When:</b> {new Date(risk.timestamp * 1000).toLocaleString()}
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

    const ClientCreatedEntry = () => (
        <TimelineItem>
            <TimelineOppositeContent className={styles.timelineDate}>
                {dateFormatter(client!.created_date)}
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
    );

    const SkeletonEntry = () => (
        <TimelineItem>
            <TimelineOppositeContent className={styles.timelineDate}>
                <Skeleton variant="text" />
            </TimelineOppositeContent>
            <TimelineSeparator>
                <TimelineConnector />
                <TimelineDot />
                <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
                <div className={styles.timelineEntry}>
                    <Skeleton variant="text" />
                </div>
            </TimelineContent>
        </TimelineItem>
    );

    const riskSort = (a: IRisk, b: IRisk) => {
        if (a.timestamp === b.timestamp) {
            return b.risk_type.localeCompare(a.risk_type);
        }

        return b.timestamp - a.timestamp;
    };

    return (
        <Timeline className={styles.timeline}>
            {client ? (
                <>
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
                    <ClientCreatedEntry />
                </>
            ) : (
                [1, 2, 3, 4].map((i) => <SkeletonEntry key={i} />)
            )}
        </Timeline>
    );
};

export default RiskHistoryTimeline;
