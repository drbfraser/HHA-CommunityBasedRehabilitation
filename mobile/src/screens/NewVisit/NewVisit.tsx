import React, { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { Text, Appbar, Divider, TextInput, HelperText } from "react-native-paper";
import { ProgressSteps, ProgressStep } from "react-native-progress-steps";
import { FieldArray, Formik, FormikHelpers, FormikProps } from "formik";
import TextPicker from "../../components/TextPicker/TextPicker";
import TextCheckBox from "../../components/TextCheckBox/TextCheckBox";
import { themeColors, useZones, TZoneMap, IRisk, Endpoint, apiFetch, IClient } from "@cbr/common";
import { StackParamList } from "../../util/stackScreens";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackScreenName } from "../../util/StackScreenName";
import { RouteProp } from "@react-navigation/native";

import {
    visitFieldLabels,
    VisitFormField,
    ImprovementFormField,
    OutcomeFormField,
    visitInitialValues,
    provisionals,
    initialValidationSchema,
    visitTypeValidationSchema,
    GoalStatus,
} from "@cbr/common";

import { handleSubmit } from "./formHandler";

import useStyles, { defaultScrollViewProps, progressStepsStyle } from "./NewVisit.style";
import { useParams } from "react-router-dom";

interface IFormProps {
    formikProps: FormikProps<any>;
}

interface INewVisitProps {
    clientID: number;
    route: RouteProp<StackParamList, StackScreenName.VISIT>;
    navigation: StackNavigationProp<StackParamList, StackScreenName.VISIT>;
}

const visitTypes: VisitFormField[] = [
    VisitFormField.health,
    VisitFormField.education,
    VisitFormField.social,
];

