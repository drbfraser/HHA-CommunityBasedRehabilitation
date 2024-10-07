import {
    Button,
    FormControl,
    FormGroup,
    FormLabel,
    MenuItem,
    Step,
    StepContent,
    StepLabel,
    Stepper,
    Typography,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { Field, FieldArray, Form, Formik, FormikHelpers, FormikProps } from "formik";
import { CheckboxWithLabel, TextField } from "formik-material-ui";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import {
    visitFieldLabels,
    VisitFormField,
    ImprovementFormField,
    OutcomeFormField,
    visitInitialValues,
    provisionals,
    initialValidationSchema,
    visitTypeValidationSchema,
    GoalStatus,
} from "@cbr/common/forms/newVisit/visitFormFields";

import { handleSubmit } from "./formHandler";
import { useStyles } from "./NewVisit.styles";
import history from "@cbr/common/util/history";
import { IRisk } from "@cbr/common/util/risks";
import { apiFetch, Endpoint } from "@cbr/common/util/endpoints";
import { IClient } from "@cbr/common/util/clients";
import { Alert } from '@mui/material';
import { TZoneMap, useZones } from "@cbr/common/util/hooks/zones";

const visitTypes: VisitFormField[] = [
    VisitFormField.health,
    VisitFormField.education,
    VisitFormField.social,
    VisitFormField.nutrition,
    VisitFormField.mental,
];

const ImprovementField = (props: {
    formikProps: FormikProps<any>;
    visitType: string;
    provided: string;
    index: number;
}) => {
    const fieldName = `${VisitFormField.improvements}.${props.visitType}.${props.index}`;
    const isImprovementEnabled =
        props.formikProps.values[VisitFormField.improvements][props.visitType][props.index]?.[
            ImprovementFormField.enabled
        ] === true;

    if (
        props.formikProps.values[VisitFormField.improvements][props.visitType][props.index] ===
        undefined
    ) {
        // Since this component is dynamically generated we need to set its initial values
        props.formikProps.setFieldValue(`${fieldName}`, {
            [ImprovementFormField.id]: "tmp",
            [ImprovementFormField.enabled]: false,
            [ImprovementFormField.description]: "",
            [ImprovementFormField.riskType]: props.visitType,
            [ImprovementFormField.provided]: props.provided,
        });
    }

    return (
        <div key={props.index}>
            <Field
                component={CheckboxWithLabel}
                type="checkbox"
                name={`${fieldName}.${ImprovementFormField.enabled}`}
                Label={{ label: props.provided }}
            />
            <br />
            {isImprovementEnabled && (
                <Field
                    key={`${props.provided}${ImprovementFormField.description}`}
                    type="text"
                    component={TextField}
                    variant="outlined"
                    name={`${fieldName}.${ImprovementFormField.description}`}
                    label={visitFieldLabels[ImprovementFormField.description]}
                    required
                    fullWidth
                    multiline
                />
            )}
        </div>
    );
};

const OutcomeField = (props: { visitType: VisitFormField; risks: IRisk[] }) => {
    const fieldName = `${VisitFormField.outcomes}.${props.visitType}`;

    return (
        <div>
            <FormLabel focused={false}>Client's {visitFieldLabels[props.visitType]} Goal</FormLabel>
            <Typography variant={"body1"}>
                {props.risks.find((r) => r.risk_type === (props.visitType as string))?.goal}
            </Typography>
            <br />

            <FormLabel focused={false}>
                Client's {visitFieldLabels[props.visitType]} Goal Status
            </FormLabel>
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
                        {visitFieldLabels[status]}
                    </MenuItem>
                ))}
            </Field>
            <br />
            <br />
            <div>
                <FormLabel focused={false}>What is the Outcome of the Goal?</FormLabel>
                <Field
                    type="text"
                    component={TextField}
                    variant="outlined"
                    name={`${fieldName}.${OutcomeFormField.outcome}`}
                    label={visitFieldLabels[OutcomeFormField.outcome]}
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

const VisitTypeStep = (visitType: VisitFormField, risks: IRisk[]) => {
    return ({ formikProps }: IStepProps) => {
        return (
            <FormControl>
                <FormLabel focused={false}>Select an Improvement</FormLabel>
                <FieldArray
                    name={VisitFormField.improvements}
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
                <OutcomeField visitType={visitType} risks={risks} />
            </FormControl>
        );
    };
};

