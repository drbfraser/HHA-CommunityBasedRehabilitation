import React from "react";
import { useStyles } from "./styles";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import history from "@cbr/common/util/history";
import { FormControl, MenuItem } from "@material-ui/core";
import { handleNewUserSubmit } from "@cbr/common/forms/Admin/adminFormsHandler";
import {
    AdminField,
    adminUserFieldLabels,
    adminUserInitialValues,
    newUserValidationSchema,
} from "@cbr/common/forms/Admin/adminFields";
import { APIFetchFailError } from "@cbr/common/util/endpoints";

export const priority = {
    Important: {
        name: "Important",
    },
    Info: {
        name: "Info",
    },
    Notice: {
        name: "Notice",
    },
};

const AlertNew = () => {
    const styles = useStyles();

    return (
        <Formik
            initialValues={adminUserInitialValues}
            validationSchema={newUserValidationSchema}
            onSubmit={(values, formikHelpers) => {
                handleNewUserSubmit(values, formikHelpers)
                    .then((user) => history.replace(`/alerts`))
                    .catch((e) => {
                        const errMsg =
                            e instanceof APIFetchFailError
                                ? e.buildFormError(adminUserFieldLabels)
                                : `${e}`;
                        alert(errMsg);
                    });
            }}
        >
            {({ isSubmitting }) => (
                <div className={styles.container}>
                    <Form>
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12}>
                                <Field
                                    component={TextField}
                                    name={"subject"}
                                    variant="outlined"
                                    label={"Subject"}
                                    required
                                    fullWidth
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <FormControl fullWidth variant="outlined">
                                    <Field
                                        component={TextField}
                                        select
                                        required
                                        variant="outlined"
                                        label={"priority"}
                                        name={"Alert Priority"}
                                    >
                                        {Object.entries(priority).map(([value, { name }]) => (
                                            <MenuItem key={value} value={value}>
                                                {name}
                                            </MenuItem>
                                        ))}
                                    </Field>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <Field
                                    component={TextField}
                                    name={"Message"}
                                    variant="outlined"
                                    type="multiline"
                                    label={"Message"}
                                    required
                                    fullWidth
                                />
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
                                        Create
                                    </Button>
                                </Grid>

                                <Grid item>
                                    <Button
                                        color="primary"
                                        variant="outlined"
                                        onClick={history.goBack}
                                    >
                                        Cancel
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

export default AlertNew;
