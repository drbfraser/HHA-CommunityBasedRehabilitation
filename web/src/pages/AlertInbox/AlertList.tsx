import React, { useState, useEffect, useRef } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import { RiskLevel, IRiskLevel, riskLevels, RiskType } from "@cbr/common/util/risks";
import { MoreVert, Cancel, FiberManualRecord } from "@material-ui/icons";
import RiskLevelChip from "components/RiskLevelChip/RiskLevelChip";
import alertList from "./TestAlertExampleDeleteLater";
import {makeStyles} from "@material-ui/core/styles";
import { themeColors } from "@cbr/common/util/colors";

const useStyles = makeStyles({
  listItemStyle: {
    backgroundColor: "grey",
  },
  listItemStyle2: {
    backgroundColor: "blue",
  },
  gridStyle: {
    borderRight: "3px solid grey",
  },
  dividerStyle: {
    // backgroundColor: "black",
  },
  dividerStyle3: {
    backgroundColor: "black",
  }
});

const RenderBadge = (params: String) => {
  const risk: RiskLevel = Object(params);

  return window.innerWidth >= 20 ? (
    <RiskLevelChip clickable risk={risk} />
    ) : (
    <FiberManualRecord style={{ color: riskLevels[risk].color }} />
    );
};

const printHelloWorld = () => {
  console.log("Hello!")
}

const AlertList = () => {
  const style = useStyles();

  return (
    <Grid item xs={3} md={3}  
      className={style.gridStyle} 
    >
      <h1 
        // className={style.listItemStyle2}
      >
        Inbox
      </h1>
      <Divider variant="fullWidth" className={style.dividerStyle3}/>
      <List
        sx={{
          width: '100%',
          maxWidth: 360,
          bgcolor: 'background.paper',
          overflow: 'auto',
        }}
        // className={style.gridStyle}
      >
        {alertList.map(currAlert => {
          return (
            <div>
              <ListItemText
                primary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: 'inline',fontSize: 16,fontWeight: 'medium' }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {currAlert.subject}
                    </Typography>
                  </React.Fragment>
                }
                secondary={RenderBadge(currAlert.priority)}
                onClick={printHelloWorld}
                // className={style.listItemStyle}
              />

              <Divider
                variant="fullWidth"
                component="li" 
                className={style.dividerStyle}
              />
            </div>
          )
        })}      
      </List>
    </Grid>
  );
}

export default AlertList;