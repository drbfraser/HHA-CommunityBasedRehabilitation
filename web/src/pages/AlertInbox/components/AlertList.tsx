import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Divider, Grid, List, ListItemText, Typography } from "@mui/material";
import { FiberManualRecord } from "@mui/icons-material";

import { socket } from "@cbr/common/context/SocketIOContext";
import { IAlert, PriorityLevel, priorityLevels } from "@cbr/common/util/alerts";
import { timestampToDate } from "@cbr/common/util/dates";
import PriorityLevelChip from "components/PriorityLevelChip/PriorityLevelChip";
import { compressedDataGridWidth } from "styles/DataGrid.styles";
import { alertInboxStyles } from "../AlertInbox.styles";
import { alertListStyles } from "./AlertList.styles";

type AlertDetailProps = {
    selectAlert: number;
    userID: string;
    alertData: IAlert[];
    onAlertSelectionEvent: (itemNum: number) => void;
};

const RenderBadge = (params: String) => {
    let priority: PriorityLevel;
    if (params === "ME") {
        priority = PriorityLevel.MEDIUM;
    } else if (params === "HI") {
        priority = PriorityLevel.HIGH;
    } else {
        priority = PriorityLevel.LOW;
    }

    return window.innerWidth >= compressedDataGridWidth ? (
        <PriorityLevelChip clickable priority={priority} />
    ) : (
        <FiberManualRecord style={{ color: priorityLevels[priority].color }} />
    );
};

const AlertList = ({ alertData, userID, selectAlert, onAlertSelectionEvent }: AlertDetailProps) => {
    const { t } = useTranslation();

    // For the purposes of tracking changes to a user's unread alerts
    const [unreadAlertsCount, setUnreadAlertsCount] = useState<number>(0);

    socket.on("updateUnreadList", (unreadAlerts) => {
        if (unreadAlertsCount !== unreadAlerts) {
            // update state only if the number of unread alerts have changed
            setUnreadAlertsCount(unreadAlerts);
        }
    });

    const sortAlert = (alertData: IAlert[]) => {
        const tempAlerts = alertData.sort(function (a, b) {
            return b.created_date - a.created_date;
        });
        return tempAlerts;
    };

    const getFontWeight = (alert: IAlert) =>
        alert.unread_by_users.includes(userID) ? "bold" : "small";

    return (
        <Grid item xs={3} sx={alertInboxStyles.gridStyle}>
            <h1>{t("general.alerts")}</h1>
            <Divider variant="fullWidth" sx={alertInboxStyles.tableTopAndContentDividerStyle} />
            <List sx={alertListStyles.list}>
                {sortAlert(alertData).map((alert) => {
                    return (
                        <div key={alert.id}>
                            <ListItemText
                                primary={
                                    <div>
                                        <Typography
                                            sx={alertListStyles.alertSubject}
                                            fontWeight={getFontWeight(alert)}
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                            noWrap={false}
                                        >
                                            {alert.subject}
                                        </Typography>
                                        <Typography
                                            sx={alertListStyles.alertInfoText}
                                            fontWeight={getFontWeight(alert)}
                                            component="span"
                                            variant="body2"
                                            color="#01579b"
                                            noWrap={false}
                                        >
                                            {alert.created_by_user}
                                        </Typography>
                                    </div>
                                }
                                secondary={
                                    <div>
                                        {RenderBadge(alert.priority)}{" "}
                                        <Typography
                                            sx={alertListStyles.alertInfoText}
                                            fontWeight={getFontWeight(alert)}
                                            component="span"
                                            variant="body2"
                                            color="#616161"
                                            noWrap={false}
                                        >
                                            {timestampToDate(alert.created_date * 1000)}
                                        </Typography>
                                    </div>
                                }
                                onClick={() => onAlertSelectionEvent(alert.id)}
                                sx={{
                                    ...(alert.id === selectAlert
                                        ? alertInboxStyles.selectedListItemStyle
                                        : alertInboxStyles.listItemStyle),
                                }}
                            />

                            <Divider
                                variant="fullWidth"
                                component="li"
                                sx={alertInboxStyles.dividerStyle}
                            />
                        </div>
                    );
                })}
            </List>
        </Grid>
    );
};

export default AlertList;