const ImprovementField = (props: {
    formikProps: FormikProps<any>;
    visitType: string;
    provided: string;
    index: number;
}) => {
    const fieldName = `${VisitFormField.improvements}.${props.visitType}.${props.index}`;
    const isImprovementEnabled =
        props.formikProps.values[VisitFormField.improvements][props.visitType][props.index]?.[
            ImprovementFormField.enabled
        ] === true;
    const styles = useStyles();
    useEffect(() => {
        if (
            props.formikProps.values[VisitFormField.improvements][props.visitType][props.index] ===
            undefined
        ) {
            // Since this component is dynamically generated we need to set its initial values
            props.formikProps.setFieldValue(`${fieldName}`, {
                [ImprovementFormField.enabled]: false,
                [ImprovementFormField.description]: "",
                [ImprovementFormField.riskType]: props.visitType,
                [ImprovementFormField.provided]: props.provided,
            });
        }
    });

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
                        label={visitFieldLabels[ImprovementFormField.description]}
                        value={
                            props.formikProps.values[VisitFormField.improvements][props.visitType][
                                props.index
                            ][ImprovementFormField.description]
                        }
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
    visitType: VisitFormField;
    risks: IRisk[];
    formikProps: FormikProps<any>;
}) => {
    const fieldName = `${VisitFormField.outcomes}.${props.visitType}`;
    const styles = useStyles();

    return (
        <View>
            <Text style={styles.pickerQuestion}>
                Client's {visitFieldLabels[props.visitType]} Goal
            </Text>
            <Text style={styles.normalInput}>
                {props.risks.find((r) => r.risk_type === (props.visitType as string))?.goal}
            </Text>
            <Text style={styles.pickerQuestion}>
                Client's {visitFieldLabels[props.visitType]} Goal Status
            </Text>
            <TextPicker
                field={`${fieldName}.${OutcomeFormField.goalStatus}`}
                choices={Object.values(GoalStatus).map((status) => ({
                    label: visitFieldLabels[status],
                    value: status,
                }))}
                selectedValue={
                    props.formikProps.values[VisitFormField.outcomes][props.visitType][
                        OutcomeFormField.goalStatus
                    ]
                }
                setFieldValue={props.formikProps.setFieldValue}
                setFieldTouched={props.formikProps.setFieldTouched}
            />

            <View>
                <Text style={styles.pickerQuestion}>What is the Outcome of the Goal?</Text>
                <TextInput
                    mode="outlined"
                    label={visitFieldLabels[OutcomeFormField.outcome]}
                    value={
                        props.formikProps.values[VisitFormField.outcomes][props.visitType][
                            OutcomeFormField.outcome
                        ]
                    }
                    onChangeText={(value) => {
                        props.formikProps.setFieldValue(
                            `${fieldName}.${OutcomeFormField.outcome}`,
                            value
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
    (setEnabledSteps: React.Dispatch<React.SetStateAction<VisitFormField[]>>, zones: TZoneMap) =>
    ({ formikProps }: IFormProps) =>
        visitFocusForm(formikProps, setEnabledSteps, zones);

const visitFocusForm = (
    formikProps: FormikProps<any>,
    setEnabledSteps: React.Dispatch<React.SetStateAction<VisitFormField[]>>,
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
            formikProps.setFieldValue(`${VisitFormField.outcomes}.${visitType}`, {
                [OutcomeFormField.riskType]: visitType,
                [OutcomeFormField.goalStatus]: GoalStatus.ongoing,
                [OutcomeFormField.outcome]: "",
            });
        } else {
            formikProps.setFieldValue(`${VisitFormField.outcomes}.${visitType}`, undefined);
        }
    };
    return (
        <View>
            <Text style={styles.pickerQuestion}>Where was the Visit? </Text>
            <Text />
            <TextInput
                mode="outlined"
                label={visitFieldLabels[VisitFormField.village]}
                value={formikProps.values[VisitFormField.village]}
                onChangeText={(value) => formikProps.setFieldValue(VisitFormField.village, value)}
            />

            <HelperText
                style={styles.errorText}
                type="error"
                visible={!!formikProps.errors[VisitFormField.village]}
            >
                {formikProps.errors[VisitFormField.village]}
            </HelperText>

            <TextPicker
                field={VisitFormField.zone}
                choices={Array.from(zones.entries()).map(([key, value]) => ({
                    label: value,
                    value: key,
                }))}
                selectedValue={formikProps.values[VisitFormField.zone]}
                setFieldValue={formikProps.setFieldValue}
                setFieldTouched={formikProps.setFieldTouched}
            />

            <HelperText
                style={styles.errorText}
                type="error"
                visible={!!formikProps.errors[VisitFormField.zone]}
            >
                {formikProps.errors[VisitFormField.zone]}
            </HelperText>

            <Text style={styles.pickerQuestion}>Select the Reasons for the Visit </Text>
            {visitTypes.map((visitType) => (
                <TextCheckBox
                    key={visitType}
                    field={visitType}
                    value={formikProps.values[visitType]}
                    label={visitFieldLabels[visitType]}
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

const VisitTypeStep = (visitType: VisitFormField, risks: IRisk[]) => {
    const styles = useStyles();

    return ({ formikProps }: IFormProps) => {
        return (
            <View>
                <Text style={styles.pickerQuestion}>Select an Improvement</Text>
                <FieldArray
                    name={VisitFormField.improvements}
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

const NewVisit = (props: INewVisitProps) => {
    const [loadingError, setLoadingError] = useState(false);
    const styles = useStyles();
    const zones = useZones();
    const [submissionError, setSubmissionError] = useState(false);
    const [activeStep, setActiveStep] = useState<number>(0);
    const [enabledSteps, setEnabledSteps] = useState<VisitFormField[]>([]);
    const [checkedSteps, setCheckedSteps] = useState<VisitFormField[]>([]);

    const [risks, setRisks] = useState<IRisk[]>([]);
    const isFinalStep = activeStep === enabledSteps.length && activeStep !== 0;
    const [saveError, setSaveError] = useState<string>();
    const clientId = props.route.params.clientID;

    // For test
    // TODO: Change it back after connect to the client detail screen
    useEffect(() => {
        apiFetch(Endpoint.CLIENT, `${clientId}`)
            .then((resp) => resp.json())
            .then((client: IClient) => {
                client.risks.sort((a: IRisk, b: IRisk) => b.timestamp - a.timestamp);
                setRisks(client.risks);
            })
            .catch(() => {
                setLoadingError(true);
            });
    }, [clientId]);

    useEffect(() => {
        props.navigation.setOptions({
            headerShown: true,
            header: (stackHeaderProps) => (
                <Appbar.Header statusBarHeight={0}>
                    <Appbar.BackAction onPress={() => stackHeaderProps.navigation.goBack()} />
                    <Appbar.Content title="New Visit" subtitle={"Client ID: " + clientId} />
                </Appbar.Header>
            ),
        });
    }, []);

    const visitSteps = [
        {
            label: "Visit Focus",
            Form: visitReasonStepCallBack(setEnabledSteps, zones),
            validationSchema: initialValidationSchema,
        },
        ...enabledSteps.map((visitType) => ({
            label: `${visitFieldLabels[visitType]} Visit`,
            Form: VisitTypeStep(visitType, risks),
            validationSchema: visitTypeValidationSchema(visitType),
        })),
    ];
    const prevStep = () => setActiveStep(activeStep - 1);

    const nextStep = (values: any, helpers: FormikHelpers<any>) => {
        if (isFinalStep) {
            setSaveError(undefined);
            handleSubmit(values, helpers, setSubmissionError)
                .then(() => {
                    props.navigation.navigate(StackScreenName.CLIENT, {
                        clientID: clientId,
                    });
                })
                .catch((e) => {
                    setSaveError(`${e}`);
                    helpers.setSubmitting(false);
                    setSubmissionError(true);
                });
            setCheckedSteps([]);
        } else {
            if (activeStep === 0) {
                helpers.setFieldValue(`${[VisitFormField.client]}`, `${clientId}`);
            }
            checkedSteps.push(enabledSteps[activeStep - 1]);
            if (!checkedSteps.includes(enabledSteps[activeStep - 1])) {
                helpers.setTouched({});
            }

            setActiveStep(activeStep + 1);
            helpers.setSubmitting(false);
        }
    };

    return (
        <Formik
            initialValues={visitInitialValues}
            validationSchema={visitSteps[activeStep].validationSchema}
            onSubmit={nextStep}
            enableReinitialize
        >
            {(formikProps) => (
                <>
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
                                            enabledSteps.length === 0 ||
                                            (enabledSteps[activeStep - 1] !== undefined
                                                ? !checkedSteps.includes(
                                                      enabledSteps[activeStep - 1]
                                                  )
                                                    ? Object.keys(formikProps.errors).length !==
                                                          0 ||
                                                      Object.keys(formikProps.touched).length === 0
                                                    : Object.keys(formikProps.errors).length !== 0
                                                : Object.keys(formikProps.errors).length !== 0)
                                        }
                                        onPrevious={prevStep}
                                        onSubmit={() => nextStep(formikProps.values, formikProps)}
                                    >
                                        <Text style={styles.stepLabelText}>{surveyStep.label}</Text>
                                        <Divider
                                            style={{
                                                backgroundColor: themeColors.blueBgDark,
                                            }}
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
