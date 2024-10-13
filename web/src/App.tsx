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
import { useStyles } from "App.styles";
import { useIsLoggedIn } from "./util/hooks/loginState";
import { Box } from "@mui/material";
import { themeColors } from "@cbr/common/util/colors";
import { mediaMobile } from "theme.styles";

const App = () => {
    const isLoggedIn = useIsLoggedIn();
    const styles = useStyles();
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
                // container
                sx={{
                    minHeight: "100%",
                    display: "flex",
                    flexDirection: "row",
                    [mediaMobile]: {
                        flexDirection: "column-reverse",
                        height: "100%",
                    },
                }}
            >
                <SideNav />
                <Box
                    // pageContainer
                    sx={{
                        width: "100%",
                        padding: 20,
                        borderRadius: "50px 0 0 50px",
                        boxShadow: "-5px 0px 10px rgba(25, 25, 25, 0.2)",
                        backgroundColor: themeColors.blueBgLight,
                        [mediaMobile]: {
                            height: "100%",
                            width: "auto",
                            padding: 0,
                            overflowX: "auto",
                            overflowY: "auto",
                            borderRadius: "0 0 30px 30px",
                            boxShadow: "0px 5px 10px rgba(25, 25, 25, 0.2)",
                        },
                    }}
                >
                    <Switch>
                        {pagesForUser(user).map((page) => (
                            <Route key={page.path} exact={page.exact ?? true} path={page.path}>
                                {open && <AlertNotification alertInfo={alert} setOpen={setOpen} />}
                                <Typography
                                    variant="h1"
                                    sx={{
                                        // pageTitle
                                        marginLeft: 20,
                                        fontWeight: "bold",
                                        [mediaMobile]: {
                                            marginTop: 10,
                                            marginLeft: 0,
                                            fontSize: "40px",
                                            textAlign: "center",
                                        }
                                    }}
                                >
                                    {page.name}
                                </Typography>
                                <Box
                                    // pageContent
                                    sx={{
                                        marginTop: 20,
                                        padding: 20,
                                        borderRadius: 30,
                                        backgroundColor: "white",
                                        boxShadow: "0px 0px 10px rgba(25, 25, 25, 0.1)",
                                        [mediaMobile]: {
                                            marginTop: 10,
                                        },
                                    }}
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
