import React, { useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import AlertList from "./AlertList";
import AlertDetail from "./AlertDetail";
import { useState } from "react";
import { apiFetch, Endpoint } from "@cbr/common/util/endpoints";

const AlertInbox = () => {
    const [selectedAlert, setSelectedAlert] = useState<string>("-1");

    const alertListProps = {
        onAlertSelectionEvent: (itemNum: string) => {
            setSelectedAlert(itemNum);
        },
        selectAlert: selectedAlert,
    };

    const alertDetailProps = {
        selectAlert: selectedAlert,
    };

    // TODO: Use case needs to be modified to display alerts properly in the 
    // frontend. This is just a placeholder for testing the alerts endpoint.
    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const tempAlerts: any[] = await (await apiFetch(Endpoint.ALERTS)).json();
                console.log(tempAlerts);
            } catch (e) {
                console.log(`Error fetching Alerts: ${e}`);
            }
        };
        fetchAlerts();
    }, []);

    return (
        <Grid container justify="center" alignItems="flex-start" spacing={3}>
            <AlertList {...alertListProps} />
            <AlertDetail {...alertDetailProps} />
        </Grid>
    );
};

export default AlertInbox;
