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
import ClientVisitTimeline from "./VisitTimeline/ClientVisitTimeline";
import { timestampToFormDate } from "util/dates";

interface IUrlParam {
    clientId: string;
}

const ClientDetails = () => {
    const { clientId } = useParams<IUrlParam>();
    const [clientInfo, setClientInfo] = useState<IClient>();
    const [zoneOptions, setZoneOptions] = useState<IZone[]>([]);
    const [disabilityOptions, setDisabilityOptions] = useState<IDisability[]>([]);

    const history = useHistory();

    useEffect(() => {
        const getClient = () => {
            return apiFetch(Endpoint.CLIENT, `${clientId}`)
            .then(resp => resp.json())
            .then(resp => resp as IClient)
        }

        Promise
            .all([getClient(), getAllZones(), getAllDisabilities()])
            .then(([client, zones, disabilities]) => {
                client.birth_date = timestampToFormDate(client.birth_date as number);
                client.risks.sort((a: IRisk, b: IRisk) => b.timestamp - a.timestamp);

                setClientInfo(client);
                setZoneOptions(zones);
                setDisabilityOptions(disabilities);
            })
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

            <Grid item xs={12}>
                <hr />
            </Grid>

            <Grid item xs={12}>
                <Typography style={{ marginLeft: "10px" }} variant="h5" component="h1">
                    <b>Visits Timeline</b>
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <ClientVisitTimeline client={clientInfo} zones={zoneOptions} />
            </Grid>
        </Grid>
    ) : (
        <CircularProgress />
    );
};

export default ClientDetails;
