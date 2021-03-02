import React from "react";
import { useStyles } from "./styles";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import Grid from "@material-ui/core/Grid";
import {
    fieldLabels,
    AdminField,
    initialValues,
    validationSchema,
    workerOptions,
    IUser,
} from "./fields";
import Button from "@material-ui/core/Button";
import { IRouteParams } from "./fields";
import { useHistory, useRouteMatch } from "react-router-dom";
import { FormControl, MenuItem } from "@material-ui/core";
import { useState } from "react";
import { handleSubmit } from "./handler";
import { useEffect } from "react";
import { apiFetch, Endpoint } from "util/endpoints";
import { getAllZones, IZone } from "util/cache";
import { Alert, Skeleton } from "@material-ui/lab";

export enum UserActive {
    disable = "Disable",
    active = "Active",
}

const AdminEdit = () => {
    const styles = useStyles();
    const history = useHistory();
    const [isUserActive, setIsUserActive] = useState(initialValues.status === UserActive.active);
    const [status, setStatus] = useState(initialValues.status);
    const { userId } = useRouteMatch<IRouteParams>().params;
    const [user, setUser] = useState<IUser>();
    const [zoneOptions, setZoneOptions] = useState<IZone[]>([]);
    const [loadingError, setLoadingError] = useState(false);
    const handleCancel = () => history.goBack();
    const handleDisable = () => {
        setStatus(isUserActive ? UserActive.disable : UserActive.active);
        setIsUserActive(!isUserActive);
    };
    useEffect(() => {
        const getUser = async () => {
            try {
                // After we can get the id from the list it could work
                const theUser: IUser = await (await apiFetch(Endpoint.USER, `${"/2"}`)).json();
                setUser(theUser);
            } catch (e) {
                setLoadingError(true);
            }
        };
        const fetchAllZones = async () => {
            const zones = await getAllZones();
            setZoneOptions(zones);
        };

        fetchAllZones();
        getUser();
    }, [userId]);

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting }) => (
                <div className={styles.container}>
                    {loadingError ? (
                        <Alert severity="error">
                            Something went wrong. Please go back and try again.
                        </Alert>
                    ) : (
                        <>
                            {user ? (
                                <>
                                    <b>ID</b>
                                    <p>{userId}</p>
                                    <Form>
                                        <b>Username </b>
                                        <br />
                                        <br />
                                        <Grid container spacing={2}>
                                            <Grid item md={6} xs={12}>
                                                <Field
                                                    component={TextField}
                                                    name={AdminField.firstName}
                                                    variant="outlined"
                                                    label={fieldLabels[AdminField.firstName]}
                                                    required
                                                    fullWidth
                                                />
                                            </Grid>
                                            <Grid item md={6} xs={12}>
                                                <Field
                                                    component={TextField}
                                                    required
                                                    name={AdminField.lastName}
                                                    variant="outlined"
                                                    label={fieldLabels[AdminField.lastName]}
                                                    fullWidth
                                                />
                                            </Grid>
                                            <Grid item md={7} xs={12}>
                                                <FormControl fullWidth variant="outlined">
                                                    <Field
                                                        component={TextField}
                                                        fullWidth
                                                        select
                                                        variant="outlined"
                                                        required
                                                        label={fieldLabels[AdminField.zone]}
                                                        name={AdminField.zone}
                                                    >
                                                        {zoneOptions.map((option) => (
                                                            <MenuItem
                                                                key={option.id}
                                                                value={option.id}
                                                            >
                                                                {option.zone_name}
                                                            </MenuItem>
                                                        ))}
                                                    </Field>
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={7} xs={12}>
                                                <FormControl fullWidth variant="outlined">
                                                    <Field
                                                        component={TextField}
                                                        select
                                                        required
                                                        variant="outlined"
                                                        label={fieldLabels[AdminField.type]}
                                                        name={AdminField.type}
                                                    >
                                                        {workerOptions.map((option) => (
                                                            <MenuItem
                                                                key={option.value}
                                                                value={option.value}
                                                            >
                                                                {option.name}
                                                            </MenuItem>
                                                        ))}
                                                    </Field>
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                        <br />
                                        <b>Status</b>
                                        <p>{status}</p>
                                        <br />

                                        <div>
                                            <Grid
                                                container
                                                direction="row"
                                                spacing={2}
                                                justify="space-between"
                                                alignItems="center"
                                            >
                                                <Button
                                                    variant="contained"
                                                    type="reset"
                                                    className={
                                                        isUserActive
                                                            ? styles["disableBtn"]
                                                            : styles["activeBtn"]
                                                    }
                                                    disabled={isSubmitting}
                                                    onClick={handleDisable}
                                                >
                                                    {isUserActive ? "Disable" : "Enable"}
                                                </Button>
                                                <Grid item>
                                                    <Button
                                                        color="primary"
                                                        variant="contained"
                                                        type="submit"
                                                        className={styles.btn}
                                                        disabled={isSubmitting}
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
                                        </div>
                                    </Form>
                                </>
                            ) : (
                                <Skeleton variant="text" />
                            )}
                        </>
                    )}
                </div>
            )}
        </Formik>
    );
};

export default AdminEdit;
