import React, { useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import AlertList from "./AlertList";
import AlertDetail from "./AlertDetail";
import { useState } from "react";
import { apiFetch, Endpoint } from "@cbr/common/util/endpoints";
import { IAlert } from "./Alert";

// type AlertDetailProps = {
//   onAlertSelectionEvent: (itemNum: number) => void;
//   selectAlert: number;
// };

const AlertInbox = () => {
    const [selectedAlert, setSelectedAlert] = useState<number>(-1);
    const [alertData, setAlertData] = useState<IAlert[]>([]);



    const alertListProps = {
        onAlertSelectionEvent: (itemNum: number) => {
            setSelectedAlert(itemNum);
        },
        //selectAlert: selectedAlert,
    };

    const alertDetailProps = {
        selectAlert: selectedAlert,
    };

    // TODO: Use case needs to be modified to display alerts properly in the
    // frontend. This is just a placeholder for testing the alerts endpoint.
    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                setAlertData(await (await apiFetch(Endpoint.ALERTS)).json());
            } catch (e) {
                console.log(`Error fetching Alerts: ${e}`);
            }
        };
        fetchAlerts();
    }, []);

    return (
        <Grid container justify="center" alignItems="flex-start" spacing={3}>
            <AlertList alertListProps={alertListProps} alertData={alertData} />
            <AlertDetail alertDetailProps={alertDetailProps} alertData={alertData} />
        </Grid>
    );
};

export default AlertInbox;
