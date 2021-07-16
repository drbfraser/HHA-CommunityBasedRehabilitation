import React, { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { Text, Appbar, Divider, TextInput, HelperText } from "react-native-paper";
import { ProgressSteps, ProgressStep } from "react-native-progress-steps";
import { FieldArray, Formik, FormikHelpers, FormikProps } from "formik";
import TextPicker from "../../components/TextPicker/TextPicker";
import TextCheckBox from "../../components/TextCheckBox/TextCheckBox";
import { themeColors, useZones, TZoneMap, IRisk, Endpoint, apiFetch, IClient } from "@cbr/common";

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
import useStyles, { defaultScrollViewProps, progressStepsStyle } from "./NewVisit.style";
import { useParams } from "react-router-dom";

interface IFormProps {
    formikProps: FormikProps<any>;
}

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
    const styles = useStyles();

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
        <View>
            <TextCheckBox
                key={fieldName}
                field={`${fieldName}.${ImprovementFormField.enabled}`}
                value={isImprovementEnabled}
                label={props.provided}
                setFieldValue={props.formikProps.setFieldValue}
            />

            {isImprovementEnabled && (
                <>
                    <TextInput
                        mode="outlined"
                        key={`${props.provided}${ImprovementFormField.description}`}
                        label={fieldLabels[ImprovementFormField.description]}
                        value={
                            props.formikProps.values[FormField.improvements][props.visitType][
                                props.index
                            ][ImprovementFormField.description]
                        }
                        multiline={true}
                        onChangeText={(value) => {
                            props.formikProps.setFieldTouched(
                                `${fieldName}.${ImprovementFormField.description}`,
                                true
                            );

                            props.formikProps.setFieldValue(
                                `${fieldName}.${ImprovementFormField.description}`,
                                value
                            );
                        }}
                    />
                    <HelperText
                        style={styles.errorText}
                        type="error"
                        visible={
                            !!props.formikProps.errors[
                                `${fieldName}.${ImprovementFormField.description}`
                            ]
                        }
                    >
                        {
                            props.formikProps.errors[
                                `${fieldName}.${ImprovementFormField.description}`
                            ]
                        }
                    </HelperText>
                </>
            )}
        </View>
    );
};

const OutcomeField = (props: {
    visitType: FormField;
    risks: IRisk[];
    formikProps: FormikProps<any>;
}) => {
    const fieldName = `${FormField.outcomes}.${props.visitType}`;
    const styles = useStyles();

    return (
        <View>
            <Text>Client's {fieldLabels[props.visitType]} Goal</Text>
            <Text>
                {props.risks.find((r) => r.risk_type === (props.visitType as string))?.goal}
            </Text>
            <Text>Client's {fieldLabels[props.visitType]} Goal Status</Text>
            <TextPicker
                field={`${fieldName}.${OutcomeFormField.goalStatus}`}
                choices={Object.values(GoalStatus).map((status) => ({
                    label: fieldLabels[status],
                    value: status,
                }))}
                selectedValue={
                    props.formikProps.values[FormField.outcomes][props.visitType][
                        OutcomeFormField.goalStatus
                    ]
                }
                setFieldValue={props.formikProps.setFieldValue}
                setFieldTouched={props.formikProps.setFieldTouched}
            />

            <View>
                <Text>What is the Outcome of the Goal?</Text>
                <TextInput
                    mode="outlined"
                    label={fieldLabels[OutcomeFormField.outcome]}
                    value={
                        props.formikProps.values[FormField.outcomes][props.visitType][
                            OutcomeFormField.outcome
                        ]
                    }
                    onChangeText={(value) => {
                        props.formikProps.setFieldValue(
                            `${fieldName}.${OutcomeFormField.outcome}`,
                            value
                        );
                        props.formikProps.setFieldTouched(
                            `${fieldName}.${OutcomeFormField.outcome}`,
                            true
                        );
                    }}
                />
                <HelperText
                    style={styles.errorText}
                    type="error"
                    visible={!!props.formikProps.errors[`${fieldName}.${OutcomeFormField.outcome}`]}
                >
                    {props.formikProps.errors[`${fieldName}.${OutcomeFormField.outcome}`]}
                </HelperText>
            </View>
        </View>
    );
};

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
    const onCheckboxChange = (checked: boolean, visitType: string) => {
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
                style={styles.errorText}
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
                style={styles.errorText}
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
                    onChange={(value: boolean) => {
                        formikProps.setFieldTouched(visitType, true);
                        onCheckboxChange(value, visitType);
                    }}
                />
            ))}
        </View>
    );
};

