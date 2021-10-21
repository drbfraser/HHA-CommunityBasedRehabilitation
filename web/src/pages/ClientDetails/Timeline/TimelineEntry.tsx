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
import BlankIcon from "@material-ui/core/SvgIcon";
import { OverridableComponent } from "@material-ui/core/OverridableComponent";
import { SvgIconTypeMap } from "@material-ui/core";

interface IProps {
    date: string | JSX.Element;
    content: string | JSX.Element;
    DotIcon?: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
    isBottomEntry?: boolean;
    onClick?: () => void;
}

const TimelineEntry = ({ date, content, DotIcon, isBottomEntry, onClick }: IProps) => {
    const timelineStyles = useTimelineStyles();
    const Icon = DotIcon ?? BlankIcon;

    return (
        <TimelineItem>
            <TimelineOppositeContent className={timelineStyles.date}>
                {date}
            </TimelineOppositeContent>
            <TimelineSeparator>
                <TimelineConnector />
                <TimelineDot color="grey" variant="outlined">
                    <Icon color="primary" fontSize="small" />
                </TimelineDot>
                <TimelineConnector className={isBottomEntry ? timelineStyles.hidden : ""} />
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
