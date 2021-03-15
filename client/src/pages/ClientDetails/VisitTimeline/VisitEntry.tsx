import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    CardContent,
    Card,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
} from "@material-ui/core";
import { Skeleton, Alert } from "@material-ui/lab";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { timestampToDateTime } from "util/dates";
import { IVisit, IVisitSummary, outcomeGoalMets } from "util/visits";
import { useStyles } from "./VisitEntry.styles";
import RiskTypeChip from "components/RiskTypeChip/RiskTypeChip";
import { IZone } from "util/cache";
import { apiFetch, Endpoint } from "util/endpoints";
import { RiskType, riskTypes } from "util/risks";
import TimelineEntry from "../Timeline/TimelineEntry";

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

    const Details = () => {
        if (!visit) {
            return <Skeleton variant="rect" height={200} />;
        }

        const DetailAccordion = ({ type }: { type: RiskType }) => {
            const improvements = visit.improvements
                .filter((i) => i.risk_type === type)
                .map((i) => ({
                    title: i.provided,
                    desc: i.desc,
                }));

            const outcomes = visit.outcomes
                .filter((o) => o.risk_type === type)
                .map((o) => ({
                    title: outcomeGoalMets[o.goal_met].name,
                    desc: o.outcome,
                }));

            if (!improvements.length && !outcomes.length) {
                return <React.Fragment key={type} />;
            }

            interface IDataCardProps {
                data: {
                    title: string;
                    desc: string;
                }[];
            }

            const DataCard = ({ data }: IDataCardProps) => (
                <>
                    <Card>
                        <CardContent>
                            {data.map((d, i) => (
                                <p key={i}>
                                    <b>{d.title}:</b> {d.desc}
                                </p>
                            ))}
                        </CardContent>
                    </Card>
                    <br />
                </>
            );

            let titleDescArr = [];

            if (improvements.length) {
                titleDescArr.push("Improvements");
            }

            if (outcomes.length) {
                titleDescArr.push("Outcomes");
            }

            return (
                <Accordion key={type} className={styles.impOutcomeAccordion}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>
                            <b>{riskTypes[type].name}</b> ({titleDescArr.join(" & ")})
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div>
                            {Boolean(improvements.length) && <DataCard data={improvements} />}
                            {Boolean(outcomes.length) && <DataCard data={outcomes} />}
                        </div>
                    </AccordionDetails>
                </Accordion>
            );
        };

        return (
            <>
                <Card variant="outlined">
                    <CardContent>
                        <b>When:</b> {timestampToDateTime(visit.date_visited)}
                        <br />
                        <b>Village:</b> {visit.village}
                    </CardContent>
                </Card>
                <br />
                {Object.values(RiskType).map((type) => (
                    <DetailAccordion key={type} type={type} />
                ))}
            </>
        );
    };

    return (
        <>
            <TimelineEntry
                date={dateFormatter(visitSummary.date_visited)}
                content={<Summary clickable={true} />}
                onClick={onOpen}
            />
            <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
                <DialogTitle>
                    <Summary clickable={false} />
                </DialogTitle>
                <DialogContent>
                    {loadingError ? (
                        <Alert severity="error">Something went wrong. Please try again.</Alert>
                    ) : (
                        <Details />
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
