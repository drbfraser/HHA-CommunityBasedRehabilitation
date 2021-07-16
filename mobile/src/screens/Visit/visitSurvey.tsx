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

// import { useParams } from "react-router";
import { getZones, themeColors, useZones, TZoneMap, IRisk } from "@cbr/common";
// import { useHistory } from "react-router-dom";

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
        <View key={props.index}>
            <TextCheckBox
                //key={visitType}
                field={FormField.improvements}
                value={props.formikProps.values[ImprovementFormField.enabled]}
                label={props.provided}
                setFieldValue={props.formikProps.setFieldValue}
            />

            {/* {isImprovementEnabled && (
                <TextInput
                    mode="outlined"
                    label={fieldLabels[ImprovementFormField.description]}
                    value={props.formikProps.values[ImprovementFormField.description]}
                    onChangeText={(value) =>
                        props.formikProps.setFieldValue(ImprovementFormField.description, value)
                    }
                />
            )} */}
        </View>
    );
};

interface IVisitForm {
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

        if (checked) {
            formikProps.setFieldValue(`${FormField.outcomes}.${visitType}`, {
                [OutcomeFormField.riskType]: visitType,
                [OutcomeFormField.goalStatus]: GoalStatus.ongoing,
                [OutcomeFormField.outcome]: "",
            });
        } else {
            formikProps.setFieldValue(`${FormField.outcomes}.${visitType}`, undefined);
        }
    };
    return (
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
                    onChange={(value) => {
                        formikProps.setFieldTouched(visitType, true);
                        onCheckboxChange(value, visitType);
                    }}
                />
            ))}
        </View>
    );
};

