import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@material-ui/core";
import {
    TimelineItem,
    TimelineOppositeContent,
    TimelineSeparator,
    TimelineConnector,
    TimelineDot,
    TimelineContent,
    Skeleton,
    Alert,
} from "@material-ui/lab";
import { timestampToDateTime } from "util/dates";
import { IVisit, IVisitSummary } from "util/visits";
import { useStyles } from "./ClientVisitTimeline.styles";
import RiskTypeChip from "components/RiskTypeChip/RiskTypeChip";
import { IZone } from "util/cache";
import { apiFetch, Endpoint } from "util/endpoints";
import { RiskType } from "util/risks";

interface IEntryProps {
    visitSummary: IVisitSummary;
    zones: IZone[];
    dateFormatter: (timestamp: number) => string;
}

const VisitEntry = ({ visitSummary, zones, dateFormatter }: IEntryProps) => {
    const [open, setOpen] = useState(false);
    const [visit, setVisit] = useState<IVisit>();
    const [loadingError, setLoadingError] = useState(false);
    const styles = useStyles();

    const onOpen = () => {
        setOpen(true);

        if (!visit) {
            apiFetch(Endpoint.VISIT, `${visitSummary.id}`)
                .then((resp) => resp.json())
                .then((resp) => setVisit(resp as IVisit))
                .catch(() => setLoadingError(true));
        }
    };

    const onClose = () => {
        setOpen(false);
        setLoadingError(false);
    };

    const Summary = ({ clickable }: { clickable: boolean }) => {
        const zone = zones.find((z) => z.id === visitSummary.zone);

        return (
            <>
                Visit in {zone?.zone_name} &nbsp;
                {visitSummary.health_visit && (
                    <RiskTypeChip risk={RiskType.HEALTH} clickable={clickable} />
                )}{" "}
                {visitSummary.educat_visit && (
                    <RiskTypeChip risk={RiskType.EDUCATION} clickable={clickable} />
                )}{" "}
                {visitSummary.social_visit && (
                    <RiskTypeChip risk={RiskType.SOCIAL} clickable={clickable} />
                )}{" "}
            </>
        );
    };

    return (
        <>
            <TimelineItem>
                <TimelineOppositeContent className={styles.timelineDate}>
                    {dateFormatter(visitSummary.date_visited)}
                </TimelineOppositeContent>
                <TimelineSeparator>
                    <TimelineConnector />
                    <TimelineDot />
                    <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                    <div
                        className={`${styles.timelineEntry} ${styles.visitEntry}`}
                        onClick={onOpen}
                    >
                        <Summary clickable={true} />
                    </div>
                </TimelineContent>
            </TimelineItem>
            <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
                <DialogTitle>
                    <Summary clickable={false} />
                </DialogTitle>
                <DialogContent>
                    {loadingError ? (
                        <Alert severity="error">Something went wrong. Please try again.</Alert>
                    ) : (
                        <>
                            {visit ? (
                                <>
                                    <b>When:</b> {timestampToDateTime(visit?.date_visited ?? 0)}
                                </>
                            ) : (
                                <Skeleton variant="rect" height={200} />
                            )}
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default VisitEntry;
