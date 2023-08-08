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
import ConfirmDeleteZone from "components/Dialogs/ConfirmDeleteZone";
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
    const [userList, setUserList] = useState<IResponseRow[]>([]);
    const [clientList, setClientList] = useState<IResponseRow[]>([]);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

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
                alert("Encountered an error while trying to delete the zone!");
            } else {
                alert("Zone successfully deleted!");
                history.push("/admin");
            }
        });
    };
    const getClientsAndUsers = async (zoneId: any) => {
        const allUsers = await apiFetch(Endpoint.USERS, "");
        const allClients = await apiFetch(Endpoint.CLIENTS, "");
        const userRows: IResponseRow[] = await allUsers.json();
        const clientRows: IResponseRow[] = await allClients.json();
        const usersInZone = userRows.filter(function (row) {
            return row.zone === zoneId;
        });
        const clientsInZone = clientRows.filter(function (row) {
            return row.zone === zoneId;
        });
        setUserList(usersInZone);
        setClientList(clientsInZone);
        return usersInZone.length || clientsInZone.length;
    };
    const handleDeleteZone = async (zoneId: number) => {
        const zoneNotEmpty = await getClientsAndUsers(zoneId);
        if (zoneNotEmpty) {
            setDialogOpen(true);
        } else if (window.confirm("Are you sure you want to delete this zone?")) deleteZone(zoneId);
    };
    return loadingError ? (
        <Alert severity="error">
            Something went wrong trying to load that user. Please go back and try again.{" "}
            {loadingError}
        </Alert>
    ) : zone && zones.size ? (
        <div>
            <ConfirmDeleteZone
                users={userList}
                clients={clientList}
                zoneId={zone.id}
                open={dialogOpen}
                setOpen={setDialogOpen}
                handleDeleteZone={deleteZone}
            />
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

                                    <Button
                                        color="primary"
                                        variant="outlined"
                                        onClick={history.goBack}
                                    >
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
        </div>
    ) : (
        <Skeleton variant="rect" height={500} />
    );
};

export default ZoneEdit;
