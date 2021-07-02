import React, { Component, useEffect, useState } from "react";
import { SafeAreaView, TextInput, View, Button, ScrollView } from "react-native";
import { Text, Title, List, Appbar, Checkbox, Divider } from "react-native-paper";
import { ProgressSteps, ProgressStep } from "react-native-progress-steps";
import { Field, FieldArray, Form, Formik, FormikHelpers, FormikProps } from "formik";
import { Picker } from "@react-native-community/picker";
import TextCheckBox from "../../components/TextCheckBox/TextCheckBox";

// import { useParams } from "react-router";
import { getZones, themeColors, useZones, TZoneMap } from "@cbr/common";
// import { useHistory } from "react-router-dom";
import { MaterialIcons } from "@expo/vector-icons";

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

const ImprovementField = (props: {
    formikProps: FormikProps<any>;
    visitType: string;
    provided: string;
    index: number;
}) => {
    const fieldName = `${FormField.improvements}.${props.visitType}.${props.index}`;
    const isImprovementEnabled =
        props.formikProps.values[FormField.improvements][props.visitType][props.index]?.[
            ImprovementFormField.enabled
        ] === true;

    if (
        props.formikProps.values[FormField.improvements][props.visitType][props.index] === undefined
    ) {
        // Since this component is dynamically generated we need to set its initial values
        props.formikProps.setFieldValue(`${fieldName}`, {
            [ImprovementFormField.enabled]: false,
            [ImprovementFormField.description]: "",
            [ImprovementFormField.riskType]: props.visitType,
            [ImprovementFormField.provided]: props.provided,
        });
    }

    return (
        <div key={props.index}>
            <Field
                component={CheckboxWithLabel}
                type="checkbox"
                name={`${fieldName}.${ImprovementFormField.enabled}`}
                Label={{ label: props.provided }}
            />
            <br />
            {isImprovementEnabled && (
                <Field
                    key={`${props.provided}${ImprovementFormField.description}`}
                    type="text"
                    component={TextInput}
                    variant="outlined"
                    name={`${fieldName}.${ImprovementFormField.description}`}
                    label={fieldLabels[ImprovementFormField.description]}
                    required
                    fullWidth
                    multiline
                />
            )}
        </div>
    );
};

interface ISurvey {
    label: string;
    Form: (props: IFormProps) => JSX.Element;
    validationSchema: () => any;
}

interface IFormProps {
    formikProps: FormikProps<any>;
}

// const visitReasonStepCallBack =
//     (setEnabledSteps: React.Dispatch<React.SetStateAction<FormField[]>>, zones: TZoneMap) =>
//     ({ formikProps }: IFormProps) =>
//         visitFocusForm(formikProps, setEnabledSteps, zones);

const visitReasonStepCallBack =
    (setEnabledSteps: React.Dispatch<React.SetStateAction<FormField[]>>) =>
    ({ formikProps }: IFormProps) =>
        visitFocusForm(formikProps, setEnabledSteps);

const visitFocusForm = (
    formikProps: FormikProps<any>,
    setEnabledSteps: React.Dispatch<React.SetStateAction<FormField[]>>
) => {
    const styles = useStyles();
    const [checked, setChecked] = React.useState(false);
    const [activeStep, setActiveStep] = useState<number>(1);

    return (
        <View>
            <Formik initialValues={{ village: "" }} onSubmit={(values) => console.log(values)}>
                <View style={styles.viewPadding}>
                    <Text style={styles.pickerQuestion}>{"\n"}Where was the Visit? </Text>
                    <TextInput
                        style={styles.inputText}
                        placeholder="Village *"
                        value={formikProps.values.village}
                        onChangeText={formikProps.handleChange("village")}
                    />
                    {/* <Picker
                        selectedValue={formikProps.values[FormField.zone]}
                        style={styles.picker}
                        onValueChange={(itemValue) => {
                            formikProps.setFieldTouched(FormField.zone, true);
                            formikProps.setFieldValue(FormField.zone, itemValue);
                        }}
                    >
                        <Picker.Item key={"unselectable"} label={""} value={""} />
                        {Object.entries(zones).map(([value, { name }]) => (
                            <Picker.Item label={name} value={value} key={name} />
                        ))}
                    </Picker> */}
                </View>
            </Formik>

            {/* <Checkbox
                status={checked ? "checked" : "unchecked"}
                onPress={() => {
                    setChecked(!checked);
                }}
            /> */}
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

// const surveySteps: ISurvey[] = [
//     {
//         label: "Visit Focus",
//         Form: (formikProps) => visitFocusForm(formikProps),
//         validationSchema: initialValidationSchema,
//     },
// ];

const NewVisit = () => {
    const [step, setStep] = useState<number>(0);
    const [submissionError, setSubmissionError] = useState(false);
    // const history = useHistory();
    const styles = useStyles();
    const hideAlert = () => setSubmissionError(false);
    const showAlert = () => setSubmissionError(true);

    const [activeStep, setActiveStep] = useState<number>(1);
    const [checked, setChecked] = React.useState(false);
    const [checked2, setChecked2] = React.useState(false);
    const [enabledSteps, setEnabledSteps] = useState<FormField[]>([]);
    const zones = useZones();

    const isFinalStep = activeStep === enabledSteps.length && activeStep !== 0;

    const surveySteps: ISurvey[] = [
        {
            label: "Visit Focus",
            // Form: (formikProps) => visitFocusForm(formikProps),
            Form: visitReasonStepCallBack(setEnabledSteps),
            validationSchema: initialValidationSchema,
        },
        // {
        //     label: "Health Visit",
        //     Form: (formikProps) => healthVisitForm(formikProps),
        //     validationSchema: initialValidationSchema,
        // },
    ];

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
                <>
                    <Appbar.Header statusBarHeight={25}>
                        <MaterialIcons name="arrow-back" size={25} color="#FFFFFF" />
                        <Appbar.Content title={"New Visit Survey"} />
                    </Appbar.Header>

                    <SafeAreaView style={styles.container}>
                        <ProgressSteps key={activeStep} {...progressStepsStyle}>
                            {surveySteps.slice(0, activeStep).map((surveyStep, index) => {
                                console.log(surveySteps);

                                return (
                                    <ProgressStep
                                        key={index}
                                        label={surveyStep.label}
                                        scrollViewProps={defaultScrollViewProps}
                                        previousBtnTextStyle={styles.buttonTextStyle}
                                        nextBtnTextStyle={styles.buttonTextStyle}
                                        nextBtnStyle={styles.nextButton}
                                        previousBtnStyle={styles.prevButton}
                                    >
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
                </>
            )}
        </Formik>
    );
};

export default NewVisit;
