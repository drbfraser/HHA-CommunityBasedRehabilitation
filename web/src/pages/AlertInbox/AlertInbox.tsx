import React from "react";
import Grid from "@material-ui/core/Grid";
import AlertList from "./AlertList";
import {makeStyles} from "@material-ui/core/styles";
import AlertDetail from './AlertDetail';
import { useState } from "react";

const useStyles = makeStyles({
  testItemStyle1: {
    backgroundColor: "green",
  },
  testItemStyle2: {
    backgroundColor: "yellow",
  },
  gridStyle: {
    borderStyle: "solid",
    borderColor: "pink",
  },
  dividerStyle: {
    backgroundColor: "grey",
    height: "3px"
  }
});

const AlertInbox = () => {
  const style = useStyles();
  const [selectedAlert, setSelectedAlert] = useState<string>("-1");

  const currProps = {
    onAlertSelectionEvent: (itemNum:string)=> {
      setSelectedAlert(itemNum);
      console.log("clicked");
    },
    selectAlert:selectedAlert,
  }

  const anotherProps= {
    selectAlert:selectedAlert,
  }

  return  (
    <Grid container justify="center" alignItems="flex-start" spacing={3}>
      <AlertList {...currProps}/>
      <AlertDetail {...anotherProps}/>
    </Grid>
  );
}

export default AlertInbox;