import React from "react";
import { useStyles } from "./styles";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import Grid from "@material-ui/core/Grid";
import { fieldLabels, AdminField, initialValues, validationSchema, workerOptions } from "./fields";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";
import { FormControl, MenuItem } from "@material-ui/core";
import { handleNewSubmit } from "./handler";
import { useState, useEffect } from "react";
import { getAllZones, IZone } from "util/cache";

const AdminNew = () => {
    const styles = useStyles();
    const history = useHistory();
    const handleCancel = () => history.goBack();
    const [zoneOptions, setZoneOptions] = useState<IZone[]>([]);
    useEffect(() => {
        const fetchAllZones = async () => {
            const zones = await getAllZones();
            setZoneOptions(zones);
        };
        fetchAllZones();
    }, []);
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleNewSubmit}
        >
            {({ isSubmitting }) => (
                <div className={styles.container}>
                    <Form>
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12}>
                                <Field
                                    component={TextField}
                                    name={AdminField.username}
                                    variant="outlined"
                                    label={fieldLabels[AdminField.username]}
                                    required
                                    fullWidth
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <Field
                                    component={TextField}
                                    name={AdminField.password}
                                    variant="outlined"
                                    label={fieldLabels[AdminField.password]}
                                    required
                                    fullWidth
                                />
                            </Grid>
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

                        <div>
                            <Grid container justify="flex-end" spacing={2}>
                                <Grid item>
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        CREATE
                                    </Button>
                                </Grid>

                                <Grid item>
                                    <Button
                                        color="primary"
                                        variant="outlined"
                                        onClick={handleCancel}
                                    >
                                        Cancel
                                    </Button>
                                </Grid>
                            </Grid>
                            <br></br>
                        </div>
                    </Form>
                </div>
            )}
        </Formik>
    );
};

export default AdminNew;
