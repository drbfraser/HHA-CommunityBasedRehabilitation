import React from "react";
import { useRouteMatch } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-mui";
import { Alert, Box, Button, Grid, Skeleton } from "@mui/material";

import { handleUpdatePassword } from "@cbr/common/forms/Admin/adminFormsHandler";
import { APIFetchFailError } from "@cbr/common/util/endpoints";
import history from "@cbr/common/util/history";
import {
    AdminField,
    adminUserFieldLabels,
    IRouteParams,
    adminPasswordInitialValues,
    adminEditPasswordValidationSchema,
} from "@cbr/common/forms/Admin/adminFields";
import { adminStyles } from "./Admin.styles";
import { useUser } from "util/hooks/useUser";

const AdminPasswordEdit = () => {
    const { userId } = useRouteMatch<IRouteParams>().params;
    const [user, loadingError] = useUser(userId);
    const { t } = useTranslation();

    if (loadingError) {
        return (
            <Alert severity="error">
                {t("alert.loadUserFailure")}
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
                        alert(`${t("alert.editUserPasswordFailure")}: ${errorMessage}`);
                    });
            }}
        >
            {({ isSubmitting }) => (
                <Box sx={adminStyles.container}>
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

                        <Grid container direction="row" spacing={2} justifyContent="flex-end">
                            <Grid item>
                                <Button
                                    color="primary"
                                    variant="contained"
                                    type="submit"
                                    disabled={isSubmitting}
                                    sx={adminStyles.btn}
                                >
                                    {t("general.save")}
                                </Button>

                                <Button color="primary" variant="outlined" onClick={history.goBack}>
                                    {t("general.cancel")}
                                </Button>
                            </Grid>
                        </Grid>
                    </Form>
                </Box>
            )}
        </Formik>
    ) : (
        <Skeleton variant="rectangular" height={500} />
    );
};

export default AdminPasswordEdit;
