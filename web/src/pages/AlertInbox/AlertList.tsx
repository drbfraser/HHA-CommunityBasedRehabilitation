import React from "react";
import { useState } from "react";
import { Divider, Grid, List, ListItemText, Typography } from "@mui/material";
import { FiberManualRecord } from "@mui/icons-material";
import { socket } from "@cbr/common/context/SocketIOContext";
import { IAlert, PriorityLevel, priorityLevels } from "@cbr/common/util/alerts";
import { timestampToDate } from "@cbr/common/util/dates";
import { compressedDataGridWidth } from "styles/DataGrid.styles";
import PriorityLevelChip from "components/PriorityLevelChip/PriorityLevelChip";
import { alertInboxStyles } from "./AlertInbox.styles";

type AlertDetailProps = {
    onAlertSelectionEvent: (itemNum: number) => void;
    selectAlert: number;
    userID: string;
    alertData: IAlert[];
    onAlertSetEvent: (alertData: IAlert[]) => void;
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

const AlertList = (alertDetailProps: AlertDetailProps) => {
    const { alertData, onAlertSelectionEvent } = alertDetailProps;
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

    return (
        <Grid item xs={3} sx={alertInboxStyles.gridStyle}>
            <h1>Alerts</h1>
            <Divider variant="fullWidth" sx={alertInboxStyles.tableTopAndContentDividerStyle} />
            <List
                // todosd: move inline styles to external file
                sx={{
                    width: "100%",
                    maxWidth: 360,
                    bgcolor: "background.paper",
                    overflow: "auto",
                }}
            >
                {sortAlert(alertData).map((currAlert) => {
                    return (
                        <div key={currAlert.id}>
                            <ListItemText
                                primary={
                                    <div>
                                        <React.Fragment>
                                            <Typography
                                                sx={{
                                                    display: "inline",
                                                    fontSize: 18,
                                                    fontWeight: currAlert.unread_by_users.includes(
                                                        alertDetailProps.userID
                                                    )
                                                        ? "bold"
                                                        : "small",
                                                }}
                                                component="span"
                                                variant="body2"
                                                color="text.primary"
                                                noWrap={false}
                                            >
                                                {currAlert.subject}
                                            </Typography>
                                        </React.Fragment>
                                        {"  "}
                                        <Typography
                                            sx={{
                                                display: "inline",
                                                fontSize: 14,
                                                fontWeight: currAlert.unread_by_users.includes(
                                                    alertDetailProps.userID
                                                )
                                                    ? "bold"
                                                    : "small",
                                            }}
                                            component="span"
                                            variant="body2"
                                            color="#01579b"
                                            noWrap={false}
                                        >
                                            {currAlert.created_by_user}
                                        </Typography>
                                    </div>
                                }
                                secondary={
                                    <div>
                                        {RenderBadge(currAlert.priority)}{" "}
                                        <Typography
                                            sx={{
                                                display: "inline",
                                                fontSize: 14,
                                                fontWeight: currAlert.unread_by_users.includes(
                                                    alertDetailProps.userID
                                                )
                                                    ? "bold"
                                                    : "small",
                                            }}
                                            component="span"
                                            variant="body2"
                                            color="#616161"
                                            noWrap={false}
                                        >
                                            {timestampToDate(currAlert.created_date * 1000)}
                                        </Typography>
                                    </div>
                                }
                                onClick={() => onAlertSelectionEvent(currAlert.id)}
                                sx={{
                                    ...(currAlert.id === alertDetailProps.selectAlert
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
