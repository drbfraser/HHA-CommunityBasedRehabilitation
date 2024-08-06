import React, { useContext, useState } from "react";
import { ScrollView, View } from "react-native";
import { Text, Divider, Appbar } from "react-native-paper";
import { Formik, FormikHelpers } from "formik";
import { ProgressSteps, ProgressStep } from "react-native-progress-steps";
import { handleSubmit } from "./formHandler";
import {
    IReferralForm,
    ReferralFormProps,
    referralInitialValidationSchema,
    serviceTypes,
    themeColors,
    referralFieldLabels,
    ReferralFormField,
    referralInitialValues,
    otherServicesValidationSchema,
    physiotherapyValidationSchema,
    prostheticOrthoticValidationSchema,
    wheelchairValidationSchema,
    APIFetchFailError,
    countObjectKeys,
    hhaNutritionAndAgricultureProjectValidationSchema,
    mentalHealthValidationSchema,
} from "@cbr/common";
import WheelchairForm from "./ReferralForm/WheelchairForm";
import PhysiotherapyForm from "./ReferralForm/PhysiotherapyForm";
import useStyles, { defaultScrollViewProps, progressStepsStyle } from "./NewReferral.styles";
import ProstheticOrthoticForm from "./ReferralForm/ProstheticOrthoticForm";
import NutritionAgricultureForm from "./ReferralForm/NutritionAgricultureForm";
import MentalHealthForm from "./ReferralForm/MentalHealthForm";
import OtherServicesForm from "./ReferralForm/OtherServicesForm";
import TextCheckBox from "../../components/TextCheckBox/TextCheckBox";
import { StackScreenName } from "../../util/StackScreenName";
import { StackParamList } from "../../util/stackScreens";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Alert from "../../components/Alert/Alert";
import ConfirmDialogWithNavListener from "../../components/DiscardDialogs/ConfirmDialogWithNavListener";
import { useDatabase } from "@nozbe/watermelondb/hooks";
import { SyncContext } from "../../context/SyncContext/SyncContext";
import { string } from "yup";
import { useTranslation } from "react-i18next";
import i18n from "i18next";

interface INewReferralProps {
    clientID: number;
    route: RouteProp<StackParamList, StackScreenName.REFERRAL>;
    navigation: StackNavigationProp<StackParamList, StackScreenName.REFERRAL>;
}

const ReferralServiceForm = (
    props: ReferralFormProps,
    setEnabledSteps: React.Dispatch<React.SetStateAction<ReferralFormField[]>>
) => {
    const styles = useStyles();
    const { t } = useTranslation();
    const onCheckboxChange = (checked: boolean, selectedServiceType: string) => {
        setEnabledSteps(
            serviceTypes.filter(
                (serviceType) =>
                    (props.formikProps.values[serviceType] &&
                        serviceType !== selectedServiceType) ||
                    (checked && serviceType === selectedServiceType)
            )
        );
    };
    return (
        <View>
            <Text />
            <Text style={styles.question}>{t('referral.selectReferralServices')}</Text>
            {serviceTypes.map((serviceType) => (
                <TextCheckBox
                    key={serviceType}
                    field={serviceType}
                    label={referralFieldLabels[serviceType]}
                    value={props.formikProps.values[serviceType]}
                    setFieldValue={props.formikProps.setFieldValue}
                    setFieldTouched={props.formikProps.setFieldTouched}
                    onChange={(value: boolean) => onCheckboxChange(value, serviceType)}
                />
            ))}
        </View>
    );
};

