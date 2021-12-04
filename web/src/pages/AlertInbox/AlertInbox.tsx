import React from "react";
import Grid from "@material-ui/core/Grid";
import AlertList from "./AlertList";
import AlertDetail from "./AlertDetail";
import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  dividerStyle: {
      backgroundColor: "grey",
      height: "3px",
  },
  gridStyle: {
      backgroundColor:"red",
  },
});

const AlertInbox = () => {

    const style = useStyles();

    const [selectedAlert, setSelectedAlert] = useState<number>(-1);

    const alertListProps = {
        onAlertSelectionEvent: (itemNum: number) => {
            setSelectedAlert(itemNum);
        },
        selectAlert: selectedAlert,
    };

    const alertDetailProps = {
        selectAlert: selectedAlert,
    };

    return (
        <Grid container justify="center" alignItems="flex-start" spacing={3}  className={style.gridStyle}>
            <AlertList {...alertListProps} />
            <AlertDetail {...alertDetailProps} />
            {/* TODO: 
              API call should be placed in this component, need to check how to pass those as props
            */}
            {/* <AlertList alertListProps={alertListProps} alertData={alertData} />
            <AlertDetail alertDetailProps={alertDetailProps} alertData={alertData} /> */}
        </Grid>
    );
};

export default AlertInbox;
