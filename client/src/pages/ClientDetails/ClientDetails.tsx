import React, { useState, useEffect } from "react";
import { useParams } from "react-router";

import { Grid, Typography, Button } from "@material-ui/core";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";

import { apiFetch, Endpoint } from "../../util/endpoints";

import ClientInfoForm from "./ClientInfoForm";
import { IClient } from "util/clients";
import ClientRisks from "./Risks/ClientRisks";
import { IRisk } from "util/risks";
import { getAllZones, IZone, getAllDisabilities, IDisability } from "util/cache";
import { useHistory } from "react-router-dom";
import VisitReferralTimeline from "./VisitReferralTimeline/VisitReferralTimeline";
import { timestampToFormDate } from "util/dates";
import { Alert, Skeleton } from "@material-ui/lab";

interface IUrlParam {
    clientId: string;
}

const ClientDetails = () => {
    const { clientId } = useParams<IUrlParam>();
    const [clientInfo, setClientInfo] = useState<IClient>();
    const [zoneOptions, setZoneOptions] = useState<IZone[]>([]);
    const [disabilityOptions, setDisabilityOptions] = useState<IDisability[]>([]);
    const [loadingError, setLoadingError] = useState(false);

    const history = useHistory();

    useEffect(() => {
        const getClient = () => {
            return apiFetch(Endpoint.CLIENT, `${clientId}`)
                .then((resp) => resp.json())
                .then((resp) => resp as IClient);
        };

        Promise.all([getClient(), getAllZones(), getAllDisabilities()])
            .then(([client, zones, disabilities]) => {
                client.birth_date = timestampToFormDate(client.birth_date as number);
                client.risks.sort((a: IRisk, b: IRisk) => b.timestamp - a.timestamp);

                setClientInfo(client);
                setZoneOptions(zones);
                setDisabilityOptions(disabilities);
            })
            .catch(() => {
                setLoadingError(true);
            });
    }, [clientId]);

    return loadingError ? (
        <Alert severity="error">Something went wrong loading that client. Please try again.</Alert>
    ) : (
        <Grid container spacing={2} direction="row" justify="flex-start">
            <Grid item xs={12}>
                {clientInfo && zoneOptions.length && disabilityOptions.length ? (
                    <ClientInfoForm
                        clientInfo={clientInfo}
                        zoneOptions={zoneOptions}
                        disabilityOptions={disabilityOptions}
                    />
                ) : (
                    <Skeleton variant="rect" height={500} />
                )}
            </Grid>
            <Grid item xs={12}>
                <hr />
            </Grid>
            <Grid container justify="space-between" direction="row">
                <Grid item xs={6}>
                    <Typography style={{ marginLeft: "10px" }} variant="h5" component="h1">
                        <b>Risk Levels</b>
                    </Typography>
                    <br />
                </Grid>
                <Grid item xs={6}>
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

            <Grid container justify="space-between" direction="row">
                <Grid item xs={6}>
                    <Typography style={{ marginLeft: "10px" }} variant="h5" component="h1">
                        <b>Visits &amp; Referrals</b>
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Button
                        size="small"
                        style={{ float: "right" }}
                        onClick={() => {
                            history.push(`/client/${clientId}/visits/new`);
                        }}
                    >
                        New Visit
                        <ArrowForwardIcon fontSize="small" />
                    </Button>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <VisitReferralTimeline client={clientInfo} zones={zoneOptions} />
            </Grid>
        </Grid>
    );
};

export default ClientDetails;
