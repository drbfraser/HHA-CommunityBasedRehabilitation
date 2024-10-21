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
} from "@mui/material";
import { Skeleton, Alert } from '@mui/material';
import { Assignment } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { timestampToDateTime } from "@cbr/common/util/dates";
import { getSurveyInfo, ISurvey } from "@cbr/common/util/survey";
import {
    BaseSurveyFormField,
    baseFieldLabels,
} from "@cbr/common/forms/BaseSurvey/baseSurveyFields";
import { entryStyles } from "./Entry.styles";
import TimelineEntry from "../Timeline/TimelineEntry";
import DataCard from "components/DataCard/DataCard";

interface IEntryProps {
    survey: ISurvey;
    dateFormatter: (timestamp: number) => string;
}

type TSurveyForm = {
    [key: string]: { [key: string]: string | number | boolean | undefined };
};

const BaseSurveyEntry = ({ survey, dateFormatter }: IEntryProps) => {
    const [open, setOpen] = useState(false);
    const [loadingError, setLoadingError] = useState(false);
    const { t } = useTranslation();

    const onOpen = () => setOpen(true);
    const onClose = () => {
        setOpen(false);
        setLoadingError(false);
    };

    const surveyInfo: TSurveyForm = getSurveyInfo(survey);

    const Details = () => {
        if (!survey) {
            return <Skeleton variant="rectangular" height={200} />;
        }

        const DetailAccordion = ({ categoryName }: { categoryName: string }) => {
            const fields = Object.keys(surveyInfo[categoryName])
                .map((k) => {
                    let desc;
                    if (typeof surveyInfo[categoryName][k] === "boolean") {
                        desc = surveyInfo[categoryName][k] ? t("general.yes") : t("general.no");
                    } else {
                        desc = surveyInfo[categoryName][k]?.toString();
                    }

                    return {
                        title: baseFieldLabels[k as BaseSurveyFormField],
                        desc: desc ?? "",
                    };
                })
                .filter((d) => d.desc !== "");
            console.log(fields);

            return (
                <Accordion key={categoryName} sx={entryStyles.impOutcomeAccordion}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>
                            <b>{baseFieldLabels[categoryName as BaseSurveyFormField]}</b>
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div>{<DataCard data={fields} />}</div>
                    </AccordionDetails>
                </Accordion>
            );
        };

        return (
            <>
                <Card variant="outlined">
                    <CardContent>
                        <b>{t("surveyAttr.surveyDate")}:</b>{" "}
                        {timestampToDateTime(survey.survey_date)}
                    </CardContent>
                </Card>
                <br />
                {Object.keys(surveyInfo).map((categoryName) => (
                    <DetailAccordion key={categoryName} categoryName={categoryName} />
                ))}
            </>
        );
    };

    return (
        <>
            <TimelineEntry
                date={dateFormatter(survey.survey_date)}
                content={<b>{t("surveyAttr.baselineSurvey")}</b>}
                DotIcon={Assignment}
                onClick={onOpen}
            />
            <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
                <DialogTitle>
                    <b>{t("surveyAttr.baselineSurvey")}</b>
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

export default BaseSurveyEntry;
