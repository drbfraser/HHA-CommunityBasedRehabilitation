import React from "react";
import { useStyles } from "./styles";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { useRouteMatch } from "react-router-dom";
import { useState, useEffect } from "react";
import { handleZoneEditSubmit } from "@cbr/common/forms/Zone/zoneFormsHandler";
import { Alert, Skeleton } from "@material-ui/lab";
import { apiFetch, APIFetchFailError, Endpoint } from "@cbr/common/util/endpoints";
import { IZone } from "@cbr/common/util/zones";
import { useZones } from "@cbr/common/util/hooks/zones";
import {
    ZoneField,
    editZoneValidationSchema,
    zoneFieldLabels,
    IRouteParams,
} from "@cbr/common/forms/Zone/zoneFields";
import history from "@cbr/common/util/history";
import { UserRole } from "@cbr/common/util/users";
interface IResponseRow {
    id: number;
    zone: number;
    first_name: string;
    last_name: string;
    full_name: string;
    username: string;
    role: UserRole;
    is_active: boolean;
}
const ZoneEdit = () => {
    const styles = useStyles();
    const { zone_name } = useRouteMatch<IRouteParams>().params;
    const [zone, setZone] = useState<IZone>();
    const zones = useZones();
    const [loadingError, setLoadingError] = useState<string>();

    useEffect(() => {
        const getInfo = async () => {
            try {
                const theZone: IZone = (await (
                    await apiFetch(Endpoint.ZONE, `${zone_name}`)
                ).json()) as IZone;
                setZone(theZone);
            } catch (e) {
                setLoadingError(
                    e instanceof APIFetchFailError && e.details ? `${e}: ${e.details}` : `${e}`
                );
            }
        };
        getInfo();
    }, [zone_name]);

    const deleteZone = async (zoneId: number): Promise<void> => {
        const init: RequestInit = {
            method: "DELETE",
        };
        return await apiFetch(Endpoint.ZONE, `${zoneId}`, init).then(async (res) => {
            if (!res.ok) {
                const resBody = await res.text();
                if (resBody.includes("referenced through protected foreign keys")) {
                    const allUsers = await apiFetch(Endpoint.USERS, "");
                    const allClients = await apiFetch(Endpoint.CLIENTS, "");
                    const userRows: IResponseRow[] = await allUsers.json();
                    const clientRows: IResponseRow[] = await allClients.json();
                    var users = userRows.filter(function (row) {
                        return row.zone === zoneId;
                    });
                    var clients = clientRows.filter(function (row) {
                        return row.zone === zoneId;
                    });
                    var userList = "";
                    for (const user of users) {
                        userList += user.username;
                        if (user === users[users.length - 1]) {
                            userList += ".";
                        } else userList += ", ";
                    }
                    var clientList = "";
                    for (const client of clients) {
                        clientList += client.full_name;
                        if (client === clients[clients.length - 1]) {
                            clientList += ".";
                        } else clientList += ", ";
                    }
                    var inZone = userList ? "Users: " + userList : "";
                    inZone += clientList ? "\nClients: " + clientList : "";
                    alert(
                        "Zone cannot be deleted. The following users/clients are in this zone: \n" +
                            inZone
                    );
                } else {
                    alert("Encountered an error while trying to delete the zone!");
                }
            }
            history.push("/admin");
        });
    };
    const handleDeleteZone = (zoneId: number) => {
        if (window.confirm("Are you sure you want to delete this zone?")) {
            deleteZone(zoneId);
        }
    };
    return loadingError ? (
        <Alert severity="error">
            Something went wrong trying to load that user. Please go back and try again.{" "}
            {loadingError}
        </Alert>
    ) : zone && zones.size ? (
        <Formik
            initialValues={zone}
            validationSchema={editZoneValidationSchema}
            onSubmit={(values, formikHelpers) => {
                handleZoneEditSubmit(values, formikHelpers)
                    .then(() => history.push("/admin"))
                    .then(() => window.location.reload())
                    .catch((e) => {
                        const errMsg =
                            e instanceof APIFetchFailError
                                ? e.buildFormError(zoneFieldLabels)
                                : `${e}` ??
                                  "Sorry, something went wrong trying to edit that user. Please try again.";
                        alert(errMsg);
                    });
            }}
        >
            {({ values, setFieldValue, isSubmitting }) => (
                <div className={styles.container}>
                    <br />
                    <b>ZoneName </b>
                    <p>{zone.zone_name}</p>
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

                                <Button color="primary" variant="outlined" onClick={history.goBack}>
                                    Cancel
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    variant="contained"
                                    className={styles.disableBtn}
                                    onClick={() => handleDeleteZone(zone.id)}
                                >
                                    DELETE
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

export default ZoneEdit;