const NewReferral = (props: INewReferralProps) => {
    const styles = useStyles();
    const clientId = props.route.params.clientID;
    const [activeStep, setActiveStep] = useState<number>(0);
    const [saveError, setSaveError] = useState<string>();
    const [enabledSteps, setEnabledSteps] = useState<ReferralFormField[]>([]);
    const [checkedSteps, setCheckedSteps] = useState<ReferralFormField[]>([]);
    const [submissionError, setSubmissionError] = useState(false);
    const isFinalStep = activeStep === enabledSteps.length && activeStep !== 0;
    const { autoSync, cellularSync } = useContext(SyncContext);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const { t } = useTranslation();

    const prevStep = async (props: any) => { 
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

    const database = useDatabase();
    const nextStep = async (values: any, helpers: FormikHelpers<any>) => {
        if (isFinalStep) {
            setSaveError(undefined);
            handleSubmit(values, database, helpers, autoSync, cellularSync)
                .then(() => {
                    setHasSubmitted(true);
                    props.navigation.navigate(StackScreenName.CLIENT, {
                        clientID: clientId,
                    });
                })
                .catch((e) => {
                    setSaveError(
                        e instanceof APIFetchFailError
                            ? e.buildFormError(referralFieldLabels)
                            : `${e}`
                    );
                    helpers.setSubmitting(false);
                    setSubmissionError(true);
                });
            setCheckedSteps([]);
        } else {
            if (activeStep === 0) {
                if (checkedSteps.length === 0) {
                    setCheckedSteps([]);
                }
                checkedSteps.push(ReferralFormField.orthotic);
                checkedSteps.push(ReferralFormField.prosthetic);
                helpers.setFieldValue(`${[ReferralFormField.client_id]}`, clientId);
            }
            else if (!checkedSteps.includes(enabledSteps[activeStep - 1])) {
                checkedSteps.push(enabledSteps[activeStep - 1]);
            }
            setCheckedSteps([...new Set(checkedSteps)]);

            if (
                (enabledSteps[activeStep] !== ReferralFormField.prosthetic &&
                    enabledSteps[activeStep] !== ReferralFormField.orthotic) ||
                !checkedSteps.includes(enabledSteps[activeStep - 1])
            ) {
                helpers.setTouched({});
            }

            setActiveStep(activeStep + 1);
            helpers.setSubmitting(false);
        }
    };

    const visitStr = t("newVisit.visit");
    const services: { [key: string]: IReferralForm } = {
        [ReferralFormField.wheelchair]: {
            label: `${referralFieldLabels[ReferralFormField.wheelchair]} ${visitStr}`,
            Form: WheelchairForm,
            validationSchema: wheelchairValidationSchema,
        },
        [ReferralFormField.physiotherapy]: {
            label: `${referralFieldLabels[ReferralFormField.physiotherapy]} ${visitStr}`,
            Form: PhysiotherapyForm,
            validationSchema: physiotherapyValidationSchema,
        },
        [ReferralFormField.prosthetic]: {
            label: `${referralFieldLabels[ReferralFormField.prosthetic]} ${visitStr}`,
            Form: (formikProps) =>
                ProstheticOrthoticForm(formikProps, ReferralFormField.prosthetic),
            validationSchema: () =>
                prostheticOrthoticValidationSchema(ReferralFormField.prosthetic),
        },
        [ReferralFormField.orthotic]: {
            label: `${referralFieldLabels[ReferralFormField.orthotic]} ${visitStr}`,
            Form: (formikProps) => ProstheticOrthoticForm(formikProps, ReferralFormField.orthotic),
            validationSchema: () => prostheticOrthoticValidationSchema(ReferralFormField.orthotic),
        },
        [ReferralFormField.hhaNutritionAndAgricultureProject]: {
            label: `${
                referralFieldLabels[ReferralFormField.hhaNutritionAndAgricultureProject]
            } ${visitStr}`,
            Form: NutritionAgricultureForm,
            validationSchema: hhaNutritionAndAgricultureProjectValidationSchema,
        },
        [ReferralFormField.mentalHealth]: {
            label: `${referralFieldLabels[ReferralFormField.mentalHealth]} ${visitStr}`,
            Form: MentalHealthForm,
            validationSchema: mentalHealthValidationSchema,
        },
        [ReferralFormField.servicesOther]: {
            label: `${referralFieldLabels[ReferralFormField.servicesOther]} ${visitStr}`,
            Form: OtherServicesForm,
            validationSchema: otherServicesValidationSchema,
        },
    };

    const countTouchedFields = (formikTouched: any): number => {
        let count = 0;
        for (const key in formikTouched) {
            if (formikTouched[key] == true) {
                count++;
            }
        }
        return count;
    };

    const referralSteps: IReferralForm[] = [
        {
            label: t("referral.referralServices"),
            Form: (props) => ReferralServiceForm(props, setEnabledSteps),
            validationSchema: referralInitialValidationSchema,
        },
        ...enabledSteps.map((serviceType) => ({
            label: services[serviceType].label,
            Form: services[serviceType].Form,
            validationSchema: services[serviceType].validationSchema,
        })),
    ];

    return (
        <>
            <ConfirmDialogWithNavListener
                bypassDialog={hasSubmitted}
                confirmButtonText={t('general.discard')}
                dialogContent={t('referral.discardNewReferral')}
            />
            <Formik
                initialValues={referralInitialValues}
                validationSchema={referralSteps[activeStep].validationSchema}
                onSubmit={nextStep}
                enableReinitialize
            >
                {(formikProps) => (
                    <>
                        <View style={styles.container}>
                            {saveError && (
                                <Alert
                                    style={styles.errorAlert}
                                    severity={"error"}
                                    text={saveError}
                                    onClose={() => setSaveError(undefined)}
                                />
                            )}

                            <ProgressSteps key={referralSteps} {...progressStepsStyle}>
                                {referralSteps.map((surveyStep, index) => (
                                    <ProgressStep
                                        key={index}
                                        scrollViewProps={defaultScrollViewProps}
                                        previousBtnTextStyle={styles.buttonTextStyle}
                                        nextBtnTextStyle={styles.buttonTextStyle}
                                        nextBtnStyle={styles.nextButton}
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
                                                    ? countObjectKeys(formikProps.errors) !== 0 ||
                                                      Object.keys(formikProps.touched).length === 0
                                                    : countObjectKeys(formikProps.errors) !== 0))
                                        }
                                        previousBtnDisabled={formikProps.isSubmitting}
                                        onPrevious={() => prevStep(formikProps)}
                                        previousBtnStyle={styles.prevButton}
                                        onSubmit={() => nextStep(formikProps.values, formikProps)}
                                        previousBtnText={t("general.previous")}
                                        nextBtnText={t("general.next")}
                                        finishBtnText={t("general.submit")}
                                    >
                                        <Text style={styles.stepLabelText}>{surveyStep.label}</Text>
                                        <Divider
                                            style={{ backgroundColor: themeColors.blueBgDark }}
                                        />
                                        <ScrollView>
                                            <Text>
                                                formikProps.isSubmitting: {formikProps.isSubmitting}
                                            </Text>
                                            <Text>
                                                enabledSteps.length: {enabledSteps.length}
                                            </Text>
                                            <Text>
                                                enabledSteps: {enabledSteps}
                                            </Text>
                                            <Text>
                                                enabledSteps[activeStep-1]:{" "}
                                                {enabledSteps[activeStep - 1]}
                                            </Text>
                                            <Text>
                                                activeStep: {activeStep}
                                            </Text>
                                            <Text>
                                                checkedSteps: {checkedSteps}
                                            </Text>
                                            <Text>
                                                checkedSteps include current: {checkedSteps.includes(
                                                    enabledSteps[activeStep - 1])}
                                            </Text>
                                            <Text>
                                                countTouchedFields(formikProps.touched):
                                                {countTouchedFields(formikProps.touched)}    
                                            </Text>
                                            <Text>
                                                countObjectKeys(formikProps.errors):
                                                {countObjectKeys(formikProps.errors)}
                                            </Text>
                                            <surveyStep.Form formikProps={formikProps} />
                                        </ScrollView>
                                    </ProgressStep>
                                ))}
                            </ProgressSteps>
                        </View>
                    </>
                )}
            </Formik>
        </>
    );
};

export default NewReferral;
