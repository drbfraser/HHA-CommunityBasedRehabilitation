import {
    Button,
    FormControl,
    FormLabel,
    MenuItem,
    Step,
    StepContent,
    StepLabel,
    Stepper,
} from "@material-ui/core";
import { Field, Form, Formik, FormikHelpers, FormikProps } from "formik";
import { CheckboxWithLabel, TextField } from "formik-material-ui";
import { useState } from "react";
import {
    fieldLabels,
    FormField,
    initialValidationSchema,
    initialValues,
    rateLevelValidationSchema,
} from "./surveyFormFields";
import { handleSubmit } from "./surveyHandler";
import { ArrowBack } from "@material-ui/icons";
import history from "util/history";
import { useParams } from "react-router-dom";
import { useStyles } from "./BaseSurvey.style";
import { Alert } from "@material-ui/lab";
import { deviceType, grade, rateLevel, reasonNotSchool } from "util/survey";

const serviceTypes: FormField[] = [FormField.health, FormField.education];

interface IFormProps {
    formikProps: FormikProps<any>;
}

interface ISurvey {
    label: string;
    Form: (props: IFormProps) => JSX.Element;
    validationSchema: () => any;
}

const HealthForm = () => {
    const styles = useStyles();

    return (
        <div>
            <FormLabel>Rate your general health</FormLabel>
            <br />
            <br />

            <FormControl fullWidth variant="outlined">
                <Field
                    component={TextField}
                    select
                    variant="outlined"
                    label={fieldLabels[FormField.rateLevel]}
                    name={FormField.rateLevel}
                >
                    {Object.entries(rateLevel).map(([value, { name }]) => (
                        <MenuItem key={value} value={value}>
                            {name}
                        </MenuItem>
                    ))}
                </Field>
            </FormControl>
            <br />
            <br />

            <div className={styles.fieldIndent}>
                <Field
                    component={CheckboxWithLabel}
                    type="checkbox"
                    name={FormField.getService}
                    Label={{ label: fieldLabels[FormField.getService] }}
                />
                <br />
            </div>
            <div className={styles.fieldIndent}>
                <Field
                    component={CheckboxWithLabel}
                    type="checkbox"
                    name={FormField.needService}
                    Label={{ label: fieldLabels[FormField.needService] }}
                />
                <br />
            </div>
            <div className={styles.fieldIndent}>
                <Field
                    component={CheckboxWithLabel}
                    type="checkbox"
                    name={FormField.deviceWoking}
                    Label={{ label: fieldLabels[FormField.deviceWoking] }}
                />
                <br />
            </div>
            <div className={styles.fieldIndent}>
                <Field
                    component={CheckboxWithLabel}
                    type="checkbox"
                    name={FormField.haveDevice}
                    Label={{ label: fieldLabels[FormField.haveDevice] }}
                />
                <br />
            </div>
            <div className={styles.fieldIndent}>
                <Field
                    component={CheckboxWithLabel}
                    type="checkbox"
                    name={FormField.needDevice}
                    Label={{ label: fieldLabels[FormField.needDevice] }}
                />
                <br />
            </div>

            <FormLabel>What assistive device do you need?</FormLabel>
            <br />
            <br />
            <FormControl fullWidth variant="outlined">
                <Field
                    component={TextField}
                    select
                    variant="outlined"
                    label={fieldLabels[FormField.deviceType]}
                    name={FormField.deviceType}
                >
                    {Object.entries(deviceType).map(([value, { name }]) => (
                        <MenuItem key={value} value={value}>
                            {name}
                        </MenuItem>
                    ))}
                </Field>
            </FormControl>

            <FormLabel>Are you satisfied with the health services you receive</FormLabel>
            <br />
            <br />
            <FormControl fullWidth variant="outlined">
                <Field
                    component={TextField}
                    select
                    variant="outlined"
                    label={fieldLabels[FormField.deviceSatisf]}
                    name={FormField.deviceSatisf}
                >
                    {Object.entries(rateLevel).map(([value, { name }]) => (
                        <MenuItem key={value} value={value}>
                            {name}
                        </MenuItem>
                    ))}
                </Field>
            </FormControl>
            <br />
            <br />
        </div>
    );
};

