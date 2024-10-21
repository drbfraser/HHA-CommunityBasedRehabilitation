import React from "react";
import {
    TimelineItem,
    TimelineOppositeContent,
    TimelineSeparator,
    TimelineConnector,
    TimelineDot,
    TimelineContent,
} from "@mui/lab";
import { timelineStyles } from "./timelines.styles";
import BlankIcon from "@mui/material/SvgIcon";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { SvgIconTypeMap } from "@mui/material";

interface IProps {
    date: string | JSX.Element;
    content: string | JSX.Element;
    DotIcon?: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
    isBottomEntry?: boolean;
    onClick?: () => void;
}

const TimelineEntry = ({ date, content, DotIcon, isBottomEntry, onClick }: IProps) => {
    const Icon = DotIcon ?? BlankIcon;

    return (
        <TimelineItem>
            <TimelineOppositeContent sx={timelineStyles.date}>
                {date}
            </TimelineOppositeContent>
            <TimelineSeparator>
                <TimelineConnector />
                <TimelineDot color="grey" variant="outlined">
                    <Icon color="primary" fontSize="small" />
                </TimelineDot>
                {/* todosd: equiv to empty string? */}
                {/* <TimelineConnector className={isBottomEntry ? timelineStyles.hidden : ""} /> */}
                <TimelineConnector sx={isBottomEntry ? timelineStyles.hidden : {}} /> 
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
