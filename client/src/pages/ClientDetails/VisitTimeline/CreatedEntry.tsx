import React from "react";
import {
    TimelineItem,
    TimelineOppositeContent,
    TimelineSeparator,
    TimelineConnector,
    TimelineDot,
    TimelineContent,
} from "@material-ui/lab";
import { useStyles } from "./ClientVisitTimeline.styles";

interface IProps {
    createdDate: string;
}

const CreatedEntry = ({ createdDate }: IProps) => {
    const styles = useStyles();

    return (
        <TimelineItem>
            <TimelineOppositeContent className={styles.timelineDate}>
                {createdDate}
            </TimelineOppositeContent>
            <TimelineSeparator>
                <TimelineConnector />
                <TimelineDot />
                <TimelineConnector className={styles.hidden} />
            </TimelineSeparator>
            <TimelineContent>
                <div className={styles.timelineEntry}>Client created</div>
            </TimelineContent>
        </TimelineItem>
    );
};

export default CreatedEntry;
