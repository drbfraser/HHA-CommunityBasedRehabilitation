import React from "react";
import { Field, FormikProps } from "formik";
import { CheckboxWithLabel, TextField } from "formik-mui";
import { FormControl, FormLabel, MenuItem } from "@mui/material";

import {
    baseFieldLabels,
    BaseSurveyFormField,
} from "@cbr/common/forms/BaseSurvey/baseSurveyFields";
import { grade, reasonNotSchool } from "@cbr/common/util/survey";
import { Container, FieldDoubleIndent } from "../baseSurvey.style";

const EducationForm = ({ formikProps }: { formikProps: FormikProps<any> }) => {
    return (
        <Container>
            <Field
                type="checkbox"
                color="secondary"
                Label={{ label: baseFieldLabels[BaseSurveyFormField.goSchool] }}
                name={BaseSurveyFormField.goSchool}
                component={CheckboxWithLabel}
            />

            <FieldDoubleIndent>
                {formikProps.values[BaseSurveyFormField.goSchool] ? (
                    <>
                        <FormLabel>What grade?</FormLabel>
                        <FormControl fullWidth variant="outlined" margin="normal">
                            <Field
                                select
                                variant="outlined"
                                required
                                label={baseFieldLabels[BaseSurveyFormField.grade]}
                                name={BaseSurveyFormField.grade}
                                component={TextField}
                            >
                                {Object.entries(grade).map(([value, { name }]) => (
                                    <MenuItem key={value} value={value}>
                                        {name}
                                    </MenuItem>
                                ))}
                            </Field>
                        </FormControl>
                    </>
                ) : (
                    <>
                        <FormLabel>Why do you not go to school?</FormLabel>
                        <FormControl fullWidth variant="outlined" margin="normal">
                            <Field
                                select
                                variant="outlined"
                                required
                                label={baseFieldLabels[BaseSurveyFormField.reasonNotSchool]}
                                name={BaseSurveyFormField.reasonNotSchool}
                                component={TextField}
                            >
                                {Object.entries(reasonNotSchool).map(([value, name]) => (
                                    <MenuItem key={value} value={value}>
                                        {name}
                                    </MenuItem>
                                ))}
                            </Field>
                            <Field
                                type="checkbox"
                                color="secondary"
                                name={BaseSurveyFormField.beenSchool}
                                Label={{
                                    label: baseFieldLabels[BaseSurveyFormField.beenSchool],
                                }}
                                component={CheckboxWithLabel}
                            />
                        </FormControl>
                    </>
                )}
            </FieldDoubleIndent>

            <Field
                type="checkbox"
                color="secondary"
                name={BaseSurveyFormField.wantSchool}
                Label={{ label: baseFieldLabels[BaseSurveyFormField.wantSchool] }}
                component={CheckboxWithLabel}
            />
        </Container>
    );
};

export default EducationForm;
