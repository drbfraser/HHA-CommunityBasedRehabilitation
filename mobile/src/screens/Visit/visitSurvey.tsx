import React, { Component, useEffect, useState } from "react";
import { SafeAreaView, View, Button, ScrollView } from "react-native";
import {
    Text,
    Title,
    List,
    Appbar,
    Checkbox,
    Divider,
    TextInput,
    HelperText,
} from "react-native-paper";
import { ProgressSteps, ProgressStep } from "react-native-progress-steps";
import { Field, FieldArray, Form, Formik, FormikHelpers, FormikProps } from "formik";
import TextPicker from "../../components/TextPicker/TextPicker";
import TextCheckBox from "../../components/TextCheckBox/TextCheckBox";
import { IRisk } from "@cbr/common";

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
import AsyncStorage from "@react-native-async-storage/async-storage";

const visitTypes: FormField[] = [FormField.health, FormField.education, FormField.social];

// const ImprovementField = (props: {
//     formikProps: FormikProps<any>;
//     visitType: string;
//     provided: string;
//     index: number;
// }) => {
//     const fieldName = `${FormField.improvements}.${props.visitType}.${props.index}`;
//     const isImprovementEnabled =
//         props.formikProps.values[FormField.improvements][props.visitType][props.index]?.[
//             ImprovementFormField.enabled
//         ] === true;

//     if (
//         props.formikProps.values[FormField.improvements][props.visitType][props.index] === undefined
//     ) {
//         // Since this component is dynamically generated we need to set its initial values
//         props.formikProps.setFieldValue(`${fieldName}`, {
//             [ImprovementFormField.enabled]: false,
//             [ImprovementFormField.description]: "",
//             [ImprovementFormField.riskType]: props.visitType,
//             [ImprovementFormField.provided]: props.provided,
//         });
//     }

//     return (
//         <div key={props.index}>
//             <Field
//                 component={CheckboxWithLabel}
//                 type="checkbox"
//                 name={`${fieldName}.${ImprovementFormField.enabled}`}
//                 Label={{ label: props.provided }}
//             />
//             <br />
//             {isImprovementEnabled && (
//                 <Field
//                     key={`${props.provided}${ImprovementFormField.description}`}
//                     type="text"
//                     component={TextField}
//                     variant="outlined"
//                     name={`${fieldName}.${ImprovementFormField.description}`}
//                     label={fieldLabels[ImprovementFormField.description]}
//                     required
//                     fullWidth
//                     multiline
//                 />
//             )}
//         </div>
//     );
// };

interface ISurvey {
    label: string;
    Form: (props: IFormProps) => JSX.Element;
    validationSchema: () => any;
}

interface IFormProps {
    formikProps: FormikProps<any>;
}

const visitReasonStepCallBack =
    (setEnabledSteps: React.Dispatch<React.SetStateAction<FormField[]>>, zones: TZoneMap) =>
    ({ formikProps }: IFormProps) =>
        visitFocusForm(formikProps, setEnabledSteps, zones);

const visitFocusForm = (
    formikProps: FormikProps<any>,
    setEnabledSteps: React.Dispatch<React.SetStateAction<FormField[]>>,
    zones: TZoneMap
) => {
    const styles = useStyles();
    const [checked, setChecked] = React.useState(false);
    const [activeStep, setActiveStep] = useState<number>(1);

    const onCheckboxChange = (checked: boolean, visitType: string) => {
        // We can't fully rely on formikProps.values[type] here because it might not be updated yet
        setEnabledSteps(
            visitTypes.filter(
                (type) =>
                    (formikProps.values[type] && type !== visitType) ||
                    (checked && type === visitType)
            )
        );
        console.log(checked);

        if (checked) {
            // formikProps.setFieldValue(`${FormField.outcomes}.${visitType}`, {
            //     [OutcomeFormField.riskType]: visitType,
            //     [OutcomeFormField.goalStatus]: GoalStatus.ongoing,
            //     [OutcomeFormField.outcome]: "",
            // });
            console.log("checked");
        } else {
            // formikProps.setFieldValue(`${FormField.outcomes}.${visitType}`, undefined);
            console.log("not checked");
        }
    };
    return (
        <View>
            <View style={styles.viewPadding}>
                <Text style={styles.pickerQuestion}>{"\n"}Where was the Visit? </Text>
                <Text />
                <TextInput
                    mode="outlined"
                    label={fieldLabels[FormField.village]}
                    value={formikProps.values[FormField.village]}
                    onChangeText={(value) => formikProps.setFieldValue(FormField.village, value)}
                />

                <HelperText
                    // style={styles.errorText}
                    type="error"
                    visible={!!formikProps.errors[FormField.village]}
                >
                    {formikProps.errors[FormField.village]}
                </HelperText>

                <TextPicker
                    field={FormField.zone}
                    choices={Array.from(zones.entries()).map(([key, value]) => ({
                        label: value,
                        value: key,
                    }))}
                    selectedValue={formikProps.values[FormField.zone]}
                    setFieldValue={formikProps.setFieldValue}
                    setFieldTouched={formikProps.setFieldTouched}
                />

                <HelperText
                    // style={styles.errorText}
                    type="error"
                    visible={!!formikProps.errors[FormField.zone]}
                >
                    {formikProps.errors[FormField.zone]}
                </HelperText>
                <Text style={styles.pickerQuestion}>{"\n"}Select the Reasons for the Visit </Text>
                {visitTypes.map((visitType) => (
                    <TextCheckBox
                        key={visitType}
                        field={visitType}
                        value={formikProps.values[visitType]}
                        label={fieldLabels[visitType]}
                        setFieldValue={formikProps.setFieldValue}
                    />
                ))}
                {/* <Checkbox
                    status={checked ? "checked" : "unchecked"}
                    onPress={() => {
                        setChecked(!checked);
                        onCheckboxChange(!checked, "HEALTH");
                    }}
                /> */}
            </View>
        </View>
    );
};

