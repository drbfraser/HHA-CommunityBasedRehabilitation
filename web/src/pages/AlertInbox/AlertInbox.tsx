import React, { useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import AlertList from "./AlertList";
import AlertDetail from "./AlertDetail";
import { useState } from "react";
import { getCurrentUser } from "@cbr/common/util/hooks/currentUser";
import { APILoadError } from "@cbr/common/util/endpoints";

const AlertInbox = () => {
    const [selectedAlert, setSelectedAlert] = useState<number>(-1);
    const [userID, setUserID] = useState<string>("unknown");

    const alertListProps = {
        onAlertSelectionEvent: (itemNum: number) => {
            setSelectedAlert(itemNum);
        },
        selectAlert: selectedAlert,
    };

    useEffect(() => {
        const getUserProfile = async () => {
            let user = await getCurrentUser();
            if (user !== APILoadError) {
                setUserID(user.id);
            }
        };
        getUserProfile();
    }, []);

    const alertDetailProps = {
        selectAlert: selectedAlert,
        userID: userID,
    };

    return (
        <Grid container justify="center" alignItems="flex-start" spacing={3}>
            <AlertList {...alertListProps} />
            <AlertDetail {...alertDetailProps} />
            {/* TODO: 
              API call should be placed in this component, need to check how to pass those as props
            */}
            {/* <AlertList alertListProps={alertListProps} alertData={alertData} />
            <AlertDetail alertDetailProps={alertDetailProps} alertData={alertData} /> */}
        </Grid>
    );
};

export default AlertInbox;
