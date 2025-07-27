import React, { useState, useEffect, useCallback } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Alert, Grid, Skeleton, Typography, Button, styled } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { apiFetch, Endpoint } from "@cbr/common/util/endpoints";
import { IClient } from "@cbr/common/util/clients";
import { IRisk } from "@cbr/common/util/risks";
import { timestampToFormDate } from "@cbr/common/util/dates";
import ClientInfoForm from "./ClientInfoForm";
import ClientRisks from "./Risks/ClientRisks";
import ClientTimeline from "./ClientTimeline/ClientTimeline";
import PreviousGoalsModal from "./PreviousGoals/PreviousGoalsModal/PreviousGoalsModal";

interface IUrlParam {
    clientId: string;
}

const SectionHeader = styled(Typography)({
    marginLeft: "20px",
});

const ClientDetails = () => {
    const { clientId } = useParams<IUrlParam>();
    const [clientInfo, setClientInfo] = useState<IClient>();
    const [loadingError, setLoadingError] = useState(false);
    const history = useHistory();
    const { t } = useTranslation();
    const [isPrevGoalsOpen, setPrevGoalsOpen] = useState(false);

    const handlePrevGoalsClick = () => {
        setPrevGoalsOpen((prevGoalsOpen) => !prevGoalsOpen);
    };

    const getClient = useCallback(() => {
        apiFetch(Endpoint.CLIENT, clientId)
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
        return <Alert severity="error">{t("alert.loadClientFailure")}</Alert>;
    }
    return (
        <>
            {isPrevGoalsOpen && (
                <PreviousGoalsModal clientId={clientId} close={handlePrevGoalsClick} />
            )}
            <Grid container spacing={2} direction="row" justifyContent="flex-start">
                <Grid item xs={12}>
                    {clientInfo ? (
                        <ClientInfoForm clientInfo={clientInfo} />
                    ) : (
                        <Skeleton variant="rectangular" height={500} />
                    )}
                </Grid>

                <Grid item xs={12}>
                    <hr />
                </Grid>

                <Grid container justifyContent="space-between" direction="row">
                    <Grid item xs={6}>
                        <SectionHeader variant="h5">
                            <b>{t("clientAttr.riskLevels")}</b>
                        </SectionHeader>
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            size="small"
                            style={{ float: "right" }}
                            onClick={() => history.push(`/client/${clientId}/risks`)}
                        >
                            {t("clientAttr.seeRiskHistory")}
                            <ArrowForwardIcon fontSize="small" />
                        </Button>
                    </Grid>
                </Grid>
                <Grid item xs={2}>
                    <Button
                        color="primary"
                        variant="contained"
                        fullWidth
                        onClick={handlePrevGoalsClick}
                    >
                        {t("goals.previousGoals")}
                    </Button>
                </Grid>

                <Grid item xs={12}>
                    <ClientRisks clientInfo={clientInfo} refreshClient={getClient} />
                </Grid>

                <Grid item xs={12}>
                    <hr />
                </Grid>

                <Grid item xs={6}>
                    <SectionHeader variant="h5">
                        <b>{t("clientAttr.visitsRefsSurveys")}</b>
                    </SectionHeader>
                </Grid>
                <Grid item xs={12}>
                    <ClientTimeline refreshClient={getClient} client={clientInfo} />
                </Grid>
            </Grid>
        </>
    );
};

export default ClientDetails;
