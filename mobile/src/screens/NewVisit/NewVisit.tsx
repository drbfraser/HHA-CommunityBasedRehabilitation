import React, { useContext, useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { Divider, HelperText, Text, TextInput } from "react-native-paper";
import { ProgressStep, ProgressSteps } from "react-native-progress-steps";
import { FieldArray, Formik, FormikHelpers, FormikProps, getIn } from "formik";
import TextCheckBox from "../../components/TextCheckBox/TextCheckBox";
import {
    APIFetchFailError,
    countObjectKeys,
    ImprovementFormField,
    initialValidationSchema,
    IRisk,
    provisionals,
    themeColors,
    TZoneMap,
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
import { useTranslation } from "react-i18next";
import i18n from "i18next";

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
    VisitFormField.nutrition,
    VisitFormField.mental,
];

const ImprovementField = (props: {
    formikProps: FormikProps<any>;
    visitType: string;
    provided: string;
    index: number;
}) => {
    const fieldName = `${VisitFormField.improvements}.${props.visitType}.${props.index}`;
    const section =
        props.formikProps.values?.[VisitFormField.improvements]?.[props.visitType] ?? [];
    const item = section[props.index];
    const isImprovementEnabled = item?.[ImprovementFormField.enabled] === true;
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

    // get Formik error values
    const path = `${VisitFormField.improvements}.${props.visitType}[${props.index}].${ImprovementFormField.description}`;
    const errorMessage = getIn(props.formikProps.errors, path);
    const touched = getIn(props.formikProps.touched, path);

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
                        label={visitFieldLabels[ImprovementFormField.description] + "*"}
                        value={
                            props.formikProps.values[VisitFormField.improvements][props.visitType][
                                props.index
                            ][ImprovementFormField.description]
                        }
                        error={!!errorMessage && !!touched}
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
                        onBlur={() => {
                            props.formikProps.setFieldTouched(
                                `${fieldName}.${ImprovementFormField.description}`,
                                true
                            );
                        }}
                    />
                    <HelperText
                        style={styles.errorText}
                        type="error"
                        visible={!!errorMessage && !!touched}
                    >
                        {errorMessage}
                    </HelperText>
                </>
            )}
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
    const { t } = useTranslation();
    const styles = useStyles();

    const onCheckboxChange = (checked: boolean, visitType: VisitFormField) => {
        setEnabledSteps(
            visitTypes.filter(
                (type) =>
                    (formikProps.values[type] && type !== visitType) ||
                    (checked && type === visitType)
            )
        );

        if (checked) {
            // Seed improvements for this visit type from provisionals (string list)
            const providedList: string[] = provisionals[visitType] ?? [];
            const seeded = providedList.map((provided) => ({
                [ImprovementFormField.enabled]: false,
                [ImprovementFormField.description]: "",
                [ImprovementFormField.riskType]: visitType,
                [ImprovementFormField.provided]: provided,
            }));

            // Ensure the parent object exists, then set the array
            if (!formikProps.values[VisitFormField.improvements]) {
                formikProps.setFieldValue(VisitFormField.improvements, {});
            }
            formikProps.setFieldValue(`${VisitFormField.improvements}.${visitType}`, seeded);
        } else {
            // Clear on uncheck to avoid stale payload
            formikProps.setFieldValue(`${VisitFormField.improvements}.${visitType}`, []);
        }
    };

    return (
        <View>
            <Text style={styles.pickerQuestion}>{t("newVisit.whereVisit")} </Text>
            <View style={styles.verticalSpacer}></View>
            <TextInput
                mode="outlined"
                label={visitFieldLabels[VisitFormField.village] + "*"}
                value={formikProps.values[VisitFormField.village]}
                onChangeText={(value) => formikProps.setFieldValue(VisitFormField.village, value)}
                error={!!formikProps.errors[VisitFormField.village]}
            />

            <HelperText
                style={styles.errorText}
                type="error"
                visible={!!formikProps.errors[VisitFormField.village]}
            >
                {typeof formikProps.errors[VisitFormField.village] === "string"
                    ? formikProps.errors[VisitFormField.village]
                    : ""}
            </HelperText>

            <FormikExposedDropdownMenu
                field={VisitFormField.zone}
                placeholder={visitFieldLabels[VisitFormField.zone] + "*"}
                valuesType="map"
                values={zones}
                formikProps={formikProps}
                fieldLabels={visitFieldLabels}
                mode="outlined"
            />
            <View style={styles.verticalSpacer}></View>
            <Text style={styles.pickerQuestion}>{t("newVisit.selectReasons") + "*"} </Text>
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

const VisitTypeStep = (
    visitType: VisitFormField,
    risks: IRisk[],
    setRisks: React.Dispatch<React.SetStateAction<IRisk[]>>
) => {
    const styles = useStyles();
    // Note: Not using the useTranslation hook here because it causes a crash:
    //     "Render Error -- Cannot read the property 'length' of undefined"
    // Using `i18n.t(...)` instead
    return ({ formikProps }: IFormProps) => {
        return (
            <View>
                <Text style={styles.pickerQuestion}>{i18n.t("newVisit.selectImprovement")}</Text>
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
            </View>
        );
    };
};

const NewVisit = (props: INewVisitProps) => {
    const authContext = useContext(AuthContext);
    const user =
        authContext.authState.state === "loggedIn" ? authContext.authState.currentUser : null;
    const [, setLoadingError] = useState(false);
    const styles = useStyles();
    const zones = useZones();
    const [, setSubmissionError] = useState(false);
    const [activeStep, setActiveStep] = useState<number>(0);
    const [enabledSteps, setEnabledSteps] = useState<VisitFormField[]>([]);
    const [checkedSteps, setCheckedSteps] = useState<VisitFormField[]>([]);

    const [risks, setRisks] = useState<IRisk[]>([]);
    const isFinalStep = activeStep === enabledSteps.length && activeStep !== 0;
    const [saveError, setSaveError] = useState<string>();
    const clientId = props.route.params.clientID;
    const database = useDatabase();
    const { autoSync, cellularSync } = useContext(SyncContext);
    const { t } = useTranslation();

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
            label: t("newVisit.visitFocus"),
            Form: visitReasonStepCallBack(setEnabledSteps, zones),
            validationSchema: initialValidationSchema,
        },
        ...enabledSteps.map((visitType) => ({
            label: `${visitFieldLabels[visitType]} ${t("newVisit.visit")}`,
            Form: VisitTypeStep(visitType, risks, setRisks),
            validationSchema: visitTypeValidationSchema(visitType),
        })),
    ];

    const prevStep = (props: any) => {
        // Only adjust set of "good" states if we changed something:
        if (Object.keys(props.touched).length !== 0) {
            if (countObjectKeys(props.errors) !== 0) {
                const arr = checkedSteps.filter((item) => {
                    return item != enabledSteps[activeStep - 1];
                });
                setCheckedSteps(arr);
            } else {
                checkedSteps.push(enabledSteps[activeStep - 1]);
            }
        }
        setActiveStep(activeStep - 1);
        props.setErrors({});
    };

    const [hasSubmitted, setHasSubmitted] = useState(false);
    useEffect(() => {
        if (hasSubmitted) {
            props.navigation.navigate(StackScreenName.CLIENT, { clientID: clientId });
        }
    }, [hasSubmitted]);
    const nextStep = async (values: any, helpers: FormikHelpers<any>) => {
        const errors = await helpers.validateForm();
        const hasErrors = Object.keys(errors).length > 0;

        // validate form (should be unneeded in current setup, as 'Submit' button is disabled if form has errors)
        if (hasErrors) {
            helpers.setTouched(
                Object.keys(errors).reduce((acc, key) => {
                    acc[key] = true;
                    return acc;
                }, {} as Record<string, boolean>)
            );
            helpers.setSubmitting(false);
            return;
        }

        if (isFinalStep) {
            setSaveError(undefined);
            handleSubmit(values, helpers, user!.username, database, autoSync, cellularSync)
                .then(() => {
                    setHasSubmitted(true);
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
                confirmButtonText={t("general.discard")}
                dialogContent={t("newVisit.discardNewVisit")}
            />
            <Formik
                initialValues={{ ...visitInitialValues, [VisitFormField.client_id]: clientId }}
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
                            {/* todosd: steps not fully connected when 5 or fewer selected */}
                            {/* Issue #602: The key forces ProgressSteps to re-render when visitSteps change, which causes the fields to flicker, 
                            however, forced re-rendering is needed because ProgressSteps doesn't handle dynamic step changes well */}
                            <ProgressSteps key={visitSteps.length} {...progressStepsStyle}>
                                {visitSteps.map((surveyStep, index) => {
                                    const isCurrentStepActive = activeStep === index;
                                    const hasErrors = countObjectKeys(formikProps.errors) !== 0;

                                    return (
                                        <ProgressStep
                                            key={index}
                                            scrollViewProps={defaultScrollViewProps}
                                            onNext={() => {
                                                nextStep(formikProps.values, formikProps);
                                            }}
                                            buttonNextDisabled={
                                                formikProps.isSubmitting ||
                                                (isCurrentStepActive &&
                                                    (hasErrors ||
                                                        (activeStep === 0 &&
                                                            enabledSteps.length === 0)))
                                            }
                                            buttonPreviousDisabled={formikProps.isSubmitting}
                                            buttonFinishDisabled={
                                                formikProps.isSubmitting ||
                                                hasErrors ||
                                                (activeStep === 0 && enabledSteps.length === 0)
                                            }
                                            onPrevious={() => prevStep(formikProps)}
                                            onSubmit={() =>
                                                nextStep(formikProps.values, formikProps)
                                            }
                                            buttonPreviousText={t("general.previous")}
                                            buttonNextText={t("general.next")}
                                            buttonFinishText={
                                                activeStep === 0
                                                    ? t("general.next")
                                                    : t("general.submit")
                                            }
                                            buttonFillColor={themeColors.blueBgDark}
                                            buttonBorderColor={themeColors.blueBgDark}
                                            buttonPreviousTextColor={themeColors.blueBgDark}
                                            buttonHorizontalOffset={20}
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
