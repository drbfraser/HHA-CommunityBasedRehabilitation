import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Redirect, Route, Router, Switch } from "react-router-dom";

import { socket, SocketContext } from "@cbr/common/context/SocketIOContext";
import { IAlert } from "@cbr/common/util/alerts";
import history from "@cbr/common/util/history";
import { useCurrentUser } from "@cbr/common/util/hooks/currentUser";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { appStyles } from "App.styles";
import LanguagePicker from "components/LanguagePicker/LanguagePicker";
import Login from "pages/Login/Login";
import { defaultPagePath, pagesForUser } from "util/pages";
import AlertNotification from "./components/Alerts/AlertNotification";
import AlertOffline from "./components/Alerts/AlertOffline";
import SideNav from "./components/SideNav/SideNav";
import { useIsLoggedIn } from "./util/hooks/loginState";

const App = () => {
    const isLoggedIn = useIsLoggedIn();
    const [open, setOpen] = useState<boolean>(false);
    const [alert, setAlert] = useState<Partial<IAlert>>();

    useEffect(() => {
        socket.on("broadcastAlert", (data) => {
            setAlert(data);
            setOpen(true);
        });
        return () => {
            setOpen(false);
        };
    }, []);

    const PrivateRoutes = () => {
        const user = useCurrentUser();
        const { t } = useTranslation();

        return (
            <Box sx={appStyles.container}>
                <SideNav />
                <Box sx={appStyles.pageContainer}>
                    <Switch>
                        {pagesForUser(user).map((page) => (
                            <Route key={page.path} exact={page.exact ?? true} path={page.path}>
                                <header>
                                    {open && (
                                        <AlertNotification alertInfo={alert} setOpen={setOpen} />
                                    )}
                                    <Box
                                        component="section"
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Typography variant="h1" sx={appStyles.pageTitle}>
                                            {t(page.name)}
                                        </Typography>
                                        <LanguagePicker />
                                    </Box>
                                </header>
                                <Box component="main" sx={appStyles.pageContent}>
                                    <page.Component />
                                </Box>
                            </Route>
                        ))}
                    </Switch>
                </Box>
            </Box>
        );
    };

    return (
        // LocalizationProvider was added for the MUI DatePicker in StatsDateFilter
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <Router history={history}>
                <AlertOffline />
                {isLoggedIn !== undefined && (
                    <SocketContext.Provider value={socket}>
                        <Switch>
                            <Route exact path="/">
                                {!isLoggedIn ? <Login /> : <Redirect to={defaultPagePath} />}
                            </Route>
                            <Route path="/">
                                {isLoggedIn ? <PrivateRoutes /> : <Redirect to="/" />}
                            </Route>
                        </Switch>
                    </SocketContext.Provider>
                )}
            </Router>
        </LocalizationProvider>
    );
};

export default App;
