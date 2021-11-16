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
import React, { useState } from "react";
import {
    baseFieldLabels,
    BaseSurveyFormField,
    emptyValidationSchema,
    baseInitialValues,
    foodValidationSchema,
    livelihoodValidationSchema,
    healthValidationSchema,
    educationValidationSchema,
    empowermentValidationSchema,
    surveyTypes,
} from "@cbr/common/forms/BaseSurvey/baseSurveyFields";
import { ArrowBack } from "@material-ui/icons";
import history from "@cbr/common/util/history";
import { useParams } from "react-router-dom";
import { Alert } from "@material-ui/lab";
import {
    ChildNourish,
    childNourish,
    deviceTypes,
    grade,
    isSelfEmployed,
    rateLevel,
    reasonNotSchool,
} from "@cbr/common/util/survey";
import { useStyles } from "./baseSurvey.style";
import { handleSubmit } from "./formHandler";

interface IFormProps {
    formikProps: FormikProps<any>;
}

interface ISurvey {
    label: string;
    Form: (props: IFormProps) => JSX.Element;
    validationSchema: () => any;
}

const HealthForm = (props: IFormProps) => {
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
                    required
                    variant="outlined"
                    label={baseFieldLabels[BaseSurveyFormField.rateLevel]}
                    name={BaseSurveyFormField.rateLevel}
                >
                    {Object.entries(rateLevel).map(([value, { name }]) => (
                        <MenuItem key={value} value={value}>
                            {name}
                        </MenuItem>
                    ))}
                </Field>
            </FormControl>
            <div>
                <Field
                    component={CheckboxWithLabel}
                    type="checkbox"
                    name={BaseSurveyFormField.getService}
                    Label={{ label: baseFieldLabels[BaseSurveyFormField.getService] }}
                />
                <br />

                <Field
                    component={CheckboxWithLabel}
                    type="checkbox"
                    name={BaseSurveyFormField.needService}
                    Label={{ label: baseFieldLabels[BaseSurveyFormField.needService] }}
                />
                <br />

                <Field
                    component={CheckboxWithLabel}
                    type="checkbox"
                    name={BaseSurveyFormField.haveDevice}
                    Label={{ label: baseFieldLabels[BaseSurveyFormField.haveDevice] }}
                />
                <br />

                <Field
                    component={CheckboxWithLabel}
                    type="checkbox"
                    name={BaseSurveyFormField.deviceWorking}
                    Label={{ label: baseFieldLabels[BaseSurveyFormField.deviceWorking] }}
                />
                <br />

                <Field
                    component={CheckboxWithLabel}
                    type="checkbox"
                    name={BaseSurveyFormField.needDevice}
                    Label={{ label: baseFieldLabels[BaseSurveyFormField.needDevice] }}
                />
                <br />
            </div>

            {props.formikProps.values[BaseSurveyFormField.needDevice] && (
                <div className={styles.fieldIndent}>
                    <FormControl fullWidth variant="outlined">
                        <FormLabel>What assistive device do you need?</FormLabel>
                        <br />
                        <Field
                            component={TextField}
                            select
                            required
                            variant="outlined"
                            label={baseFieldLabels[BaseSurveyFormField.deviceType]}
                            name={BaseSurveyFormField.deviceType}
                        >
                            {Object.entries(deviceTypes).map(([value, name]) => (
                                <MenuItem key={value} value={value}>
                                    {name}
                                </MenuItem>
                            ))}
                        </Field>
                    </FormControl>
                </div>
            )}

            <br />
            <FormLabel>Are you satisfied with the health services you receive?</FormLabel>
            <br />
            <br />
            <FormControl fullWidth variant="outlined">
                <Field
                    component={TextField}
                    select
                    required
                    variant="outlined"
                    label={baseFieldLabels[BaseSurveyFormField.serviceSatisf]}
                    name={BaseSurveyFormField.serviceSatisf}
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
            <Field
                component={CheckboxWithLabel}
                type="checkbox"
                name={BaseSurveyFormField.goSchool}
                Label={{ label: baseFieldLabels[BaseSurveyFormField.goSchool] }}
            />
            <br />
            <div className={styles.fieldIndent}>
                {props.formikProps.values[BaseSurveyFormField.goSchool] ? (
                    <div className={styles.fieldIndent}>
                        <FormLabel>What grade?</FormLabel>
                        <FormControl fullWidth variant="outlined">
                            <br />
                            <Field
                                component={TextField}
                                select
                                required
                                variant="outlined"
                                label={baseFieldLabels[BaseSurveyFormField.grade]}
                                name={BaseSurveyFormField.grade}
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
                        <FormLabel>Why do you not go to school?</FormLabel>
                        <FormControl fullWidth variant="outlined">
                            <br />
                            <Field
                                component={TextField}
                                select
                                required
                                variant="outlined"
                                label={baseFieldLabels[BaseSurveyFormField.reasonNotSchool]}
                                name={BaseSurveyFormField.reasonNotSchool}
                            >
                                {Object.entries(reasonNotSchool).map(([value, name]) => (
                                    <MenuItem key={value} value={value}>
                                        {name}
                                    </MenuItem>
                                ))}
                            </Field>
                            <Field
                                component={CheckboxWithLabel}
                                type="checkbox"
                                name={BaseSurveyFormField.beenSchool}
                                Label={{ label: baseFieldLabels[BaseSurveyFormField.beenSchool] }}
                            />
                        </FormControl>
                    </div>
                )}
            </div>
            <Field
                component={CheckboxWithLabel}
                type="checkbox"
                name={BaseSurveyFormField.wantSchool}
                Label={{ label: baseFieldLabels[BaseSurveyFormField.wantSchool] }}
            />
        </div>
    );
};

