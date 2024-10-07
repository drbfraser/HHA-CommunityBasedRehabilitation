import React from "react";
import { Box, Collapse, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Alert } from '@mui/material';

const AlertNotification = (props: any) => {
    return (
        <Box>
            <Collapse in={props.setOpen}>
                <Alert
                    severity="info"
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                                props.setOpen(false);
                            }}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                >
                    <Typography variant="body1">
                        New message! — <b>{props.alertInfo["subject"]}:</b> "
                        {props.alertInfo["alert_message"]}"
                    </Typography>
                </Alert>
            </Collapse>
        </Box>
    );
};

export default AlertNotification;
