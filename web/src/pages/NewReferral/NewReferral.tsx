import {
    Button,
    FormControl,
    FormGroup,
    FormLabel,
    InputAdornment,
    MenuItem,
    Radio,
    Step,
    StepContent,
    StepLabel,
    Stepper,
} from "@mui/material";
import { Field, Form, Formik, FormikHelpers, FormikProps } from "formik";
import { CheckboxWithLabel, RadioGroup, TextField } from "formik-mui";
import React, { useState } from "react";
import { getOtherDisabilityId, useDisabilities } from "@cbr/common/util/hooks/disabilities";
import {
    orthoticInjuryLocations,
    prostheticInjuryLocations,
    wheelchairExperiences,
    otherServices,
    Impairments,
    mentalHealthConditions,
    MentalConditions,
} from "@cbr/common/util/referrals";
import { handleSubmit } from "./formHandler";
import { ArrowBack } from "@mui/icons-material";
import history from "@cbr/common/util/history";
import { useParams } from "react-router-dom";
import { useStyles } from "./NewReferral.styles";
import { Alert } from '@mui/material';
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
import { PhotoView } from "components/ReferralPhotoView/PhotoView";

interface IFormProps {
    formikProps: FormikProps<any>;
}

interface IService {
    label: string;
    Form: (props: IFormProps) => JSX.Element;
    validationSchema: () => any;
}

const ReferralServiceForm = (
    props: IFormProps,
    setEnabledSteps: React.Dispatch<React.SetStateAction<ReferralFormField[]>>
) => {
    const onCheckboxChange = (checked: boolean, selectedServiceType: string) => {
        // We can't fully rely on formikProps.values[service] here because it might not be updated yet
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
        (<FormControl variant="standard" component="fieldset">
            <FormLabel>Select referral services</FormLabel>
            <FormGroup>
                {serviceTypes.map((serviceType) => (
                    <Field
                        component={CheckboxWithLabel}
                        type="checkbox"
                        key={serviceType}
                        name={serviceType}
                        Label={{ label: referralFieldLabels[serviceType] }}
                        onChange={(event: React.FormEvent<HTMLInputElement>) => {
                            props.formikProps.handleChange(event);
                            onCheckboxChange(event.currentTarget.checked, serviceType);
                        }}
                    />
                ))}
            </FormGroup>
        </FormControl>)
    );
};

const WheelchairForm = (props: IFormProps) => {
    const styles = useStyles();

    return (
        <div>
            <FormLabel>What type of wheelchair user?</FormLabel>
            <Field
                component={RadioGroup}
                name={ReferralFormField.wheelchairExperience}
                label={referralFieldLabels[ReferralFormField.wheelchairExperience]}
            >
                {Object.entries(wheelchairExperiences).map(([value, name]) => (
                    <label key={value}>
                        <Field
                            component={Radio}
                            type="radio"
                            name={ReferralFormField.wheelchairExperience}
                            value={value}
                        />
                        {name}
                    </label>
                ))}
            </Field>
            <br />
            <FormLabel>What is the client's hip width?</FormLabel>
            <br />
            <div className={`${styles.fieldIndent}`}>
                <Field
                    className={styles.hipWidth}
                    component={TextField}
                    type="number"
                    name={ReferralFormField.hipWidth}
                    InputProps={{
                        endAdornment: <InputAdornment position="end">inches</InputAdornment>,
                    }}
                />
            </div>
            <br />
            <FormLabel>Wheelchair information</FormLabel>
            <br />
            <div className={styles.fieldIndent}>
                <Field
                    component={CheckboxWithLabel}
                    type="checkbox"
                    name={ReferralFormField.wheelchairOwned}
                    Label={{ label: referralFieldLabels[ReferralFormField.wheelchairOwned] }}
                />
                <br />
                {props.formikProps.values[ReferralFormField.wheelchairOwned] && (
                    <Field
                        component={CheckboxWithLabel}
                        type="checkbox"
                        name={ReferralFormField.wheelchairRepairable}
                        Label={{
                            label: referralFieldLabels[ReferralFormField.wheelchairRepairable],
                        }}
                    />
                )}
            </div>
            {props.formikProps.values[ReferralFormField.wheelchairOwned] &&
                props.formikProps.values[ReferralFormField.wheelchairRepairable] && (
                    <>
                        <Alert severity="info">Please bring wheelchair to the center</Alert>
                        <br />
                        <PhotoView
                            onPictureChange={(pictureURL) => {
                                props.formikProps.setFieldValue(
                                    ReferralFormField.picture,
                                    pictureURL
                                );
                            }}
                        ></PhotoView>
                    </>
                )}
        </div>
    );
};

