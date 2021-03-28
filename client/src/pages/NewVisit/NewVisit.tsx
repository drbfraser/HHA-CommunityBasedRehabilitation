import {
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    MenuItem,
    Step,
    StepContent,
    StepLabel,
    Stepper,
} from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import { Field, FieldArray, Form, Formik, FormikHelpers, FormikProps } from "formik";
import { CheckboxWithLabel, TextField } from "formik-material-ui";
import React, { useState } from "react";
import { useParams } from "react-router";
import {
    fieldLabels,
    FormField,
    ImprovementFormField,
    OutcomeFormField,
    initialValues,
    provisionals,
    initialValidationSchema,
    visitTypeValidationSchema,
    GoalStatus,
} from "./formFields";
import { handleSubmit } from "./formHandler";
import { useStyles } from "./NewVisit.styles";
import history from "../../util/history";
import { TZoneMap, useZones } from "util/hooks/zones";

const visitTypes: FormField[] = [FormField.health, FormField.education, FormField.social];

const ImprovementField = (props: {
    formikProps: FormikProps<any>;
    visitType: string;
    provided: string;
    index: number;
}) => {
    const [isFieldVisible, setFieldVisibility] = useState<boolean>(
        props.formikProps.values.improvements[props.visitType][props.index] !== undefined
    );

    const fieldName = `${FormField.improvements}.${props.visitType}.${props.index}`;

    const onCheckboxChange = (checked: boolean) => {
        setFieldVisibility(checked);
        if (checked) {
            props.formikProps.setFieldValue(`${fieldName}`, {
                [ImprovementFormField.riskType]: props.visitType,
                [ImprovementFormField.provided]: props.provided,
                [ImprovementFormField.description]: "",
            });
        } else {
            props.formikProps.setFieldValue(`${fieldName}`, undefined);
        }
    };

    return (
        <div key={props.index}>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={isFieldVisible}
                        onChange={(event) => onCheckboxChange(event.currentTarget.checked)}
                        name={props.provided}
                    />
                }
                label={props.provided}
            />
            <br />
            {isFieldVisible && (
                <Field
                    key={`${props.provided}${ImprovementFormField.description}`}
                    type="text"
                    component={TextField}
                    variant="outlined"
                    name={`${fieldName}.${ImprovementFormField.description}`}
                    label={fieldLabels[ImprovementFormField.description]}
                    required
                    fullWidth
                    multiline
                />
            )}
        </div>
    );
};

const OutcomeField = (props: { visitType: FormField }) => {
    const fieldName = `${FormField.outcomes}.${props.visitType}`;

    return (
        <div>
            <FormLabel>Client's {fieldLabels[props.visitType]} Goal Status</FormLabel>
            <br />
            <Field
                component={TextField}
                select
                required
                variant="outlined"
                name={`${fieldName}.${OutcomeFormField.goalStatus}`}
            >
                {Object.values(GoalStatus).map((status) => (
                    <MenuItem key={status} value={status}>
                        {fieldLabels[status]}
                    </MenuItem>
                ))}
            </Field>
            <br />
            <br />
            <div>
                <FormLabel>What is the Outcome of the Goal?</FormLabel>
                <Field
                    type="text"
                    component={TextField}
                    variant="outlined"
                    name={`${fieldName}.${OutcomeFormField.outcome}`}
                    label={fieldLabels[OutcomeFormField.outcome]}
                    required
                    fullWidth
                    multiline
                />
                <br />
            </div>
        </div>
    );
};

interface IStepProps {
    formikProps: FormikProps<any>;
}

const VisitTypeStep = (visitType: FormField) => {
    return ({ formikProps }: IStepProps) => {
        return (
            <FormControl>
                <FormLabel>Select an Improvement</FormLabel>
                <FieldArray
                    name={FormField.improvements}
                    render={() =>
                        provisionals[visitType].map((provided, index) => (
                            <ImprovementField
                                key={index}
                                formikProps={formikProps}
                                visitType={visitType}
                                provided={provided}
                                index={index}
                            />
                        ))
                    }
                />
                <br />
                <OutcomeField visitType={visitType} />
            </FormControl>
        );
    };
};

const visitReasonStepCallBack = (
    setEnabledSteps: React.Dispatch<React.SetStateAction<FormField[]>>,
    zones: TZoneMap
) => ({ formikProps }: IStepProps) => VisitReasonStep(formikProps, setEnabledSteps, zones);

