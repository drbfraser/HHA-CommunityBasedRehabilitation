import React from "react";
import Grid from "@material-ui/core/Grid";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { IAlert } from "@cbr/common/util/alerts";
import { useEffect } from "react";
import { handleUpdateAlertSubmit, handleDeleteAlert } from "@cbr/common/forms/Alert/alertHandler";

const useStyles = makeStyles({
    dividerStyle: {
        backgroundColor: "grey",
        height: "3px",
    },
    deleteButtonStyle: {
        bottom: 0,
        position: "absolute",
    },
    detailContainerStyle: {
        position: "relative",
        minHeight: "300px",
    },
});

type Props = {
    selectAlert: number;
    userID: string;
    alertData: IAlert[];
    refreshAlert: () => void;
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

    return (
        <Grid item xs={9} className={style.detailContainerStyle}>
            <h1>Details</h1>
            <Divider variant="fullWidth" className={style.dividerStyle} />

            <h2>{selectedItem.length === 0 ? "" : selectedItem[0].subject}</h2>
            <Typography>
                {selectedItem.length === 0 || selectedItem[0].alert_message === ""
                    ? "Please select an alert."
                    : selectedItem[0].alert_message}
            </Typography>
            {selectedItem.length === 0 ? (
                <></>
            ) : (
                <div className={style.deleteButtonStyle}>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() =>
                            handleDeleteAlert(selectedItem[0].id, alertDetailProps.refreshAlert)
                        }
                    >
                        Discard
                    </Button>
                </div>
            )}
        </Grid>
    );
};

export default AlertDetail;
