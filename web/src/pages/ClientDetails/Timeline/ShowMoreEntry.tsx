import React from "react";
import { useTranslation } from "react-i18next";
import { SvgIconTypeMap } from "@mui/material";
import { MoreVert, ArrowDropDown } from "@mui/icons-material";
import {
    TimelineOppositeContent,
    TimelineItem,
    TimelineSeparator,
    TimelineDot,
    TimelineConnector,
    TimelineContent,
} from "@mui/lab";
import { OverridableComponent } from "@mui/material/OverridableComponent";

import { timelineStyles } from "./timelines.styles";

interface IProps {
    onClick?: () => void;
}

const ShowMoreEntry = ({ onClick }: IProps) => {
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
                <div
                    className={timelineStyles.showMore + ` ${timelineStyles.showMoreClickable}`}
                    style={{ color: "white", fontWeight: 700 }}
                    onClick={onClick}
                >
                    {`${t("general.showMore")} `}
                    {<ArrowDropDown style={{ marginBottom: "-7px" }} />}
                </div>
            </TimelineContent>
        </TimelineItem>
    );
};

export default ShowMoreEntry;
