import React, { useState, useEffect, useCallback } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Grid, Typography, Button } from "@material-ui/core";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { Alert, Skeleton } from "@material-ui/lab";

import { apiFetch, Endpoint } from "@cbr/common/util/endpoints";
import { IClient } from "@cbr/common/util/clients";
import { IRisk } from "@cbr/common/util/risks";
import { timestampToFormDate } from "@cbr/common/util/dates";
import ClientInfoForm from "./ClientInfoForm";
import ClientRisks from "./Risks/ClientRisks";
import ClientTimeline from "./ClientTimeline/ClientTimeline";

interface IUrlParam {
    clientId: string;
}

const ClientDetails = () => {
    const { clientId } = useParams<IUrlParam>();
    const [clientInfo, setClientInfo] = useState<IClient>();
    const [loadingError, setLoadingError] = useState(false);
    const history = useHistory();
    const { t } = useTranslation();

    const getClient = useCallback(() => {
        apiFetch(Endpoint.CLIENT, `${clientId}`)
            .then((resp) => resp.json())
            .then((client: IClient) => {
                client.birth_date = timestampToFormDate(client.birth_date as number, true);
                client.risks.sort((a: IRisk, b: IRisk) => b.timestamp - a.timestamp);
                setClientInfo(client);
            })
            .catch(() => setLoadingError(true));
    }, [clientId]);

    useEffect(() => {
        getClient();
    }, [getClient]);

    if (loadingError) {
        return (
            <Alert severity="error">
                {/* TODO: translate */}
                Something went wrong loading that client. Please try again.
            </Alert>
        );
    }

    return (
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
                        {/* TODO: translate */}
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
                        {/* TODO: translate */}
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
                    <b>{t("clientAttr.visitsRefsSurveys")}</b>
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <ClientTimeline refreshClient={getClient} client={clientInfo} />
            </Grid>
        </Grid>
    );
};

export default ClientDetails;
