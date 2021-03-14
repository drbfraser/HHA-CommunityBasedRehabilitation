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
import { Field, FieldArray, Form, Formik, FormikProps } from "formik";
import { CheckboxWithLabel, TextField } from "formik-material-ui";
import React, { useState } from "react";
import {
    fieldLabels,
    FormField,
    ImprovementFormField,
    OutcomeFormField,
    initialValues,
    provisionals,
    validationSchemas,
    GoalStatus,
} from "./formFields";
import { handleSubmit } from "./formHandler";

interface IVisitStep {
    label: string;
    enabled: boolean;
    form: JSX.Element;
}

const visitsTypes: FormField[] = [FormField.health, FormField.education, FormField.social];

const ImprovementField = (props: {
    formikProps: FormikProps<any>;
    visitType: string;
    provided: string;
    index: number;
}) => {
    const [isFieldVisible, setFieldVisibility] = useState<boolean>(
        props.formikProps.values.improvements[props.visitType][props.index]
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
                    label={fieldLabels[FormField.improvements]}
                    required
                    fullWidth
                    multiline
                />
            )}
        </div>
    );
};

const OutcomeField = (props: { visitType: string }) => {
    const fieldName = `${FormField.outcomes}.${props.visitType}`;

    return (
        <div>
            <FormLabel>Client's {props.visitType} Goal Status</FormLabel>
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
                        {status[0].toUpperCase() + status.substr(1).toLowerCase()}
                    </MenuItem>
                ))}
            </Field>
            <br />
            <br />
            <div>
                <FormLabel>What is the Outcome of the Goal?</FormLabel>
                <Field
                    key={`${props.visitType}${OutcomeFormField.outcome}`}
                    type="text"
                    component={TextField}
                    variant="outlined"
                    name={`${fieldName}.${OutcomeFormField.outcome}`}
                    label={fieldLabels[FormField.outcomes]}
                    required
                    fullWidth
                    multiline
                />
                <br />
            </div>
        </div>
    );
};

const VisitTypeStep = (visitType: FormField, formikProps: FormikProps<any>) => {
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

const VisitReasonStep = (formikProps: FormikProps<any>) => {
    const onCheckboxChange = (checked: boolean, visitType: string) => {
        if (checked) {
            formikProps.setFieldValue(`${FormField.outcomes}.${visitType}`, {
                [OutcomeFormField.riskType]: visitType,
                [OutcomeFormField.goalStatus]: GoalStatus.GO,
                [OutcomeFormField.outcome]: "",
            });
        } else {
            formikProps.setFieldValue(`${FormField.outcomes}.${visitType}`, undefined);
        }
    };

    return (
        <FormControl component="fieldset">
            <FormLabel>Select the Reasons for the Visit</FormLabel>
            <FormGroup>
                {visitsTypes.map((visitType) => (
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
    );
};

const NewVisit = () => {
    const [activeStep, setActiveStep] = useState<number>(0);

    const nextStep = (formikProps: FormikProps<any>) => {
        // formikProps.validateForm().then(() => setActiveStep(activeStep + 1));
        setActiveStep(activeStep + 1);
    };

    const prevStep = () => {
        setActiveStep(activeStep - 1);
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchemas[activeStep]}
            onSubmit={handleSubmit}
        >
            {(formikProps) => {
                console.log(formikProps.values);

                const visitSteps: IVisitStep[] = [
                    {
                        label: "Visit Focus",
                        enabled: true,
                        form: VisitReasonStep(formikProps),
                    },
                    ...visitsTypes.map((visitType) => ({
                        label: `${fieldLabels[visitType]} Visit`,
                        enabled: formikProps.values[visitType] as boolean,
                        form: VisitTypeStep(visitType, formikProps),
                    })),
                ];

                return (
                    <Form>
                        <Stepper activeStep={activeStep} orientation="vertical">
                            {visitSteps.map((visitStep, index) => {
                                return visitStep.enabled ? (
                                    <Step key={index}>
                                        <StepLabel>{visitStep.label}</StepLabel>
                                        <StepContent>
                                            {visitStep.form}
                                            <br />
                                            <br />
                                            <Button
                                                style={{ marginRight: "5px" }}
                                                variant="outlined"
                                                color="primary"
                                                onClick={prevStep}
                                            >
                                                Prev Step
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => nextStep(formikProps)}
                                            >
                                                Next Step
                                            </Button>
                                        </StepContent>
                                    </Step>
                                ) : null;
                            })}
                        </Stepper>
                    </Form>
                );
            }}
        </Formik>
    );
};

export default NewVisit;
