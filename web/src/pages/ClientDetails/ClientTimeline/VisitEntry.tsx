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
} from "@mui/material";
import { Skeleton, Alert } from '@mui/material';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { timestampToDateTime } from "@cbr/common/util/dates";
import { IVisit, IVisitSummary, outcomeGoalMets } from "@cbr/common/util/visits";
import { useStyles } from "./Entry.styles";
import RiskTypeChip from "components/RiskTypeChip/RiskTypeChip";
import { apiFetch, Endpoint } from "@cbr/common/util/endpoints";
import { RiskType } from "@cbr/common/util/risks";
import { riskTypes } from "util/riskIcon";
import TimelineEntry from "../Timeline/TimelineEntry";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import { useZones } from "@cbr/common/util/hooks/zones";
import DataCard from "components/DataCard/DataCard";

interface IEntryProps {
    visitSummary: IVisitSummary;
    dateFormatter: (timestamp: number) => string;
}

const VisitEntry = ({ visitSummary, dateFormatter }: IEntryProps) => {
    const [open, setOpen] = useState(false);
    const [visit, setVisit] = useState<IVisit>();
    const [loadingError, setLoadingError] = useState(false);
    const zones = useZones();
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
        const zone = zones.get(visitSummary.zone) ?? "Unknown";

        return (
            <>
                <b>Visit</b> in {zone} &nbsp;
                {visitSummary.health_visit && (
                    <RiskTypeChip risk={RiskType.HEALTH} clickable={clickable} />
                )}{" "}
                {visitSummary.educat_visit && (
                    <RiskTypeChip risk={RiskType.EDUCATION} clickable={clickable} />
                )}{" "}
                {visitSummary.social_visit && (
                    <RiskTypeChip risk={RiskType.SOCIAL} clickable={clickable} />
                )}{" "}
                {visitSummary.nutrit_visit && (
                    <RiskTypeChip risk={RiskType.NUTRITION} clickable={clickable} />
                )}{" "}
                {visitSummary.mental_visit && (
                    <RiskTypeChip risk={RiskType.MENTAL} clickable={clickable} />
                )}{" "}
            </>
        );
    };

    const Details = () => {
        if (!visit) {
            return <Skeleton variant="rectangular" height={200} />;
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
                        <b>Visit Date:</b> {timestampToDateTime(visit.created_at)}
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
                date={dateFormatter(visitSummary.created_at)}
                content={<Summary clickable={true} />}
                DotIcon={EmojiPeopleIcon}
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
