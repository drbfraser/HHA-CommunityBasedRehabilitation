import React from "react";
import { useStyles } from "./styles";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import Grid from "@material-ui/core/Grid";
import { fieldLabels, AdminField, workerOptions, IUser, validationEditSchema } from "./fields";
import Button from "@material-ui/core/Button";
import { IRouteParams } from "./fields";
import { useHistory, useRouteMatch } from "react-router-dom";
import { FormControl, MenuItem } from "@material-ui/core";
import { useState } from "react";
import { handleEditSubmit } from "./handler";
import { useEffect } from "react";
import { getAllZones, IZone } from "util/cache";

export enum UserActive {
    disable = "Disable",
    active = "Active",
}
const AdminEdit = () => {
    const styles = useStyles();
    const history = useHistory();
    const handleCancel = () => history.goBack();
    const { userId } = useRouteMatch<IRouteParams>().params;
    const [user] = useState<IUser>(history.location.state as IUser);
    const [zoneOptions, setZoneOptions] = useState<IZone[]>([]);
    const [isUserActive, setIsUserActive] = useState(user.is_active);
    const [status, setStatus] = useState(user.is_active ? UserActive.active : UserActive.disable);
    const handleDisable = () => {
        setStatus(isUserActive ? UserActive.disable : UserActive.active);
        setIsUserActive(!isUserActive);
    };
    useEffect(() => {
        const fetchAllZones = async () => {
            const zones = await getAllZones();
            setZoneOptions(zones);
        };
        fetchAllZones();
    }, []);
    return (
        <Formik
            initialValues={user}
            validationSchema={validationEditSchema}
            onSubmit={handleEditSubmit}
        >
            {({ isSubmitting }) => (
                <div className={styles.container}>
                    <b>ID</b>
                    <p>{userId}</p>
                    <b>Username </b>
                    <p>{user.username}</p>
                    <Form>
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
                                    name={AdminField.last_name}
                                    variant="outlined"
                                    label={fieldLabels[AdminField.last_name]}
                                    required
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
                                <Field
                                    component={TextField}
                                    fullWidth
                                    required
                                    variant="outlined"
                                    label={fieldLabels[AdminField.phone_number]}
                                    name={AdminField.phone_number}
                                />
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
                                        {Object.entries(workerOptions).map(([value, name]) => (
                                            <MenuItem key={value} value={value}>
                                                {name}
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
                                    isUserActive ? styles["disableBtn"] : styles["activeBtn"]
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
    );
};

export default AdminEdit;
