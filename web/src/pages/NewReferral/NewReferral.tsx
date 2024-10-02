import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Field, Form, Formik, FormikHelpers, FormikProps } from "formik";
import { CheckboxWithLabel } from "formik-material-ui";
import {
    Button,
    FormControl,
    FormGroup,
    FormLabel,
    Step,
    StepContent,
    StepLabel,
    Stepper,
} from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";

import history from "@cbr/common/util/history";
import {
    referralFieldLabels,
    ReferralFormField,
    referralInitialValidationSchema,
    referralInitialValues,
    otherServicesValidationSchema,
    physiotherapyValidationSchema,
    prostheticOrthoticValidationSchema,
    wheelchairValidationSchema,
    hhaNutritionAndAgricultureProjectValidationSchema,
    serviceTypes,
    mentalHealthValidationSchema,
} from "@cbr/common/forms/Referral/referralFields";
import { handleSubmit } from "./formHandler";
import {
    MentalHealthForm,
    NutritionForm,
    OtherServicesForm,
    PhysiotherapyForm,
    ProstheticOrthoticForm,
    ReferralServiceForm,
    WheelchairForm,
} from "./forms";

interface IFormProps {
    formikProps: FormikProps<any>;
}

interface IService {
    label: string;
    Form: (props: IFormProps) => JSX.Element;
    validationSchema: () => any;
}

const NewReferral = () => {
    const [activeStep, setActiveStep] = useState<number>(0);
    const [enabledSteps, setEnabledSteps] = useState<ReferralFormField[]>([]);
    const [submissionError, setSubmissionError] = useState<string>();
    const { clientId } = useParams<{ clientId: string }>();

    const services: { [key: string]: IService } = {
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
        [ReferralFormField.hhaNutritionAndAgricultureProject]: {
            label: `${
                referralFieldLabels[ReferralFormField.hhaNutritionAndAgricultureProject]
            } Visit`,
            Form: NutritionForm,
            validationSchema: hhaNutritionAndAgricultureProjectValidationSchema,
        },
        [ReferralFormField.mentalHealth]: {
            label: `${referralFieldLabels[ReferralFormField.mentalHealth]} Visit`,
            Form: MentalHealthForm,
            validationSchema: mentalHealthValidationSchema,
        },

        [ReferralFormField.servicesOther]: {
            label: `${referralFieldLabels[ReferralFormField.servicesOther]} Visit`, // TODO: translate "Visit"?
            Form: OtherServicesForm,
            validationSchema: otherServicesValidationSchema,
        },
    };

    const isFinalStep = activeStep === enabledSteps.length && activeStep !== 0;

    const referralSteps: IService[] = [
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

    const nextStep = (values: any, helpers: FormikHelpers<any>) => {
        if (isFinalStep) {
            handleSubmit(values, helpers, setSubmissionError);
        } else {
            if (activeStep === 0) {
                helpers.setFieldValue(`${[ReferralFormField.client_id]}`, clientId);
            }
            setActiveStep(activeStep + 1);
            helpers.setSubmitting(false);
            helpers.setTouched({});
        }
    };

    const isNoServiceChecked = (formikProps: FormikProps<any>) => {
        return !serviceTypes
            .map((serviceType) => Boolean(formikProps.values[serviceType]))
            .reduce((disabledState, serviceState) => disabledState || serviceState);
    };

    const prevStep = () => setActiveStep(activeStep - 1);

    return (
        <Formik
            initialValues={referralInitialValues}
            validationSchema={referralSteps[activeStep].validationSchema}
            onSubmit={nextStep}
            enableReinitialize
        >
            {(formikProps) => (
                <Form>
                    {submissionError && (
                        <Alert onClose={() => setSubmissionError(undefined)} severity="error">
                            An error occurred when submitting the referral: {submissionError}
                        </Alert>
                    )}
                    <Button onClick={history.goBack}>
                        <ArrowBack /> Go back
                    </Button>
                    <Stepper activeStep={activeStep} orientation="vertical">
                        {referralSteps.map((referralStep, index) => (
                            <Step key={index}>
                                <StepLabel>{referralStep.label}</StepLabel>
                                <StepContent>
                                    <referralStep.Form formikProps={formikProps} />
                                    <br />
                                    {activeStep !== 0 && (
                                        <Button
                                            style={{ marginRight: "5px" }}
                                            variant="outlined"
                                            color="primary"
                                            onClick={prevStep}
                                        >
                                            Prev Step
                                        </Button>
                                    )}
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        disabled={isNoServiceChecked(formikProps)}
                                    >
                                        {isFinalStep && index === activeStep
                                            ? "Submit"
                                            : "Next Step"}
                                    </Button>
                                </StepContent>
                            </Step>
                        ))}
                    </Stepper>
                </Form>
            )}
        </Formik>
    );
};

export default NewReferral;
