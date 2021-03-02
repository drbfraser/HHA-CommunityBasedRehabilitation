import React from "react";
import { useStyles } from "./styles";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import Grid from "@material-ui/core/Grid";
import { fieldLabels, AdminField, initialValues, validationSchema, workerOptions } from "./fields";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";
import { FormControl, MenuItem } from "@material-ui/core";
import { handleSubmit } from "./handler";
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
            onSubmit={handleSubmit}
        >
            {({ isSubmitting }) => (
                <div className={styles.container}>
                    <b>ID</b>
                    <p>{initialValues.id}</p>
                    <Form>
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
                                    name={AdminField.lastName}
                                    variant="outlined"
                                    label={fieldLabels[AdminField.lastName]}
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
                                    label={fieldLabels[AdminField.phoneNumber]}
                                    name={AdminField.phoneNumber}
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
                                        {workerOptions.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.name}
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
                                        Save
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
