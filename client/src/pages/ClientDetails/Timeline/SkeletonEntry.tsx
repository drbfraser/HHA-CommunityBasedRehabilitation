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
import { useTimelineStyles } from "./timelines.styles";

const SkeletonEntry = () => {
    const timelineStyles = useTimelineStyles();

    return (
        <TimelineItem>
            <TimelineOppositeContent className={timelineStyles.date}>
                <Skeleton variant="text" />
            </TimelineOppositeContent>
            <TimelineSeparator>
                <TimelineConnector />
                <TimelineDot />
                <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
                <div className={timelineStyles.entry}>
                    <Skeleton variant="text" />
                </div>
            </TimelineContent>
        </TimelineItem>
    );
};

export default SkeletonEntry;
