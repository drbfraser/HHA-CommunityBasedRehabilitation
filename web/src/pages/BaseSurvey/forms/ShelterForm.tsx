import React from "react";
import { Field } from "formik";
import { CheckboxWithLabel } from "formik-mui";
import { FormControl } from "@mui/material";

import {
    baseFieldLabels,
    BaseSurveyFormField,
} from "@cbr/common/forms/BaseSurvey/baseSurveyFields";

const ShelterForm = () => {
    return (
        <FormControl fullWidth variant="outlined">
            <Field
                component={CheckboxWithLabel}
                type="checkbox"
                color="secondary"
                name={BaseSurveyFormField.haveShelter}
                Label={{ label: baseFieldLabels[BaseSurveyFormField.haveShelter] }}
            />

            <Field
                component={CheckboxWithLabel}
                type="checkbox"
                color="secondary"
                name={BaseSurveyFormField.accessItem}
                Label={{ label: baseFieldLabels[BaseSurveyFormField.accessItem] }}
            />
        </FormControl>
    );
};

export default ShelterForm;
