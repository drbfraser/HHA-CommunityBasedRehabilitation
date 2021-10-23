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
// import IAlert from "./Alert";

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
  const [height, setHeight] = useState(0)
  const ref = useRef(null);

  useEffect(() => {
    setHeight(ref.current.clientHeight)
  })

  return (
    <Grid item xs={3} md={3} ref={ref}>
      <h1> Inbox </h1>
      <List
        sx={{
          width: '100%',
          maxWidth: 360,
          bgcolor: 'background.paper',
          overflow: 'auto',
          maxHeight: {height},
        }}
      >

        
        <ListItemText
          primary={
            <React.Fragment>
              <Typography
                sx={{ display: 'inline',fontSize: 16,fontWeight: 'medium' }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                A regular Title
              </Typography>
            </React.Fragment>
          }
          secondary={RenderBadge('ME')}
          onClick={printHelloWorld}
        />

        <Divider variant="fullWidth" component="li" />

        <ListItemText
          primary={
            <React.Fragment>
              <Typography
                sx={{ display: 'inline',fontSize: 16,fontWeight: 'medium' }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                This is an emergency message! Tomorrow will be raining, please prepare some boats...
              </Typography>
            </React.Fragment>
          }
          secondary={RenderBadge('ME')}
        />

        <Divider variant="fullWidth" component="li" />

        <ListItemText
          primary={
            <React.Fragment>
              <Typography
                sx={{ display: 'inline',fontSize: 16,fontWeight: 'medium' }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                This is an emergency message! Tomorrow will be raining, please prepare some boats...
              </Typography>
            </React.Fragment>
          }
          secondary={RenderBadge('ME')}
        />

        <Divider variant="fullWidth" component="li" />
          
        <ListItemText
          primary={
            <React.Fragment>
              <Typography
                sx={{ display: 'inline',fontSize: 16,fontWeight: 'medium' }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                This is an emergency message! Tomorrow will be raining, please prepare some boats...
              </Typography>
            </React.Fragment>
          }
          secondary={RenderBadge('ME')}
        />

<Divider variant="fullWidth" component="li" />
          
          <ListItemText
            primary={
              <React.Fragment>
                <Typography
                  sx={{ display: 'inline',fontSize: 16,fontWeight: 'medium' }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  This is an emergency message! Tomorrow will be raining, please prepare some boats...
                </Typography>
              </React.Fragment>
            }
            secondary={RenderBadge('ME')}
          />
        <Divider variant="fullWidth" component="li" />
          
          <ListItemText
            primary={
              <React.Fragment>
                <Typography
                  sx={{ display: 'inline',fontSize: 16,fontWeight: 'medium' }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  This is an emergency message! Tomorrow will be raining, please prepare some boats...
                </Typography>
              </React.Fragment>
            }
            secondary={RenderBadge('ME')}
          />
        <Divider variant="fullWidth" component="li" />
          
          <ListItemText
            primary={
              <React.Fragment>
                <Typography
                  sx={{ display: 'inline',fontSize: 16,fontWeight: 'medium' }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  This is an emergency message! Tomorrow will be raining, please prepare some boats...
                </Typography>
              </React.Fragment>
            }
            secondary={RenderBadge('ME')}
          />
      
      </List>
    </Grid>
  );
}

export default AlertList;