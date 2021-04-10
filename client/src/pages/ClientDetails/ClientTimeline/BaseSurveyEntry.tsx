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
import { useStyles } from "./Entry.styles";
import { FormField, fieldLabels } from "pages/BaseSurvey/formFields";
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
} from "util/survey";
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
        [FormField.health]: {
            [FormField.health]: rateLevel[survey.health].name,
            [FormField.getService]: survey.health_have_rehabilitation_access,
            [FormField.needService]: survey.health_need_rehabilitation_access,
            [FormField.haveDevice]: survey.health_have_assistive_device,
            [FormField.deviceWorking]: survey.health_working_assistive_device,
            [FormField.needDevice]: survey.health_need_assistive_device,
            [FormField.deviceType]:
                survey.health_assistive_device_type !== undefined
                    ? deviceTypes[survey.health_assistive_device_type]
                    : "",
            [FormField.serviceSatisf]: rateLevel[survey.health_services_satisfaction].name,
        },
        [FormField.education]: {
            [FormField.goSchool]: survey.school_currently_attend,
            [FormField.grade]: grade[survey.school_grade as Grade].name,
            [FormField.reasonNotSchool]:
                survey.school_not_attend_reason !== undefined
                    ? reasonNotSchool[survey.school_not_attend_reason]
                    : "",
            [FormField.beenSchool]: survey.school_ever_attend,
            [FormField.wantSchool]: survey.school_want_attend,
        },
        [FormField.social]: {
            [FormField.feelValue]: survey.social_community_valued,
            [FormField.feelIndependent]: survey.social_independent,
            [FormField.ableInSocial]: survey.social_able_participate,
            [FormField.disabiAffectSocial]: survey.social_affected_by_disability,
            [FormField.disabiDiscrimination]: survey.social_discrimination,
        },
        [FormField.livelihood]: {
            [FormField.isWorking]: survey.work,
            [FormField.job]: survey.work_what,
            [FormField.isSelfEmployed]:
                survey.work_status !== undefined ? isSelfEmployed[survey.work_status] : "",
            [FormField.meetFinanceNeeds]: survey.work_meet_financial_needs,
            [FormField.disabiAffectWork]: survey.work_affected_by_disability,
            [FormField.wantWork]: survey.work_want,
        },
        [FormField.foodAndNutrition]: {
            [FormField.foodSecurityRate]: rateLevel[survey.food_security].name,
            [FormField.enoughFoodPerMonth]: survey.food_enough_monthly,
            [FormField.childNourish]:
                survey.food_enough_for_child !== undefined
                    ? childNourish[survey.food_enough_for_child]
                    : "",
        },
        [FormField.empowerment]: {
            [FormField.memOfOrgan]: survey.empowerment_organization_member,
            [FormField.organization]: survey.empowerment_organization,
            [FormField.awareRight]: survey.empowerment_rights_awareness,
            [FormField.ableInfluence]: survey.empowerment_influence_others,
        },
        [FormField.shelterAndCare]: {
            [FormField.haveShelter]: survey.shelter_adequate,
            [FormField.accessItem]: survey.shelter_essential_access,
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
                        title: fieldLabels[k as FormField],
                        desc: desc ?? "",
                    };
                })
                .filter((d) => d.desc !== "");

            return (
                <Accordion key={categoryName} className={styles.impOutcomeAccordion}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>
                            <b>{fieldLabels[categoryName as FormField]}</b>
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
