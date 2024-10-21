import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouteMatch } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Alert from '@mui/material/Alert';
import Skeleton from '@mui/material/Skeleton';

import { IClient } from "@cbr/common/util/clients";
import { apiFetch, Endpoint } from "@cbr/common/util/endpoints";
import RiskHistoryCharts from "./RiskHistoryCharts";
import RiskHistoryTimeline from "./RiskHistoryTimeline";
import GoBackButton from "components/GoBackButton/GoBackButton";

interface IRouteParams {
    clientId: string;
}

const ClientRiskHistory = () => {
    const { t } = useTranslation();
    const { clientId } = useRouteMatch<IRouteParams>().params;
    const [loadingError, setLoadingError] = useState(false);
    const [client, setClient] = useState<IClient>();

    useEffect(() => {
        const getClient = async () => {
            try {
                const client: IClient = await (await apiFetch(Endpoint.CLIENT, clientId)).json();
                setClient(client);
            } catch (e) {
                setLoadingError(true);
            }
        };

        getClient();
    }, [clientId]);

    return (
        <>
            <GoBackButton />
            <br />
            <br />

            {loadingError ? (
                <Alert severity="error">{t("alert.generalFailureTryAgain")}</Alert>
            ) : (
                <>
                    <Typography variant="h3">
                        {client ? (
                            <>
                                {client.first_name} {client.last_name}
                            </>
                        ) : (
                            <Skeleton variant="text" />
                        )}
                    </Typography>
                    <br />
                    <RiskHistoryCharts client={client} />
                    <RiskHistoryTimeline client={client} />
                </>
            )}
        </>
    );
};

export default ClientRiskHistory;
