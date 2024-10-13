import { useStyles } from "./styles";
import { TextField } from "formik-mui";
import { Field, Form, Formik } from "formik";
import { Alert, Skeleton } from '@mui/material';
import { useCurrentUser } from "@cbr/common/util/hooks/currentUser";
import { APILoadError } from "@cbr/common/util/endpoints";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

import {
    changePassValidationSchema,
    ChangePasswordField,
    changePasswordFieldLabels,
    changePasswordInitialValues,
} from "@cbr/common/forms/UserProfile/userProfileFields";
import { useState } from "react";
import React from "react";
import {
    getPassChangeErrorMessageFromSubmissionError,
    handleSubmitChangePassword,
} from "@cbr/common/forms/UserProfile/userProfileHandler";
import history from "@cbr/common/util/history";

const handleCancel = () => history.goBack();

const UserPasswordEdit = () => {
    const styles = useStyles();
    const user = useCurrentUser();
    const [passwordChangeError, setPasswordChangeError] = useState<string | null>(null);

    return user === APILoadError ? (
        <Alert severity="error">
            Something went wrong trying to load that user. Please go back and try again.
        </Alert>
    ) : user ? (
        <>
            <div className={styles.container}>
                {passwordChangeError && (
                    <Alert onClose={() => setPasswordChangeError(null)} severity="error">
                        {passwordChangeError}
                    </Alert>
                )}
                <br />
                <b>ID</b>
                <p>{user.id}</p>
                <b>Username </b>
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

                            <Grid container direction="row" spacing={2} justifyContent="flex-end">
                                <Grid item>
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        type="submit"
                                        disabled={isSubmitting}
                                        style={{ marginRight: 5 }}
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
                        </Form>
                    </div>
                )}
            </Formik>
        </>
    ) : (
        <Skeleton variant="rectangular" height={500} />
    );
};

export default UserPasswordEdit;
