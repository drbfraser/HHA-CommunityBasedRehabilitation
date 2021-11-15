import React from "react";
import Grid from "@material-ui/core/Grid";
import Divider from "@mui/material/Divider";
import { makeStyles } from "@material-ui/core/styles";
import testAlertExample from "./TestAlertExampleDeleteLater";
import Typography from "@material-ui/core/Typography";
import { IAlert } from "./Alert";

const useStyles = makeStyles({
    dividerStyle: {
        backgroundColor: "grey",
        height: "3px",
    },
});

type Props = {
    selectAlert: number;
};

interface Alert {
    id: number;
    subject: string;
    priority: string;
    body: string;
}

const AlertDetail = (alertDetailProps: Props, alertData: IAlert[]) => {
    const style = useStyles();

    const selectedItem: Array<IAlert> = alertData.filter((alert) => {
        return alert.id === alertDetailProps.selectAlert;
    });

    /* TODO: this part will be changed to accordion in the next iteration */
    return (
        <Grid item xs={12} md={9}>
            <h1>Details</h1>

            <Divider variant="fullWidth" className={style.dividerStyle} />

            <h2>{selectedItem.length === 0 ? "" : selectedItem[0].Subject}</h2>
            <Typography>
                {selectedItem.length === 0 || selectedItem[0].Body === ""
                    ? "Empty"
                    : selectedItem[0].Body}
            </Typography>
        </Grid>
    );
};

export default AlertDetail;
