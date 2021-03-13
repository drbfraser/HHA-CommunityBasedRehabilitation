import {
    TimelineItem,
    TimelineOppositeContent,
    Skeleton,
    TimelineSeparator,
    TimelineConnector,
    TimelineDot,
    TimelineContent,
} from "@material-ui/lab";
import React from "react";
import { useStyles } from "./ClientVisitTimeline.styles";

const SkeletonEntry = () => {
    const styles = useStyles();

    return (
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
};

export default SkeletonEntry;