// const healthVisitForm = (props: IFormProps, visitType: FormField) => {
//     const styles = useStyles();
//     return (
//         <View style={styles.viewPadding}>
//             <Text style={styles.pickerQuestion}>{"\n"}Select an Improvement </Text>
//             {provisionals[visitType].map((visitType) => (
//                 <>
//                     <TextCheckBox
//                         key={visitType}
//                         field={visitType}
//                         value={props.formikProps.values[visitType]}
//                         label={visitType}
//                         setFieldValue={props.formikProps.setFieldValue}
//                     />

//                     {props.formikProps.values[visitType] && (
//                         <>
//                             <TextInput
//                                 key={"unselectable"}
//                                 mode="outlined"
//                                 label={fieldLabels[ImprovementFormField.description]}
//                                 value={props.formikProps.values[ImprovementFormField.description]}
//                                 onChangeText={(value) => {
//                                     props.formikProps.setFieldTouched(
//                                         ImprovementFormField.description,
//                                         true
//                                     );

//                                     props.formikProps.setFieldValue(
//                                         ImprovementFormField.description,
//                                         value
//                                     );
//                                 }}
//                             />
//                             <HelperText
//                                 // style={styles.errorText}
//                                 type="error"
//                                 visible={
//                                     !!props.formikProps.errors[ImprovementFormField.description]
//                                 }
//                             >
//                                 {props.formikProps.errors[ImprovementFormField.description]}
//                             </HelperText>
//                         </>
//                     )}
//                 </>
//             ))}

//             <Text style={styles.pickerQuestion}>{"\n"}Client's Health Goal </Text>
//             <Text style={styles.normalInput}>{"\n"}Improved Learning </Text>
//             <Text style={styles.pickerQuestion}>{"\n"}Client's Health Goal Status </Text>

//             <TextPicker
//                 field={OutcomeFormField.goalStatus}
//                 choices={Object.values(GoalStatus).map((status) => ({
//                     label: fieldLabels[status],
//                     value: status,
//                 }))}
//                 selectedValue={props.formikProps.values[OutcomeFormField.goalStatus]}
//                 setFieldValue={props.formikProps.setFieldValue}
//                 setFieldTouched={props.formikProps.setFieldTouched}
//             />

//             <Text style={styles.pickerQuestion}>{"\n"}What is the Outcome of the Goal? </Text>

//             <TextInput
//                 mode="outlined"
//                 label={fieldLabels[OutcomeFormField.outcome]}
//                 value={props.formikProps.values[OutcomeFormField.outcome]}
//                 onChangeText={(value) =>
//                     props.formikProps.setFieldValue(OutcomeFormField.outcome, value)
//                 }
//             />
//             <HelperText
//                 style={styles.errorText}
//                 type="error"
//                 visible={!!props.formikProps.errors[OutcomeFormField.outcome]}
//             >
//                 {props.formikProps.errors[OutcomeFormField.outcome]}
//             </HelperText>
//         </View>
//     );
// };

// const educationVisitForm = (props: IFormProps, visitType: FormField) => {
//     const styles = useStyles();
//     return (
//         <View>
//             <Text style={styles.pickerQuestion}>{"\n"}Select an Improvement </Text>
//             {provisionals[visitType].map((visitType) => (
//                 <>
//                     <TextCheckBox
//                         key={visitType}
//                         field={visitType}
//                         value={props.formikProps.values[visitType]}
//                         label={visitType}
//                         setFieldValue={props.formikProps.setFieldValue}
//                     />

//                     {props.formikProps.values[visitType] && (
//                         <>
//                             <TextInput
//                                 // key={"unselectable"}
//                                 mode="outlined"
//                                 label={fieldLabels[ImprovementFormField.description]}
//                                 value={props.formikProps.values[ImprovementFormField.description]}
//                                 onChangeText={(value) => {
//                                     props.formikProps.setFieldTouched(
//                                         ImprovementFormField.description,
//                                         true
//                                     );

