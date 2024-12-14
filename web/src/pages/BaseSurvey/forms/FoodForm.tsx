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
import * as Styled from "../baseSurvey.style";

const FoodForm = ({ formikProps }: { formikProps: FormikProps<any> }) => {
    const { t } = useTranslation();

    const hasChildOrIsChild = formikProps.values[BaseSurveyFormField.isChild];
    const childIsMalnourished =
        formikProps.values[BaseSurveyFormField.childNourish] === ChildNourish.MALNOURISHED;

    return (
        <>
            <FormLabel>{t("survey.foodSecurity")}</FormLabel>
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

                {hasChildOrIsChild && (
                    <Styled.FieldIndent>
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
                            {childIsMalnourished && (
                                <Styled.FieldIndent>
                                    <Alert sx={{ marginTop: "0.75em" }} severity="info">
                                        {t("survey.referralRequired")}
                                    </Alert>
                                </Styled.FieldIndent>
                            )}
                        </FormControl>
                    </Styled.FieldIndent>
                )}
            </FormControl>
        </>
    );
};

export default FoodForm;
