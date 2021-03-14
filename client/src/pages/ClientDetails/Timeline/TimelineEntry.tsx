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
    date: string | JSX.Element;
    content: string | JSX.Element;
    bottomEntry?: boolean;
    onClick?: () => void;
}

const TimelineEntry = ({ date, content, onClick, bottomEntry }: IProps) => {
    const timelineStyles = useTimelineStyles();

    return (
        <TimelineItem>
            <TimelineOppositeContent className={timelineStyles.date}>
                {date}
            </TimelineOppositeContent>
            <TimelineSeparator>
                <TimelineConnector />
                <TimelineDot />
                <TimelineConnector className={bottomEntry ? timelineStyles.hidden : ""} />
            </TimelineSeparator>
            <TimelineContent>
                <div
                    className={
                        timelineStyles.entry +
                        (Boolean(onClick) ? ` ${timelineStyles.clickable}` : "")
                    }
                    onClick={onClick}
                >
                    {content}
                </div>
            </TimelineContent>
        </TimelineItem>
    );
};

export default TimelineEntry;
