import React, { useContext, useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { Divider, HelperText, Text, TextInput } from "react-native-paper";
import { ProgressStep, ProgressSteps } from "react-native-progress-steps";
import { FieldArray, Formik, FormikHelpers, FormikProps } from "formik";
import TextCheckBox from "../../components/TextCheckBox/TextCheckBox";
import {
    apiFetch,
    APIFetchFailError,
    countObjectKeys,
    Endpoint,
    GoalStatus,
    IClient,
    ImprovementFormField,
    initialValidationSchema,
    IRisk,
    OutcomeFormField,
    provisionals,
    themeColors,
    TZoneMap,
    useCurrentUser,
    useZones,
    visitFieldLabels,
    VisitFormField,
    visitInitialValues,
    visitTypeValidationSchema,
} from "@cbr/common";
import { StackParamList } from "../../util/stackScreens";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackScreenName } from "../../util/StackScreenName";
import { RouteProp } from "@react-navigation/native";

import { handleSubmit } from "./formHandler";

import useStyles, { defaultScrollViewProps, progressStepsStyle } from "./NewVisit.style";
import Alert from "../../components/Alert/Alert";
import ConfirmDialogWithNavListener from "../../components/DiscardDialogs/ConfirmDialogWithNavListener";
import FormikExposedDropdownMenu from "../../components/ExposedDropdownMenu/FormikExposedDropdownMenu";
import { useDatabase } from "@nozbe/watermelondb/hooks";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import { modelName } from "../../models/constant";
import { SyncContext } from "../../context/SyncContext/SyncContext";

interface IFormProps {
    formikProps: FormikProps<any>;
}

interface INewVisitProps {
    clientID: string;
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
                setFieldTouched={props.formikProps.setFieldTouched}
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

            <FormikExposedDropdownMenu
                field={`${fieldName}.${OutcomeFormField.goalStatus}`}
                valuesType="record-string"
                values={Object.values(GoalStatus).reduce((accumulator, currentGoalStatus) => {
                    accumulator[currentGoalStatus] = visitFieldLabels[currentGoalStatus];
                    return accumulator;
                }, {})}
                currentValueOverride={
                    props.formikProps.values[VisitFormField.outcomes][props.visitType][
                        OutcomeFormField.goalStatus
                    ]
                }
                formikProps={props.formikProps}
                fieldLabels={visitFieldLabels}
                mode="outlined"
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
                        props.formikProps.setFieldTouched(
                            `${fieldName}.${OutcomeFormField.outcome}`,
                            true
                        );
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
        VisitFocusForm(formikProps, setEnabledSteps, zones);

const VisitFocusForm = (
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

            <FormikExposedDropdownMenu
                field={VisitFormField.zone}
                valuesType="map"
                values={zones}
                formikProps={formikProps}
                fieldLabels={visitFieldLabels}
                mode="outlined"
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
                    setFieldTouched={formikProps.setFieldTouched}
                    onChange={(value: boolean) => onCheckboxChange(value, visitType)}
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
    const authContext = useContext(AuthContext);
    const user =
        authContext.authState.state === "loggedIn" ? authContext.authState.currentUser : null;
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
    const database = useDatabase();
    const { autoSync, cellularSync } = useContext(SyncContext);

    const getClientDetails = async () => {
        try {
            const fetchedClient: any = await database.get(modelName.clients).find(clientId);
            fetchedClient.risks.fetch().then((risk) => {
                risk.sort((a: any, b: any) => b.timestamp - a.timestamp);
                setRisks(risk);
            });
        } catch (e) {
            setLoadingError(true);
        }
    };

    useEffect(() => {
        authContext.requireLoggedIn(true);
    }, []);

    useEffect(() => {
        getClientDetails();
    }, [clientId]);

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

    const prevStep = (props: any) => {
        if (countObjectKeys(props.errors) !== 0) {
            const arr = checkedSteps.filter((item) => {
                return item != enabledSteps[activeStep - 1];
            });
            setCheckedSteps(arr);
        } else {
            checkedSteps.push(enabledSteps[activeStep - 1]);
        }
        setActiveStep(activeStep - 1);
        props.setErrors({});
    };

    const [hasSubmitted, setHasSubmitted] = useState(false);

    const nextStep = (values: any, helpers: FormikHelpers<any>) => {
        if (isFinalStep) {
            setSaveError(undefined);
            handleSubmit(values, helpers, user!.id, database, autoSync, cellularSync)
                .then(() => {
                    setHasSubmitted(true);
                    props.navigation.navigate(StackScreenName.CLIENT, {
                        clientID: clientId,
                    });
                })
                .catch((e) => {
                    setSaveError(
                        e instanceof APIFetchFailError ? e.buildFormError(visitFieldLabels) : `${e}`
                    );
                    helpers.setSubmitting(false);
                    setSubmissionError(true);
                });
            setCheckedSteps([]);
        } else {
            if (activeStep === 0) {
                helpers.setFieldValue(`${[VisitFormField.client_id]}`, `${clientId}`);
            }
            if (!checkedSteps.includes(enabledSteps[activeStep - 1])) {
                checkedSteps.push(enabledSteps[activeStep - 1]);
            }
            setCheckedSteps([...new Set(checkedSteps)]);

            setActiveStep(activeStep + 1);
            helpers.setSubmitting(false);
            helpers.setTouched({});
        }
    };

    return (
        <>
            <ConfirmDialogWithNavListener
                bypassDialog={hasSubmitted}
                confirmButtonText="Discard"
                dialogContent="Discard this new visit?"
            />
            <Formik
                initialValues={visitInitialValues}
                validationSchema={visitSteps[activeStep].validationSchema}
                onSubmit={nextStep}
                enableReinitialize
            >
                {(formikProps) => (
                    <>
                        <View style={styles.container}>
                            {saveError && (
                                <Alert
                                    style={styles.errorAlert}
                                    severity="error"
                                    text={saveError}
                                    onClose={() => setSaveError(undefined)}
                                />
                            )}
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
                                                formikProps.isSubmitting ||
                                                enabledSteps.length === 0 ||
                                                (enabledSteps[activeStep - 1] !== undefined &&
                                                    (!checkedSteps.includes(
                                                        enabledSteps[activeStep - 1]
                                                    )
                                                        ? countObjectKeys(formikProps.errors) !==
                                                              0 ||
                                                          Object.keys(formikProps.touched)
                                                              .length === 0
                                                        : countObjectKeys(formikProps.errors) !==
                                                          0))
                                            }
                                            previousBtnDisabled={formikProps.isSubmitting}
                                            onPrevious={() => prevStep(formikProps)}
                                            onSubmit={() =>
                                                nextStep(formikProps.values, formikProps)
                                            }
                                        >
                                            <Text style={styles.stepLabelText}>
                                                {surveyStep.label}
                                            </Text>
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
        </>
    );
};

export default NewVisit;
