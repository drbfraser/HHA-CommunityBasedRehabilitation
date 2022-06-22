import React from "react";
import { useStyles } from "./styles";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import history from "@cbr/common/util/history";
import { handleNewZoneSubmit } from "@cbr/common/forms/Zone/zoneFormsHandler";
import { userRoles } from "@cbr/common/util/users";
import { useZones } from "@cbr/common/util/hooks/zones";
import { ZoneField, zoneFieldLabels, zoneInitialValues } from "@cbr/common/forms/Zone/zoneFields";
import { APIFetchFailError } from "@cbr/common/util/endpoints";

const ZoneNew = () => {
    const styles = useStyles();
    const zones = useZones();

    return (
        <Formik
            initialValues={zoneInitialValues}
            onSubmit={(values, formikHelpers) => {
                handleNewZoneSubmit(values, formikHelpers)
                    .then((zone) => history.replace(`/admin`))
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
                            <Grid container justify="flex-end" spacing={2}>
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
        </Formik>
    );
};

export default ZoneNew;