const SocialForm = () => {
    return (
        <FormControl fullWidth variant="outlined">
            <Field
                component={CheckboxWithLabel}
                type="checkbox"
                name={BaseSurveyFormField.feelValue}
                Label={{ label: baseFieldLabels[BaseSurveyFormField.feelValue] }}
            />
            <Field
                component={CheckboxWithLabel}
                type="checkbox"
                name={BaseSurveyFormField.feelIndependent}
                Label={{ label: baseFieldLabels[BaseSurveyFormField.feelIndependent] }}
            />
            <Field
                component={CheckboxWithLabel}
                type="checkbox"
                name={BaseSurveyFormField.ableInSocial}
                Label={{ label: baseFieldLabels[BaseSurveyFormField.ableInSocial] }}
            />
            <Field
                component={CheckboxWithLabel}
                type="checkbox"
                name={BaseSurveyFormField.disabiAffectSocial}
                Label={{ label: baseFieldLabels[BaseSurveyFormField.disabiAffectSocial] }}
            />
            <Field
                component={CheckboxWithLabel}
                type="checkbox"
                name={BaseSurveyFormField.disabiDiscrimination}
                Label={{ label: baseFieldLabels[BaseSurveyFormField.disabiDiscrimination] }}
            />
            <br />
        </FormControl>
    );
};

const LivelihoodForm = (props: IFormProps) => {
    const styles = useStyles();

    return (
        <div className={styles.fieldIndent}>
            <FormControl fullWidth variant="outlined">
                <Field
                    component={CheckboxWithLabel}
                    type="checkbox"
                    name={BaseSurveyFormField.isWorking}
                    Label={{ label: baseFieldLabels[BaseSurveyFormField.isWorking] }}
                />
            </FormControl>
            {props.formikProps.values[BaseSurveyFormField.isWorking] && (
                <div className={styles.fieldIndent}>
                    <FormLabel>What do you do?</FormLabel>
                    <FormControl fullWidth variant="outlined">
                        <br />
                        <Field
                            component={TextField}
                            multiline
                            variant="outlined"
                            label={baseFieldLabels[BaseSurveyFormField.job]}
                            name={BaseSurveyFormField.job}
                            fullWidth
                        />
                    </FormControl>
                    <br />
                    <br />
                    <FormLabel>Are you employed or self-employed?</FormLabel>
                    <br />
                    <br />
                    <FormControl fullWidth variant="outlined">
                        <Field
                            component={TextField}
                            select
                            required
                            variant="outlined"
                            label={baseFieldLabels[BaseSurveyFormField.isSelfEmployed]}
                            name={BaseSurveyFormField.isSelfEmployed}
                        >
                            {Object.entries(isSelfEmployed).map(([value, name]) => (
                                <MenuItem key={value} value={value}>
                                    {name}
                                </MenuItem>
                            ))}
                        </Field>
                        <br />
                        <Field
                            component={CheckboxWithLabel}
                            type="checkbox"
                            name={BaseSurveyFormField.meetFinanceNeeds}
                            Label={{ label: baseFieldLabels[BaseSurveyFormField.meetFinanceNeeds] }}
                        />
                    </FormControl>
                </div>
            )}

            <br />
            <FormControl fullWidth variant="outlined">
                <Field
                    component={CheckboxWithLabel}
                    type="checkbox"
                    name={BaseSurveyFormField.disabiAffectWork}
                    Label={{ label: baseFieldLabels[BaseSurveyFormField.disabiAffectWork] }}
                />

                <Field
                    component={CheckboxWithLabel}
                    type="checkbox"
                    name={BaseSurveyFormField.wantWork}
                    Label={{ label: baseFieldLabels[BaseSurveyFormField.wantWork] }}
                />
            </FormControl>
        </div>
    );
};

