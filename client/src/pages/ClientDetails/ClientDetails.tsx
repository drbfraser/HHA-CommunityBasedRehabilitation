import React, { useState, useEffect } from "react";
import { useParams } from "react-router";

import { Grid, CircularProgress, Typography, Button } from "@material-ui/core";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";

import { apiFetch, Endpoint } from "../../util/endpoints";

import ClientInfoForm from "./ClientInfoForm";
import { IClient } from "util/clients";
import ClientRisks from "./Risks/ClientRisks";
import { IRisk } from "util/risks";
import { getAllZones, IZone, getAllDisabilities, IDisability } from "util/cache";
import { useHistory } from "react-router-dom";

interface IUrlParam {
    clientId: string;
}

const ClientDetails = () => {
    const { clientId } = useParams<IUrlParam>();
    const [zoneOptions, setZoneOptions] = useState<IZone[]>([]);
    const [disabilityOptions, setDisabilityOptions] = useState<IDisability[]>([]);
    const [clientInfo, setClientInfo] = useState<IClient>();

    const history = useHistory();

    useEffect(() => {
        const fetchClientInfo = async () => {
            const clientInfo = await (await apiFetch(Endpoint.CLIENT, `${clientId}`)).json();
            const tempDate = new Date(clientInfo.birth_date * 1000).toISOString();
            clientInfo.birth_date = tempDate.substring(0, 10);
            clientInfo.risks.sort((a: IRisk, b: IRisk) => b.timestamp - a.timestamp);

            setClientInfo(clientInfo);
        };
        const fetchAllZones = async () => {
            const zones = await getAllZones();
            setZoneOptions(zones);
        };
        const fetchAllDisabilities = async () => {
            const disabilities = await getAllDisabilities();
            setDisabilityOptions(disabilities);
        };

        fetchAllZones();
        fetchAllDisabilities();
        fetchClientInfo();
    }, [clientId]);

    return clientInfo && zoneOptions.length ? (
        <Grid container spacing={2} direction="row" justify="flex-start">
            <Grid item>
                <ClientInfoForm
                    clientInfo={clientInfo}
                    zoneOptions={zoneOptions}
                    disabilityOptions={disabilityOptions}
                />
            </Grid>
            <Grid item md={12} xs={12}>
                <hr />
            </Grid>
            <Grid container justify="space-between" direction="row">
                <Grid item md={6} xs={6}>
                    <Typography style={{ marginLeft: "10px" }} variant="h5" component="h1">
                        <b>Risk Levels</b>
                    </Typography>
                    <br />
                </Grid>
                <Grid item md={6} xs={6}>
                    <Button
                        size="small"
                        style={{ float: "right" }}
                        onClick={() => {
                            history.push(`/client/${clientId}/risks`);
                        }}
                    >
                        See Risk History
                        <ArrowForwardIcon fontSize="small" />
                    </Button>
                </Grid>
            </Grid>
            <ClientRisks clientInfo={clientInfo} />

            <Grid item md={12} xs={12}>
                <hr />
            </Grid>
            <Grid container justify="space-between" direction="row">
                <Grid item md={6} xs={6}>
                    <Typography style={{ marginLeft: "10px" }} variant="h5" component="h1">
                        <b>Recent Visits</b>
                    </Typography>
                    <br />
                </Grid>
                <Grid item md={6} xs={6}>
                    <Button
                        size="small"
                        style={{ float: "right" }}
                        onClick={() => {
                            history.push(`/client/${clientId}/visits`);
                        }}
                    >
                        See Visit History
                        <ArrowForwardIcon fontSize="small" />
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    ) : (
        <CircularProgress />
    );
};

export default ClientDetails;
