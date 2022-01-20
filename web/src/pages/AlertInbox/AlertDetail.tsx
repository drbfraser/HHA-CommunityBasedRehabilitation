import React from "react";
import Grid from "@material-ui/core/Grid";
import Divider from "@mui/material/Divider";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { IAlert } from "@cbr/common/util/alerts";
import { useEffect } from "react";
import { handleUpdateAlertSubmit } from "@cbr/common/forms/Alert/alertHandler";

const useStyles = makeStyles({
    dividerStyle: {
        backgroundColor: "grey",
        height: "3px",
    },
});

type Props = {
    selectAlert: number;
    userID: string;
    alertData: IAlert[];
};

const AlertDetail = (alertDetailProps: Props) => {
    const style = useStyles();
    const { alertData } = alertDetailProps;

    useEffect(() => {
        const updateAlertUnreadUsersList = async () => {
            try {
                // Find the selected alert in the alertData list by ID
                let selectedAlertData: IAlert | undefined = alertData.find(
                    ({ id }) => id.toString() === alertDetailProps.selectAlert.toString()
                );

                let updateAlert: IAlert;
                if (selectedAlertData) {
                    updateAlert = {
                        id: selectedAlertData.id,
                        subject: selectedAlertData.subject,
                        priority: selectedAlertData.priority,
                        alert_message: selectedAlertData.alert_message,
                        unread_by_users: selectedAlertData.unread_by_users,
                        created_by_user: selectedAlertData.created_by_user,
                        created_date: selectedAlertData.created_date,
                    };

                    await handleUpdateAlertSubmit(updateAlert);
                }
            } catch (e) {
                console.log(`Error updating the Alert: ${e}`);
            }
        };

        updateAlertUnreadUsersList();
    }, [alertDetailProps, alertData]);

    const selectedItem: Array<any> = alertData.filter((alert) => {
        return alert.id.toString() === alertDetailProps.selectAlert.toString();
    });

    /* TODO: Delete Button */
    return (
        <Grid item xs={9}>
            <h1>Details</h1>

            <Divider variant="fullWidth" className={style.dividerStyle} />

            <h2>{selectedItem.length === 0 ? "" : selectedItem[0].subject}</h2>
            <Typography>
                {selectedItem.length === 0 || selectedItem[0].alert_message === ""
                    ? "Empty"
                    : selectedItem[0].alert_message}
            </Typography>
        </Grid>
    );
};

export default AlertDetail;
