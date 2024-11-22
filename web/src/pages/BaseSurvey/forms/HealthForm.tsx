import React from "react";
import { useTranslation } from "react-i18next";
import { Field, FormikProps } from "formik";
import { CheckboxWithLabel, TextField } from "formik-mui";
import { FormControl, FormLabel, MenuItem, styled } from "@mui/material";

import {
    baseFieldLabels,
    BaseSurveyFormField,
} from "@cbr/common/forms/BaseSurvey/baseSurveyFields";
import { deviceTypes, rateLevel } from "@cbr/common/util/survey";
import { FieldIndent } from "components/StyledComponents/StyledComponents";
import { Container } from "../baseSurvey.style";

const CheckboxSection = styled("div")({
    display: "flex",
    flexDirection: "column",
    gap: "0.75em",
});

const HealthForm = ({ formikProps }: { formikProps: FormikProps<any> }) => {
    const { t } = useTranslation();

    return (
        <Container sx={{ gap: "1.5em" }}>
            <FormLabel>{t("survey.rateHealth")}</FormLabel>

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
                            {t("survey.assistiveDeviceNeeds")}
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

            <FormLabel>{t("survey.satisfiedWithHealthService")}</FormLabel>
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
