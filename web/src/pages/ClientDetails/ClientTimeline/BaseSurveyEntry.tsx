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
import { timestampToDateTime } from "@cbr/common/util/dates";
import { useStyles } from "./Entry.styles";
import {
    BaseSurveyFormField,
    baseFieldLabels,
} from "@cbr/common/forms/BaseSurvey/baseSurveyFields";
import TimelineEntry from "../Timeline/TimelineEntry";
import { Assignment } from "@material-ui/icons";
import DataCard from "components/DataCard/DataCard";
import { getSurveyInfo, ISurvey } from "@cbr/common/util/survey";

interface IEntryProps {
    survey: ISurvey;
    dateFormatter: (timestamp: number) => string;
}

type TSurveyForm = {
    [key: string]: ISurveyCategory;
};

type ISurveyCategory = { [key: string]: string | boolean | undefined };

const BaseSurveyEntry = ({ survey, dateFormatter }: IEntryProps) => {
    const [open, setOpen] = useState(false);
    const [loadingError, setLoadingError] = useState(false);
    const styles = useStyles();
    console.log(survey);

    const onOpen = () => setOpen(true);

    const onClose = () => {
        setOpen(false);
        setLoadingError(false);
    };

    const surveyInfo: TSurveyForm = getSurveyInfo(survey);

    const Details = () => {
        if (!survey) {
            return <Skeleton variant="rect" height={200} />;
        }

        const DetailAccordion = ({ categoryName }: { categoryName: string }) => {
            const fields = Object.keys(surveyInfo[categoryName])
                .map((k) => {
                    let desc;
                    if (typeof surveyInfo[categoryName][k] === "boolean") {
                        desc = surveyInfo[categoryName][k] ? "Yes" : "No";
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
                <Accordion key={categoryName} className={styles.impOutcomeAccordion}>
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
                        <b>Survey Date:</b> {timestampToDateTime(survey.survey_date)}
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
                content={<b>Baseline Survey</b>}
                DotIcon={Assignment}
                onClick={onOpen}
            />
            <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
                <DialogTitle>
                    <b>Baseline Survey</b>
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

export default BaseSurveyEntry;
