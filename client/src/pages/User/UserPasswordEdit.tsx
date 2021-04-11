import { useStyles } from "./styles";
import { TextField } from "formik-material-ui";
import { Field, Form, Formik } from "formik";
import { Alert, Skeleton } from "@material-ui/lab";
import { useCurrentUser } from "util/hooks/currentUser";
import { APILoadError } from "util/endpoints";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

import {
    changePasswordField,
    changePasswordInitialValues,
    fieldLabels,
    passwordValidationSchema,
} from "./fields";
import { handleCancel, handleUpdatePassword } from "./handleUpdatePassword";
import { useState } from "react";

const UserPasswordEdit = () => {
    const styles = useStyles();
    const user = useCurrentUser();
    const [wrongPasswordError, setWrongPasswordError] = useState(false);

    return user === APILoadError ? (
        <Alert severity="error">
            Something went wrong trying to load that user. Please go back and try again.
        </Alert>
    ) : user ? (
        <>
            <div className={styles.container}>
                {wrongPasswordError && (
                    <Alert onClose={() => setWrongPasswordError(false)} severity="error">
                        The old password you have entered is incorrect. Please try again.
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
                validationSchema={passwordValidationSchema}
                onSubmit={handleUpdatePassword(setWrongPasswordError)}
            >
                {({ isSubmitting }) => (
                    <div className={styles.container}>
                        <Form>
                            <Grid container spacing={1}>
                                <Grid item md={3} xs={12}>
                                    <Field
                                        component={TextField}
                                        name={changePasswordField.oldPassword}
                                        variant="outlined"
                                        type="password"
                                        label={fieldLabels[changePasswordField.oldPassword]}
                                        required
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item md={3} xs={12}>
                                    <Grid>
                                        <Field
                                            component={TextField}
                                            name={changePasswordField.newPassword}
                                            variant="outlined"
                                            type="password"
                                            label={fieldLabels[changePasswordField.newPassword]}
                                            style={{ marginBottom: 8 }}
                                            required
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid>
                                        <Field
                                            component={TextField}
                                            name={changePasswordField.confirmNewPassword}
                                            variant="outlined"
                                            type="password"
                                            label={
                                                fieldLabels[changePasswordField.confirmNewPassword]
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
        <Skeleton variant="rect" height={500} />
    );
};

export default UserPasswordEdit;
