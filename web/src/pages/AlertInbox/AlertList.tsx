import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import { RiskLevel, riskLevels } from "@cbr/common/util/risks";
import { FiberManualRecord } from "@material-ui/icons";
import RiskLevelChip from "components/RiskLevelChip/RiskLevelChip";
import testAlertExample from "./TestAlertExampleDeleteLater";
import { makeStyles } from "@material-ui/core/styles";
import { IAlert } from "./Alert";

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
    onAlertSelectionEvent: (itemNum: number) => void;
    selectAlert: number;
};

/* TODO: This function is not working as expected, will improve it in the next iteration */
const RenderBadge = (params: String) => {
    const risk: RiskLevel = Object(params);

    return window.innerWidth >= 20 ? (
        <RiskLevelChip clickable risk={risk} />
    ) : (
        <FiberManualRecord style={{ color: riskLevels[risk].color }} />
    );
};

const AlertList = (alertDetailProps: AlertDetailProps, alertData: IAlert[]) => {
    const style = useStyles();

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
                        <div>
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
                                            {currAlert.Subject}
                                        </Typography>
                                    </React.Fragment>
                                }
                                secondary={RenderBadge(currAlert.Priority)}
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
