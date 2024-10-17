import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import { Alert, Skeleton } from "@material-ui/lab";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

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
import { useStyles } from "./styles";

const handleCancel = () => history.goBack();

const UserPasswordEdit = () => {
    const { t } = useTranslation();
    const styles = useStyles();
    const user = useCurrentUser();
    const [passwordChangeError, setPasswordChangeError] = useState<string | null>(null);

    if (user === APILoadError) {
        return <Alert severity="error">{t("alert.loadUserFailure")}</Alert>;
    }
    if (!user) {
        return <Skeleton variant="rect" height={500} />;
    }
    return (
        <>
            <div className={styles.container}>
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
            </div>

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
                    <div className={styles.container}>
                        <Form>
                            <Grid container spacing={1}>
                                <Grid item md={3} xs={12}>
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
                                <Grid item md={3} xs={12}>
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

                            <Grid container direction="row" spacing={2} justify="flex-end">
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
                    </div>
                )}
            </Formik>
        </>
    );
};

export default UserPasswordEdit;
