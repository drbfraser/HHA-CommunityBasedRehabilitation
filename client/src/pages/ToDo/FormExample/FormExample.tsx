import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import { Field, Form, Formik } from "formik";
import { CheckboxWithLabel, Select, TextField } from "formik-material-ui";
import React from "react";
import { handleSubmit } from "./handlers";
import { dropdownOptions, fieldLabels, FormField, initialValues, validationSchema } from "./fields";

const FormExample = () => (
    <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
    >
        {({ values, isSubmitting }) => (
            <Form>
                <Grid container spacing={2}>
                    <Grid item md={6}>
                        <Field
                            component={TextField}
                            fullWidth
                            required
                            variant="outlined"
                            label={fieldLabels[FormField.textInputRequired]}
                            name={FormField.textInputRequired}
                        />
                    </Grid>
                    <Grid item md={6}>
                        <Field
                            component={TextField}
                            fullWidth
                            variant="outlined"
                            label={fieldLabels[FormField.textInputOptional]}
                            name={FormField.textInputOptional}
                        />
                    </Grid>
                    <Grid item md={6}>
                        <Field
                            component={TextField}
                            fullWidth
                            variant="outlined"
                            label={fieldLabels[FormField.textInputPrefilled]}
                            name={FormField.textInputPrefilled}
                        />
                    </Grid>
                    <Grid item md={6}>
                        <Field
                            component={TextField}
                            type="number"
                            fullWidth
                            variant="outlined"
                            label={fieldLabels[FormField.numericInput]}
                            name={FormField.numericInput}
                        />
                    </Grid>
                    <Grid item md={12}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel>{fieldLabels[FormField.dropdown]}</InputLabel>
                            <Field
                                component={Select}
                                fullWidth
                                label={fieldLabels[FormField.dropdown]}
                                name={FormField.dropdown}
                            >
                                {dropdownOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.name}
                                    </MenuItem>
                                ))}
                            </Field>
                        </FormControl>
                    </Grid>
                    <Grid item md={12}>
                        <Field
                            component={CheckboxWithLabel}
                            type="checkbox"
                            name={FormField.checkbox}
                            Label={{ label: fieldLabels[FormField.checkbox] }}
                        />
                        {values.checkbox ? (
                            <Field
                                component={TextField}
                                fullWidth
                                multiline
                                rows={4}
                                variant="outlined"
                                label={fieldLabels[FormField.multiLineInput]}
                                name={FormField.multiLineInput}
                            />
                        ) : (
                            <></>
                        )}
                    </Grid>
                </Grid>
                <br />
                <Button color="primary" variant="contained" type="submit" disabled={isSubmitting}>
                    Submit
                </Button>
            </Form>
        )}
    </Formik>
);

export default FormExample;
