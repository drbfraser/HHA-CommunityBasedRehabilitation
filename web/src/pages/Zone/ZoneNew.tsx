import React from "react";
import { useStyles } from "./styles";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import history from "@cbr/common/util/history";
import { handleNewZoneSubmit } from "@cbr/common/forms/Zone/zoneFormsHandler";
import { ZoneField, zoneFieldLabels, zoneInitialValues } from "@cbr/common/forms/Zone/zoneFields";
import { APIFetchFailError } from "@cbr/common/util/endpoints";

const ZoneNew = () => {
    const styles = useStyles();
    return (
        (<Formik
            initialValues={zoneInitialValues}
            onSubmit={(values, formikHelpers) => {
                handleNewZoneSubmit(values, formikHelpers)
                    .then(() => history.push("/admin"))
                    .then(() => window.location.reload())
                    .catch((e) => {
                        const errMsg =
                            e instanceof APIFetchFailError
                                ? e.buildFormError(zoneFieldLabels)
                                : `${e}`;
                        alert(errMsg);
                    });
            }}
        >
            {({ isSubmitting }) => (
                <div className={styles.container}>
                    <Form>
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12}>
                                <Field
                                    component={TextField}
                                    name={ZoneField.zone_name}
                                    variant="outlined"
                                    label={zoneFieldLabels[ZoneField.zone_name]}
                                    required
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                        <br />

                        <div>
                            <Grid container justifyContent="flex-end" spacing={2}>
                                <Grid item>
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        Create
                                    </Button>
                                </Grid>

                                <Grid item>
                                    <Button
                                        color="primary"
                                        variant="outlined"
                                        onClick={history.goBack}
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
        </Formik>)
    );
};

export default ZoneNew;
