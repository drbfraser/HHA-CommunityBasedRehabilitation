import React from "react";
import Grid from "@material-ui/core/Grid";
import AlertList from "./AlertList";
import AlertDetail from "./AlertDetail";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { positions } from '@mui/system';
import { apiFetch, Endpoint } from "@cbr/common/util/endpoints";
import { useState, useEffect } from "react";
import { Time } from "@cbr/common/util/time";
import { PriorityLevel } from "./Alert";


const drawerWidth = 240;

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
}


interface IAlert {
  id: number;
  subject: string;
  priority: PriorityLevel;
  alert_message: string;
  created_by_user: number;
  created_date: Time;
}


export default function AlertInbox(props: Props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [alertData, setAlertData] = useState<IAlert[]>([]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

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
  }, []);


  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {/*{['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (*/}
        {alertData.map((currAlert) => (
          <ListItem button key={currAlert.id}>
            <ListItemIcon>
              {<InboxIcon />}
            </ListItemIcon>
            <ListItemText primary={currAlert.subject} />
          </ListItem>
        ))}
      </List>
      <Divider />
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
    {/* // <Box sx={{ 
    //   display: 'relative'
    //   ,top:200,left:200
    // }}> */}
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          // top:200,left:200
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Responsive drawer
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 }
          // ,top:200,left:200 
        }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        <Typography paragraph>
          {alertData.length === 0 || alertData[0].alert_message === ""
                      ? "Empty"
                      : alertData[0].alert_message}

        </Typography>
      </Box>
    </Box>
  );
}

// export default AlertInbox;
