import React, { Component, useEffect, useState } from "react";
import { SafeAreaView, TextInput, View, Button, ScrollView } from "react-native";
import { Text, Title, List, Appbar, Checkbox, Divider } from "react-native-paper";
import { ProgressSteps, ProgressStep } from "react-native-progress-steps";
import { Field, FieldArray, Form, Formik, FormikHelpers, FormikProps } from "formik";
import { Picker } from "@react-native-community/picker";
import { useParams } from "react-router";
import { themeColors } from "@cbr/common";
import { useHistory } from "react-router-dom";
import {
    fieldLabels,
    FormField,
    ImprovementFormField,
    OutcomeFormField,
    initialValues,
    provisionals,
    initialValidationSchema,
    visitTypeValidationSchema,
    GoalStatus,
} from "./formFields";
import { handleSubmit } from "./formHandler";
import useStyles, { defaultScrollViewProps, progressStepsStyle } from "./visitSurvey.style";

const visitTypes: FormField[] = [FormField.health, FormField.education, FormField.social];

interface IFormProps {
    formikProps: FormikProps<any>;
}

interface ISurvey {
    label: string;
    Form: (props: IFormProps) => JSX.Element;
    validationSchema: () => any;
}

const visitFocusForm = (props: IFormProps) => {
    const styles = useStyles();
    const [checked, setChecked] = React.useState(false);
    const [activeStep, setActiveStep] = useState<number>(1);

    return (
        <View>
            <Text style={styles.pickerQuestion}>{"\n"}Visit Focus </Text>
        </View>
    );
};

const healthVisitForm = (props: IFormProps) => {
    const styles = useStyles();
    const [checked, setChecked] = React.useState(false);
    const [activeStep, setActiveStep] = useState<number>(1);

    return (
        <View>
            <Text style={styles.pickerQuestion}>{"\n"}Rate your general health </Text>
        </View>
    );
};

const educationVisitForm = (props: IFormProps) => {
    const styles = useStyles();
    const [checked, setChecked] = React.useState(false);
    const [activeStep, setActiveStep] = useState<number>(1);

    return (
        <View>
            <Text style={styles.pickerQuestion}>{"\n"}Education visit form </Text>
        </View>
    );
};

const surveySteps: ISurvey[] = [
    {
        label: "Visit Focus",
        Form: (formikProps) => visitFocusForm(formikProps),
        validationSchema: initialValidationSchema,
    },
];

const NewVisit = () => {
    const [step, setStep] = useState<number>(0);
    const [submissionError, setSubmissionError] = useState(false);
    const history = useHistory();
    const styles = useStyles();
    const hideAlert = () => setSubmissionError(false);
    const showAlert = () => setSubmissionError(true);

    const [activeStep, setActiveStep] = useState<number>(1);
    const [checked, setChecked] = React.useState(false);
    const [checked2, setChecked2] = React.useState(false);
    const [enabledSteps, setEnabledSteps] = useState<FormField[]>([]);

    const isFinalStep = activeStep === enabledSteps.length && activeStep !== 0;

    // const surveySteps: ISurvey[] = [
    //     {
    //         label: "Visit Focus",
    //         Form: (formikProps) => visitFocusForm(formikProps),
    //         validationSchema: initialValidationSchema,
    //     },
    //     {
    //         label: "Health Visit",
    //         Form: (formikProps) => healthVisitForm(formikProps),
    //         validationSchema: initialValidationSchema,
    //     },
    // ];

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

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={surveySteps[step].validationSchema}
            onSubmit={nextStep}
            enableReinitialize
        >
            {(formikProps) => (
                <SafeAreaView style={styles.container}>
                    <ProgressSteps key={activeStep} {...progressStepsStyle}>
                        {/* <ProgressStep label="Payment" scrollViewProps={defaultScrollViewProps}>
                            <View style={{ alignItems: "center" }}>
                                <Text>Payment step content</Text>
                            </View>
                        </ProgressStep> */}
                        {surveySteps.slice(0, activeStep).map((surveyStep, index) => {
                            {
                                /* {surveySteps
                            .filter((steps) => steps.label.toLocaleLowerCase().includes("m"))
                            .map((surveyStep, index) => { */
                            }
                            console.log(surveySteps);

                            return (
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
                            );
                        })}
                    </ProgressSteps>

                    <Checkbox
                        status={checked ? "checked" : "unchecked"}
                        onPress={() => {
                            setChecked(!checked);

                            if (!checked) {
                                surveySteps.push({
                                    label: "Health Visit",
                                    Form: (formikProps) => healthVisitForm(formikProps),
                                    validationSchema: initialValidationSchema,
                                });
                                setActiveStep(activeStep + 1);
                                console.log(surveySteps);
                            } else {
                                // surveySteps.filter(
                                //     (steps) =>
                                //         !steps.label.toLocaleLowerCase().includes("livelihood")
                                // );
                                const indexA = surveySteps.findIndex((steps) =>
                                    steps.label.toLocaleLowerCase().includes("health")
                                );
                                // console.log(indexA);
                                surveySteps.splice(indexA, 1);
                                setActiveStep(activeStep - 1);
                            }
                        }}
                    />

                    <Checkbox
                        status={checked2 ? "checked" : "unchecked"}
                        onPress={() => {
                            setChecked2(!checked2);

                            if (!checked2) {
                                surveySteps.push({
                                    label: "Education",
                                    Form: (formikProps) => educationVisitForm(formikProps),
                                    validationSchema: initialValidationSchema,
                                });
                                setActiveStep(activeStep + 1);
                            } else {
                                const indexA = surveySteps.findIndex((steps) =>
                                    steps.label.toLocaleLowerCase().includes("education")
                                );
                                // console.log(indexA);
                                surveySteps.splice(indexA, 1);

                                setActiveStep(activeStep - 1);
                            }
                        }}
                    />
                </SafeAreaView>
            )}
        </Formik>
    );
};

export default NewVisit;