const healthVisitForm = (props: IFormProps, visitType: FormField) => {
    const styles = useStyles();
    return (
        <View>
            <Text style={styles.pickerQuestion}>{"\n"}Select an Improvement </Text>
            {provisionals[visitType].map((visitType) => (
                <TextCheckBox
                    key={visitType}
                    field={visitType}
                    value={props.formikProps.values[visitType]}
                    label={visitType}
                    setFieldValue={props.formikProps.setFieldValue}
                />
            ))}
            {/* <FieldArray
                name={FormField.improvements}
                render={() =>
                    provisionals[visitType].map((provided, index) => (
                        <ImprovementField
                            key={index}
                            formikProps={formikProps}
                            visitType={visitType}
                            provided={provided}
                            index={index}
                        />
                    ))
                }
            /> */}
            <Text style={styles.pickerQuestion}>{"\n"}Client's Health Goal </Text>
            <Text style={styles.normalInput}>{"\n"}Improved Learning </Text>
            <Text style={styles.pickerQuestion}>{"\n"}Client's Health Goal Status </Text>

            <TextPicker
                field={OutcomeFormField.goalStatus}
                choices={Object.values(GoalStatus).map((status) => ({
                    label: fieldLabels[status],
                    value: status,
                }))}
                selectedValue={props.formikProps.values[OutcomeFormField.goalStatus]}
                setFieldValue={props.formikProps.setFieldValue}
                setFieldTouched={props.formikProps.setFieldTouched}
            />

            <Text style={styles.pickerQuestion}>{"\n"}What is the Outcome of the Goal? </Text>

            <TextInput
                mode="outlined"
                label={fieldLabels[OutcomeFormField.outcome]}
                value={props.formikProps.values[OutcomeFormField.outcome]}
                onChangeText={(value) =>
                    props.formikProps.setFieldValue(OutcomeFormField.outcome, value)
                }
            />
            <HelperText
                // style={styles.errorText}
                type="error"
                visible={!!props.formikProps.errors[FormField.village]}
            >
                {props.formikProps.errors[FormField.village]}
            </HelperText>
        </View>
    );
};

const educationVisitForm = (props: IFormProps, visitType: FormField) => {
    const styles = useStyles();
    return (
        <View>
            <Text style={styles.pickerQuestion}>{"\n"}Select an Improvement </Text>
            {provisionals[visitType].map((visitType) => (
                <TextCheckBox
                    key={visitType}
                    field={visitType}
                    value={props.formikProps.values[visitType]}
                    label={visitType}
                    setFieldValue={props.formikProps.setFieldValue}
                />
            ))}
            <Text style={styles.pickerQuestion}>{"\n"}Client's Education Goal </Text>
            <Text style={styles.normalInput}>{"\n"}Additional Mobility </Text>
            <Text style={styles.pickerQuestion}>{"\n"}Client's Education Goal Status </Text>
            <TextPicker
                field={OutcomeFormField.goalStatus}
                choices={Object.values(GoalStatus).map((status) => ({
                    label: fieldLabels[status],
                    value: status,
                }))}
                selectedValue={props.formikProps.values[OutcomeFormField.goalStatus]}
                setFieldValue={props.formikProps.setFieldValue}
                setFieldTouched={props.formikProps.setFieldTouched}
            />

            <Text style={styles.pickerQuestion}>{"\n"}What is the Outcome of the Goal? </Text>

            <TextInput
                mode="outlined"
                label={fieldLabels[OutcomeFormField.outcome]}
                value={props.formikProps.values[OutcomeFormField.outcome]}
                onChangeText={(value) =>
                    props.formikProps.setFieldValue(OutcomeFormField.outcome, value)
                }
            />
            <HelperText
                // style={styles.errorText}
                type="error"
                visible={!!props.formikProps.errors[FormField.village]}
            >
                {props.formikProps.errors[FormField.village]}
            </HelperText>
        </View>
    );
};

