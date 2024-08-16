import React from "react";
import {
    baseFieldLabels,
    BaseSurveyFormField,
    getSurveyInfo,
    ISurvey,
    themeColors,
    timestampToDateTime,
} from "@cbr/common";
import { Button, Card, Dialog, List, Text } from "react-native-paper";
import useStyles from "./Entry.styles";
import { ActivityIndicator, ScrollView } from "react-native";
import DataCard from "../../../../components/DataCard/DataCard";
import { useTranslation } from "react-i18next";

interface IEntryProps {
    survey: ISurvey;
    close: () => void;
}

type TSurveyForm = {
    [key: string]: ISurveyCategory;
};

type ISurveyCategory = { [key: string]: string | boolean | undefined };

const BaseSurveyEntry = ({ survey, close }: IEntryProps) => {
    const styles = useStyles();
    const { t } = useTranslation();
    const onClose = () => {
        close();
    };

    const surveyInfo: TSurveyForm = getSurveyInfo(survey);

    const Details = () => {
        if (!survey) {
            return <ActivityIndicator size="small" color={themeColors.blueAccent} />;
        }
        const DetailAccordion = ({ categoryName }: { categoryName: string }) => {
            const fields = Object.keys(surveyInfo[categoryName])
                .map((k) => {
                    let desc: string | undefined;
                    if (typeof surveyInfo[categoryName][k] === "boolean") {
                        desc = surveyInfo[categoryName][k] ?  t("general.yes") : t("general.no");
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
                <Card.Title title={t("surveyAttr.baselineSurvey")} />
                <Card style={styles.createdCard}>
                    <Card.Content>
                        <Text>
                            <Text style={styles.labelBold}>{t("surveyAttr.surveyDate")}:</Text>{" "}
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
                <Details />
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
