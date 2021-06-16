import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router";

import { Grid, Typography, Button } from "@material-ui/core";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";

import { apiFetch, Endpoint } from "../../util/endpoints";

import ClientInfoForm from "./ClientInfoForm";
import { IClient } from "util/clients";
import ClientRisks from "./Risks/ClientRisks";
import { IRisk } from "util/risks";
import { useHistory } from "react-router-dom";
import ClientTimeline from "./ClientTimeline/ClientTimeline";
import { timestampToFormDate } from "util/dates";
import { Alert, Skeleton } from "@material-ui/lab";
interface IUrlParam {
    clientId: string;
}

const ClientDetails = () => {
    const { clientId } = useParams<IUrlParam>();
    const [clientInfo, setClientInfo] = useState<IClient>();
    const [loadingError, setLoadingError] = useState(false);

    const history = useHistory();

    const getClient = useCallback(() => {
        apiFetch(Endpoint.CLIENT, `${clientId}`)
            .then((resp) => resp.json())
            .then((client: IClient) => {
                client.birth_date = timestampToFormDate(client.birth_date as number);
                client.risks.sort((a: IRisk, b: IRisk) => b.timestamp - a.timestamp);

                setClientInfo(client);
            })
            .catch(() => setLoadingError(true));
    }, [clientId]);

    useEffect(() => {
        getClient();
    }, [getClient]);

    return loadingError ? (
        <Alert severity="error">Something went wrong loading that client. Please try again.</Alert>
    ) : (
        <Grid container spacing={2} direction="row" justify="flex-start">
            <Grid item xs={12}>
                {clientInfo ? (
                    <ClientInfoForm clientInfo={clientInfo} />
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
            <Grid item xs={6}>
                <Typography style={{ marginLeft: "10px" }} variant="h5" component="h1">
                    <b>Visits, Referrals &amp; Surveys</b>
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <ClientTimeline refreshClient={() => getClient()} client={clientInfo} />
            </Grid>
        </Grid>
    );
};

export default ClientDetails;