const socialVisitForm = (props: IFormProps, visitType: FormField) => {
    const styles = useStyles();
    return (
        <View>
            <Text style={styles.pickerQuestion}>{"\n"}Select an Improvement </Text>
            {provisionals[visitType].map((visitType) => (
                <TextCheckBox
                    key={visitType}
                    field={visitType}
                    value={props.formikProps.values[visitType]}
                    label={visitType}
                    setFieldValue={props.formikProps.setFieldValue}
                />
            ))}
            <Text style={styles.pickerQuestion}>{"\n"}Client's Social Goal </Text>
            <Text style={styles.normalInput}>{"\n"}Full Recovery </Text>
            <Text style={styles.pickerQuestion}>{"\n"}Client's Social Goal Status </Text>
            <TextPicker
                field={OutcomeFormField.goalStatus}
                choices={Object.values(GoalStatus).map((status) => ({
                    label: fieldLabels[status],
                    value: status,
                }))}
                selectedValue={props.formikProps.values[OutcomeFormField.goalStatus]}
                setFieldValue={props.formikProps.setFieldValue}
                setFieldTouched={props.formikProps.setFieldTouched}
            />

            <Text style={styles.pickerQuestion}>{"\n"}What is the Outcome of the Goal? </Text>

            <TextInput
                mode="outlined"
                label={fieldLabels[OutcomeFormField.outcome]}
                value={props.formikProps.values[OutcomeFormField.outcome]}
                onChangeText={(value) =>
                    props.formikProps.setFieldValue(OutcomeFormField.outcome, value)
                }
            />
            <HelperText
                // style={styles.errorText}
                type="error"
                visible={!!props.formikProps.errors[FormField.village]}
            >
                {props.formikProps.errors[FormField.village]}
            </HelperText>
        </View>
    );
};

const NewVisit = () => {
    const [step, setStep] = useState<number>(0);
    const [submissionError, setSubmissionError] = useState(false);
    // const history = useHistory();
    const styles = useStyles();
    const hideAlert = () => setSubmissionError(false);
    const showAlert = () => setSubmissionError(true);

    // const [risks, setRisks] = useState<IRisk[]>([]);

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
            Form: visitReasonStepCallBack(setEnabledSteps, zones),
            validationSchema: initialValidationSchema,
        },
        {
            label: "Health Visit",
            Form: (formikProps) => healthVisitForm(formikProps, visitTypes[0]),
            validationSchema: initialValidationSchema,
        },
        {
            label: "Education Visit",
            Form: (formikProps) => educationVisitForm(formikProps, visitTypes[1]),
            validationSchema: initialValidationSchema,
        },
        {
            label: "Social Visit",
            Form: (formikProps) => socialVisitForm(formikProps, visitTypes[2]),
            validationSchema: initialValidationSchema,
        },
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
                    <Appbar.Header>
                        <Appbar.BackAction />
                        <Appbar.Content title={"Baseline Survey"} />
                    </Appbar.Header>

                    <SafeAreaView style={styles.container}>
                        <ProgressSteps {...progressStepsStyle}>
                            {surveySteps.map((surveyStep, index) => {
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

                        {/* <Checkbox
                            status={checked ? "checked" : "unchecked"}
                            onPress={() => {
                                setChecked(!checked);

                                if (!checked) {
                                    surveySteps.push({
                                        label: "Health Visit",
                                        Form: (formikProps) =>
                                            healthVisitForm(formikProps, visitTypes[0]),
                                        validationSchema: initialValidationSchema,
                                    });
                                    setActiveStep(activeStep + 1);
                                } else {
                                    // surveySteps.filter(
                                    //     (steps) =>
                                    //         !steps.label.toLocaleLowerCase().includes("livelihood")
                                    // );
                                    const indexA = surveySteps.findIndex((steps) =>
                                        steps.label.toLocaleLowerCase().includes("health")
                                    );
                                    surveySteps.splice(indexA, 1);
                                    setActiveStep(activeStep - 1);
                                }
                            }}
                        /> */}

                        {/* <Checkbox
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
                        /> */}
                    </SafeAreaView>
                </>
            )}
        </Formik>
    );
};

export default NewVisit;
