import React, { useState, useEffect } from "react";
import { useParams } from "react-router";

import { Grid, CircularProgress, Typography, Button } from "@material-ui/core";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";

import { apiFetch, Endpoint } from "../../util/endpoints";

import ClientInfo from "./ClientInfo";
import { IClient } from "util/clients";
import ClientRisks from "./ClientRisks";
import { IRisk } from "util/risks";
import { getAllZones, IZone } from "util/cache";
import { useHistory } from "react-router-dom";

interface IUrlParam {
    clientId: string;
}

const ClientDetails = () => {
    const { clientId } = useParams<IUrlParam>();
    const [zoneOptions, setZoneOptions] = useState<IZone[]>([]);
    const [clientInfo, setClientInfo] = useState<IClient>();
    const [clientHealthRisk, setClientHealthRisk] = useState<IRisk>();
    const [clientSocialRisk, setClientSocialRisk] = useState<IRisk>();
    const [clientEducationRisk, setClientEducationRisk] = useState<IRisk>();

    const history = useHistory();

    useEffect(() => {
        const fetchClientInfo = async () => {
            const clientInfo = await (await apiFetch(Endpoint.CLIENT, `${clientId}`)).json();
            const tempDate = new Date(clientInfo.birth_date * 1000).toISOString();
            clientInfo.birth_date = tempDate.substring(0, 10);
            clientInfo.risks.sort((a: IRisk, b: IRisk) => b.timestamp - a.timestamp);
            setClientHealthRisk(
                clientInfo.risks.filter((risk: IRisk) => risk.risk_type === "HEALTH")[0]
            );
            setClientSocialRisk(
                clientInfo.risks.filter((risk: IRisk) => risk.risk_type === "SOCIAL")[0]
            );
            setClientEducationRisk(
                clientInfo.risks.filter((risk: IRisk) => risk.risk_type === "EDUCAT")[0]
            );

            setClientInfo(clientInfo);
        };
        const fetchAllZones = async () => {
            const zones = await getAllZones();
            setZoneOptions(zones);
        };

        fetchAllZones();
        fetchClientInfo();
    }, [clientId]);

    return clientInfo && zoneOptions.length ? (
        <Grid container spacing={2} direction="row" justify="flex-start">
            <Grid item>
                <ClientInfo clientInfo={clientInfo} zoneOptions={zoneOptions} />
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
            {clientHealthRisk && clientSocialRisk && clientEducationRisk ? (
                <ClientRisks
                    healthRisk={clientHealthRisk}
                    socialRisk={clientSocialRisk}
                    educatRisk={clientEducationRisk}
                />
            ) : (
                <></>
            )}

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
                        // TODO: add visits history path once visits history page is implemented.
                        // onClick={() => {
                        //     history.push(`/client/${client_id}/`);
                        // }}
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
