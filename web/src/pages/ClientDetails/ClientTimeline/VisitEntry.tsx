import React, { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import {
    Alert,
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
    Skeleton,
    Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";

import { timestampToDateTime } from "@cbr/common/util/dates";
import { getTranslatedImprovementName, IVisit, IVisitSummary } from "@cbr/common/util/visits";
import { apiFetch, Endpoint } from "@cbr/common/util/endpoints";
import { RiskType } from "@cbr/common/util/risks";
import { useZones } from "@cbr/common/util/hooks/zones";
import RiskTypeChip from "components/RiskTypeChip/RiskTypeChip";
import DataCard from "components/DataCard/DataCard";
import { getTranslatedRiskName } from "util/risks";
import TimelineEntry from "../Timeline/TimelineEntry";
import { entryStyles, PhotoIndicator, SummaryContainer } from "./Entry.styles";
import ImageIcon from "@mui/icons-material/Image";
import { Thumb } from "components/ReferralPhotoView/Thumb";

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
        const zone = zones.get(visitSummary.zone) ?? t("general.unknown");
        const hasPhoto = Boolean(visitSummary.picture?.trim?.().length);
        return (
            <>
                <SummaryContainer>
                    <Trans i18nKey="visitAttr.visitLocation">
                        -<b>Visit</b> in {{ body: zone }}
                    </Trans>
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
                    {hasPhoto && (
                        <PhotoIndicator>
                            <ImageIcon fontSize="medium" />
                        </PhotoIndicator>
                    )}
                </SummaryContainer>
            </>
        );
    };

    const Details = () => {
        if (!visit) {
            return <Skeleton variant="rectangular" height={200} />;
        }

        const DetailAccordion = ({ type }: { type: RiskType }) => {
            const improvements = (visit?.improvements ?? [])
                .filter(({ risk_type }) => risk_type === type)
                .map(({ provided, desc }) => ({
                    title: getTranslatedImprovementName(t, provided),
                    desc,
                }));

            if (!improvements.length) {
                return <React.Fragment key={type} />;
            }

            return (
                <Accordion key={type} sx={entryStyles.impOutcomeAccordion}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>
                            <b>{getTranslatedRiskName(t, type)}</b> ({t("newVisit.improvements")})
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <DataCard data={improvements} />
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
                <Thumb Id={visit.id} Url={visit.picture} endpoint={Endpoint.VISIT_PICTURE} />
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
                        <Alert severity="error">{t("alert.generalFailureTryAgain")}</Alert>
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
