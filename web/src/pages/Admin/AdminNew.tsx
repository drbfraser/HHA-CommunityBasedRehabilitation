import React from "react";
import { useTranslation } from "react-i18next";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import { FormControl, MenuItem, Button, Grid } from "@material-ui/core";

import history from "@cbr/common/util/history";
import { handleNewUserSubmit } from "@cbr/common/forms/Admin/adminFormsHandler";
import { userRoles } from "@cbr/common/util/users";
import { useZones } from "@cbr/common/util/hooks/zones";
import { APIFetchFailError } from "@cbr/common/util/endpoints";
import {
    AdminField,
    adminUserFieldLabels,
    adminUserInitialValues,
    newUserValidationSchema,
} from "@cbr/common/forms/Admin/adminFields";
import { useStyles } from "./styles";

const AdminNew = () => {
    const styles = useStyles();
    const zones = useZones();
    const { t } = useTranslation();

    return (
        <Formik
            initialValues={adminUserInitialValues}
            validationSchema={newUserValidationSchema}
            onSubmit={(values, formikHelpers) => {
                handleNewUserSubmit(values, formikHelpers)
                    .then((user) => history.replace(`/admin/view/${user.id}`))
                    .catch((e) => {
                        const errMsg =
                            e instanceof APIFetchFailError
                                ? e.buildFormError(adminUserFieldLabels)
                                : (e as string);
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
                                    name={AdminField.username}
                                    variant="outlined"
                                    label={adminUserFieldLabels[AdminField.username]}
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
                                        label={adminUserFieldLabels[AdminField.role]}
                                        name={AdminField.role}
                                    >
                                        {Object.entries(userRoles).map(([value, { name }]) => (
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
                                    name={AdminField.password}
                                    variant="outlined"
                                    type="password"
                                    label={adminUserFieldLabels[AdminField.password]}
                                    required
                                    fullWidth
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <Field
                                    component={TextField}
                                    name={AdminField.confirmPassword}
                                    variant="outlined"
                                    type="password"
                                    label={adminUserFieldLabels[AdminField.confirmPassword]}
                                    required
                                    fullWidth
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <Field
                                    component={TextField}
                                    name={AdminField.first_name}
                                    variant="outlined"
                                    label={adminUserFieldLabels[AdminField.first_name]}
                                    required
                                    fullWidth
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <Field
                                    component={TextField}
                                    name={AdminField.last_name}
                                    variant="outlined"
                                    label={adminUserFieldLabels[AdminField.last_name]}
                                    required
                                    fullWidth
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <FormControl fullWidth variant="outlined">
                                    <Field
                                        component={TextField}
                                        fullWidth
                                        select
                                        variant="outlined"
                                        required
                                        label={adminUserFieldLabels[AdminField.zone]}
                                        name={AdminField.zone}
                                    >
                                        {Array.from(zones).map(([id, name]) => (
                                            <MenuItem key={id} value={id}>
                                                {name}
                                            </MenuItem>
                                        ))}
                                    </Field>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <Field
                                    component={TextField}
                                    fullWidth
                                    required
                                    variant="outlined"
                                    label={adminUserFieldLabels[AdminField.phone_number]}
                                    name={AdminField.phone_number}
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
                                        {t("general.create")}
                                    </Button>
                                </Grid>

                                <Grid item>
                                    <Button
                                        color="primary"
                                        variant="outlined"
                                        onClick={history.goBack}
                                    >
                                        {t("general.cancel")}
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
