import {
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    MenuItem,
    Select,
    Step,
    StepContent,
    StepLabel,
    Stepper,
} from "@material-ui/core";
import { Field, FieldArray, Form, Formik, FormikProps } from "formik";
import { CheckboxWithLabel, TextField } from "formik-material-ui";
import { useState } from "react";
import {
    fieldLabels,
    FormField,
    initialValues,
    provisionals,
    validationSchema,
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
    formikProps: FormikProps<any>
    visitType: string;
    provided: string;
    index: number;
}) => {
    const [isFieldVisible, setFieldVisibility] = useState<boolean>(props.formikProps.values.improvements[props.visitType][props.index]);

    const fieldName = `${FormField.improvements}.${props.visitType}.${props.index}`;

    const onCheckboxChange = (checked: boolean) => {
        setFieldVisibility(checked);
        if (checked) {
            props.formikProps.setFieldValue(`${fieldName}`, { risk_type: props.visitType, provided: props.provided, desc: "" })
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
                    onChange={(event => onCheckboxChange(event.currentTarget.checked))}
                    name={props.provided}
                />
                }
                label={props.provided}
            />

            <br />
            {isFieldVisible && (
                <Field
                    key={`${props.provided}Desc`}
                    type="text"
                    component={TextField}
                    variant="outlined"
                    name={`${fieldName}.desc`}
                    label="Description"
                    required
                    fullWidth
                    multiline
                />
            )}
        </div>
    );
};

const OutcomeField = (props: { visitType: string }) => {
    const [goalStatus, setGoalStatus] = useState<string>(GoalStatus.ONGOING);

    const fieldName = `${FormField.outcomes}.${props.visitType}`;


    return (
        <div>
            <FormLabel>Client's {props.visitType} Goal Status</FormLabel>
            <br />
            <Select
                variant="outlined"
                defaultValue={GoalStatus.ONGOING}
                value={goalStatus}
                onChange={(event) => setGoalStatus(String(event.target.value))}
            >
                {Object.values(GoalStatus).map((status) => (
                    <MenuItem key={status} value={status}>
                        {status[0].toUpperCase() + status.slice(1)}
                    </MenuItem>
                ))}
            </Select>

            <br />
            <br />
            {goalStatus !== GoalStatus.ONGOING && (
                <div>
                    <FormLabel>What is the Outcome of the Goal?</FormLabel>
                    <Field
                        key={`${props.visitType}Outcome`}
                        type="text"
                        component={TextField}
                        variant="outlined"
                        name={`${fieldName}.outcome`}
                        label={fieldLabels[FormField.outcomes]}
                        required
                        fullWidth
                        multiline
                    />
                    <br />
                </div>
            )}
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

const VisitReasonStep = () => {
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
                    />
                ))}
            </FormGroup>
        </FormControl>
    );
};

const NewVisit = () => {
    const [activeStep, setActiveStep] = useState<number>(0);

    const nextStep = () => {
        setActiveStep(activeStep + 1);
    };

    const prevStep = () => {
        setActiveStep(activeStep - 1);
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {(formikProps) => {
                console.log(formikProps.values);
                

                const visitSteps: IVisitStep[] = [
                    {
                        label: "Visit Focus",
                        enabled: true,
                        form: VisitReasonStep(),
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
                                                onClick={nextStep}
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
