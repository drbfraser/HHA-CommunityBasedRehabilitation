import React, { useState, useEffect } from "react";
import { useParams } from "react-router";

import { Grid, Typography, Button } from "@material-ui/core";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";

import { apiFetch, Endpoint } from "../../util/endpoints";

import ClientInfoForm from "./ClientInfoForm";
import { IClient } from "util/clients";
import ClientRisks from "./Risks/ClientRisks";
import { IRisk } from "util/risks";
import { useHistory } from "react-router-dom";
import VisitReferralTimeline from "./VisitReferralTimeline/VisitReferralTimeline";
import { timestampToFormDate } from "util/dates";
import { Alert, Skeleton } from "@material-ui/lab";
import { OTHER } from "util/hooks/disabilities";
interface IUrlParam {
    clientId: string;
}

const ClientDetails = () => {
    const { clientId } = useParams<IUrlParam>();
    const [clientInfo, setClientInfo] = useState<IClient>();
    const [loadingError, setLoadingError] = useState(false);

    const history = useHistory();

    useEffect(() => {
        const getClient = async () => {
            try {
                const client = (await (
                    await apiFetch(Endpoint.CLIENT, `${clientId}`)
                ).json()) as IClient;

                client.birth_date = timestampToFormDate(client.birth_date as number);
                client.risks.sort((a: IRisk, b: IRisk) => b.timestamp - a.timestamp);
                if (!client.disability.includes(OTHER) && client.other_disability.length > 1) {
                    client.disability.push(OTHER);
                }

                setClientInfo(client);
            } catch (e) {
                setLoadingError(true);
            }
        };

        getClient();
    }, [clientId]);

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
                    <b>Visits &amp; Referrals</b>
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <VisitReferralTimeline client={clientInfo} />
            </Grid>
        </Grid>
    );
};

export default ClientDetails;
