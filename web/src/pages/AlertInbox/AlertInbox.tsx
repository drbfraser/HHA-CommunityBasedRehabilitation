import React from "react";
import Grid from "@material-ui/core/Grid";
import AlertList from "./AlertList";
import AlertDetail from "./AlertDetail";
import { useState } from "react";

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

    return (
        <Grid container justify="center" alignItems="flex-start" spacing={3}>
            <AlertList {...alertListProps} />
            <AlertDetail {...alertDetailProps} />
        </Grid>
    );
};

export default AlertInbox;
