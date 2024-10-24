import React, { useEffect, useState } from "react";
import { Redirect, Route, Router, Switch } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Typography from "@material-ui/core/Typography";

import history from "@cbr/common/util/history";
import { useCurrentUser } from "@cbr/common/util/hooks/currentUser";
import { IAlert } from "@cbr/common/util/alerts";
import { socket, SocketContext } from "@cbr/common/context/SocketIOContext";
import SideNav from "./components/SideNav/SideNav";
import AlertNotification from "./components/Alerts/AlertNotification";
import AlertOffline from "./components/Alerts/AlertOffline";
import LanguagePicker from "components/LanguagePicker/LanguagePicker";
import { defaultPagePath, pagesForUser } from "util/pages";
import Login from "pages/Login/Login";
import { useStyles } from "App.styles";
import { useIsLoggedIn } from "./util/hooks/loginState";
import { Box } from "@mui/material";

const App = () => {
    const isLoggedIn = useIsLoggedIn();
    const styles = useStyles();
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
            <div className={styles.container}>
                <SideNav />
                <div className={styles.pageContainer}>
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
                                        <Typography variant="h1" className={styles.pageTitle}>
                                            {t(page.name)}
                                        </Typography>
                                        <LanguagePicker />
                                    </Box>
                                </header>
                                <main className={styles.pageContent}>
                                    <page.Component />
                                </main>
                            </Route>
                        ))}
                    </Switch>
                </div>
            </div>
        );
    };

    return (
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
    );
};

export default App;
