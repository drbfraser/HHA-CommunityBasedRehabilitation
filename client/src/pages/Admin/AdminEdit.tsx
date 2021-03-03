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
import { handleEditSubmit } from "./handler";
import { useEffect } from "react";
import { apiFetch, Endpoint } from "util/endpoints";
import { getAllZones, IZone } from "util/cache";
import { Alert, Skeleton } from "@material-ui/lab";

export enum UserActive {
    disable = "Disable",
    active = "Active",
}

interface IProps {
    userInfo: IUser;
    zoneOptions: IZone[];
}

const AdminEdit = (props: IProps) => {
    const styles = useStyles();
    const history = useHistory();
    const [isUserActive, setIsUserActive] = useState(initialValues.status === UserActive.active);
    const [status, setStatus] = useState(initialValues.status);
    const { userId } = useRouteMatch<IRouteParams>().params;
    const [zoneOptions, setZoneOptions] = useState<IZone[]>([]);
    const user = history.location.state as IUser;

    const handleCancel = () => history.goBack();
    const handleDisable = () => {
        setStatus(isUserActive ? UserActive.disable : UserActive.active);
        setIsUserActive(!isUserActive);
    };
    console.log(user);
    useEffect(() => {
        const fetchAllZones = async () => {
            const zones = await getAllZones();
            setZoneOptions(zones);
        };
        fetchAllZones();
    }, [userId]);

    return (
        <Formik
            initialValues={user}
            validationSchema={validationSchema}
            onSubmit={handleEditSubmit}
        >
            {({ isSubmitting }) => (
                <div className={styles.container}>
                    {user ? (
                        <>
                            <b>ID</b>
                            <p>{userId}</p>
                            <Form>
                                <b>Username </b>
                                <p>{user.username}</p>
                                <Grid container spacing={2}>
                                    <Grid item md={6} xs={12}>
                                        <Field
                                            component={TextField}
                                            name={AdminField.first_name}
                                            variant="outlined"
                                            label={fieldLabels[AdminField.first_name]}
                                            required
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <Field
                                            component={TextField}
                                            required
                                            name={AdminField.last_name}
                                            variant="outlined"
                                            label={fieldLabels[AdminField.last_name]}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <Field
                                            component={TextField}
                                            required
                                            name={AdminField.phone_number}
                                            variant="outlined"
                                            label={fieldLabels[AdminField.phone_number]}
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
                                                label={fieldLabels[AdminField.zone]}
                                                name={AdminField.zone}
                                            >
                                                {zoneOptions.map((option) => (
                                                    <MenuItem key={option.id} value={option.id}>
                                                        {option.zone_name}
                                                    </MenuItem>
                                                ))}
                                            </Field>
                                        </FormControl>
                                    </Grid>

                                    <Grid item md={6} xs={12}>
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
                </div>
            )}
        </Formik>
    );
};

export default AdminEdit;
