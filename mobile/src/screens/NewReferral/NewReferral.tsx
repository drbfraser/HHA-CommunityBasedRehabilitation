import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { Text, Divider, Appbar } from "react-native-paper";
// import {
//     FormField,
//     IFormProps,
//     initialValues,
//     surveyTypes,
// } from "@cbr/common";
import { Formik, FormikHelpers } from "formik";
import { ProgressSteps, ProgressStep } from "react-native-progress-steps";
import { IFormProps, themeColors } from "@cbr/common";
// import useStyles, { defaultScrollViewProps, progressStepsStyle } from "./baseSurvey.style";
import { handleSubmit } from "./formHandler";
import {
    fieldLabels,
    FormField,
    initialValues,
    otherServicesValidationSchema,
    physiotherapyValidationSchema,
    prostheticOrthoticValidationSchema,
    wheelchairValidationSchema,
} from "./formFields";
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
    const [enabledSteps, setEnabledSteps] = useState<FormField[]>([]);
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
            label: `${fieldLabels[FormField.wheelchair]} Visit`,
            Form: WheelchairForm,
            validationSchema: wheelchairValidationSchema,
        },
        {
            label: `${fieldLabels[FormField.physiotherapy]} Visit`,
            Form: PhysiotherapyForm,
            validationSchema: physiotherapyValidationSchema,
        },
        {
            label: `${fieldLabels[FormField.prosthetic]} Visit`,
            Form: (formikProps) => ProstheticOrthoticForm(formikProps, FormField.prosthetic),
            validationSchema: () => prostheticOrthoticValidationSchema(FormField.prosthetic),
        },
        {
            label: `${fieldLabels[FormField.orthotic]} Visit`,
            Form: (formikProps) => ProstheticOrthoticForm(formikProps, FormField.orthotic),
            validationSchema: () => prostheticOrthoticValidationSchema(FormField.orthotic),
        },
        {
            label: `${fieldLabels[FormField.servicesOther]} Visit`,
            Form: OtherServicesForm,
            validationSchema: otherServicesValidationSchema,
        },
    ];

    return (
        <Formik
            initialValues={initialValues}
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
