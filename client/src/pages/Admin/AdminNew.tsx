import React from "react";
import { useStyles } from "./styles";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import Grid from "@material-ui/core/Grid";
import { fieldLabels, AdminField, initialValues, validationSchema, workerOptions } from "./fields";
import Button from "@material-ui/core/Button";
import { FormikHelpers } from "formik";
import { TFormValues } from "./fields";
import { useHistory } from "react-router-dom";
import { FormControl, MenuItem } from "@material-ui/core";

const AdminNew = () => {
    const styles = useStyles();
    const history = useHistory();
    const handleCancel = () => history.push("/admin");
    const handleSubmit = (values: TFormValues, helpers: FormikHelpers<TFormValues>) => {
        setTimeout(() => {
            console.log(values);
            helpers.setSubmitting(false);
        }, 1000);
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting }) => (
                <div className={styles.container}>
                    <b>ID</b>
                    <p>{initialValues.id}</p>
                    <Form>
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12}>
                                <Field
                                    component={TextField}
                                    name={AdminField.firstName}
                                    variant="outlined"
                                    label={fieldLabels[AdminField.firstName]}
                                    required
                                    fullWidth
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <Field
                                    component={TextField}
                                    name={AdminField.lastName}
                                    variant="outlined"
                                    label={fieldLabels[AdminField.lastName]}
                                    required
                                    fullWidth
                                />
                            </Grid>
                            <Grid item md={7} xs={12}>
                                <Field
                                    component={TextField}
                                    fullWidth
                                    required
                                    variant="outlined"
                                    type="number"
                                    label={fieldLabels[AdminField.zone]}
                                    name={AdminField.zone}
                                />
                            </Grid>

                            <Grid item md={7} xs={12}>
                                <Field
                                    component={TextField}
                                    fullWidth
                                    required
                                    variant="outlined"
                                    label={fieldLabels[AdminField.phoneNumber]}
                                    name={AdminField.phoneNumber}
                                />
                            </Grid>
                            <Grid item md={7} xs={12}>
                                <FormControl fullWidth variant="outlined">
                                    <Field
                                        component={TextField}
                                        select
                                        required
                                        variant="outlined"
                                        label={fieldLabels[AdminField.type]}
                                        name={AdminField.type}
                                    >
                                        {workerOptions.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.name}
                                            </MenuItem>
                                        ))}
                                    </Field>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br />

                        <div>
                            <Grid container justify="flex-end" spacing={2}>
                                <Grid item>
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        Save
                                    </Button>
                                </Grid>

                                <Grid item>
                                    <Button
                                        color="primary"
                                        variant="outlined"
                                        onClick={handleCancel}
                                    >
                                        Back
                                    </Button>
                                </Grid>
                            </Grid>
                            <br></br>
                        </div>
                    </Form>
                </div>
            )}
        </Formik>
    );
};

export default AdminNew;
