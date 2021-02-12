import React from "react";
import { useStyles } from "./styles";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import Grid from "@material-ui/core/Grid";
import { fieldLabels, UserField, initialValues, validationSchema } from "./fields";
import Button from "@material-ui/core/Button";
import { FormikHelpers } from "formik";
import { TFormValues } from "./fields";
import { useHistory } from "react-router-dom";

const UserEdit = () => {
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
                    <b>ID</b>
                    <p>{initialValues.id}</p>

                    <Form>
                        <Grid container spacing={2}>
                            <Grid item md={7} xs={12}>
                                <Field
                                    component={TextField}
                                    fullWidth
                                    required
                                    variant="outlined"
                                    label={fieldLabels[UserField.zoneNumber]}
                                    name={UserField.zoneNumber}
                                />
                            </Grid>
                            <br></br>

                            <Grid item md={7} xs={12}>
                                <Field
                                    component={TextField}
                                    fullWidth
                                    required
                                    variant="outlined"
                                    label={fieldLabels[UserField.phoneNumber]}
                                    name={UserField.phoneNumber}
                                />
                            </Grid>
                            <br></br>

                            <Grid item md={7} xs={12}>
                                <Field
                                    component={TextField}
                                    fullWidth
                                    required
                                    variant="outlined"
                                    label={fieldLabels[UserField.email]}
                                    name={UserField.email}
                                />
                            </Grid>
                            <br></br>
                        </Grid>
                        <br></br>
                        <br></br>
                        <div className={styles.editContainer}>
                            <Grid justify="flex-end" container spacing={2}>
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

export default UserEdit;
