import React from "react";
import { useTranslation } from "react-i18next";
import { Box, SvgIconTypeMap, SxProps } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { MoreVert, ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import {
    TimelineOppositeContent,
    TimelineItem,
    TimelineSeparator,
    TimelineDot,
    TimelineConnector,
    TimelineContent,
} from "@mui/lab";

import { timelineStyles } from "./Timeline.styles";

interface IProps {
    expanded?: boolean;
    onClick?: () => void;
}

const ShowMoreEntry = ({ expanded, onClick }: IProps) => {
    const { t } = useTranslation();
    const Icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> = MoreVert;

    return (
        <TimelineItem>
            <TimelineOppositeContent sx={timelineStyles.date} />
            <TimelineSeparator>
                <TimelineConnector />
                <TimelineDot color="primary" variant="outlined">
                    <Icon color="primary" fontSize="small" />
                </TimelineDot>
                <TimelineConnector className="" />
            </TimelineSeparator>
            <TimelineContent>
                <Box
                    sx={
                        {
                            ...timelineStyles.showMore,
                            ...timelineStyles.showMoreClickable,
                        } as SxProps
                    }
                    style={{ color: "white", fontWeight: 700 }}
                    onClick={onClick}
                    data-testid="timeline-show-toggle"
                >
                    {`${expanded ? "Show Less" : t("general.showMore")} `}
                    {expanded ? (
                        <ArrowDropUp style={{ marginBottom: "-7px" }} />
                    ) : (
                        <ArrowDropDown style={{ marginBottom: "-7px" }} />
                    )}
                </Box>
            </TimelineContent>
        </TimelineItem>
    );
};

export default ShowMoreEntry;