const FoodForm = (props: IFormProps) => {
    const styles = useStyles();

    return (
        <div>
            <FormLabel>Food security</FormLabel>
            <FormControl fullWidth variant="outlined">
                <br />
                <Field
                    component={TextField}
                    select
                    required
                    variant="outlined"
                    label={baseFieldLabels[BaseSurveyFormField.foodSecurityRate]}
                    name={BaseSurveyFormField.foodSecurityRate}
                >
                    {Object.entries(rateLevel).map(([value, { name }]) => (
                        <MenuItem key={value} value={value}>
                            {name}
                        </MenuItem>
                    ))}
                </Field>
                <Field
                    component={CheckboxWithLabel}
                    type="checkbox"
                    name={BaseSurveyFormField.enoughFoodPerMonth}
                    Label={{ label: baseFieldLabels[BaseSurveyFormField.enoughFoodPerMonth] }}
                />
                <Field
                    component={CheckboxWithLabel}
                    type="checkbox"
                    name={BaseSurveyFormField.isChild}
                    Label={{ label: baseFieldLabels[BaseSurveyFormField.isChild] }}
                />

                {props.formikProps.values[BaseSurveyFormField.isChild] && (
                    <div className={styles.fieldIndent}>
                        <FormControl fullWidth variant="outlined">
                            <FormLabel>What is this child nutritional status?</FormLabel>
                            <br />
                            <Field
                                component={TextField}
                                select
                                required
                                variant="outlined"
                                label={baseFieldLabels[BaseSurveyFormField.childNourish]}
                                name={BaseSurveyFormField.childNourish}
                            >
                                {Object.entries(childNourish).map(([value, name]) => (
                                    <MenuItem key={value} value={value}>
                                        {name}
                                    </MenuItem>
                                ))}
                            </Field>
                            {props.formikProps.values[BaseSurveyFormField.childNourish] ===
                                ChildNourish.MALNOURISHED && (
                                <div className={styles.fieldIndent}>
                                    <br />
                                    <Alert severity="info">
                                        A referral to the health center is required!
                                    </Alert>
                                </div>
                            )}
                        </FormControl>
                        <br />
                    </div>
                )}
            </FormControl>
        </div>
    );
};

const EmpowermentForm = (props: IFormProps) => {
    const styles = useStyles();

    return (
        <div>
            <FormControl fullWidth variant="outlined">
                <Field
                    component={CheckboxWithLabel}
                    type="checkbox"
                    name={BaseSurveyFormField.memOfOrgan}
                    Label={{ label: baseFieldLabels[BaseSurveyFormField.memOfOrgan] }}
                />
                {props.formikProps.values[BaseSurveyFormField.memOfOrgan] && (
                    <div className={styles.fieldIndent}>
                        <Field
                            component={TextField}
                            multiline
                            variant="outlined"
                            label={baseFieldLabels[BaseSurveyFormField.organization]}
                            name={BaseSurveyFormField.organization}
                            fullWidth
                        />
                    </div>
                )}

                <FormControl fullWidth variant="outlined">
                    <Field
                        component={CheckboxWithLabel}
                        type="checkbox"
                        name={BaseSurveyFormField.awareRight}
                        Label={{ label: baseFieldLabels[BaseSurveyFormField.awareRight] }}
                    />

                    <Field
                        component={CheckboxWithLabel}
                        type="checkbox"
                        name={BaseSurveyFormField.ableInfluence}
                        Label={{ label: baseFieldLabels[BaseSurveyFormField.ableInfluence] }}
                    />
                </FormControl>
                <br />
            </FormControl>
        </div>
    );
};

