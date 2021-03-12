import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { ArrowBack } from "@material-ui/icons";
import Alert from "@material-ui/lab/Alert";
import Skeleton from "@material-ui/lab/Skeleton";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { getZoneMap, IZoneMap } from "util/cache";
import { IClient } from "util/clients";
import { apiFetch, Endpoint } from "util/endpoints";
import VisitHistoryTimeline from "./VisitHistoryTimeline";

interface IRouteParams {
    clientId: string;
}

const ClientVisitHistory = () => {
    const history = useHistory();
    const { clientId } = useParams<IRouteParams>();
    const [loadingError, setLoadingError] = useState(false);
    const [client, setClient] = useState<IClient>();
    const [zones, setZones] = useState<IZoneMap>();

    useEffect(() => {
        const getClientZones = async () => {
            try {
                const theClient: IClient = await (
                    await apiFetch(Endpoint.CLIENT, `${clientId}`)
                ).json();

                const theZones = await getZoneMap();

                setClient(theClient);
                setZones(theZones);
            } catch (e) {
                setLoadingError(true);
            }
        };

        getClientZones();
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
                    <VisitHistoryTimeline client={client} zones={zones} />
                </>
            )}
        </>
    );
};

export default ClientVisitHistory;
