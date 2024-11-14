import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-mui";
import { Alert, Box, Button, Grid, Skeleton } from "@mui/material";

import { useCurrentUser } from "@cbr/common/util/hooks/currentUser";
import { APILoadError } from "@cbr/common/util/endpoints";
import {
    changePassValidationSchema,
    ChangePasswordField,
    changePasswordFieldLabels,
    changePasswordInitialValues,
} from "@cbr/common/forms/UserProfile/userProfileFields";
import {
    getPassChangeErrorMessageFromSubmissionError,
    handleSubmitChangePassword,
} from "@cbr/common/forms/UserProfile/userProfileHandler";
import history from "@cbr/common/util/history";
import { userStyles } from "./User.styles";

const handleCancel = () => history.goBack();

const UserPasswordEdit = () => {
    const { t } = useTranslation();
    const user = useCurrentUser();
    const [passwordChangeError, setPasswordChangeError] = useState<string | null>(null);

    if (user === APILoadError) {
        return <Alert severity="error">{t("alert.loadUserFailure")}</Alert>;
    }
    if (!user) {
        return <Skeleton variant="rectangular" height={500} />;
    }
    return (
        <>
            <Box sx={userStyles.container}>
                {passwordChangeError && (
                    <Alert onClose={() => setPasswordChangeError(null)} severity="error">
                        {passwordChangeError}
                    </Alert>
                )}
                <br />

                <b>{t("general.id")}</b>
                <p>{user.id}</p>

                <b>{t("general.username")}</b>
                <p>{user.username}</p>
            </Box>
            <Formik
                initialValues={changePasswordInitialValues}
                validationSchema={changePassValidationSchema}
                onSubmit={async (values, formikHelpers) => {
                    return await handleSubmitChangePassword(values, formikHelpers)
                        .then(() => history.goBack())
                        .catch((e: any) => {
                            setPasswordChangeError(getPassChangeErrorMessageFromSubmissionError(e));
                        });
                }}
            >
                {({ isSubmitting }) => (
                    <Box sx={userStyles.container}>
                        <Form>
                            <Grid container spacing={1}>
                                <Grid item md={4} xs={12}>
                                    <Field
                                        component={TextField}
                                        name={ChangePasswordField.oldPassword}
                                        variant="outlined"
                                        type="password"
                                        label={
                                            changePasswordFieldLabels[
                                                ChangePasswordField.oldPassword
                                            ]
                                        }
                                        required
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item md={4} xs={12}>
                                    <Grid>
                                        <Field
                                            component={TextField}
                                            name={ChangePasswordField.newPassword}
                                            variant="outlined"
                                            type="password"
                                            label={
                                                changePasswordFieldLabels[
                                                    ChangePasswordField.newPassword
                                                ]
                                            }
                                            style={{ marginBottom: 8 }}
                                            required
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid>
                                        <Field
                                            component={TextField}
                                            name={ChangePasswordField.confirmNewPassword}
                                            variant="outlined"
                                            type="password"
                                            label={
                                                changePasswordFieldLabels[
                                                    ChangePasswordField.confirmNewPassword
                                                ]
                                            }
                                            required
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>

                            <br />

                            <Grid container direction="row" spacing={2} justifyContent="flex-end">
                                <Grid item>
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        type="submit"
                                        disabled={isSubmitting}
                                        style={{ marginRight: 5 }}
                                    >
                                        {t("general.save")}
                                    </Button>

                                    <Button
                                        color="primary"
                                        variant="outlined"
                                        onClick={handleCancel}
                                    >
                                        {t("general.cancel")}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Form>
                    </Box>
                )}
            </Formik>
        </>
    );
};

export default UserPasswordEdit;
