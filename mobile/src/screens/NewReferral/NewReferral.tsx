import React, { useState } from "react";
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

const NewReferral = () => {
    const styles = useStyles();
    const [activeStep, setActiveStep] = useState<number>(0);
    const [enabledSteps, setEnabledSteps] = useState<ReferralFormField[]>([]);
    const [checkedSteps, setCheckedSteps] = useState<ReferralFormField[]>([]);
    const [submissionError, setSubmissionError] = useState(false);
    const isFinalStep = activeStep === enabledSteps.length && activeStep !== 0;

    const prevStep = (values: any) => {
        setActiveStep(activeStep - 1);
        if (values !== "") {
            checkedSteps.push(enabledSteps[activeStep]);
        }
        if (activeStep === 1) {
            checkedSteps.push(enabledSteps[activeStep]);
        }
    };

    // Make sure the user can not click to next if they did not fill out the required fields
    const nextStep = (values: any, helpers: FormikHelpers<any>) => {
        if (isFinalStep) {
            handleSubmit(values, helpers, setSubmissionError);
            setCheckedSteps([]);
        } else {
            if (activeStep === 0) {
                checkedSteps.push(ReferralFormField.orthotic);
                checkedSteps.push(ReferralFormField.prosthetic);
                // TODO: Change back when it is connected to the client detail
                helpers.setFieldValue(`${[ReferralFormField.client]}`, 1);
                // helpers.setFieldValue(`${[FormField.client]}`, clientId);
            }

            checkedSteps.push(enabledSteps[activeStep - 1]);
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
                                        enabledSteps.length === 0 ||
                                        (enabledSteps[activeStep - 1] !== undefined &&
                                            (!checkedSteps.includes(enabledSteps[activeStep - 1])
                                                ? Object.keys(formikProps.errors).length !== 0 ||
                                                  Object.keys(formikProps.touched).length === 0
                                                : Object.keys(formikProps.errors).length !== 0))
                                    }
                                    onPrevious={() =>
                                        prevStep(
                                            formikProps.values[ReferralFormField.otherDescription]
                                        )
                                    }
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