const PhysiotherapyForm = (props: IFormProps) => {
    const styles = useStyles();
    const disabilities = useDisabilities();

    return (
        <div>
            <FormLabel>What condition does the client have?</FormLabel>
            <br />
            <br />
            <div className={styles.fieldIndent}>
                <Field
                    component={TextField}
                    fullWidth
                    select
                    label={referralFieldLabels[ReferralFormField.condition]}
                    required
                    name={ReferralFormField.condition}
                    variant="outlined"
                >
                    {Array.from(disabilities).map(([id, name]) => (
                        <MenuItem key={id} value={id}>
                            {name}
                        </MenuItem>
                    ))}
                </Field>
                {props.formikProps.values[ReferralFormField.condition] ===
                    getOtherDisabilityId(disabilities) && (
                    <div>
                        <br />
                        <Field
                            component={TextField}
                            fullWidth
                            label={referralFieldLabels[ReferralFormField.conditionOther]}
                            required
                            name={ReferralFormField.conditionOther}
                            variant="outlined"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

const ProstheticOrthoticForm = (props: IFormProps, serviceType: ReferralFormField) => {
    const injuryLocations =
        serviceType === ReferralFormField.prosthetic
            ? prostheticInjuryLocations
            : orthoticInjuryLocations;

    return (
        <div>
            <FormLabel>Where is the injury?</FormLabel>
            <Field
                component={RadioGroup}
                name={`${serviceType}_injury_location`}
                label={referralFieldLabels[serviceType]}
            >
                {Object.entries(injuryLocations).map(([value, name]) => (
                    <label key={value}>
                        <Field
                            component={Radio}
                            type="radio"
                            name={`${serviceType}_injury_location`}
                            value={value}
                        />
                        {name}
                    </label>
                ))}
            </Field>
        </div>
    );
};

const NutritionForm = (props: IFormProps) => {
    const styles = useStyles();
    // const disabilities = useDisabilities();

    return (
        <div>
            <FormLabel>What does the client need?</FormLabel>
            <br />
            <div className={styles.fieldIndent}>
                <Field
                    component={CheckboxWithLabel}
                    type="checkbox"
                    key={ReferralFormField.emergencyFoodAidRequired}
                    name={ReferralFormField.emergencyFoodAidRequired}
                    Label={{
                        label: referralFieldLabels[ReferralFormField.emergencyFoodAidRequired],
                    }}
                    onChange={(event: React.FormEvent<HTMLInputElement>) => {
                        props.formikProps.handleChange(event);
                    }}
                />
                <br />
                <Field
                    component={CheckboxWithLabel}
                    type="checkbox"
                    key={ReferralFormField.agricultureLivelihoodProgramEnrollment}
                    name={ReferralFormField.agricultureLivelihoodProgramEnrollment}
                    Label={{
                        label: referralFieldLabels[
                            ReferralFormField.agricultureLivelihoodProgramEnrollment
                        ],
                    }}
                    onChange={(event: React.FormEvent<HTMLInputElement>) => {
                        props.formikProps.handleChange(event);
                    }}
                />
            </div>
        </div>
    );
};

const MentalHealthForm = (props: IFormProps) => {
    const styles = useStyles();
    return (
        <div>
            <FormLabel>Please select mental health referral</FormLabel>
            <br />
            <br />
            <div className={styles.fieldIndent}>
                <Field
                    component={TextField}
                    variant="outlined"
                    name={ReferralFormField.mentalHealthCondition}
                    label={referralFieldLabels[ReferralFormField.mentalHealthCondition]}
                    select
                    fullWidth
                    required
                >
                    {Object.entries(mentalHealthConditions).map(([value, name]) => (
                        <MenuItem key={value} value={value}>
                            {name}
                        </MenuItem>
                    ))}
                </Field>
                {props.formikProps.values[ReferralFormField.mentalHealthCondition] ===
                    MentalConditions.OTHER && (
                    <div>
                        <br />
                        <FormLabel>Please describe the referral</FormLabel>
                        <Field
                            component={TextField}
                            fullWidth
                            label={referralFieldLabels[ReferralFormField.mentalConditionOther]}
                            required
                            name={ReferralFormField.mentalConditionOther}
                            variant="outlined"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

const OtherServicesForm = (props: IFormProps) => {
    const styles = useStyles();

    return (
        <div>
            <FormLabel>Please select another referral</FormLabel>
            <br />
            <br />
            <div className={styles.fieldIndent}>
                <Field
                    component={TextField}
                    variant="outlined"
                    name={ReferralFormField.otherDescription}
                    label={referralFieldLabels[ReferralFormField.otherDescription]}
                    select
                    fullWidth
                    required
                >
                    {Object.entries(otherServices).map(([value, name]) => (
                        <MenuItem key={value} value={value}>
                            {name}
                        </MenuItem>
                    ))}
                </Field>
                {props.formikProps.values[ReferralFormField.otherDescription] ===
                    Impairments.OTHER && (
                    <div>
                        <br />
                        <FormLabel>Please describe the referral</FormLabel>
                        <Field
                            component={TextField}
                            fullWidth
                            label={referralFieldLabels[ReferralFormField.referralOther]}
                            required
                            name={ReferralFormField.referralOther}
                            variant="outlined"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

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
            label: `${referralFieldLabels[ReferralFormField.servicesOther]} Visit`,
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
