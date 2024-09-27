import React, { useState, useEffect } from "react";
import { useRouteMatch } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { Alert, Skeleton } from "@material-ui/lab";

import { handleUpdatePassword } from "@cbr/common/forms/Admin/adminFormsHandler";
import { apiFetch, APIFetchFailError, Endpoint } from "@cbr/common/util/endpoints";
import { IUser } from "@cbr/common/util/users";
import history from "@cbr/common/util/history";
import {
    AdminField,
    adminUserFieldLabels,
    IRouteParams,
    adminPasswordInitialValues,
    adminEditPasswordValidationSchema,
} from "@cbr/common/forms/Admin/adminFields";
import { useStyles } from "./styles";

const AdminPasswordEdit = () => {
    const styles = useStyles();
    const [user, setUser] = useState<IUser>();
    const [loadingError, setLoadingError] = useState<string>();
    const { userId } = useRouteMatch<IRouteParams>().params;
    const { t } = useTranslation();

    useEffect(() => {
        const getInfo = async () => {
            try {
                const theUser: IUser = (await (
                    await apiFetch(Endpoint.USER, userId)
                ).json()) as IUser;
                setUser(theUser);
            } catch (e) {
                setLoadingError(
                    e instanceof APIFetchFailError && e.details
                        ? `${e}: ${e.details}`
                        : (e as string)
                );
            }
        };
        getInfo();
    }, [userId]);

    if (loadingError) {
        return (
            <Alert severity="error">
                {/* TODO: translate */}
                Something went wrong trying to load that user. Please go back and try again.
                {loadingError}
            </Alert>
        );
    }

    return user ? (
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
                                : (e as string);
                        alert(
                            // TODO: translate
                            "Error occurred when trying to change the user's password: " +
                                errorMessage
                        );
                    });
            }}
        >
            {({ isSubmitting }) => (
                <div className={styles.container}>
                    <br />
                    <b>{t("general.id")}</b>
                    <p>{userId}</p>

                    <b>{t("admin.username")}</b>
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

                        <Grid container direction="row" spacing={2} justify="flex-end">
                            <Grid item>
                                <Button
                                    color="primary"
                                    variant="contained"
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={styles.btn}
                                >
                                    {t("general.save")}
                                </Button>

                                <Button color="primary" variant="outlined" onClick={history.goBack}>
                                    {t("general.cancel")}
                                </Button>
                            </Grid>
                        </Grid>
                    </Form>
                </div>
            )}
        </Formik>
    ) : (
        <Skeleton variant="rect" height={500} />
    );
};

export default AdminPasswordEdit;