const EducationForm = (props: IFormProps) => {
    const styles = useStyles();

    return (
        <div>
            <div className={styles.fieldIndent}>
                <Field
                    component={CheckboxWithLabel}
                    type="checkbox"
                    name={FormField.needDevice}
                    Label={{ label: fieldLabels[FormField.needDevice] }}
                />
                <br />
            </div>
            <div className={styles.fieldIndent}>
                <Field
                    component={CheckboxWithLabel}
                    type="checkbox"
                    name={FormField.goSchool}
                    Label={{ label: fieldLabels[FormField.goSchool] }}
                />
                <br />
                {props.formikProps.values[FormField.goSchool] ? (
                    <div className={styles.fieldIndent}>
                        <FormControl fullWidth variant="outlined">
                            <FormLabel>What grade?</FormLabel>
                            <br />
                            <Field
                                component={TextField}
                                select
                                variant="outlined"
                                label={fieldLabels[FormField.grade]}
                                name={FormField.grade}
                            >
                                {Object.entries(grade).map(([value, { name }]) => (
                                    <MenuItem key={value} value={value}>
                                        {name}
                                    </MenuItem>
                                ))}
                            </Field>
                        </FormControl>
                    </div>
                ) : (
                    <div className={styles.fieldIndent}>
                        <FormControl fullWidth variant="outlined">
                            <FormLabel>Why do you not go to school?"</FormLabel>
                            <br />
                            <Field
                                component={TextField}
                                select
                                variant="outlined"
                                label={fieldLabels[FormField.reasonNotSchool]}
                                name={FormField.reasonNotSchool}
                            >
                                {Object.entries(reasonNotSchool).map(([value, { name }]) => (
                                    <MenuItem key={value} value={value}>
                                        {name}
                                    </MenuItem>
                                ))}
                            </Field>
                            <Field
                                component={CheckboxWithLabel}
                                type="checkbox"
                                name={FormField.beenSchool}
                                Label={{ label: fieldLabels[FormField.beenSchool] }}
                            />
                        </FormControl>
                    </div>
                )}
                <Field
                    component={CheckboxWithLabel}
                    type="checkbox"
                    name={FormField.wantSchool}
                    Label={{ label: fieldLabels[FormField.wantSchool] }}
                />
            </div>
        </div>
    );
};

const SocialForm = (props: IFormProps) => {
    return (
        <div>
            <br />
            <br />
        </div>
    );
};

const NewSurvey = () => {
    const [activeStep, setActiveStep] = useState<number>(0);
    const [enabledSteps, setEnabledSteps] = useState<FormField[]>([]);
    const [submissionError, setSubmissionError] = useState(false);
    const { clientId } = useParams<{ clientId: string }>();

    const surveys: { [key: string]: ISurvey } = {
        [FormField.health]: {
            label: `${fieldLabels[FormField.health]} Survey`,
            Form: HealthForm,
            validationSchema: rateLevelValidationSchema,
        },
        [FormField.education]: {
            label: `${fieldLabels[FormField.education]} Visit`,
            Form: EducationForm,
            validationSchema: rateLevelValidationSchema,
        },
    };

    const isFinalStep = activeStep === enabledSteps.length && activeStep !== 0;

    const surveySteps: ISurvey[] = [
        {
            label: "Health",
            Form: () => HealthForm(),
            validationSchema: initialValidationSchema,
        },
        {
            label: "Education",
            Form: (formikProps) => EducationForm(formikProps),
            validationSchema: initialValidationSchema,
        },
        {
            label: "Social",
            Form: (formikProps) => SocialForm(formikProps),
            validationSchema: initialValidationSchema,
        },
        ...enabledSteps.map((serviceType) => ({
            label: surveys[serviceType].label,
            Form: surveys[serviceType].Form,
            validationSchema: surveys[serviceType].validationSchema,
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
            validationSchema={surveySteps[activeStep].validationSchema}
            onSubmit={nextStep}
            enableReinitialize
        >
            {(formikProps) => (
                <Form>
                    {submissionError && (
                        <Alert onClose={() => setSubmissionError(false)} severity="error">
                            Something went wrong submitting the survey. Please try again.
                        </Alert>
                    )}
                    <Button onClick={history.goBack}>
                        <ArrowBack /> Go back
                    </Button>
                    <Stepper activeStep={activeStep} orientation="vertical">
                        {surveySteps.map((surveyStep, index) => (
                            <Step key={index}>
                                <StepLabel>{surveyStep.label}</StepLabel>
                                <StepContent>
                                    <surveyStep.Form formikProps={formikProps} />
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

export default NewSurvey;