//                                     props.formikProps.setFieldValue(
//                                         ImprovementFormField.description,
//                                         value
//                                     );
//                                 }}
//                             />
//                             <HelperText
//                                 // style={styles.errorText}
//                                 type="error"
//                                 visible={
//                                     !!props.formikProps.errors[ImprovementFormField.description]
//                                 }
//                             >
//                                 {props.formikProps.errors[ImprovementFormField.description]}
//                             </HelperText>
//                         </>
//                     )}
//                 </>
//             ))}
//             <Text style={styles.pickerQuestion}>{"\n"}Client's Education Goal </Text>
//             <Text style={styles.normalInput}>{"\n"}Additional Mobility </Text>
//             <Text style={styles.pickerQuestion}>{"\n"}Client's Education Goal Status </Text>
//             <TextPicker
//                 field={OutcomeFormField.goalStatus}
//                 choices={Object.values(GoalStatus).map((status) => ({
//                     label: fieldLabels[status],
//                     value: status,
//                 }))}
//                 selectedValue={props.formikProps.values[OutcomeFormField.goalStatus]}
//                 setFieldValue={props.formikProps.setFieldValue}
//                 setFieldTouched={props.formikProps.setFieldTouched}
//             />

//             <Text style={styles.pickerQuestion}>{"\n"}What is the Outcome of the Goal? </Text>

//             <TextInput
//                 mode="outlined"
//                 label={fieldLabels[OutcomeFormField.outcome]}
//                 value={props.formikProps.values[OutcomeFormField.outcome]}
//                 onChangeText={(value) =>
//                     props.formikProps.setFieldValue(OutcomeFormField.outcome, value)
//                 }
//             />
//             <HelperText
//                 // style={styles.errorText}
//                 type="error"
//                 visible={!!props.formikProps.errors[OutcomeFormField.outcome]}
//             >
//                 {props.formikProps.errors[OutcomeFormField.outcome]}
//             </HelperText>
//         </View>
//     );
// };

// const socialVisitForm = (props: IFormProps, visitType: FormField) => {
//     const styles = useStyles();
//     return (
//         <View>
//             <Text style={styles.pickerQuestion}>{"\n"}Select an Improvement </Text>
//             {provisionals[visitType].map((visitType) => (
//                 <>
//                     <TextCheckBox
//                         key={visitType}
//                         field={visitType}
//                         value={props.formikProps.values[visitType]}
//                         label={visitType}
//                         setFieldValue={props.formikProps.setFieldValue}
//                     />

//                     {props.formikProps.values[visitType] && (
//                         <>
//                             <TextInput
//                                 // key={"unselectable"}
//                                 mode="outlined"
//                                 label={fieldLabels[ImprovementFormField.description]}
//                                 value={props.formikProps.values[ImprovementFormField.description]}
//                                 onChangeText={(value) => {
//                                     props.formikProps.setFieldTouched(
//                                         ImprovementFormField.description,
//                                         true
//                                     );

//                                     props.formikProps.setFieldValue(
//                                         ImprovementFormField.description,
//                                         value
//                                     );
//                                 }}
//                             />
//                             <HelperText
//                                 style={styles.errorText}
//                                 type="error"
//                                 visible={
//                                     !!props.formikProps.errors[ImprovementFormField.description]
//                                 }
//                             >
//                                 {props.formikProps.errors[ImprovementFormField.description]}
//                             </HelperText>
//                         </>
//                     )}
//                 </>
//             ))}
//             <Text style={styles.pickerQuestion}>{"\n"}Client's Social Goal </Text>
//             <Text style={styles.normalInput}>{"\n"}Full Recovery </Text>
//             <Text style={styles.pickerQuestion}>{"\n"}Client's Social Goal Status </Text>
//             <TextPicker
//                 field={OutcomeFormField.goalStatus}
//                 choices={Object.values(GoalStatus).map((status) => ({
//                     label: fieldLabels[status],
//                     value: status,
//                 }))}
//                 selectedValue={props.formikProps.values[OutcomeFormField.goalStatus]}
//                 setFieldValue={props.formikProps.setFieldValue}
//                 setFieldTouched={props.formikProps.setFieldTouched}
//             />

//             <Text style={styles.pickerQuestion}>{"\n"}What is the Outcome of the Goal? </Text>

//             <TextInput
//                 mode="outlined"
//                 label={fieldLabels[OutcomeFormField.outcome]}
//                 value={props.formikProps.values[OutcomeFormField.outcome]}
//                 onChangeText={(value) =>
//                     props.formikProps.setFieldValue(OutcomeFormField.outcome, value)
//                 }
//             />
//             <HelperText
//                 style={styles.errorText}
//                 type="error"
//                 visible={!!props.formikProps.errors[OutcomeFormField.outcome]}
//             >
//                 {props.formikProps.errors[OutcomeFormField.outcome]}
//             </HelperText>
//         </View>
//     );
// };

