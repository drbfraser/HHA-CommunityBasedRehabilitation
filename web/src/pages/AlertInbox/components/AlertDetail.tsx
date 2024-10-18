import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Grid from "@material-ui/core/Grid";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import { IAlert } from "@cbr/common/util/alerts";
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

type IProps = {
    selectAlert: number;
    alertData: IAlert[];
    refreshAlert: () => void;
};

const AlertDetail = ({ selectAlert, alertData, refreshAlert }: IProps) => {
    const { t } = useTranslation();
    const style = useStyles();

    useEffect(() => {
        const updateAlertUnreadUsersList = async () => {
            try {
                // Find the selected alert in the alertData list by ID
                const selectedAlertData: IAlert | undefined = alertData.find(
                    ({ id }) => id.toString() === selectAlert.toString()
                );
                if (selectedAlertData) {
                    const updateAlert = {
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
    }, [alertData, selectAlert]);

    const selectedItem: Array<any> = alertData.filter((alert) => {
        return alert.id.toString() === selectAlert.toString();
    });

    return (
        <Grid item xs={9} className={style.detailContainerStyle}>
            <h1>{t("general.details")}</h1>
            <Divider variant="fullWidth" className={style.dividerStyle} />

            <h2>{selectedItem.length === 0 ? "" : selectedItem[0].subject}</h2>
            <Typography>
                {selectedItem.length === 0 || selectedItem[0].alert_message === ""
                    ? t("alerts.selectAnAlert")
                    : selectedItem[0].alert_message}
            </Typography>

            {selectedItem.length !== 0 && (
                <div className={style.deleteButtonStyle}>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDeleteAlert(selectedItem[0].id, refreshAlert)}
                    >
                        {t("general.delete")}
                    </Button>
                </div>
            )}
        </Grid>
    );
};

export default AlertDetail;
