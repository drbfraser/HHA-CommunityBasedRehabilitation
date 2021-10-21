import React, { useEffect } from "react";
import { Redirect, Route, Router, Switch } from "react-router-dom";
import SideNav from "./components/SideNav/SideNav";
import { defaultPagePath, pagesForUser } from "util/pages";
import Login from "pages/Login/Login";
import Typography from "@material-ui/core/Typography";
import { useStyles } from "App.styles";
import history from "@cbr/common/util/history";
import { useIsLoggedIn } from "./util/hooks/loginState";
import { useCurrentUser } from "@cbr/common/util/hooks/currentUser";
import io from "socket.io-client";

const App = () => {
    const isLoggedIn = useIsLoggedIn();
    const styles = useStyles();

    const API_URL =
        process.env.NODE_ENV === "development" ? `http://${window.location.hostname}:8000` : "";

    useEffect(() => {
        const socket = io(`${API_URL}`, {
            transports: ["websocket"], // explicitly use websockets
            autoConnect: true,
        });

        socket.on("connect", () => {
            console.log(`[SocketIO] Web user connected on ${API_URL}. SocketID: ${socket.id}`);
        });

        socket.on("disconnect", () => {
            console.log(`[SocketIO] Web user disconnected`);
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const PrivateRoutes = () => {
        const user = useCurrentUser();

        return (
            <div className={styles.container}>
                <SideNav />
                <div className={styles.pageContainer}>
                    <Switch>
                        {pagesForUser(user).map((page) => (
                            <Route key={page.path} exact={page.exact ?? true} path={page.path}>
                                <Typography variant="h1" className={styles.pageTitle}>
                                    {page.name}
                                </Typography>
                                <div className={styles.pageContent}>
                                    <page.Component />
                                </div>
                            </Route>
                        ))}
                    </Switch>
                </div>
            </div>
        );
    };

    return (
        <Router history={history}>
            {isLoggedIn === undefined ? (
                <></>
            ) : (
                <Switch>
                    <Route exact path="/">
                        {!isLoggedIn ? <Login /> : <Redirect to={defaultPagePath} />}
                    </Route>
                    <Route path="/">{isLoggedIn ? <PrivateRoutes /> : <Redirect to="/" />}</Route>
                </Switch>
            )}
        </Router>
    );
};

export default App;
