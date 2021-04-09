import { useStyles } from "./styles";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import Grid from "@material-ui/core/Grid";
import {
    fieldLabels,
    AdminField,
    passwordValidationSchema,
    IRouteParams,
    passwordInitialValues,
} from "./fields";
import Button from "@material-ui/core/Button";
import { useRouteMatch } from "react-router-dom";
import { useState, useEffect } from "react";
import { handleCancel, handleUpdatePassword } from "./handler";
import { Alert, Skeleton } from "@material-ui/lab";
import { apiFetch, Endpoint } from "util/endpoints";
import { IUser } from "util/users";

const AdminPasswordEdit = () => {
    const styles = useStyles();
    const { userId } = useRouteMatch<IRouteParams>().params;
    const [user, setUser] = useState<IUser>();
    const [loadingError, setLoadingError] = useState(false);

    useEffect(() => {
        const getInfo = async () => {
            try {
                const theUser: IUser = (await (
                    await apiFetch(Endpoint.USER, `${userId}`)
                ).json()) as IUser;
                setUser(theUser);
            } catch (e) {
                setLoadingError(true);
            }
        };
        getInfo();
    }, [userId]);

    return loadingError ? (
        <Alert severity="error">
            Something went wrong trying to load that user. Please go back and try again.
        </Alert>
    ) : user ? (
        <Formik
            initialValues={passwordInitialValues}
            validationSchema={passwordValidationSchema}
            onSubmit={handleUpdatePassword(Number(userId))}
        >
            {({ isSubmitting }) => (
                <div className={styles.container}>
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
                                    label={fieldLabels[AdminField.password]}
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
                                    label={fieldLabels[AdminField.confirmPassword]}
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
                                    Save
                                </Button>

                                <Button color="primary" variant="outlined" onClick={handleCancel}>
                                    Cancel
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
