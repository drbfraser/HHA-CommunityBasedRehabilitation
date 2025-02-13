import { IAlert } from "@cbr/common/util/alerts";
import { apiFetch, APILoadError, Endpoint } from "@cbr/common/util/endpoints";
import { getCurrentUser } from "@cbr/common/util/hooks/currentUser";
import { IUser } from "@cbr/common/util/users";
import { Divider } from "@mui/material";
import Grid from "@mui/material/Grid";
import React, { useEffect, useState } from "react";
import { alertInboxStyles } from "./AlertInbox.styles";
import { AlertDetail, AlertList } from "./components";

const AlertInbox = () => {
    const [selectedAlert, setSelectedAlert] = useState<number>(-1);
    const [userID, setUserID] = useState<string>("unknown");
    const [alertData, setAlertData] = useState<IAlert[]>([]);

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

    useEffect(() => {
        const getUserProfile = async () => {
            let user: IUser | typeof APILoadError = await getCurrentUser();
            if (user !== APILoadError) {
                setUserID(user.id);
            }
        };
        getUserProfile();
    }, []);

    const alertListProps = {
        onAlertSelectionEvent: (itemNum: number) => {
            setSelectedAlert(itemNum);
        },
        selectAlert: selectedAlert,
        userID: userID,
        alertData: alertData,
        onAlertSetEvent: (alertData: IAlert[]) => {
            setAlertData(alertData);
        },
    };

    const refreshAlert = async () => {
        try {
            setAlertData(await (await apiFetch(Endpoint.ALERTS)).json());
        } catch (e) {
            console.log(`Error fetching Alerts: ${e}`);
        }
    };
    const alertDetailProps = {
        selectAlert: selectedAlert,
        userID: userID,
        alertData: alertData,
        refreshAlert,
    };

    return (
        <Grid
            container
            direction={{ xs: "column", sm: "row" }}
            alignItems="stretch"
            spacing={3}
            padding="10px"
        >
            <Grid item xs={3}>
                <AlertList {...alertListProps} />
            </Grid>
            <Grid item alignSelf="stretch">
                <Divider
                    orientation="vertical"
                    sx={alertInboxStyles.tableTopAndContentDividerStyle}
                />
            </Grid>
            <Grid item xs>
                <AlertDetail {...alertDetailProps} />
            </Grid>
            {/* TODO: API call should be placed in this component, need to check how to pass those as props */}
            {/* <AlertList alertListProps={alertListProps} alertData={alertData} />
                <AlertDetail alertDetailProps={alertDetailProps} alertData={alertData} /> */}
        </Grid>
    );
};

export default AlertInbox;
