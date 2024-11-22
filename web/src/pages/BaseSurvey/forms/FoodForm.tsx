import React from "react";
import { useTranslation } from "react-i18next";
import { Field, FormikProps } from "formik";
import { CheckboxWithLabel, TextField } from "formik-mui";
import { Alert, FormControl, FormLabel, MenuItem } from "@mui/material";

import {
    baseFieldLabels,
    BaseSurveyFormField,
} from "@cbr/common/forms/BaseSurvey/baseSurveyFields";
import { ChildNourish, childNourish, rateLevel } from "@cbr/common/util/survey";
import { FieldIndent } from "../baseSurvey.style";

const FoodForm = ({ formikProps }: { formikProps: FormikProps<any> }) => {
    const { t } = useTranslation();

    return (
        <>
            <FormLabel>Food security</FormLabel>
            <FormControl fullWidth variant="outlined" margin="normal">
                <Field
                    component={TextField}
                    select
                    required
                    variant="outlined"
                    label={baseFieldLabels[BaseSurveyFormField.foodSecurityRate]}
                    name={BaseSurveyFormField.foodSecurityRate}
                >
                    {Object.entries(rateLevel).map(([value, { name }]) => (
                        <MenuItem key={value} value={value}>
                            {name}
                        </MenuItem>
                    ))}
                </Field>
                <Field
                    component={CheckboxWithLabel}
                    type="checkbox"
                    color="secondary"
                    name={BaseSurveyFormField.enoughFoodPerMonth}
                    Label={{ label: baseFieldLabels[BaseSurveyFormField.enoughFoodPerMonth] }}
                />
                <Field
                    component={CheckboxWithLabel}
                    type="checkbox"
                    color="secondary"
                    name={BaseSurveyFormField.isChild}
                    Label={{ label: baseFieldLabels[BaseSurveyFormField.isChild] }}
                />

                {formikProps.values[BaseSurveyFormField.isChild] && (
                    <FieldIndent>
                        <FormControl fullWidth variant="outlined" margin="normal">
                            <FormLabel>{t("survey.whatsNutritionStatus")}</FormLabel>
                            <Field
                                component={TextField}
                                select
                                required
                                variant="outlined"
                                label={baseFieldLabels[BaseSurveyFormField.childNourish]}
                                name={BaseSurveyFormField.childNourish}
                            >
                                {Object.entries(childNourish).map(([value, name]) => (
                                    <MenuItem key={value} value={value}>
                                        {name}
                                    </MenuItem>
                                ))}
                            </Field>
                            {formikProps.values[BaseSurveyFormField.childNourish] ===
                                ChildNourish.MALNOURISHED && (
                                <FieldIndent>
                                    <Alert sx={{ marginTop: "0.75em" }} severity="info">
                                        A referral to the health center is required!
                                    </Alert>
                                </FieldIndent>
                            )}
                        </FormControl>
                    </FieldIndent>
                )}
            </FormControl>
        </>
    );
};

export default FoodForm;
