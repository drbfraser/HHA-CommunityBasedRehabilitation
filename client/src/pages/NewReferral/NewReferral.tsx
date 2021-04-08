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
} from "@material-ui/core";
import { Field, Form, Formik, FormikHelpers, FormikProps } from "formik";
import { CheckboxWithLabel, RadioGroup, TextField } from "formik-material-ui";
import React, { useState } from "react";
import { OTHER, useDisabilities } from "util/hooks/disabilities";
import {
    orthoticInjuryLocations,
    prostheticInjuryLocations,
    wheelchairExperiences,
} from "util/referrals";
import {
    fieldLabels,
    FormField,
    initialValidationSchema,
    initialValues,
    otherServicesValidationSchema,
    physiotherapyValidationSchema,
    prostheticOrthoticValidationSchema,
    wheelchairValidationSchema,
} from "./formFields";
import { handleSubmit } from "./formHandler";
import { ArrowBack } from "@material-ui/icons";
import history from "../../util/history";
import { useParams } from "react-router-dom";
import { useStyles } from "./NewReferral.styles";
import { Alert } from "@material-ui/lab";

const serviceTypes: FormField[] = [
    FormField.wheelchair,
    FormField.physiotherapy,
    FormField.prosthetic,
    FormField.orthotic,
    FormField.servicesOther,
];

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
    setEnabledSteps: React.Dispatch<React.SetStateAction<FormField[]>>
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
        <FormControl component="fieldset">
            <FormLabel>Select referral services</FormLabel>
            <FormGroup>
                {serviceTypes.map((serviceType) => (
                    <Field
                        component={CheckboxWithLabel}
                        type="checkbox"
                        key={serviceType}
                        name={serviceType}
                        Label={{ label: fieldLabels[serviceType] }}
                        onChange={(event: React.FormEvent<HTMLInputElement>) => {
                            props.formikProps.handleChange(event);
                            onCheckboxChange(event.currentTarget.checked, serviceType);
                        }}
                    />
                ))}
            </FormGroup>
        </FormControl>
    );
};

const WheelchairForm = (props: IFormProps) => {
    const styles = useStyles();

    return (
        <div>
            <FormLabel>What is the client's wheelchair experience?</FormLabel>
            <Field
                component={RadioGroup}
                name={FormField.wheelchairExperience}
                label={fieldLabels[FormField.wheelchairExperience]}
            >
                {Object.entries(wheelchairExperiences).map(([value, name]) => (
                    <label key={value}>
                        <Field
                            component={Radio}
                            type="radio"
                            name={FormField.wheelchairExperience}
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
                    name={FormField.hipWidth}
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
                    name={FormField.wheelchairOwned}
                    Label={{ label: fieldLabels[FormField.wheelchairOwned] }}
                />
                <br />
                {props.formikProps.values[FormField.wheelchairOwned] && (
                    <Field
                        component={CheckboxWithLabel}
                        type="checkbox"
                        name={FormField.wheelchairRepairable}
                        Label={{ label: fieldLabels[FormField.wheelchairRepairable] }}
                    />
                )}
            </div>
            {props.formikProps.values[FormField.wheelchairOwned] &&
                props.formikProps.values[FormField.wheelchairRepairable] && (
                    <Alert severity="info">Please bring wheelchair to the center</Alert>
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
                    label={fieldLabels[FormField.condition]}
                    required
                    name={FormField.condition}
                    variant="outlined"
                >
                    {Array.from(disabilities).map(([id, name]) => (
                        <MenuItem key={id} value={id}>
                            {name}
                        </MenuItem>
                    ))}
                </Field>
                {props.formikProps.values[FormField.condition] === OTHER && (
                    <div>
                        <br />
                        <Field
                            component={TextField}
                            fullWidth
                            label={fieldLabels[FormField.conditionOther]}
                            required
                            name={FormField.conditionOther}
                            variant="outlined"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

const ProstheticOrthoticForm = (props: IFormProps, serviceType: FormField) => {
    const injuryLocations =
        serviceType === FormField.prosthetic ? prostheticInjuryLocations : orthoticInjuryLocations;

    return (
        <div>
            <FormLabel>Where is the injury?</FormLabel>
            <Field
                component={RadioGroup}
                name={`${serviceType}_injury_location`}
                label={fieldLabels[serviceType]}
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

const OtherServicesForm = (props: IFormProps) => {
    const styles = useStyles();

    return (
        <div>
            <FormLabel>Please describe the referral</FormLabel>
            <br />
            <br />
            <div className={styles.fieldIndent}>
                <Field
                    type="text"
                    component={TextField}
                    variant="outlined"
                    name={FormField.otherDescription}
                    label={fieldLabels[FormField.otherDescription]}
                    required
                    fullWidth
                    multiline
                />
            </div>
        </div>
    );
};

const NewReferral = () => {
    const [activeStep, setActiveStep] = useState<number>(0);
    const [enabledSteps, setEnabledSteps] = useState<FormField[]>([]);
    const [submissionError, setSubmissionError] = useState(false);
    const { clientId } = useParams<{ clientId: string }>();

    const services: { [key: string]: IService } = {
        [FormField.wheelchair]: {
            label: `${fieldLabels[FormField.wheelchair]} Visit`,
            Form: WheelchairForm,
            validationSchema: wheelchairValidationSchema,
        },
        [FormField.physiotherapy]: {
            label: `${fieldLabels[FormField.physiotherapy]} Visit`,
            Form: PhysiotherapyForm,
            validationSchema: physiotherapyValidationSchema,
        },
        [FormField.prosthetic]: {
            label: `${fieldLabels[FormField.prosthetic]} Visit`,
            Form: (formikProps) => ProstheticOrthoticForm(formikProps, FormField.prosthetic),
            validationSchema: () => prostheticOrthoticValidationSchema(FormField.prosthetic),
        },
        [FormField.orthotic]: {
            label: `${fieldLabels[FormField.orthotic]} Visit`,
            Form: (formikProps) => ProstheticOrthoticForm(formikProps, FormField.orthotic),
            validationSchema: () => prostheticOrthoticValidationSchema(FormField.orthotic),
        },
        [FormField.servicesOther]: {
            label: `${fieldLabels[FormField.servicesOther]} Visit`,
            Form: OtherServicesForm,
            validationSchema: otherServicesValidationSchema,
        },
    };

    const isFinalStep = activeStep === enabledSteps.length && activeStep !== 0;

    const referralSteps: IService[] = [
        {
            label: "Referral Services",
            Form: (props) => ReferralServiceForm(props, setEnabledSteps),
            validationSchema: initialValidationSchema,
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
                helpers.setFieldValue(`${[FormField.client]}`, clientId);
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
            initialValues={initialValues}
            validationSchema={referralSteps[activeStep].validationSchema}
            onSubmit={nextStep}
            enableReinitialize
        >
            {(formikProps) => (
                <Form>
                    {submissionError && (
                        <Alert onClose={() => setSubmissionError(false)} severity="error">
                            Something went wrong submitting the referral. Please try again.
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
