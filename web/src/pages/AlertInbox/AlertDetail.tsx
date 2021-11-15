import React from "react";
import Grid from "@material-ui/core/Grid";
import Divider from "@mui/material/Divider";
import { makeStyles } from "@material-ui/core/styles";
import testAlertExample from "./TestAlertExampleDeleteLater";
import Typography from "@material-ui/core/Typography";
import { IAlert } from "./Alert";
import { useState,useEffect } from "react";
import { apiFetch, Endpoint } from "@cbr/common/util/endpoints";

const useStyles = makeStyles({
    dividerStyle: {
        backgroundColor: "grey",
        height: "3px",
    },
});

type Props = {
    selectAlert: number;
};

const AlertDetail = (alertDetailProps: Props) => {
    const style = useStyles();

    const [alertData, setAlertData] = useState<IAlert[]>([]);

    /* 
    TODO
      This part should belong to its parent component, but I am still learning how to implement that
    */
    useEffect(() => {
      const fetchAlerts = async () => {
          try {
              setAlertData(await (await apiFetch(Endpoint.ALERTS)).json());
          } catch (e) {
              console.log(`Error fetching Alerts: ${e}`);
          }
      };
      fetchAlerts();
    }, []);


    const selectedItem: Array<any> = alertData.filter((alert) => {
        return alert.id === alertDetailProps.selectAlert;
    });

    /* TODO: Delete Button */
    return (
        <Grid item xs={12} md={9}>
            <h1>Details</h1>

            <Divider variant="fullWidth" className={style.dividerStyle} />

            <h2>{selectedItem.length === 0 ? "" : selectedItem[0].subject}</h2>
            <Typography>
                {selectedItem.length === 0 || selectedItem[0].alert_message === ""
                    ? "Empty"
                    : selectedItem[0].alert_message}
            </Typography>
        </Grid>
    );
};

export default AlertDetail;
