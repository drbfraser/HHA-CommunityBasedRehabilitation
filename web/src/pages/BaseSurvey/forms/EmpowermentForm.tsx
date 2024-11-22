import React from "react";
import { Field, FormikProps } from "formik";
import { CheckboxWithLabel, TextField } from "formik-mui";
import { FormControl } from "@mui/material";

import {
    baseFieldLabels,
    BaseSurveyFormField,
} from "@cbr/common/forms/BaseSurvey/baseSurveyFields";
import { FieldIndent } from "components/StyledComponents/StyledComponents";

const EmpowermentForm = ({ formikProps }: { formikProps: FormikProps<any> }) => {
    return (
        <FormControl fullWidth variant="outlined">
            <Field
                component={CheckboxWithLabel}
                type="checkbox"
                color="secondary"
                name={BaseSurveyFormField.memOfOrgan}
                Label={{ label: baseFieldLabels[BaseSurveyFormField.memOfOrgan] }}
            />
            {formikProps.values[BaseSurveyFormField.memOfOrgan] && (
                <FieldIndent>
                    <Field
                        component={TextField}
                        multiline
                        variant="outlined"
                        label={baseFieldLabels[BaseSurveyFormField.organization]}
                        name={BaseSurveyFormField.organization}
                        fullWidth
                    />
                </FieldIndent>
            )}

            <FormControl fullWidth variant="outlined">
                <Field
                    component={CheckboxWithLabel}
                    type="checkbox"
                    color="secondary"
                    name={BaseSurveyFormField.awareRight}
                    Label={{ label: baseFieldLabels[BaseSurveyFormField.awareRight] }}
                />

                <Field
                    component={CheckboxWithLabel}
                    type="checkbox"
                    color="secondary"
                    name={BaseSurveyFormField.ableInfluence}
                    Label={{ label: baseFieldLabels[BaseSurveyFormField.ableInfluence] }}
                />
            </FormControl>
        </FormControl>
    );
};

export default EmpowermentForm;
