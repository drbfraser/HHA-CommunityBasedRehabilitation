import React, { useState } from "react";
import {
    baseFieldLabels,
    BaseSurveyFormField,
    childNourish,
    deviceTypes,
    Grade,
    grade,
    isSelfEmployed,
    ISurvey,
    rateLevel,
    reasonNotSchool,
    themeColors,
    timestampToDateTime,
} from "@cbr/common";
import { Button, Card, Dialog, List, Text } from "react-native-paper";
import Alert from "../../../../components/Alert/Alert";
import useStyles from "./Entry.styles";
import { ActivityIndicator, ScrollView, View } from "react-native";
import DataCard from "../../../../components/TimelineDateCard/DataCard";

interface IEntryProps {
    survey: ISurvey;
    close: () => void;
}

type ISurveyForm = {
    [key: string]: ISurveyCategory;
};

type ISurveyCategory = { [key: string]: string | boolean | undefined };

const BaseSurveyEntry = ({ survey, close }: IEntryProps) => {
    const [loadingError, setLoadingError] = useState(false);
    const styles = useStyles();
    const onClose = () => {
        close();
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
            [BaseSurveyFormField.serviceSatisf]:
                rateLevel[survey.health_services_satisfaction].name,
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
            return <ActivityIndicator size="small" color={themeColors.blueAccent} />;
        }
        const DetailAccordion = ({ categoryName }: { categoryName: string }) => {
            const fields = Object.keys(surveyInfo[categoryName])
                .map((k) => {
                    let desc: string | undefined;
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
                <List.Accordion
                    theme={{ colors: { background: themeColors.blueBgLight } }}
                    title={baseFieldLabels[categoryName as BaseSurveyFormField]}
                >
                    <DataCard data={fields} />
                </List.Accordion>
            );
        };

        return (
            <>
                <Card.Title title="Baseline Survey" />
                <Card style={styles.createdCard}>
                    <Card.Content>
                        <Text>
                            <Text style={{ fontWeight: "bold" }}>Survey Date:</Text>{" "}
                            {timestampToDateTime(survey.survey_date)}
                        </Text>
                    </Card.Content>
                </Card>
                <Text />
                {Object.keys(surveyInfo).map((categoryName) => (
                    <DetailAccordion key={categoryName} categoryName={categoryName} />
                ))}
            </>
        );
    };

    return (
        <ScrollView>
            <Dialog.Content>
                {loadingError ? (
                    <Alert severity="error" text="Something went wrong. Please try again." />
                ) : (
                    <Details />
                )}
            </Dialog.Content>
            <Dialog.Actions>
                <Button onPress={onClose} color={themeColors.blueBgDark}>
                    Close
                </Button>
            </Dialog.Actions>
        </ScrollView>
    );
};

export default BaseSurveyEntry;
