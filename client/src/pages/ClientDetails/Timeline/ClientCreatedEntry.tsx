import React from "react";
import {
    TimelineItem,
    TimelineOppositeContent,
    TimelineSeparator,
    TimelineConnector,
    TimelineDot,
    TimelineContent,
} from "@material-ui/lab";
import { useTimelineStyles } from "./timelines.styles";

interface IProps {
    createdDate: string;
}

const ClientCreatedEntry = ({ createdDate }: IProps) => {
    const timelineStyles = useTimelineStyles();

    return (
        <TimelineItem>
            <TimelineOppositeContent className={timelineStyles.date}>
                {createdDate}
            </TimelineOppositeContent>
            <TimelineSeparator>
                <TimelineConnector />
                <TimelineDot />
                <TimelineConnector className={timelineStyles.hidden} />
            </TimelineSeparator>
            <TimelineContent>
                <div className={timelineStyles.entry}>Client created</div>
            </TimelineContent>
        </TimelineItem>
    );
};

export default ClientCreatedEntry;