const healthVisitForm = (props: IFormProps, visitType: FormField) => {
    const styles = useStyles();
    return (
        <View style={styles.viewPadding}>
            <Text style={styles.pickerQuestion}>{"\n"}Select an Improvement </Text>
            {provisionals[visitType].map((visitType) => (
                <>
                    <TextCheckBox
                        key={visitType}
                        field={visitType}
                        value={props.formikProps.values[visitType]}
                        label={visitType}
                        setFieldValue={props.formikProps.setFieldValue}
                    />

                    {props.formikProps.values[visitType] && (
                        <>
                            <TextInput
                                // key={"unselectable"}
                                mode="outlined"
                                label={fieldLabels[ImprovementFormField.description]}
                                value={props.formikProps.values[ImprovementFormField.description]}
                                onChangeText={(value) => {
                                    props.formikProps.setFieldTouched(
                                        ImprovementFormField.description,
                                        true
                                    );

                                    props.formikProps.setFieldValue(
                                        ImprovementFormField.description,
                                        value
                                    );
                                }}
                            />
                            <HelperText
                                // style={styles.errorText}
                                type="error"
                                visible={
                                    !!props.formikProps.errors[ImprovementFormField.description]
                                }
                            >
                                {props.formikProps.errors[ImprovementFormField.description]}
                            </HelperText>
                        </>
                    )}
                </>
            ))}

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
                visible={!!props.formikProps.errors[OutcomeFormField.outcome]}
            >
                {props.formikProps.errors[OutcomeFormField.outcome]}
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
                <>
                    <TextCheckBox
                        key={visitType}
                        field={visitType}
                        value={props.formikProps.values[visitType]}
                        label={visitType}
                        setFieldValue={props.formikProps.setFieldValue}
                    />

                    {props.formikProps.values[visitType] && (
                        <>
                            <TextInput
                                // key={"unselectable"}
                                mode="outlined"
                                label={fieldLabels[ImprovementFormField.description]}
                                value={props.formikProps.values[ImprovementFormField.description]}
                                onChangeText={(value) => {
                                    props.formikProps.setFieldTouched(
                                        ImprovementFormField.description,
                                        true
                                    );

                                    props.formikProps.setFieldValue(
                                        ImprovementFormField.description,
                                        value
                                    );
                                }}
                            />
                            <HelperText
                                // style={styles.errorText}
                                type="error"
                                visible={
                                    !!props.formikProps.errors[ImprovementFormField.description]
                                }
                            >
                                {props.formikProps.errors[ImprovementFormField.description]}
                            </HelperText>
                        </>
                    )}
                </>
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
                visible={!!props.formikProps.errors[OutcomeFormField.outcome]}
            >
                {props.formikProps.errors[OutcomeFormField.outcome]}
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
                <>
                    <TextCheckBox
                        key={visitType}
                        field={visitType}
                        value={props.formikProps.values[visitType]}
                        label={visitType}
                        setFieldValue={props.formikProps.setFieldValue}
                    />

                    {props.formikProps.values[visitType] && (
                        <>
                            <TextInput
                                // key={"unselectable"}
                                mode="outlined"
                                label={fieldLabels[ImprovementFormField.description]}
                                value={props.formikProps.values[ImprovementFormField.description]}
                                onChangeText={(value) => {
                                    props.formikProps.setFieldTouched(
                                        ImprovementFormField.description,
                                        true
                                    );

                                    props.formikProps.setFieldValue(
                                        ImprovementFormField.description,
                                        value
                                    );
                                }}
                            />
                            <HelperText
                                // style={styles.errorText}
                                type="error"
                                visible={
                                    !!props.formikProps.errors[ImprovementFormField.description]
                                }
                            >
                                {props.formikProps.errors[ImprovementFormField.description]}
                            </HelperText>
                        </>
                    )}
                </>
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
                visible={!!props.formikProps.errors[OutcomeFormField.outcome]}
            >
                {props.formikProps.errors[OutcomeFormField.outcome]}
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

    const [activeStep, setActiveStep] = useState<number>(0);

    const [enabledSteps, setEnabledSteps] = useState<FormField[]>([]);
    const zones = useZones();

    const isFinalStep = activeStep === enabledSteps.length && activeStep !== 0;

    const focuses: { [key: string]: IVisitForm } = {
        [FormField.health]: {
            label: `${fieldLabels[FormField.health]} Visit`,
            Form: (formikProps) => healthVisitForm(formikProps, visitTypes[0]),
            validationSchema: () => visitTypeValidationSchema(visitTypes[0]),
        },
        [FormField.education]: {
            label: `${fieldLabels[FormField.education]} Visit`,
            Form: (formikProps) => educationVisitForm(formikProps, visitTypes[1]),
            validationSchema: () => visitTypeValidationSchema(visitTypes[1]),
        },
        [FormField.social]: {
            label: `${fieldLabels[FormField.social]} Visit`,
            Form: (formikProps) => educationVisitForm(formikProps, visitTypes[2]),
            validationSchema: () => visitTypeValidationSchema(visitTypes[2]),
        },
    };

    const surveySteps: IVisitForm[] = [
        {
            label: "Visit Focus",
            Form: visitReasonStepCallBack(setEnabledSteps, zones),
            validationSchema: initialValidationSchema,
        },
        ...enabledSteps.map((visitType) => ({
            label: focuses[visitType].label,
            Form: focuses[visitType].Form,
            validationSchema: focuses[visitType].validationSchema,
        })),
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
            validationSchema={surveySteps[activeStep].validationSchema}
            onSubmit={nextStep}
            enableReinitialize
        >
            {(formikProps) => (
                <>
                    <Appbar.Header>
                        <Appbar.BackAction />
                        <Appbar.Content title={"Visit Survey"} />
                    </Appbar.Header>

                    <View style={styles.container}>
                        <ProgressSteps key={surveySteps} {...progressStepsStyle}>
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
                                        style={{ flex: 1, backgroundColor: "#000000" }}
                                    >
                                        <ScrollView>
                                            <surveyStep.Form formikProps={formikProps} />
                                        </ScrollView>
                                    </ProgressStep>
                                );
                            })}
                        </ProgressSteps>
                    </View>
                </>
            )}
        </Formik>
    );
};

export default NewVisit;
