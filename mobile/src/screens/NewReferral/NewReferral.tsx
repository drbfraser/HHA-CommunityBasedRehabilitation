import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { Text, Divider, Appbar } from "react-native-paper";
import { Formik, FormikHelpers } from "formik";
import { ProgressSteps, ProgressStep } from "react-native-progress-steps";
import { IFormProps, themeColors } from "@cbr/common";
import { handleSubmit } from "./formHandler";
import {
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

interface IService {
    label: string;
    Form: (props: IFormProps) => JSX.Element;
    validationSchema: () => any;
}

const NewReferral = () => {
    const [activeStep, setActiveStep] = useState<number>(0);
    const [enabledSteps, setEnabledSteps] = useState<ReferralFormField[]>([]);
    const [submissionError, setSubmissionError] = useState(false);
    const styles = useStyles();
    const [stepChecked, setStepChecked] = useState([false]);
    const isFinalStep = activeStep === enabledSteps.length && activeStep !== 0;
    const prevStep = () => setActiveStep(activeStep - 1);

    // Make sure the user can not click to next if they did not fill out the required fields
    const nextStep = (values: any, helpers: FormikHelpers<any>) => {
        if (isFinalStep) {
            handleSubmit(values, helpers, setSubmissionError);
        } else {
            if (activeStep === 0) {
                // helpers.setFieldValue(`${[FormField.client]}`, clientId);
            }
            setActiveStep(activeStep + 1);
            helpers.setSubmitting(false);
            helpers.setTouched({});
        }
    };

    const services: IService[] = [
        {
            label: `${referralFieldLabels[ReferralFormField.wheelchair]} Visit`,
            Form: WheelchairForm,
            validationSchema: wheelchairValidationSchema,
        },
        {
            label: `${referralFieldLabels[ReferralFormField.physiotherapy]} Visit`,
            Form: PhysiotherapyForm,
            validationSchema: physiotherapyValidationSchema,
        },
        {
            label: `${referralFieldLabels[ReferralFormField.prosthetic]} Visit`,
            Form: (formikProps) => ProstheticOrthoticForm(formikProps, ReferralFormField.prosthetic),
            validationSchema: () => prostheticOrthoticValidationSchema(ReferralFormField.prosthetic),
        },
        {
            label: `${referralFieldLabels[ReferralFormField.orthotic]} Visit`,
            Form: (formikProps) => ProstheticOrthoticForm(formikProps, ReferralFormField.orthotic),
            validationSchema: () => prostheticOrthoticValidationSchema(ReferralFormField.orthotic),
        },
        {
            label: `${referralFieldLabels[ReferralFormField.servicesOther]} Visit`,
            Form: OtherServicesForm,
            validationSchema: otherServicesValidationSchema,
        },
    ];

    return (
        <Formik
            initialValues={referralInitialValues}
            validationSchema={services[activeStep].validationSchema}
            onSubmit={nextStep}
            enableReinitialize
        >
            {(formikProps) => (
                <>
                    {/* TODO: Update with Global App bar */}
                    <Appbar.Header>
                        <Appbar.BackAction />
                        <Appbar.Content title={"Baseline Survey"} />
                    </Appbar.Header>
                    <View style={styles.container}>
                        <ProgressSteps {...progressStepsStyle}>
                            {services.map((surveyStep, index) => (
                                <ProgressStep
                                    key={index}
                                    scrollViewProps={defaultScrollViewProps}
                                    previousBtnTextStyle={styles.buttonTextStyle}
                                    nextBtnTextStyle={styles.buttonTextStyle}
                                    nextBtnStyle={styles.nextButton}
                                    onNext={() => {
                                        nextStep(formikProps.values, formikProps);
                                    }}
                                    nextBtnDisabled={!formikProps.isValid}
                                    onPrevious={prevStep}
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
