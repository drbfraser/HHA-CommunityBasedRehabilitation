import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Box, Button, Divider, Grid, Typography } from "@mui/material";

import { IAlert } from "@cbr/common/util/alerts";
import { handleUpdateAlertSubmit, handleDeleteAlert } from "@cbr/common/forms/Alert/alertHandler";
import { alertDetailStyles } from "./AlertDetail.styles";

type IProps = {
    selectAlert: number;
    alertData: IAlert[];
    refreshAlert: () => void;
};

const AlertDetail = ({ selectAlert, alertData, refreshAlert }: IProps) => {
    const { t } = useTranslation();

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
        <Grid item xs={9} sx={alertDetailStyles.detailContainerStyle}>
            <h1>{t("general.details")}</h1>
            <Divider variant="fullWidth" sx={alertDetailStyles.dividerStyle} />

            <h2>{selectedItem.length === 0 ? "" : selectedItem[0].subject}</h2>
            <Typography>
                {selectedItem.length === 0 || selectedItem[0].alert_message === ""
                    ? t("alerts.selectAnAlert")
                    : selectedItem[0].alert_message}
            </Typography>

            {selectedItem.length !== 0 && (
                <Box sx={alertDetailStyles.deleteButtonStyle}>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDeleteAlert(selectedItem[0].id, refreshAlert)}
                    >
                        {t("general.delete")}
                    </Button>
                </Box>
            )}
        </Grid>
    );
};

export default AlertDetail;
