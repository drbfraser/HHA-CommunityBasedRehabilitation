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

export enum UserActive {
    disable = "Disable",
    active = "Active",
}
const AdminEdit = () => {
    const styles = useStyles();
    const history = useHistory();
    const handleCancel = () => history.goBack();
    let isUserActive = initialValues.status === UserActive.active;
    let btnLabel = isUserActive ? UserActive.disable : UserActive.active;
    const userId = history.location.state as number;
    const handleSubmit = (values: TFormValues, helpers: FormikHelpers<TFormValues>) => {
        setTimeout(() => {
            console.log(values);
            helpers.setSubmitting(false);
        }, 1000);
    };
    const handleDisable = () => {
        if (isUserActive) {
            initialValues.status = UserActive.disable;
            btnLabel = UserActive.active;
        } else {
            initialValues.status = UserActive.active;
            btnLabel = UserActive.disable;
        }
        isUserActive = !isUserActive;
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
                    <p>{userId}</p>
                    <Form>
                        <b>Username </b>
                        <br />
                        <br />
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
                                    required
                                    name={AdminField.lastName}
                                    variant="outlined"
                                    label={fieldLabels[AdminField.lastName]}
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
                        <b>Status</b>
                        <p>{initialValues.status}</p>
                        <br />

                        <div>
                            <Grid
                                container
                                direction="row"
                                spacing={2}
                                justify="space-between"
                                alignItems="center"
                            >
                                <Button
                                    variant="contained"
                                    type="reset"
                                    className={
                                        isUserActive ? styles["disableBtn"] : styles["activeBtn"]
                                    }
                                    disabled={isSubmitting}
                                    onClick={handleDisable}
                                >
                                    {btnLabel}
                                </Button>
                                <Grid item>
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        type="submit"
                                        className={styles.btn}
                                        disabled={isSubmitting}
                                    >
                                        Save
                                    </Button>

                                    <Button
                                        color="primary"
                                        variant="outlined"
                                        onClick={handleCancel}
                                    >
                                        Cancel
                                    </Button>
                                </Grid>
                            </Grid>
                        </div>
                    </Form>
                </div>
            )}
        </Formik>
    );
};

export default AdminEdit;
