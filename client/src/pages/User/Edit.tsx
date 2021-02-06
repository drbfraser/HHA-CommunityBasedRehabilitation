import React from "react";
import { useStyles } from "./Edit.styles";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import Grid from "@material-ui/core/Grid";
import { fieldLabels, UserField, initialValues, validationSchema } from "./fields";
import Button from "@material-ui/core/Button";
import { FormikHelpers } from "formik";
import { TFormValues } from "./fields";
import { useHistory } from "react-router-dom";

const Edit = () => {
    const styles = useStyles();
    const history = useHistory();
    const handleCancel = () => history.push("/user");
    const handleSubmit = (values: TFormValues, helpers: FormikHelpers<TFormValues>) => {
        // Submit the values to the server
        setTimeout(() => {
            console.log(values);
            helpers.setSubmitting(false);
        }, 1000);
    };
    return (
        // Formik Forms from Ethan's form example
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting }) => (
                <div className={styles.container}>
                    <h1>{initialValues.userName}</h1>
                    <label className={styles.label}>ID</label>
                    <p>{initialValues.id}</p>

                    <Form className={styles.form}>
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12}>
                                <Field
                                    component={TextField}
                                    fullWidth
                                    required
                                    variant="outlined"
                                    label={fieldLabels[UserField.zoneNumber]}
                                    name={UserField.zoneNumber}
                                />
                            </Grid>
                        </Grid>
                        <br></br>

                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12}>
                                <Field
                                    component={TextField}
                                    fullWidth
                                    required
                                    variant="outlined"
                                    label={fieldLabels[UserField.phoneNumber]}
                                    name={UserField.phoneNumber}
                                />
                            </Grid>
                        </Grid>
                        <br></br>

                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12}>
                                <Field
                                    component={TextField}
                                    fullWidth
                                    required
                                    variant="outlined"
                                    label={fieldLabels[UserField.email]}
                                    name={UserField.email}
                                />
                            </Grid>
                        </Grid>
                        <br></br>

                        <Button className={styles.btn} onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button
                            className={styles.btn}
                            variant="contained"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            Save
                        </Button>
                        <br></br>
                    </Form>
                </div>
            )}
        </Formik>
    );
};

export default Edit;
