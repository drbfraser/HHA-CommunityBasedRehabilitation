import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { Text, Divider } from "react-native-paper";
import {
    educationValidationSchema,
    empowermentValidationSchema,
    emptyValidationSchema,
    foodValidationSchema,
    healthValidationSchema,
    IFormProps,
    initialValues,
    livelihoodValidationSchema,
    surveyTypes,
} from "./formFields";
import { Formik, FormikHelpers } from "formik";
import { useHistory } from "react-router-dom";
import { handleSubmit } from "./formHandler";
import { ProgressSteps, ProgressStep } from "react-native-progress-steps";
import { themeColors } from "@cbr/common";
import useStyles, { defaultScrollViewProps, progressStepsStyle } from "./baseSurvey.style";
import HealthForm from "./SurveyForm/HealthForm";
import EducationForm from "./SurveyForm/EducationForm";
import SocialForm from "./SurveyForm/SocialForm";
import LivelihoodForm from "./SurveyForm/LivelihoodFom";
import EmpowermentForm from "./SurveyForm/EmpowermentForm";
import ShelterForm from "./SurveyForm/ShelterForm";
import FoodForm from "./SurveyForm/FoodForm";

interface ISurvey {
    label: string;
    Form: (props: IFormProps) => JSX.Element;
    validationSchema: () => any;
}

const BaseSurvey = () => {
    const [step, setStep] = useState<number>(0);
    const [submissionError, setSubmissionError] = useState(false);
    const history = useHistory();
    const styles = useStyles();
    const hideAlert = () => setSubmissionError(false);
    const showAlert = () => setSubmissionError(true);

    const isFinalStep = step + 1 === surveyTypes.length && step !== 0;
    const prevStep = () => setStep(step - 1);
    const nextStep = (values: any, helpers: FormikHelpers<any>) => {
        if (isFinalStep) {
            handleSubmit(values, helpers, setSubmissionError);
        } else {
            if (step === 0) {
                // helpers.setFieldValue(`${[FormField.client]}`, clientId);
            }
            setStep(step + 1);
            helpers.setSubmitting(false);
            helpers.setTouched({});
        }
    };

    const surveySteps: ISurvey[] = [
        {
            label: "Health",
            Form: (formikProps) => HealthForm(formikProps),
            validationSchema: healthValidationSchema,
        },
        {
            label: "Education (under 18)",
            Form: (formikProps) => EducationForm(formikProps),
            validationSchema: educationValidationSchema,
        },
        {
            label: "Social",
            Form: (formikProps) => SocialForm(formikProps),
            validationSchema: emptyValidationSchema,
        },
        {
            label: "Livelihood (over 16)",
            Form: (formikProps) => LivelihoodForm(formikProps),
            validationSchema: livelihoodValidationSchema,
        },
        {
            label: "Food and Nutrition",
            Form: (formikProps) => FoodForm(formikProps),
            validationSchema: foodValidationSchema,
        },
        {
            label: "Empowerment",
            Form: (formikProps) => EmpowermentForm(formikProps),
            validationSchema: empowermentValidationSchema,
        },
        {
            label: "Shelter and Care",
            Form: (formikProps) => ShelterForm(formikProps),
            validationSchema: emptyValidationSchema,
        },
    ];
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={surveySteps[step].validationSchema}
            onSubmit={nextStep}
            enableReinitialize
        >
            {(formikProps) => (
                <View style={styles.container}>
                    <ProgressSteps {...progressStepsStyle}>
                        {surveySteps.map((surveyStep, index) => (
                            <ProgressStep
                                key={index}
                                scrollViewProps={defaultScrollViewProps}
                                previousBtnTextStyle={styles.buttonTextStyle}
                                nextBtnTextStyle={styles.buttonTextStyle}
                                nextBtnStyle={styles.nextButton}
                                previousBtnStyle={styles.prevButton}
                            >
                                <Text style={{ fontSize: 25, fontWeight: "bold" }}>
                                    {surveyStep.label}
                                </Text>
                                <Divider style={{ backgroundColor: themeColors.blueBgDark }} />
                                <ScrollView>
                                    <surveyStep.Form formikProps={formikProps} />
                                </ScrollView>
                            </ProgressStep>
                        ))}
                    </ProgressSteps>
                </View>
            )}
        </Formik>
    );
};

export default BaseSurvey;
