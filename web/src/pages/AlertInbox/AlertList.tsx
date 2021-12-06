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
import { PriorityLevel } from "./Alert";
import { useState, useEffect } from "react";
import { Time } from "@cbr/common/util/time";
import alertServices from "@cbr/common/services/alertServices";

declare var require: any

const axios = require('axios');

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

interface IAlert {
    id: number;
    subject: string;
    priority: PriorityLevel;
    alert_message: string;
    created_by_user: number;
    created_date: Time;
}

type AlertDetailProps = {
    onAlertSelectionEvent: (itemNum: number) => void;
    selectAlert: number;
};

const RenderBadge = (params: String) => {
    let risk: RiskLevel;

    /*
      TODO: this should be improved, make Priority icons seperate from Risk Icons
    */
    if (params === "M") {
        risk = RiskLevel.MEDIUM;
    } else if (params === "H") {
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

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const tempAlerts: IAlert[] | undefined  = await alertServices.showAlerts();

                if(tempAlerts !== undefined) {
                  setAlertData(tempAlerts);
                }
            } catch (e) {
                console.log(`Error fetching Alerts: ${e}`);
            }
        };

        fetchAlerts();
    }, []);

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
                {/*
                TODO:
                  sort the alerts
              */}
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
                                                fontWeight: "medium",
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
