import React from "react";
import { Field, FormikProps } from "formik";
import { CheckboxWithLabel, TextField } from "formik-mui";
import { FormControl, FormLabel, MenuItem } from "@mui/material";

import {
    baseFieldLabels,
    BaseSurveyFormField,
} from "@cbr/common/forms/BaseSurvey/baseSurveyFields";
import { isSelfEmployed } from "@cbr/common/util/survey";
import { Container, FieldIndent } from "../baseSurvey.style";

const LivelihoodForm = ({ formikProps }: { formikProps: FormikProps<any> }) => {
    return (
        <FieldIndent>
            <FormControl fullWidth variant="outlined">
                <Field
                    component={CheckboxWithLabel}
                    type="checkbox"
                    color="secondary"
                    name={BaseSurveyFormField.isWorking}
                    Label={{ label: baseFieldLabels[BaseSurveyFormField.isWorking] }}
                />
            </FormControl>

            {formikProps.values[BaseSurveyFormField.isWorking] && (
                <Container sx={{ gap: "1.5em", paddingLeft: "9px" }}>
                    <FormLabel>What do you do?</FormLabel>
                    <FormControl fullWidth variant="outlined">
                        <Field
                            component={TextField}
                            multiline
                            variant="outlined"
                            label={baseFieldLabels[BaseSurveyFormField.job]}
                            name={BaseSurveyFormField.job}
                            fullWidth
                        />
                    </FormControl>

                    <FormLabel>Are you employed or self-employed?</FormLabel>
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
                        <Field
                            component={CheckboxWithLabel}
                            type="checkbox"
                            color="secondary"
                            name={BaseSurveyFormField.meetFinanceNeeds}
                            Label={{ label: baseFieldLabels[BaseSurveyFormField.meetFinanceNeeds] }}
                        />
                    </FormControl>
                </Container>
            )}

            <FormControl fullWidth variant="outlined">
                <Field
                    component={CheckboxWithLabel}
                    type="checkbox"
                    color="secondary"
                    name={BaseSurveyFormField.disabiAffectWork}
                    Label={{ label: baseFieldLabels[BaseSurveyFormField.disabiAffectWork] }}
                />

                <Field
                    component={CheckboxWithLabel}
                    type="checkbox"
                    color="secondary"
                    name={BaseSurveyFormField.wantWork}
                    Label={{ label: baseFieldLabels[BaseSurveyFormField.wantWork] }}
                />
            </FormControl>
        </FieldIndent>
    );
};

export default LivelihoodForm;
