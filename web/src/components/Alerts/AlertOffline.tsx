import React, { useEffect, useState } from "react";

import { Box, Snackbar } from "@mui/material";
import { Alert, AlertTitle } from '@mui/material';

const AlertOffline = () => {
    const [isOffline, setIsOffline] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        window.addEventListener("offline", () => {
            setIsOpen(true);
            setIsOffline(true);
        });

        window.addEventListener("online", () => {
            setIsOffline(false);
        });
    });

    return (
        <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={isOffline && isOpen}
            onClose={() => setIsOpen(false)}
            autoHideDuration={10000}
        >
            <Alert severity="error">
                <AlertTitle>Device Offline</AlertTitle>
                <Box>
                    The CBR website is not usable without Internet connection. If you would like to
                    use CBR offline, please look into downloading the mobile app.
                </Box>
            </Alert>
        </Snackbar>
    );
};

export default AlertOffline;
