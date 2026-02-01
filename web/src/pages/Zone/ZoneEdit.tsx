import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouteMatch } from "react-router-dom";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-mui";
import { Alert, Box, Button, Grid, Skeleton } from "@mui/material";

import { handleZoneEditSubmit } from "@cbr/common/forms/Zone/zoneFormsHandler";
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
import { zoneStyles } from "./Zone.styles";

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
    const { t } = useTranslation();
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
                    e instanceof APIFetchFailError && e.details ? `${e}: ${e.details}` : `${e}`,
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
                alert(t("zone.failedDelete"));
            } else {
                alert(t("zone.successfulDelete"));
                history.push("/admin");
            }
        });
    };
    const getClientsAndUsers = async (zoneId: any) => {
        const allUsers = await apiFetch(Endpoint.USERS, "");
        const userRows: IResponseRow[] = await allUsers.json();
        const usersInZone = userRows.filter((row) => row.zone === zoneId);
        setUserList(usersInZone);

        const allClients = await apiFetch(Endpoint.CLIENTS, "");
        const clientRows: IResponseRow[] = await allClients.json();
        const clientsInZone = clientRows.filter((row) => row.zone === zoneId);
        setClientList(clientsInZone);

        return usersInZone.length || clientsInZone.length;
    };
    const handleDeleteZone = async (zoneId: number) => {
        const zoneNotEmpty = await getClientsAndUsers(zoneId);
        if (zoneNotEmpty) {
            setDialogOpen(true);
        } else if (window.confirm(t("zone.confirmDelete"))) {
            deleteZone(zoneId);
        }
    };

    if (loadingError) {
        return (
            <Alert severity="error">
                {t("alert.loadUserFailure")} {loadingError}
            </Alert>
        );
    }
    return zone && zones.size ? (
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
                                    : t("alert.editUserFailure");
                            alert(errMsg);
                        });
                }}
            >
                {({ values, setFieldValue, isSubmitting }) => (
                    <Box sx={zoneStyles.container}>
                        <br />
                        <b>{t("zone.zoneName")}</b>
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
                                        sx={zoneStyles.btn}
                                    >
                                        {t("general.save")}
                                    </Button>

                                    <Button
                                        color="primary"
                                        variant="outlined"
                                        onClick={history.goBack}
                                    >
                                        {t("general.cancel")}
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button
                                        variant="contained"
                                        sx={zoneStyles.disableBtn}
                                        onClick={() => handleDeleteZone(zone.id)}
                                    >
                                        {t("general.delete")}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Form>
                    </Box>
                )}
            </Formik>
        </div>
    ) : (
        <Skeleton variant="rectangular" height={500} />
    );
};

export default ZoneEdit;
