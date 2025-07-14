import React from "react";
import { useTranslation } from "react-i18next";
import { FormLabel } from "@mui/material";
import { Field } from "formik";
import { TextField } from "formik-mui";
import {
    visitFieldLabels,
    VisitFormField,
    OutcomeFormField,
} from "@cbr/common/forms/newVisit/visitFormFields";

interface IModalProps {
    visitType: VisitFormField;
}

const OutcomeField = (props: IModalProps) => {
    const { t } = useTranslation();
    const fieldName = `${VisitFormField.outcomes}.${props.visitType}`;

    return (
        <div>
            <FormLabel focused={false}>{t("newVisit.outcomeOfGoal")}</FormLabel>
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
        </div>
    );
};

export default OutcomeField;