const visitReasonStepCallBack =
    (setEnabledSteps: React.Dispatch<React.SetStateAction<VisitFormField[]>>, zones: TZoneMap) =>
    ({ formikProps }: IStepProps) =>
        VisitReasonStep(formikProps, setEnabledSteps, zones);

const VisitReasonStep = (
    formikProps: FormikProps<any>,
    setEnabledSteps: React.Dispatch<React.SetStateAction<VisitFormField[]>>,
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
            formikProps.setFieldValue(`${VisitFormField.outcomes}.${visitType}`, {
                [OutcomeFormField.id]: "tmp",
                [OutcomeFormField.riskType]: visitType,
                [OutcomeFormField.goalStatus]: GoalStatus.ongoing,
                [OutcomeFormField.outcome]: "",
            });
        } else {
            formikProps.setFieldValue(`${VisitFormField.outcomes}.${visitType}`, undefined);
        }
    };
    return (
        <>
            <FormLabel focused={false}>Where was the Visit?</FormLabel>
            <FormControl
                className={styles.visitLocationContainer}
                fullWidth
                required
                variant="outlined"
            >
                <Field
                    className={styles.visitLocation}
                    component={TextField}
                    name={VisitFormField.village}
                    label={visitFieldLabels[VisitFormField.village]}
                    variant="outlined"
                    fullWidth
                    required
                />
                <Field
                    className={styles.visitLocation}
                    component={TextField}
                    select
                    label={visitFieldLabels[VisitFormField.zone]}
                    name={VisitFormField.zone}
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
                <FormLabel focused={false}>Select the Reasons for the Visit</FormLabel>
                <FormGroup>
                    {visitTypes.map((visitType) => (
                        <Field
                            component={CheckboxWithLabel}
                            type="checkbox"
                            key={visitType}
                            name={visitType}
                            Label={{ label: visitFieldLabels[visitType] }}
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
    const [enabledSteps, setEnabledSteps] = useState<VisitFormField[]>([]);
    const [risks, setRisks] = useState<IRisk[]>([]);
    const [submissionError, setSubmissionError] = useState<string>();
    const [loadingError, setLoadingError] = useState(false);
    const zones = useZones();
    const { clientId } = useParams<{ clientId: string }>();

    useEffect(() => {
        apiFetch(Endpoint.CLIENT, `${clientId}`)
            .then((resp) => resp.json())
            .then((client: IClient) => {
                client.risks.sort((a: IRisk, b: IRisk) => b.timestamp - a.timestamp);
                setRisks(client.risks);
            })
            .catch(() => {
                setLoadingError(true);
            });
    }, [clientId]);

    const isFinalStep = activeStep === enabledSteps.length && activeStep !== 0;

    const visitSteps = [
        {
            label: "Visit Focus",
            Form: visitReasonStepCallBack(setEnabledSteps, zones),
            validationSchema: initialValidationSchema,
        },
        ...enabledSteps.map((visitType) => ({
            label: `${visitFieldLabels[visitType]} Visit`,
            Form: VisitTypeStep(visitType, risks),
            validationSchema: visitTypeValidationSchema(visitType),
        })),
    ];

    const nextStep = (values: any, helpers: FormikHelpers<any>) => {
        if (isFinalStep) {
            handleSubmit(values, helpers, setSubmissionError);
        } else {
            if (activeStep === 0) {
                helpers.setFieldValue(`${[VisitFormField.client_id]}`, clientId);
            }
            setActiveStep(activeStep + 1);
            helpers.setSubmitting(false);
            helpers.setTouched({});
        }
    };

    const prevStep = () => {
        setActiveStep(activeStep - 1);
    };

    return loadingError ? (
        <Alert severity="error">Something went wrong loading the client. Please try again.</Alert>
    ) : (
        <Formik
            initialValues={visitInitialValues}
            validationSchema={visitSteps[activeStep].validationSchema}
            onSubmit={nextStep}
        >
            {(formikProps) => (
                <Form>
                    {submissionError && (
                        <Alert onClose={() => setSubmissionError(undefined)} severity="error">
                            Error occurred trying to submit the visit: {submissionError}
                        </Alert>
                    )}
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
                                                formikProps.values[VisitFormField.health] ||
                                                formikProps.values[VisitFormField.education] ||
                                                formikProps.values[VisitFormField.social] ||
                                                formikProps.values[VisitFormField.nutrition] ||
                                                formikProps.values[VisitFormField.mental]
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
