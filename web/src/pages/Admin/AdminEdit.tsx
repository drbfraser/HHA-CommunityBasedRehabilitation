import React from "react";
import { useStyles } from "./styles";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { useRouteMatch } from "react-router-dom";
import { FormControl, MenuItem } from "@mui/material";
import { useState, useEffect } from "react";
import { handleUserEditSubmit } from "@cbr/common/forms/Admin/adminFormsHandler";
import { Alert, Skeleton } from '@mui/material';
import { apiFetch, APIFetchFailError, Endpoint } from "@cbr/common/util/endpoints";
import { IUser, userRoles } from "@cbr/common/util/users";
import { useZones } from "@cbr/common/util/hooks/zones";
import {
    AdminField,
    editUserValidationSchema,
    adminUserFieldLabels,
    IRouteParams,
} from "@cbr/common/forms/Admin/adminFields";
import history from "@cbr/common/util/history";

const AdminEdit = () => {
    const styles = useStyles();
    const { userId } = useRouteMatch<IRouteParams>().params;
    const [user, setUser] = useState<IUser>();
    const zones = useZones();
    const [loadingError, setLoadingError] = useState<string>();

    useEffect(() => {
        const getInfo = async () => {
            try {
                const theUser: IUser = (await (
                    await apiFetch(Endpoint.USER, `${userId}`)
                ).json()) as IUser;
                setUser(theUser);
            } catch (e) {
                setLoadingError(
                    e instanceof APIFetchFailError && e.details ? `${e}: ${e.details}` : `${e}`
                );
            }
        };
        getInfo();
    }, [userId]);

    return loadingError ? (
        <Alert severity="error">
            Something went wrong trying to load that user. Please go back and try again.{" "}
            {loadingError}
        </Alert>
    ) : user && zones.size ? (
        <Formik
            initialValues={user}
            validationSchema={editUserValidationSchema}
            onSubmit={(values, formikHelpers) => {
                handleUserEditSubmit(values, formikHelpers)
                    .then(() => history.goBack())
                    .catch((e) => {
                        const errMsg =
                            e instanceof APIFetchFailError
                                ? e.buildFormError(adminUserFieldLabels)
                                : "Sorry, something went wrong trying to edit that user. Please try again.";
                        alert(errMsg);
                    });
            }}
        >
            {({ values, setFieldValue, isSubmitting }) => (
                <div className={styles.container}>
                    <br />
                    <b>ID</b>
                    <p>{userId}</p>
                    <b>Username </b>
                    <p>{user.username}</p>
                    <Form>
                        <Grid container spacing={2}>
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
                        </Grid>

                        <br />
                        <b>Status</b>
                        <p>{values.is_active ? "Active" : "Disabled"}</p>
                        <br />
                        <Grid
                            container
                            direction="row"
                            spacing={2}
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Button
                                variant="contained"
                                className={
                                    values.is_active ? styles["disableBtn"] : styles["activeBtn"]
                                }
                                disabled={isSubmitting}
                                onClick={() =>
                                    setFieldValue(AdminField.is_active, !values.is_active)
                                }
                            >
                                {values.is_active ? "Disable" : "Activate"}
                            </Button>
                            <Grid item>
                                <Button
                                    color="primary"
                                    variant="contained"
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={styles.btn}
                                >
                                    Save
                                </Button>

                                <Button color="primary" variant="outlined" onClick={history.goBack}>
                                    Cancel
                                </Button>
                            </Grid>
                        </Grid>
                    </Form>
                </div>
            )}
        </Formik>
    ) : (
        <Skeleton variant="rectangular" height={500} />
    );
};

export default AdminEdit;
