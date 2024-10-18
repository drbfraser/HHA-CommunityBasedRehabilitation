import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Grid from "@material-ui/core/Grid";
import { FiberManualRecord } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

import { socket } from "@cbr/common/context/SocketIOContext";
import { IAlert, PriorityLevel, priorityLevels } from "@cbr/common/util/alerts";
import { timestampToDate } from "@cbr/common/util/dates";
import PriorityLevelChip from "components/PriorityLevelChip/PriorityLevelChip";
import { compressedDataGridWidth } from "styles/DataGrid.styles";

const useStyles = makeStyles({
    selectedListItemStyle: {
        backgroundColor: "lightcyan",
        border: "1px solid blue",
        padding: "3px",
    },
    listItemStyle: {
        padding: "3px",
    },
    gridStyle: {
        borderRight: "3px solid grey",
    },
    dividerStyle: {
        margin: "0px",
        padding: "0px",
    },
    tableTopAndContentDividerStyle: {
        backgroundColor: "grey",
        height: "3px",
    },
});

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
    const style = useStyles();
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
        <Grid item xs={3} className={style.gridStyle}>
            <h1>Alerts</h1>
            <Divider variant="fullWidth" className={style.tableTopAndContentDividerStyle} />
            <List
                sx={{
                    width: "100%",
                    maxWidth: 360,
                    bgcolor: "background.paper",
                    overflow: "auto",
                }}
            >
                {sortAlert(alertData).map((alert) => {
                    return (
                        <div key={alert.id}>
                            <ListItemText
                                primary={
                                    <div>
                                        <Typography
                                            sx={{
                                                display: "inline",
                                                paddingRight: 1,
                                                fontSize: 18,
                                                fontWeight: getFontWeight(alert),
                                            }}
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                            noWrap={false}
                                        >
                                            {alert.subject}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                display: "inline",
                                                fontSize: 14,
                                                fontWeight: getFontWeight(alert),
                                            }}
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
                                            sx={{
                                                display: "inline",
                                                fontSize: 14,
                                                fontWeight: getFontWeight(alert),
                                            }}
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
                                className={
                                    alert.id === selectAlert
                                        ? style.selectedListItemStyle
                                        : style.listItemStyle
                                }
                            />

                            <Divider
                                variant="fullWidth"
                                component="li"
                                className={style.dividerStyle}
                            />
                        </div>
                    );
                })}
            </List>
        </Grid>
    );
};

export default AlertList;
