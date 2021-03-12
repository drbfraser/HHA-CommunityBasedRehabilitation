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
import React, { useState } from "react";
import { IClient } from "util/clients";
import { timestampToDateTime, timestampToDateFromReference } from "util/dates";
import { IVisitSummary } from "util/visits";
import { useStyles } from "./VisitHistory.styles";
import { IZoneMap } from "util/cache";
import RiskTypeChip from "components/RiskTypeChip/RiskTypeChip";
import { RiskType } from "util/risks";

interface IProps {
    client?: IClient;
    zones?: IZoneMap;
}

const VisitHistoryTimeline = ({ client, zones }: IProps) => {
    const styles = useStyles();
    const dateFormatter = timestampToDateFromReference(client?.created_date);

    interface IEntryProps {
        visit: IVisitSummary;
    }

    const VisitEntry = ({ visit }: IEntryProps) => {
        const [expanded, setExpanded] = useState(false);

        const Summary = ({ clickable }: { clickable?: boolean }) => (
            <>
                Visit in {zones?.get(visit.zone)} &nbsp;
                {visit.health_visit && <RiskTypeChip risk={RiskType.HEALTH} />}{" "}
                {visit.educat_visit && <RiskTypeChip risk={RiskType.EDUCATION} />}{" "}
                {visit.social_visit && <RiskTypeChip risk={RiskType.SOCIAL} />}{" "}
            </>
        );

        return (
            <>
                <TimelineItem key={visit.id}>
                    <TimelineOppositeContent className={styles.timelineDate}>
                        {dateFormatter(visit.date_visited)}
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                        <TimelineConnector />
                        <TimelineDot />
                        <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                        <div
                            className={`${styles.timelineEntry} ${styles.visitEntry}`}
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
                        <b>When:</b> {timestampToDateTime(visit.date_visited)}
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

    const visitSort = (a: IVisitSummary, b: IVisitSummary) => {
        return b.date_visited - a.date_visited;
    };

    return (
        <Timeline className={styles.timeline}>
            {client ? (
                <>
                    {client.visits
                        .slice()
                        .sort(visitSort)
                        .map((visit) => (
                            <VisitEntry key={visit.id} visit={visit} />
                        ))}
                    <ClientCreatedEntry />
                </>
            ) : (
                [1, 2, 3, 4].map((i) => <SkeletonEntry key={i} />)
            )}
        </Timeline>
    );
};

export default VisitHistoryTimeline;
