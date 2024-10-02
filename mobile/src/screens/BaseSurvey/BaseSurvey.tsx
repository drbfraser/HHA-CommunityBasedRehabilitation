import React, { useContext, useState } from "react";
import { ScrollView, View } from "react-native";
import { Divider, Text } from "react-native-paper";
import {
    baseInitialValues,
    BaseSurveyFormField,
    educationValidationSchema,
    empowermentValidationSchema,
    emptyValidationSchema,
    foodValidationSchema,
    healthValidationSchema,
    IFormProps,
    livelihoodValidationSchema,
    surveyTypes,
    themeColors,
    APIFetchFailError,
    baseFieldLabels,
    countObjectKeys,
} from "@cbr/common";
import { Formik, FormikHelpers } from "formik";
import { ProgressStep, ProgressSteps } from "react-native-progress-steps";
import useStyles, { defaultScrollViewProps, progressStepsStyle } from "./baseSurvey.style";
import HealthForm from "./SurveyForm/HealthForm";
import EducationForm from "./SurveyForm/EducationForm";
import SocialForm from "./SurveyForm/SocialForm";
import LivelihoodForm from "./SurveyForm/LivelihoodForm";
import EmpowermentForm from "./SurveyForm/EmpowermentForm";
import ShelterForm from "./SurveyForm/ShelterForm";
import FoodForm from "./SurveyForm/FoodForm";
import { handleSubmit } from "./formHandler";
import { RouteProp } from "@react-navigation/native";
import { StackParamList } from "../../util/stackScreens";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackScreenName } from "../../util/StackScreenName";
import Alert from "../../components/Alert/Alert";
import ConfirmDialogWithNavListener from "../../components/DiscardDialogs/ConfirmDialogWithNavListener";
import ConsentForm from "./SurveyForm/ConsentForm";
import { useDatabase } from "@nozbe/watermelondb/hooks";
import { SyncContext } from "../../context/SyncContext/SyncContext";
import { useTranslation } from "react-i18next";

interface ISurvey {
    label: string;
    Form: (props: IFormProps) => JSX.Element;
    validationSchema: () => any;
}
interface IBaseSurveyProps {
    clientID: number;
    route: RouteProp<StackParamList, StackScreenName.BASE_SURVEY>;
    navigation: StackNavigationProp<StackParamList, StackScreenName.BASE_SURVEY>;
}

