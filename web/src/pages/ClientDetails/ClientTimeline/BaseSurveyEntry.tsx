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
import { BaseSurveyFormField, baseFieldLabels } from "@cbr/common/forms/BaseSurvey/baseSurveyFields";
import TimelineEntry from "../Timeline/TimelineEntry";
import { Assignment } from "@material-ui/icons";
import {
    childNourish,
    deviceTypes,
    Grade,
    grade,
    isSelfEmployed,
    ISurvey,
    rateLevel,
    reasonNotSchool,
} from "@cbr/common/util/survey";
import DataCard from "components/DataCard/DataCard";

interface IEntryProps {
    survey: ISurvey;
    dateFormatter: (timestamp: number) => string;
}

type ISurveyForm = {
    [key: string]: ISurveyCategory;
};

type ISurveyCategory = { [key: string]: string | boolean | undefined };

const BaseSurveyEntry = ({ survey, dateFormatter }: IEntryProps) => {
    const [open, setOpen] = useState(false);
    const [loadingError, setLoadingError] = useState(false);
    const styles = useStyles();

    const onOpen = () => setOpen(true);

    const onClose = () => {
        setOpen(false);
        setLoadingError(false);
    };

    const surveyInfo: ISurveyForm = {
        [BaseSurveyFormField.health]: {
            [BaseSurveyFormField.health]: rateLevel[survey.health].name,
            [BaseSurveyFormField.getService]: survey.health_have_rehabilitation_access,
            [BaseSurveyFormField.needService]: survey.health_need_rehabilitation_access,
            [BaseSurveyFormField.haveDevice]: survey.health_have_assistive_device,
            [BaseSurveyFormField.deviceWorking]: survey.health_working_assistive_device,
            [BaseSurveyFormField.needDevice]: survey.health_need_assistive_device,
            [BaseSurveyFormField.deviceType]:
                survey.health_assistive_device_type !== undefined
                    ? deviceTypes[survey.health_assistive_device_type]
                    : "",
            [BaseSurveyFormField.serviceSatisf]: rateLevel[survey.health_services_satisfaction].name,
        },
        [BaseSurveyFormField.education]: {
            [BaseSurveyFormField.goSchool]: survey.school_currently_attend,
            [BaseSurveyFormField.grade]: grade[survey.school_grade as Grade]?.name ?? "",
            [BaseSurveyFormField.reasonNotSchool]:
                survey.school_not_attend_reason !== undefined
                    ? reasonNotSchool[survey.school_not_attend_reason]
                    : "",
            [BaseSurveyFormField.beenSchool]: survey.school_ever_attend,
            [BaseSurveyFormField.wantSchool]: survey.school_want_attend,
        },
        [BaseSurveyFormField.social]: {
            [BaseSurveyFormField.feelValue]: survey.social_community_valued,
            [BaseSurveyFormField.feelIndependent]: survey.social_independent,
            [BaseSurveyFormField.ableInSocial]: survey.social_able_participate,
            [BaseSurveyFormField.disabiAffectSocial]: survey.social_affected_by_disability,
            [BaseSurveyFormField.disabiDiscrimination]: survey.social_discrimination,
        },
        [BaseSurveyFormField.livelihood]: {
            [BaseSurveyFormField.isWorking]: survey.work,
            [BaseSurveyFormField.job]: survey.work_what,
            [BaseSurveyFormField.isSelfEmployed]:
                survey.work_status !== undefined ? isSelfEmployed[survey.work_status] : "",
            [BaseSurveyFormField.meetFinanceNeeds]: survey.work_meet_financial_needs,
            [BaseSurveyFormField.disabiAffectWork]: survey.work_affected_by_disability,
            [BaseSurveyFormField.wantWork]: survey.work_want,
        },
        [BaseSurveyFormField.foodAndNutrition]: {
            [BaseSurveyFormField.foodSecurityRate]: rateLevel[survey.food_security].name,
            [BaseSurveyFormField.enoughFoodPerMonth]: survey.food_enough_monthly,
            [BaseSurveyFormField.childNourish]:
                survey.food_enough_for_child !== undefined
                    ? childNourish[survey.food_enough_for_child]
                    : "",
        },
        [BaseSurveyFormField.empowerment]: {
            [BaseSurveyFormField.memOfOrgan]: survey.empowerment_organization_member,
            [BaseSurveyFormField.organization]: survey.empowerment_organization,
            [BaseSurveyFormField.awareRight]: survey.empowerment_rights_awareness,
            [BaseSurveyFormField.ableInfluence]: survey.empowerment_influence_others,
        },
        [BaseSurveyFormField.shelterAndCare]: {
            [BaseSurveyFormField.haveShelter]: survey.shelter_adequate,
            [BaseSurveyFormField.accessItem]: survey.shelter_essential_access,
        },
    };

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
