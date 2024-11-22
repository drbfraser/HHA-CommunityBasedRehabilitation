import React from "react";
import { Field, FormikProps } from "formik";
import { CheckboxWithLabel, TextField } from "formik-mui";
import { FormControl, FormLabel, MenuItem, styled } from "@mui/material";

import {
    baseFieldLabels,
    BaseSurveyFormField,
} from "@cbr/common/forms/BaseSurvey/baseSurveyFields";
import { deviceTypes, rateLevel } from "@cbr/common/util/survey";
import { Container, FieldIndent } from "../baseSurvey.style";

const CheckboxSection = styled("div")({
    display: "flex",
    flexDirection: "column",
    gap: "0.75em",
});

const HealthForm = ({ formikProps }: { formikProps: FormikProps<any> }) => {
    return (
        <Container sx={{ gap: "1.5em" }}>
            <FormLabel>Rate your general health</FormLabel>

            <FormControl fullWidth variant="outlined">
                <Field
                    select
                    label={baseFieldLabels[BaseSurveyFormField.rateLevel]}
                    name={BaseSurveyFormField.rateLevel}
                    required
                    variant="outlined"
                    component={TextField}
                >
                    {Object.entries(rateLevel).map(([value, { name }]) => (
                        <MenuItem key={value} value={value}>
                            {name}
                        </MenuItem>
                    ))}
                </Field>
            </FormControl>

            <CheckboxSection>
                <Field
                    type="checkbox"
                    Label={{ label: baseFieldLabels[BaseSurveyFormField.getService] }}
                    name={BaseSurveyFormField.getService}
                    color="secondary"
                    component={CheckboxWithLabel}
                />
                <Field
                    type="checkbox"
                    Label={{ label: baseFieldLabels[BaseSurveyFormField.needService] }}
                    name={BaseSurveyFormField.needService}
                    color="secondary"
                    component={CheckboxWithLabel}
                />
                <Field
                    type="checkbox"
                    Label={{ label: baseFieldLabels[BaseSurveyFormField.mentalHealth] }}
                    name={BaseSurveyFormField.mentalHealth}
                    color="secondary"
                    component={CheckboxWithLabel}
                />
                <Field
                    type="checkbox"
                    Label={{ label: baseFieldLabels[BaseSurveyFormField.haveDevice] }}
                    name={BaseSurveyFormField.haveDevice}
                    color="secondary"
                    component={CheckboxWithLabel}
                />
                <Field
                    type="checkbox"
                    Label={{ label: baseFieldLabels[BaseSurveyFormField.deviceWorking] }}
                    name={BaseSurveyFormField.deviceWorking}
                    color="secondary"
                    component={CheckboxWithLabel}
                />
                <Field
                    type="checkbox"
                    Label={{ label: baseFieldLabels[BaseSurveyFormField.needDevice] }}
                    name={BaseSurveyFormField.needDevice}
                    color="secondary"
                    component={CheckboxWithLabel}
                />
            </CheckboxSection>

            {formikProps.values[BaseSurveyFormField.needDevice] && (
                <FieldIndent>
                    <FormControl fullWidth variant="outlined">
                        <FormLabel sx={{ marginBottom: "1em" }}>
                            What assistive device do you need?
                        </FormLabel>
                        <Field
                            select
                            label={baseFieldLabels[BaseSurveyFormField.deviceType]}
                            name={BaseSurveyFormField.deviceType}
                            required
                            variant="outlined"
                            component={TextField}
                        >
                            {Object.entries(deviceTypes).map(([value, name]) => (
                                <MenuItem key={value} value={value}>
                                    {name}
                                </MenuItem>
                            ))}
                        </Field>
                    </FormControl>
                </FieldIndent>
            )}

            <FormLabel>Are you satisfied with the health services you receive?</FormLabel>
            <FormControl fullWidth variant="outlined">
                <Field
                    select
                    label={baseFieldLabels[BaseSurveyFormField.serviceSatisf]}
                    name={BaseSurveyFormField.serviceSatisf}
                    required
                    variant="outlined"
                    component={TextField}
                >
                    {Object.entries(rateLevel).map(([value, { name }]) => (
                        <MenuItem key={value} value={value}>
                            {name}
                        </MenuItem>
                    ))}
                </Field>
            </FormControl>
        </Container>
    );
};

export default HealthForm;
