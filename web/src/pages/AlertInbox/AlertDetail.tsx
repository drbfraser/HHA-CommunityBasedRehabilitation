import React from "react";
import Grid from "@material-ui/core/Grid";
import Divider from "@mui/material/Divider";
import { makeStyles } from "@material-ui/core/styles";
import testAlertExample from "./TestAlertExampleDeleteLater";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
    dividerStyle: {
        backgroundColor: "grey",
        height: "3px",
    },
});

type Props = {
    selectAlert: string;
};

interface Alert {
    id: string;
    subject: string;
    priority: string;
    body: string;
}

const AlertDetail = (alertListProps: Props) => {
    const style = useStyles();

    const selectedItem: Array<Alert> = testAlertExample.filter((alert) => {
        return alert.id === alertListProps.selectAlert;
    });

    /* TODO: this part will be changed to accordion in the next iteration */
    return (
        <Grid item xs={12} md={9}>
            <h1>Details</h1>

            <Divider variant="fullWidth" className={style.dividerStyle} />

            <h2>{selectedItem.length === 0 ? "" : selectedItem[0].subject}</h2>
            <Typography>
                {selectedItem.length === 0 || selectedItem[0].body === ""
                    ? "Empty"
                    : selectedItem[0].body}
            </Typography>
        </Grid>
    );
};

export default AlertDetail;
