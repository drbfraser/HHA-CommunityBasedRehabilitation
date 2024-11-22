import React from "react";
import { Field } from "formik";
import { CheckboxWithLabel } from "formik-mui";
import { FormControl } from "@mui/material";

import {
    baseFieldLabels,
    BaseSurveyFormField,
} from "@cbr/common/forms/BaseSurvey/baseSurveyFields";
import { Container } from "../baseSurvey.style";

const SocialForm = () => {
    return (
        <FormControl fullWidth variant="outlined">
            <Container>
                <Field
                    component={CheckboxWithLabel}
                    type="checkbox"
                    color="secondary"
                    name={BaseSurveyFormField.feelValue}
                    Label={{ label: baseFieldLabels[BaseSurveyFormField.feelValue] }}
                />
                <Field
                    component={CheckboxWithLabel}
                    type="checkbox"
                    color="secondary"
                    name={BaseSurveyFormField.feelIndependent}
                    Label={{ label: baseFieldLabels[BaseSurveyFormField.feelIndependent] }}
                />
                <Field
                    component={CheckboxWithLabel}
                    type="checkbox"
                    color="secondary"
                    name={BaseSurveyFormField.ableInSocial}
                    Label={{ label: baseFieldLabels[BaseSurveyFormField.ableInSocial] }}
                />
                <Field
                    component={CheckboxWithLabel}
                    type="checkbox"
                    color="secondary"
                    name={BaseSurveyFormField.disabiAffectSocial}
                    Label={{ label: baseFieldLabels[BaseSurveyFormField.disabiAffectSocial] }}
                />
                <Field
                    component={CheckboxWithLabel}
                    type="checkbox"
                    color="secondary"
                    name={BaseSurveyFormField.disabiDiscrimination}
                    Label={{ label: baseFieldLabels[BaseSurveyFormField.disabiDiscrimination] }}
                />
            </Container>
        </FormControl>
    );
};

export default SocialForm;