const NewVisit = () => {
    const [loadingError, setLoadingError] = useState(false);
    const styles = useStyles();
    const zones = useZones();
    const [submissionError, setSubmissionError] = useState(false);
    const [stepChecked, setStepChecked] = useState([false]);
    const [activeStep, setActiveStep] = useState<number>(0);
    const [enabledSteps, setEnabledSteps] = useState<FormField[]>([]);
    const [risks, setRisks] = useState<IRisk[]>([]);
    const isFinalStep = activeStep === enabledSteps.length && activeStep !== 0;
    // const { clientId } = useParams<{ clientId: string }>();

    // For test
    // TODO: Change it back after connect to the client detail screen
    useEffect(() => {
        apiFetch(Endpoint.CLIENT, "1")
            .then((resp) => resp.json())
            .then((client: IClient) => {
                client.risks.sort((a: IRisk, b: IRisk) => b.timestamp - a.timestamp);
                setRisks(client.risks);
            })
            .catch(() => {
                setLoadingError(true);
            });
    }, [1]);

    const VisitTypeStep = (visitType: FormField, risks: IRisk[]) => {
        return ({ formikProps }: IFormProps) => {
            return (
                <View>
                    <Text>Select an Improvement</Text>
                    <FieldArray
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
                    />

                    <OutcomeField visitType={visitType} risks={risks} formikProps={formikProps} />
                </View>
            );
        };
    };
    const visitSteps = [
        {
            label: "Visit Focus",
            Form: visitReasonStepCallBack(setEnabledSteps, zones),
            validationSchema: initialValidationSchema,
        },
        ...enabledSteps.map((visitType) => ({
            label: `${fieldLabels[visitType]} Visit`,
            Form: VisitTypeStep(visitType, risks),
            validationSchema: visitTypeValidationSchema(visitType),
        })),
    ];

    const prevStep = () => setActiveStep(activeStep - 1);
    const nextStep = (values: any, helpers: FormikHelpers<any>) => {
        if (isFinalStep) {
            handleSubmit(values, helpers, setSubmissionError);
        } else {
            if (activeStep === 0) {
                if (stepChecked.length < enabledSteps.length - 1) {
                    for (let i = 1; i < enabledSteps.length - 1; i++) {
                        stepChecked.push(false);
                    }
                }
                // TODO: Change back when it is connected to the client detail
                helpers.setFieldValue(`${[FormField.client]}`, 1);
                // helpers.setFieldValue(`${[FormField.client]}`, clientId);
            }
            helpers.setTouched({});
            let newArr = [...stepChecked];
            newArr[activeStep] = true;
            setStepChecked(newArr);
            setActiveStep(activeStep + 1);
            helpers.setSubmitting(false);
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={visitSteps[activeStep].validationSchema}
            onSubmit={nextStep}
            enableReinitialize
        >
            {(formikProps) => (
                <>
                    <Appbar.Header>
                        <Appbar.BackAction />
                        <Appbar.Content title={"New Visit"} />
                    </Appbar.Header>

                    <View style={styles.container}>
                        <ProgressSteps key={visitSteps} {...progressStepsStyle}>
                            {visitSteps.map((surveyStep, index) => {
                                return (
                                    <ProgressStep
                                        key={index}
                                        scrollViewProps={defaultScrollViewProps}
                                        previousBtnTextStyle={styles.buttonTextStyle}
                                        nextBtnTextStyle={styles.buttonTextStyle}
                                        nextBtnStyle={styles.nextButton}
                                        previousBtnStyle={styles.prevButton}
                                        onNext={() => {
                                            nextStep(formikProps.values, formikProps);
                                        }}
                                        nextBtnDisabled={
                                            !stepChecked[activeStep]
                                                ? Object.keys(formikProps.errors).length !== 0 ||
                                                  Object.keys(formikProps.touched).length === 0
                                                : false
                                        }
                                        onPrevious={prevStep}
                                        onSubmit={() => nextStep(formikProps.values, formikProps)}
                                    >
                                        <Text style={styles.stepLabelText}>{surveyStep.label}</Text>
                                        <Divider
                                            style={{ backgroundColor: themeColors.blueBgDark }}
                                        />
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