const BaseSurvey = (props: IBaseSurveyProps) => {
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [step, setStep] = useState<number>(0);
    const [submissionError, setSubmissionError] = useState(false);
    const styles = useStyles();
    const [stepChecked, setStepChecked] = useState([false]);
    const isFinalStep = step === surveyTypes.length && step !== 0;
    const clientId = props.route.params.clientID;
    const [saveError, setSaveError] = useState<string>();
    const { autoSync, cellularSync } = useContext(SyncContext);
    const prevStep = () => {
        setStep(step - 1);
    };
    const { t } = useTranslation();

    const database = useDatabase();
    const nextStep = (values: any, helpers: FormikHelpers<any>) => {
        if (isFinalStep) {
            setSaveError(undefined);
            handleSubmit(values, database, helpers, autoSync, cellularSync)
                .then(() => {
                    setHasSubmitted(true);
                    props.navigation.navigate(StackScreenName.CLIENT, {
                        clientID: clientId,
                    });
                })
                .catch((e) => {
                    setSaveError(
                        e instanceof APIFetchFailError ? e.buildFormError(baseFieldLabels) : `${e}`
                    );
                    helpers.setSubmitting(false);
                    setSubmissionError(true);
                });
        } else {
            if (step === 0) {
                if (stepChecked.length < surveySteps.length - 1) {
                    for (let i = 0; i < surveySteps.length - 1; i++) {
                        stepChecked.push(false);
                    }
                }
                helpers.setFieldValue(`${[BaseSurveyFormField.client_id]}`, clientId);
            }
            console.log(step);
            if ((step === 0 || step === 1 || step === 4) && !stepChecked[step]) {
                helpers.setTouched({});
            }
            let newArr = [...stepChecked];
            newArr[step] = true;
            setStepChecked(newArr);
            setStep(step + 1);

            helpers.setSubmitting(false);
        }
    };

    const surveySteps: ISurvey[] = [
        {
            label: t("general.consent"),
            Form: (formikProps) => ConsentForm(formikProps),
            validationSchema: emptyValidationSchema,
        },
        {
            label: t("general.health"),
            Form: (formikProps) => HealthForm(formikProps),
            validationSchema: healthValidationSchema,
        },
        {
            label: t("survey.education"),
            Form: (formikProps) => EducationForm(formikProps),
            validationSchema: educationValidationSchema,
        },
        {
            label: t("general.social"),
            Form: (formikProps) => SocialForm(formikProps),
            validationSchema: emptyValidationSchema,
        },
        {
            label: t("survey.livelihood"),
            Form: (formikProps) => LivelihoodForm(formikProps),
            validationSchema: livelihoodValidationSchema,
        },
        {
            label: t("survey.foodAndNutrition"),
            Form: (formikProps) => FoodForm(formikProps),
            validationSchema: foodValidationSchema,
        },
        {
            label: t("general.empowerment"),
            Form: (formikProps) => EmpowermentForm(formikProps),
            validationSchema: empowermentValidationSchema,
        },
        {
            label: t("survey.shelterAndCare"),
            Form: (formikProps) => ShelterForm(formikProps),
            validationSchema: emptyValidationSchema,
        },
    ];

    return (
        <>
            <ConfirmDialogWithNavListener
                bypassDialog={hasSubmitted}
                confirmButtonText={t("general.discard")}
                dialogContent={t("general.discardAdded")}
            />
            <Formik
                initialValues={baseInitialValues}
                validationSchema={surveySteps[step].validationSchema}
                onSubmit={nextStep}
                enableReinitialize
            >
                {(formikProps) => (
                    <>
                        <View style={styles.container}>
                            {saveError && (
                                <Alert
                                    style={styles.errorAlert}
                                    severity={"error"}
                                    text={saveError}
                                    onClose={() => setSaveError(undefined)}
                                />
                            )}

                            <ProgressSteps {...progressStepsStyle}>
                                {surveySteps.map((surveyStep, index) => (
                                    <ProgressStep
                                        key={index}
                                        scrollViewProps={defaultScrollViewProps}
                                        previousBtnTextStyle={styles.buttonTextStyle}
                                        nextBtnTextStyle={styles.buttonTextStyle}
                                        nextBtnStyle={styles.nextButton}
                                        onNext={() => {
                                            nextStep(formikProps.values, formikProps);
                                            console.log(step);
                                        }}
                                        nextBtnDisabled={
                                            formikProps.isSubmitting ||
                                            !formikProps.values.give_consent ||
                                            ((countObjectKeys(formikProps.errors) !== 0 ||
                                                countObjectKeys(formikProps.touched) === 0) &&
                                                !stepChecked[step])
                                        }
                                        previousBtnDisabled={formikProps.isSubmitting}
                                        onPrevious={prevStep}
                                        previousBtnStyle={styles.prevButton}
                                        onSubmit={() => nextStep(formikProps.values, formikProps)}
                                        previousBtnText={t("general.previous")}
                                        nextBtnText={t("general.next")}
                                        finishBtnText={t("general.submit")}
                                    >
                                        <Text style={styles.stepLabelText}>{surveyStep.label}</Text>
                                        <Divider
                                            style={{ backgroundColor: themeColors.blueBgDark }}
                                        />
                                        <ScrollView>
                                            <surveyStep.Form formikProps={formikProps} />
                                        </ScrollView>
                                    </ProgressStep>
                                ))}
                            </ProgressSteps>
                        </View>
                    </>
                )}
            </Formik>
        </>
    );
};

export default BaseSurvey;
