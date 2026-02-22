import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Form, Formik, FormikHelpers, FormikProps } from "formik";
import { Alert, Button, Step, StepContent, StepLabel, Stepper } from "@mui/material";

import {
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
import GoBackButton from "components/GoBackButton/GoBackButton";

interface IFormProps {
    formikProps: FormikProps<any>;
}

interface IService {
    label: string;
    Form: (props: IFormProps) => React.ReactElement;
    validationSchema: () => any;
}

const NewReferral = () => {
    const [activeStep, setActiveStep] = useState<number>(0);
    const [enabledSteps, setEnabledSteps] = useState<ReferralFormField[]>([]);
    const [submissionError, setSubmissionError] = useState<string>();
    const { t } = useTranslation();
    const { clientId } = useParams<{ clientId: string }>();

    const services: { [key: string]: IService } = {
        [ReferralFormField.wheelchair]: {
            label: t("referral.wheelchairVisit"),
            Form: WheelchairForm,
            validationSchema: wheelchairValidationSchema,
        },
        [ReferralFormField.physiotherapy]: {
            label: t("referral.physiotherapyVisit"),
            Form: PhysiotherapyForm,
            validationSchema: physiotherapyValidationSchema,
        },
        [ReferralFormField.prosthetic]: {
            label: t("referral.prostheticVisit"),
            Form: (formikProps) =>
                ProstheticOrthoticForm(formikProps, ReferralFormField.prosthetic),
            validationSchema: () =>
                prostheticOrthoticValidationSchema(ReferralFormField.prosthetic),
        },
        [ReferralFormField.orthotic]: {
            label: t("referral.orthoticVisit"),
            Form: (formikProps) => ProstheticOrthoticForm(formikProps, ReferralFormField.orthotic),
            validationSchema: () => prostheticOrthoticValidationSchema(ReferralFormField.orthotic),
        },
        [ReferralFormField.hhaNutritionAndAgricultureProject]: {
            label: t("referral.hhaNutritionAndAgricultureProjectVisit"),
            Form: NutritionForm,
            validationSchema: hhaNutritionAndAgricultureProjectValidationSchema,
        },
        [ReferralFormField.mentalHealth]: {
            label: t("referral.mentalHealthVisit"),
            Form: MentalHealthForm,
            validationSchema: mentalHealthValidationSchema,
        },

        [ReferralFormField.servicesOther]: {
            label: t("referral.otherServiceVisit"),
            Form: OtherServicesForm,
            validationSchema: otherServicesValidationSchema,
        },
    };

    const referralSteps: IService[] = [
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

    const isFinalStep = activeStep === enabledSteps.length && activeStep !== 0;
    const prevStep = () => setActiveStep(activeStep - 1);
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
                            {t("alert.submitReferralError")}: {submissionError}
                        </Alert>
                    )}
                    <GoBackButton />

                    <Stepper
                        activeStep={activeStep}
                        orientation="vertical"
                        sx={{ padding: "24px" }}
                    >
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
                                            {t("general.previous")}
                                        </Button>
                                    )}
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        disabled={isNoServiceChecked(formikProps)}
                                    >
                                        {isFinalStep && index === activeStep
                                            ? t("general.submit")
                                            : t("general.next")}
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
