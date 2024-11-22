import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Field, Form, Formik, FormikHelpers, FormikProps } from "formik";
import { CheckboxWithLabel } from "formik-mui";
import { Alert, Box, Button, Step, StepContent, StepLabel, Stepper } from "@mui/material";

import {
    baseFieldLabels,
    BaseSurveyFormField,
    emptyValidationSchema,
    baseInitialValues,
    foodValidationSchema,
    livelihoodValidationSchema,
    healthValidationSchema,
    educationValidationSchema,
    empowermentValidationSchema,
    surveyTypes,
} from "@cbr/common/forms/BaseSurvey/baseSurveyFields";
import { handleSubmit } from "./formHandler";
import GoBackButton from "components/GoBackButton/GoBackButton";
import HealthForm from "./forms/HealthForm";
import EducationForm from "./forms/EducationForm";
import SocialForm from "./forms/SocialForm";
import LivelihoodForm from "./forms/LivelihoodForm";
import FoodForm from "./forms/FoodForm";
import EmpowermentForm from "./forms/EmpowermentForm";
import ShelterForm from "./forms/ShelterForm";

interface IFormProps {
    formikProps: FormikProps<any>;
}

interface ISurvey {
    label: string;
    Form: (props: IFormProps) => JSX.Element;
    validationSchema: () => any;
}

const NewSurvey = () => {
    const [step, setStep] = useState<number>(0);
    const [submissionError, setSubmissionError] = useState<string>();
    const { clientId } = useParams<{ clientId: string }>();
    const { t } = useTranslation();

    const surveySteps: ISurvey[] = [
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
            Form: () => SocialForm(),
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
            label: t("baseSurveyFields.empowerment"),
            Form: (formikProps) => EmpowermentForm(formikProps),
            validationSchema: empowermentValidationSchema,
        },
        {
            label: t("survey.shelterAndCare"),
            Form: () => ShelterForm(),
            validationSchema: emptyValidationSchema,
        },
    ];

    const isFinalStep = step + 1 === surveyTypes.length && step !== 0;
    const prevStep = () => setStep(step - 1);
    const nextStep = (values: any, helpers: FormikHelpers<any>) => {
        if (isFinalStep) {
            handleSubmit(values, helpers, setSubmissionError);
            return;
        }

        if (step === 0) {
            helpers.setFieldValue(`${[BaseSurveyFormField.client_id]}`, clientId);
        }
        setStep(step + 1);
        helpers.setSubmitting(false);
        helpers.setTouched({});
    };

    return (
        <Formik
            initialValues={baseInitialValues}
            validationSchema={surveySteps[step].validationSchema}
            onSubmit={nextStep}
            enableReinitialize
        >
            {(formikProps) => (
                <Form>
                    {submissionError && (
                        <Alert onClose={() => setSubmissionError(undefined)} severity="error">
                            {/* TODO: add translation for this... */}
                            Error occurred when submitting the survey: {submissionError}
                        </Alert>
                    )}
                    <Box sx={{ marginBottom: "1.5em" }}>
                        <GoBackButton />
                    </Box>

                    <Field
                        component={CheckboxWithLabel}
                        type="checkbox"
                        color="secondary"
                        name={BaseSurveyFormField.surveyConsent}
                        Label={{ label: baseFieldLabels[BaseSurveyFormField.surveyConsent] }}
                    />

                    {formikProps.values.give_consent && (
                        <Stepper activeStep={step} orientation="vertical" sx={{ padding: "24px" }}>
                            {surveySteps.map((surveyStep, index) => (
                                <Step key={index}>
                                    <StepLabel>{surveyStep.label}</StepLabel>
                                    <StepContent>
                                        <surveyStep.Form formikProps={formikProps} />
                                        <Box sx={{ marginTop: "1.5rem" }}>
                                            {step !== 0 && (
                                                <Button
                                                    style={{ marginRight: "5px" }}
                                                    variant="outlined"
                                                    color="primary"
                                                    onClick={prevStep}
                                                >
                                                    {t("general.previous")}
                                                </Button>
                                            )}
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                color="primary"
                                            >
                                                {isFinalStep && index === step
                                                    ? t("general.submit")
                                                    : t("general.next")}
                                            </Button>
                                        </Box>
                                    </StepContent>
                                </Step>
                            ))}
                        </Stepper>
                    )}
                </Form>
            )}
        </Formik>
    );
};

export default NewSurvey;
