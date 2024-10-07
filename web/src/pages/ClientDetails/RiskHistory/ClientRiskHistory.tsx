import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { ArrowBack } from "@mui/icons-material";
import Alert from '@mui/material/Alert';
import Skeleton from '@mui/material/Skeleton';
import React, { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { IClient } from "@cbr/common/util/clients";
import { apiFetch, Endpoint } from "@cbr/common/util/endpoints";
import RiskHistoryCharts from "./RiskHistoryCharts";
import RiskHistoryTimeline from "./RiskHistoryTimeline";

interface IRouteParams {
    clientId: string;
}

const ClientRiskHistory = () => {
    const history = useHistory();
    const { clientId } = useRouteMatch<IRouteParams>().params;
    const [loadingError, setLoadingError] = useState(false);
    const [client, setClient] = useState<IClient>();

    useEffect(() => {
        const getClient = async () => {
            try {
                const theClient: IClient = await (
                    await apiFetch(Endpoint.CLIENT, `${clientId}`)
                ).json();

                setClient(theClient);
            } catch (e) {
                setLoadingError(true);
            }
        };

        getClient();
    }, [clientId]);

    return (
        <>
            <Button onClick={history.goBack}>
                <ArrowBack /> Go back
            </Button>
            <br />
            <br />
            {loadingError ? (
                <Alert severity="error">Something went wrong. Please go back and try again.</Alert>
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