const VisitReasonStep = (
    formikProps: FormikProps<any>,
    setEnabledSteps: React.Dispatch<React.SetStateAction<FormField[]>>,
    zones: TZoneMap
) => {
    const styles = useStyles();

    const onCheckboxChange = (checked: boolean, visitType: string) => {
        // We can't fully rely on formikProps.values[type] here because it might not be updated yet
        setEnabledSteps(
            visitTypes.filter(
                (type) =>
                    (formikProps.values[type] && type !== visitType) ||
                    (checked && type === visitType)
            )
        );

        if (checked) {
            formikProps.setFieldValue(`${FormField.outcomes}.${visitType}`, {
                [OutcomeFormField.riskType]: visitType,
                [OutcomeFormField.goalStatus]: GoalStatus.ongoing,
                [OutcomeFormField.outcome]: "",
            });
            formikProps.setFieldTouched(`${FormField.outcomes}.${visitType}`, false);
        } else {
            formikProps.setFieldValue(`${FormField.outcomes}.${visitType}`, undefined);
        }
    };

    return (
        <>
            <FormLabel>Where was the Visit?</FormLabel>
            <FormControl
                className={styles.visitLocationContainer}
                fullWidth
                required
                variant="outlined"
            >
                <Field
                    className={styles.visitLocation}
                    component={TextField}
                    name={FormField.village}
                    label={fieldLabels[FormField.village]}
                    variant="outlined"
                    fullWidth
                    required
                />
                <Field
                    className={styles.visitLocation}
                    component={TextField}
                    select
                    label={fieldLabels[FormField.zone]}
                    name={FormField.zone}
                    variant="outlined"
                    required
                >
                    {Array.from(zones).map(([id, name]) => (
                        <MenuItem key={id} value={id}>
                            {name}
                        </MenuItem>
                    ))}
                </Field>
            </FormControl>
            <br />
            <FormControl component="fieldset">
                <FormLabel>Select the Reasons for the Visit</FormLabel>
                <FormGroup>
                    {visitTypes.map((visitType) => (
                        <Field
                            component={CheckboxWithLabel}
                            type="checkbox"
                            key={visitType}
                            name={visitType}
                            Label={{ label: fieldLabels[visitType] }}
                            onChange={(event: React.FormEvent<HTMLInputElement>) => {
                                formikProps.handleChange(event);
                                onCheckboxChange(event.currentTarget.checked, visitType);
                            }}
                        />
                    ))}
                </FormGroup>
            </FormControl>
        </>
    );
};

const NewVisit = () => {
    const [activeStep, setActiveStep] = useState<number>(0);
    const [enabledSteps, setEnabledSteps] = useState<FormField[]>([]);
    const zones = useZones();
    const { clientId } = useParams<{ clientId: string }>();

    const isFinalStep = activeStep === enabledSteps.length && activeStep !== 0;

    const visitSteps = [
        {
            label: "Visit Focus",
            Form: visitReasonStepCallBack(setEnabledSteps, zones),
            validationSchema: initialValidationSchema,
        },
        ...enabledSteps.map((visitType) => ({
            label: `${fieldLabels[visitType]} Visit`,
            Form: VisitTypeStep(visitType),
            validationSchema: visitTypeValidationSchema(visitType),
        })),
    ];

    const nextStep = (values: any, helpers: FormikHelpers<any>) => {
        if (isFinalStep) {
            handleSubmit(values, helpers);
        } else {
            if (activeStep === 0) {
                helpers.setFieldValue(`${[FormField.client]}`, clientId);
            }
            setActiveStep(activeStep + 1);
            helpers.setSubmitting(false);
        }
    };

    const prevStep = () => {
        setActiveStep(activeStep - 1);
    };

    return (
        <Formik
            initialValues={initialValues}
            // TODO: Yup validation broken, need to be fixed. thumbs.gfycat.com/AchingForkedAgouti-small.gif
            //validationSchema={visitSteps[activeStep].validationSchema}
            onSubmit={nextStep}
        >
            {(formikProps) => (
                <Form>
                    <Button onClick={history.goBack}>
                        <ArrowBack /> Go back
                    </Button>
                    <Stepper activeStep={activeStep} orientation="vertical">
                        {visitSteps.map((visitStep, index) => (
                            <Step key={index}>
                                <StepLabel>{visitStep.label}</StepLabel>
                                <StepContent>
                                    <visitStep.Form formikProps={formikProps} />
                                    <br />
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
                                        disabled={Boolean(
                                            !(
                                                formikProps.values[FormField.health] ||
                                                formikProps.values[FormField.education] ||
                                                formikProps.values[FormField.social]
                                            )
                                        )}
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

export default NewVisit;
