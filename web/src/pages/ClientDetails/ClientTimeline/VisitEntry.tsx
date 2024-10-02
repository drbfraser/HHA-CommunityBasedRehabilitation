import React, { useState } from "react";
import { useTranslation } from "react-i18next";
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
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import EmojiPeopleIcon from "@material-ui/icons/EmojiPeople";
import { Skeleton, Alert } from "@material-ui/lab";

import { timestampToDateTime } from "@cbr/common/util/dates";
import {
    getTranslatedImprovementName,
    IVisit,
    IVisitSummary,
    outcomeGoalMets,
} from "@cbr/common/util/visits";
import { apiFetch, Endpoint } from "@cbr/common/util/endpoints";
import { RiskType } from "@cbr/common/util/risks";
import { useZones } from "@cbr/common/util/hooks/zones";
import { useStyles } from "./Entry.styles";
import RiskTypeChip from "components/RiskTypeChip/RiskTypeChip";
import DataCard from "components/DataCard/DataCard";
import { getTranslatedRiskName } from "util/risks";
import TimelineEntry from "../Timeline/TimelineEntry";

interface IEntryProps {
    visitSummary: IVisitSummary;
    dateFormatter: (timestamp: number) => string;
}

const VisitEntry = ({ visitSummary, dateFormatter }: IEntryProps) => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [visit, setVisit] = useState<IVisit>();
    const [loadingError, setLoadingError] = useState(false);
    const zones = useZones();
    const styles = useStyles();

    const onOpen = () => {
        setOpen(true);
        if (!visit) {
            apiFetch(Endpoint.VISIT, visitSummary.id)
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
        // TODO: translate "Unknown"
        const zone = zones.get(visitSummary.zone) ?? "Unknown";

        const title = t("visitAttr.visitLocation", { body: zone });
        const words = title.split(" ");
        const keyWord = words[0];
        const remainingWords = words.slice(1).join(" ");

        return (
            <>
                <b>{keyWord}</b> {remainingWords}{" "}
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
            return <Skeleton variant="rect" height={200} />;
        }

        const DetailAccordion = ({ type }: { type: RiskType }) => {
            const improvements = visit.improvements
                .filter(({ risk_type }) => risk_type === type)
                .map(({ provided, desc }) => ({
                    title: getTranslatedImprovementName(t, provided),
                    desc,
                }));

            const outcomes = visit.outcomes
                .filter(({ risk_type }) => risk_type === type)
                .map(({ goal_met, outcome }) => ({
                    title: outcomeGoalMets[goal_met].name,
                    desc: outcome,
                }));

            if (!improvements.length && !outcomes.length) {
                return <React.Fragment key={type} />;
            }

            const titleDescArr = [];
            if (improvements.length) {
                titleDescArr.push(t("newVisit.improvements"));
            }
            if (outcomes.length) {
                titleDescArr.push(t("newVisit.outcomes"));
            }

            return (
                <Accordion key={type} className={styles.impOutcomeAccordion}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>
                            <b>{getTranslatedRiskName(t, type)}</b> ({titleDescArr.join(" & ")})
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div>
                            {improvements.length > 0 && <DataCard data={improvements} />}
                            {outcomes.length > 0 && <DataCard data={outcomes} />}
                        </div>
                    </AccordionDetails>
                </Accordion>
            );
        };

        return (
            <>
                <Card variant="outlined">
                    <CardContent>
                        <b>{t("visitAttr.date")}:</b> {timestampToDateTime(visit.created_at)}
                        <br />
                        <b>{t("general.village")}:</b> {visit.village}
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
                        // TODO: translate
                        <Alert severity="error">Something went wrong. Please try again.</Alert>
                    ) : (
                        <Details />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="primary">
                        {t("general.close")}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default VisitEntry;
