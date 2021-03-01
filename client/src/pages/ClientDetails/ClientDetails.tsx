import React, { useState, useEffect } from "react";
import { useParams } from "react-router";

import { Grid, CircularProgress, Typography, Button } from "@material-ui/core";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";

import { apiFetch, Endpoint } from "../../util/endpoints";

import ClientInfo, { ClientBasicInfo } from "./ClientInfo";
import ClientRisks, { ClientRiskInterface } from "./ClientRisks";
import { getAllZones, IZone } from "util/cache";
import { useHistory } from "react-router-dom";

interface ParamType {
    client_id: string;
}

interface RiskInterface {
    risk_level: string;
    risk_type: string;
    requirement: string;
    goal: string;
}

const ClientDetails = () => {
    const { client_id } = useParams<ParamType>();
    const [zoneOptions, setZoneOptions] = useState<IZone[]>([]);
    const [clientInfo, setClientInfo] = useState<ClientBasicInfo>();
    const [clientHealthRisk, setClientHealthRisk] = useState<RiskInterface>();
    const [clientSocialRisk, setClientSocialRisk] = useState<RiskInterface>();
    const [clientEducationRisk, setClientEducationRisk] = useState<RiskInterface>();

    const history = useHistory();

    useEffect(() => {
        const fetchClientInfo = async () => {
            const clientInfo = await await (
                await apiFetch(Endpoint.CLIENT, `/${client_id}`)
            ).json();
            const tempDate = new Date(clientInfo.birth_date * 1000).toISOString();
            clientInfo.birth_date = tempDate.substring(0, 10);
            setClientHealthRisk(
                clientInfo.risks.filter(
                    (risk: ClientRiskInterface) => risk.risk_type === "HEALTH"
                )[0]
            );
            setClientSocialRisk(
                clientInfo.risks.filter(
                    (risk: ClientRiskInterface) => risk.risk_type === "SOCIAL"
                )[0]
            );
            setClientEducationRisk(
                clientInfo.risks.filter(
                    (risk: ClientRiskInterface) => risk.risk_type === "EDUCAT"
                )[0]
            );

            setClientInfo(clientInfo);
        };
        const fetchAllZones = async () => {
            const zones = await getAllZones();
            setZoneOptions(zones);
        };

        fetchAllZones();
        fetchClientInfo();
    }, [client_id]);

    return clientInfo ? (
        !!clientInfo.first_name && zoneOptions.length ? (
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
                                history.push(`/client/${client_id}/risk-history`);
                            }}
                        >
                            See Risk History
                            <ArrowForwardIcon fontSize="small" />
                        </Button>
                    </Grid>
                </Grid>
                <ClientRisks
                    healthRisk={clientHealthRisk}
                    socialRisk={clientSocialRisk}
                    educatRisk={clientEducationRisk}
                />
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
                                history.push(`/client/${client_id}/risk-history`);
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
        )
    ) : (
        <CircularProgress />
    );
};

export default ClientDetails;
