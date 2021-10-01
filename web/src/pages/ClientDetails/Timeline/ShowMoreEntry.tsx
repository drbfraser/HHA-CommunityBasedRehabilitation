import React from "react";
import {
    TimelineOppositeContent,
    TimelineItem,
    TimelineSeparator,
    TimelineDot,
    TimelineConnector,
    TimelineContent,
} from "@material-ui/lab";
import { useTimelineStyles } from "./timelines.styles";
import { OverridableComponent } from "@material-ui/core/OverridableComponent";
import { SvgIconTypeMap } from "@material-ui/core";
import { MoreVert, ArrowDropDown } from "@material-ui/icons";

interface IProps {
    onClick?: () => void;
}

const ShowMoreEntry = ({ onClick }: IProps) => {
    const timelineStyles = useTimelineStyles();
    const Icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> = MoreVert;

    return (
        <TimelineItem>
            <TimelineOppositeContent className={timelineStyles.date} />
            <TimelineSeparator>
                <TimelineConnector />
                <TimelineDot color="primary" variant="outlined">
                    <Icon color="primary" fontSize="small" />
                </TimelineDot>
                <TimelineConnector className="" />
            </TimelineSeparator>
            <TimelineContent>
                <div
                    className={timelineStyles.showMore + ` ${timelineStyles.showMoreClickable}`}
                    style={{ color: "white", fontWeight: 700 }}
                    onClick={onClick}
                >
                    {"Show more "}
                    {<ArrowDropDown style={{ marginBottom: "-7px" }} />}
                </div>
            </TimelineContent>
        </TimelineItem>
    );
};

export default ShowMoreEntry;
