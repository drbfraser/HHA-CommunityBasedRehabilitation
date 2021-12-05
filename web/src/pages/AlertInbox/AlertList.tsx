import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import { RiskLevel, riskLevels } from "@cbr/common/util/risks";
import { FiberManualRecord } from "@material-ui/icons";
import RiskLevelChip from "components/RiskLevelChip/RiskLevelChip";
import { makeStyles } from "@material-ui/core/styles";
import { PriorityLevel } from "@cbr/common/util/alerts";
import { useState, useEffect } from "react";
import { apiFetch, Endpoint } from "@cbr/common/util/endpoints";
import { Time } from "@cbr/common/util/time";
import { socket } from "@cbr/common/context/SocketIOContext";

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

export interface IAlert {
    id: number;
    subject: string;
    priority: PriorityLevel;
    alert_message: string;
    unread_by_users: string[];
    created_by_user: number;
    created_date: Time;
}

type AlertDetailProps = {
    onAlertSelectionEvent: (itemNum: number) => void;
    selectAlert: number;
    userID: string;
};

const RenderBadge = (params: String) => {
    let risk: RiskLevel;

    /*
      TODO: this should be improved, make Priority icons seperate from Risk Icons
    */
    if (params === "ME") {
        risk = RiskLevel.MEDIUM;
    } else if (params === "HI") {
        risk = RiskLevel.HIGH;
    } else {
        risk = RiskLevel.LOW;
    }

    /* TODO: This function is not working as expected */
    return window.innerWidth >= 20 ? (
        <RiskLevelChip clickable risk={risk} />
    ) : (
        <FiberManualRecord style={{ color: riskLevels[risk].color }} />
    );
};

const AlertList = (alertDetailProps: AlertDetailProps) => {
    const style = useStyles();
    const [alertData, setAlertData] = useState<IAlert[]>([]);
    // For the purposes of tracking changes to a user's unread alerts
    const [unreadAlertsCount, setUnreadAlertsCount] = useState<number>(0);

    socket.on("updateUnreadList", (unreadAlerts) => {
        if (unreadAlertsCount !== unreadAlerts) {
            // update state oonly if the number of unread alerts have changed
            setUnreadAlertsCount(unreadAlerts);
        }
    });

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                let tempAlerts: IAlert[] = await (await apiFetch(Endpoint.ALERTS)).json();
                tempAlerts = tempAlerts.sort(function (a, b) {
                    return b.created_date - a.created_date;
                });
                setAlertData(tempAlerts);
            } catch (e) {
                console.log(`Error fetching Alerts: ${e}`);
            }
        };
        fetchAlerts();
    }, [unreadAlertsCount]);

    return (
        <Grid item xs={12} md={3} className={style.gridStyle}>
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
                {alertData.map((currAlert) => {
                    return (
                        <div key={currAlert.id}>
                            <ListItemText
                                primary={
                                    <React.Fragment>
                                        <Typography
                                            sx={{
                                                display: "inline",
                                                fontSize: 16,
                                                fontWeight: currAlert.unread_by_users.includes(
                                                    alertDetailProps.userID
                                                )
                                                    ? "bold"
                                                    : "small",
                                            }}
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            {currAlert.subject}
                                        </Typography>
                                    </React.Fragment>
                                }
                                secondary={RenderBadge(currAlert.priority)}
                                onClick={() => alertDetailProps.onAlertSelectionEvent(currAlert.id)}
                                className={
                                    currAlert.id === alertDetailProps.selectAlert
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