const ShelterForm = () => {
    return (
        <div>
            <FormControl fullWidth variant="outlined">
                <Field
                    component={CheckboxWithLabel}
                    type="checkbox"
                    name={BaseSurveyFormField.haveShelter}
                    Label={{ label: baseFieldLabels[BaseSurveyFormField.haveShelter] }}
                />

                <Field
                    component={CheckboxWithLabel}
                    type="checkbox"
                    name={BaseSurveyFormField.accessItem}
                    Label={{ label: baseFieldLabels[BaseSurveyFormField.accessItem] }}
                />
            </FormControl>
        </div>
    );
};

const NewSurvey = () => {
    const [step, setStep] = useState<number>(0);
    const [submissionError, setSubmissionError] = useState<string>();
    const { clientId } = useParams<{ clientId: string }>();

    const surveySteps: ISurvey[] = [
        {
            label: "Health",
            Form: (formikProps) => HealthForm(formikProps),
            validationSchema: healthValidationSchema,
        },
        {
            label: "Education (under 18)",
            Form: (formikProps) => EducationForm(formikProps),
            validationSchema: educationValidationSchema,
        },
        {
            label: "Social",
            Form: () => SocialForm(),
            validationSchema: emptyValidationSchema,
        },
        {
            label: "Livelihood (over 16)",
            Form: (formikProps) => LivelihoodForm(formikProps),
            validationSchema: livelihoodValidationSchema,
        },
        {
            label: "Food and Nutrition",
            Form: (formikProps) => FoodForm(formikProps),
            validationSchema: foodValidationSchema,
        },
        {
            label: "Empowerment",
            Form: (formikProps) => EmpowermentForm(formikProps),
            validationSchema: empowermentValidationSchema,
        },
        {
            label: "Shelter and Care",
            Form: () => ShelterForm(),
            validationSchema: emptyValidationSchema,
        },
    ];

    const isFinalStep = step + 1 === surveyTypes.length && step !== 0;
    const prevStep = () => setStep(step - 1);
    const nextStep = (values: any, helpers: FormikHelpers<any>) => {
        if (isFinalStep) {
            handleSubmit(values, helpers, setSubmissionError);
        } else {
            if (step === 0) {
                helpers.setFieldValue(`${[BaseSurveyFormField.client_id]}`, clientId);
            }
            setStep(step + 1);
            helpers.setSubmitting(false);
            helpers.setTouched({});
        }
    };

    return (
        <Formik
            initialValues={baseInitialValues}
            validationSchema={surveySteps[step].validationSchema}
            onSubmit={nextStep}
            enableReinitialize
        >
            {(formikProps) => (
                <Form>
                    {submissionError && (
                        <Alert onClose={() => setSubmissionError(undefined)} severity="error">
                            Error occurred when submitting the survey: {submissionError}
                        </Alert>
                    )}
                    <Button onClick={history.goBack}>
                        <ArrowBack /> Go back
                    </Button>
                    <br />
                    <br />
                    <Field
                        component={CheckboxWithLabel}
                        type="checkbox"
                        name={BaseSurveyFormField.surveyConsent}
                        Label={{ label: baseFieldLabels[BaseSurveyFormField.surveyConsent] }}
                    />

                    {formikProps.values.give_consent ? (
                        <Stepper activeStep={step} orientation="vertical">
                            {surveySteps.map((surveyStep, index) => (
                                <Step key={index}>
                                    <StepLabel>{surveyStep.label}</StepLabel>
                                    <StepContent>
                                        <surveyStep.Form formikProps={formikProps} />
                                        <br />
                                        {step !== 0 && (
                                            <Button
                                                style={{ marginRight: "5px" }}
                                                variant="outlined"
                                                color="primary"
                                                onClick={prevStep}
                                            >
                                                Prev Step
                                            </Button>
                                        )}
                                        <Button type="submit" variant="contained" color="primary">
                                            {isFinalStep && index === step ? "Submit" : "Next Step"}
                                        </Button>
                                    </StepContent>
                                </Step>
                            ))}
                        </Stepper>
                    ) : (
                        <></>
                    )}
                </Form>
            )}
        </Formik>
    );
};

export default NewSurvey;
