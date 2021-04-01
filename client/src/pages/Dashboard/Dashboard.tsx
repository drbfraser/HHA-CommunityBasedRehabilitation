import React, { useEffect, useState } from "react";
import { Divider, Typography } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { clientPrioritySort, IClientSummary } from "util/clients";
import { apiFetch, Endpoint } from "util/endpoints";

const Dashboard = () => {
    const [clients, setClients] = useState<IClientSummary[]>([]);

    useEffect(() => {
        apiFetch(Endpoint.CLIENTS)
            .then((resp) => resp.json())
            .then((clients) => setClients(clients))
            .catch(() => alert("TODO: error handling if clients fail to load"));
    }, []);

    return (
        <>
            <Alert severity="info">
                <Typography variant="body1">
                    <b>System:</b> Welcome! Unfortunately, the dashboard is not yet fully
                    functional. We have been prioritizing work on clients, risk history, visits and
                    referrals instead.
                </Typography>
            </Alert>
            <br />
            <Alert severity="info">
                <Typography variant="body1">
                    <b>System:</b> Eventually the dashboard will show notifications sent by admins
                    (like this one!) and high-priority clients.
                </Typography>
            </Alert>
            <br />
            <Divider />
            <br />
            <Typography variant="h4" component="span">
                Priority Clients
            </Typography>
            <br />
            <br />
            <Typography variant="body1">
                This is a temporary section, to be replaced with the actual priority client tables.
                Sorted priority clients from the <code>/api/clients</code> endpoint. Clients are
                sorted primarily according to their combined risk levels. One critical risk is
                ranked as higher priority than three high risks; one high risk is ranked as higher
                priority than three medium risks; etc. If a client ties for their combined risk
                &quot;score&quot;, they are then sorted based upon last visit date, oldest first.
            </Typography>
            <div style={{ fontSize: "125%", fontFamily: "monospace" }}>
                {clients.sort(clientPrioritySort).map((c) => (
                    <p>{JSON.stringify(c, null, 1)}</p>
                ))}
            </div>
        </>
    );
};

export default Dashboard;
