import React from "react";
import { useTranslation } from "react-i18next";
import { Button, FormControl, Grid, MenuItem } from "@mui/material";
import { Field, Formik, Form } from "formik";
import { TextField } from "formik-mui";
import { priorities } from "@cbr/common/util/alerts";
import {
    alertFieldLabels,
    alertField,
    alertInitialValues,
    validationSchema,
} from "@cbr/common/forms/Alert/alertFields";
import { handleDiscard, handleNewWebAlertSubmit } from "@cbr/common/forms/Alert/alertHandler";

const AlertForm = () => {
    const { t } = useTranslation();

    return (
        <Formik
            initialValues={alertInitialValues}
            validationSchema={validationSchema}
            onSubmit={handleNewWebAlertSubmit}
        >
            {({ values, isSubmitting, resetForm, touched, setFieldValue }) => (
                <Form>
                    <Grid container justifyContent="center" alignItems="flex-start">
                        <Grid container direction="row" justifyContent="flex-start" spacing={1}>
                            <Grid item md={8} xs={8}>
                                <Field
                                    component={TextField}
                                    name={alertField.subject}
                                    variant="outlined"
                                    label={alertFieldLabels[alertField.subject]}
                                    required
                                    fullWidth
                                />
                            </Grid>

                            {/* https://stackoverflow.com/a/67961603 for the warning */}
                            <Grid item md={4} xs={6}>
                                <FormControl fullWidth variant="outlined">
                                    <Field
                                        component={TextField}
                                        fullWidth
                                        select
                                        required
                                        variant="outlined"
                                        label={alertFieldLabels[alertField.priority]}
                                        name={alertField.priority}
                                    >
                                        {Object.entries(priorities).map(([value, name]) => (
                                            <MenuItem key={value} value={value}>
                                                {name}
                                            </MenuItem>
                                        ))}
                                    </Field>
                                </FormControl>
                            </Grid>

                            <Grid item md={12} xs={12}>
                                <Field
                                    component={TextField}
                                    fullWidth
                                    multiline
                                    rows={12}
                                    required
                                    variant="outlined"
                                    label={alertFieldLabels[alertField.alert_message]}
                                    name={alertField.alert_message}
                                />
                            </Grid>

                            <Grid item md={12} xs={12}>
                                <Grid container spacing={2}>
                                    <Grid item md={8} xs={4}>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={() => handleDiscard(resetForm)}
                                        >
                                            {t("general.discard")}
                                        </Button>
                                    </Grid>
                                    <Grid item md={4} xs={8}>
                                        <Grid container justifyContent="flex-end">
                                            {/* 
                                            // Save functionality is not yet implemented, therefore the save button is disabled
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                onClick={() => handleSave(values)}
                                            >
                                                Save
                                            </Button> */}
                                            &nbsp;
                                            <Button
                                                variant="outlined"
                                                color="success"
                                                type="submit"
                                                disabled={isSubmitting}
                                            >
                                                {t("general.submit")}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Form>
            )}
        </Formik>
    );
};

export default AlertForm;
