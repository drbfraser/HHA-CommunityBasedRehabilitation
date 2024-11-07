import React from "react";
import { Field, FormikProps } from "formik";
import { CheckboxWithLabel, TextField } from "formik-material-ui";

import {
    visitFieldLabels,
    VisitFormField,
    ImprovementFormField,
} from "@cbr/common/forms/newVisit/visitFormFields";

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

export default ImprovementField;
