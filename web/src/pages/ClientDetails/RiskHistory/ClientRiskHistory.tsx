import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { ArrowBack } from "@material-ui/icons";
import Alert from "@material-ui/lab/Alert";
import Skeleton from "@material-ui/lab/Skeleton";
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
