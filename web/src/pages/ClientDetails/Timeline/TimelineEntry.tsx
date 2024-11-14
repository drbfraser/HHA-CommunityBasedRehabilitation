import React from "react";
import { Box, SvgIconTypeMap, SxProps } from "@mui/material";
import BlankIcon from "@mui/material/SvgIcon";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import {
    TimelineItem,
    TimelineOppositeContent,
    TimelineSeparator,
    TimelineConnector,
    TimelineDot,
    TimelineContent,
} from "@mui/lab";

import { timelineStyles } from "./Timeline.styles";

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
            <TimelineOppositeContent sx={timelineStyles.date}>{date}</TimelineOppositeContent>
            <TimelineSeparator>
                <TimelineConnector />
                <TimelineDot color="grey" variant="outlined">
                    <Icon color="primary" fontSize="small" />
                </TimelineDot>
                <TimelineConnector sx={isBottomEntry ? timelineStyles.hidden : {}} />
            </TimelineSeparator>
            <TimelineContent>
                <Box
                    sx={
                        {
                            ...timelineStyles.entry,
                            ...(Boolean(onClick) ? timelineStyles.clickable : {}),
                        } as SxProps
                    }
                    onClick={onClick}
                >
                    {content}
                </Box>
            </TimelineContent>
        </TimelineItem>
    );
};

export default TimelineEntry;
