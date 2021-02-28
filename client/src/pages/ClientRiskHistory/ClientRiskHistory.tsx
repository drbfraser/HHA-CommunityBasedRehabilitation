import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { ArrowBack } from "@material-ui/icons";
import Alert from "@material-ui/lab/Alert";
import Skeleton from "@material-ui/lab/Skeleton";
import React, { useCallback, useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { IClient } from "util/clients";
import { apiFetch, Endpoint } from "util/endpoints";
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

    // change date format depending on how long ago the client was created
    // this makes the graphs and timeline look better
    const dateFormatter = useCallback(
        (timestamp: number) => {
            const oneWeek = 60 * 60 * 24 * 7;
            const currentTimestamp = Date.now() / 1000;
            const date = new Date(timestamp * 1000);

            if (client && client.created_date - currentTimestamp < oneWeek) {
                return date.toLocaleString([], {
                    weekday: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                });
            }

            return date.toLocaleDateString();
        },
        [client]
    );

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
                    <RiskHistoryCharts risks={client?.risks} dateFormatter={dateFormatter} />
                    <RiskHistoryTimeline client={client} dateFormatter={dateFormatter} />
                </>
            )}
        </>
    );
};

export default ClientRiskHistory;
