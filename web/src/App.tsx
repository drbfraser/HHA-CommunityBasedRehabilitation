import React, { useEffect, useState } from "react";
import { Redirect, Route, Router, Switch } from "react-router-dom";
import Typography from "@mui/material/Typography";
import i18n from "i18next";

import { initI18n } from "@cbr/common/i18n.config";
import history from "@cbr/common/util/history";
import { useCurrentUser } from "@cbr/common/util/hooks/currentUser";
import { IAlert } from "@cbr/common/util/alerts";
import { socket, SocketContext } from "@cbr/common/context/SocketIOContext";
import SideNav from "./components/SideNav/SideNav";
import AlertNotification from "./components/Alerts/AlertNotification";
import AlertOffline from "./components/Alerts/AlertOffline";
import { defaultPagePath, pagesForUser } from "util/pages";
import Login from "pages/Login/Login";
import { appStyles } from "App.styles";
import { useIsLoggedIn } from "./util/hooks/loginState";
import { Box } from "@mui/material";

const App = () => {
    const isLoggedIn = useIsLoggedIn();
    const [open, setOpen] = useState<boolean>(false);
    const [alert, setAlert] = useState<Partial<IAlert>>();

    useEffect(() => {
        initI18n(i18n);
    }, []);

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

        // todo: verify no consequences from replacing all <div> with Box
        return (
            <Box
                sx={appStyles.container}
            >
                <SideNav />
                <Box
                    sx={appStyles.pageContainer}
                >
                    <Switch>
                        {pagesForUser(user).map((page) => (
                            <Route key={page.path} exact={page.exact ?? true} path={page.path}>
                                {open && <AlertNotification alertInfo={alert} setOpen={setOpen} />}
                                <Typography
                                    variant="h1"
                                    sx={appStyles.pageTitle}
                                >
                                    {page.name}
                                </Typography>
                                <Box
                                    sx={appStyles.pageContent}
                                >
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
        <Router history={history}>
            <AlertOffline />
            {isLoggedIn === undefined ? (
                <></>
            ) : (
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
    );
};

export default App;
