import React, { useEffect, useState } from "react";
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
} from "@cbr/common";
import WheelchairForm from "./ReferralForm/WheelchairForm";
import PhysiotherapyForm from "./ReferralForm/PhysiotherapyForm";
import useStyles, { defaultScrollViewProps, progressStepsStyle } from "./NewReferral.styles";
import ProstheticOrthoticForm from "./ReferralForm/ProstheticOrthoticForm";
import OtherServicesForm from "./ReferralForm/OtherServicesForm";
import TextCheckBox from "../../components/TextCheckBox/TextCheckBox";
import { StackScreenName } from "../../util/StackScreenName";
import { StackParamList } from "../../util/stackScreens";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Alert from "../../components/Alert/Alert";

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
            <Text style={styles.question}>Select referral services</Text>
            {serviceTypes.map((serviceType) => (
                <TextCheckBox
                    key={serviceType}
                    field={serviceType}
                    label={referralFieldLabels[serviceType]}
                    value={props.formikProps.values[serviceType]}
                    setFieldValue={props.formikProps.setFieldValue}
                    onChange={(value: boolean) => {
                        props.formikProps.setFieldTouched(serviceType, true);
                        onCheckboxChange(value, serviceType);
                    }}
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

    useEffect(() => {
        props.navigation.setOptions({
            headerShown: true,
            header: (stackHeaderProps) => (
                <Appbar.Header statusBarHeight={0}>
                    <Appbar.BackAction onPress={() => stackHeaderProps.navigation.goBack()} />
                    <Appbar.Content title="New Referral" subtitle={"Client ID: " + clientId} />
                </Appbar.Header>
            ),
        });
    }, []);

    const prevStep = (props: any) => {
        if (Object.keys(props.errors).length !== 0) {
            const arr = checkedSteps.filter((item) => {
                return item != enabledSteps[activeStep - 1];
            });
            setCheckedSteps(arr);
        } else {
            if (props.values[ReferralFormField.otherDescription] !== "") {
                checkedSteps.push(enabledSteps[activeStep - 1]);
            }
        }
        setActiveStep(activeStep - 1);
        props.setErrors({});
    };

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
                if (checkedSteps.length === 0) {
                    setCheckedSteps([]);
                }
                checkedSteps.push(ReferralFormField.orthotic);
                checkedSteps.push(ReferralFormField.prosthetic);
                helpers.setFieldValue(`${[ReferralFormField.client]}`, clientId);
            }
            if (!checkedSteps.includes(enabledSteps[activeStep - 1])) {
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

    const services: { [key: string]: IReferralForm } = {
        [ReferralFormField.wheelchair]: {
            label: `${referralFieldLabels[ReferralFormField.wheelchair]} Visit`,
            Form: WheelchairForm,
            validationSchema: wheelchairValidationSchema,
        },
        [ReferralFormField.physiotherapy]: {
            label: `${referralFieldLabels[ReferralFormField.physiotherapy]} Visit`,
            Form: PhysiotherapyForm,
            validationSchema: physiotherapyValidationSchema,
        },
        [ReferralFormField.prosthetic]: {
            label: `${referralFieldLabels[ReferralFormField.prosthetic]} Visit`,
            Form: (formikProps) =>
                ProstheticOrthoticForm(formikProps, ReferralFormField.prosthetic),
            validationSchema: () =>
                prostheticOrthoticValidationSchema(ReferralFormField.prosthetic),
        },
        [ReferralFormField.orthotic]: {
            label: `${referralFieldLabels[ReferralFormField.orthotic]} Visit`,
            Form: (formikProps) => ProstheticOrthoticForm(formikProps, ReferralFormField.orthotic),
            validationSchema: () => prostheticOrthoticValidationSchema(ReferralFormField.orthotic),
        },
        [ReferralFormField.servicesOther]: {
            label: `${referralFieldLabels[ReferralFormField.servicesOther]} Visit`,
            Form: OtherServicesForm,
            validationSchema: otherServicesValidationSchema,
        },
    };

    const referralSteps: IReferralForm[] = [
        {
            label: "Referral Services",
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
                                            (!checkedSteps.includes(enabledSteps[activeStep - 1])
                                                ? Object.keys(formikProps.errors).length !== 0 ||
                                                  Object.keys(formikProps.touched).length === 0
                                                : Object.keys(formikProps.errors).length !== 0))
                                    }
                                    previousBtnDisabled={formikProps.isSubmitting}
                                    onPrevious={() => prevStep(formikProps)}
                                    previousBtnStyle={styles.prevButton}
                                    onSubmit={() => nextStep(formikProps.values, formikProps)}
                                >
                                    <Text style={styles.stepLabelText}>{surveyStep.label}</Text>
                                    <Divider style={{ backgroundColor: themeColors.blueBgDark }} />
                                    <ScrollView>
                                        <surveyStep.Form formikProps={formikProps} />
                                    </ScrollView>
                                </ProgressStep>
                            ))}
                        </ProgressSteps>
                    </View>
                </>
            )}
        </Formik>
    );
};

export default NewReferral;
