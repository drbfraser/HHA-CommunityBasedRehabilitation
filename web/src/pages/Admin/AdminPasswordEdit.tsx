import React from "react";
import { useStyles } from "./styles";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-mui";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { useRouteMatch } from "react-router-dom";
import { useState, useEffect } from "react";
import { handleUpdatePassword } from "@cbr/common/forms/Admin/adminFormsHandler";
import { Alert, Skeleton } from '@mui/material';
import { apiFetch, APIFetchFailError, Endpoint } from "@cbr/common/util/endpoints";
import { IUser } from "@cbr/common/util/users";
import {
    AdminField,
    adminUserFieldLabels,
    IRouteParams,
    adminPasswordInitialValues,
    adminEditPasswordValidationSchema,
} from "@cbr/common/forms/Admin/adminFields";
import history from "@cbr/common/util/history";

const AdminPasswordEdit = () => {
    const styles = useStyles();
    const { userId } = useRouteMatch<IRouteParams>().params;
    const [user, setUser] = useState<IUser>();
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
            Something went wrong trying to load that user. Please go back and try again.
            {loadingError}
        </Alert>
    ) : user ? (
        <Formik
            initialValues={adminPasswordInitialValues}
            validationSchema={adminEditPasswordValidationSchema}
            onSubmit={(values, formikHelpers) => {
                handleUpdatePassword(userId, values, formikHelpers)
                    .then(() => history.goBack())
                    .catch((e) => {
                        const errorMessage =
                            e instanceof APIFetchFailError
                                ? e.buildFormError(adminUserFieldLabels)
                                : `${e}`;
                        alert(
                            "Error occurred when trying to change the user's password: " +
                                errorMessage
                        );
                    });
            }}
        >
            {({ isSubmitting }) => (
                <div className={styles.container}>
                    <br />
                    <b>ID</b>
                    <p>{userId}</p>
                    <b>Username </b>
                    <p>{user.username}</p>
                    <Form>
                        <Grid container spacing={2}>
                            <Grid item md={7} xs={12}>
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
                            <Grid item md={7} xs={12}>
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
                            <br />
                        </Grid>

                        <br />

                        <Grid container direction="row" spacing={2} justifyContent="flex-end">
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

export default AdminPasswordEdit;
