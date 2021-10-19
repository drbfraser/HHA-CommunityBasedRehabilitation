import React, { useEffect, useState } from "react";
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

    const [socket, setSocket] = useState({});

    useEffect(() => {
        const socket = io("http://localhost:8000", {
            transports: ["websocket"], // explicitly use websockets
            autoConnect: true,
        });

        setSocket(socket);

        socket.on("connect", () => {
            console.log("[WEB APP] CONNECTED. socketID: \n", socket.id);
        });

        socket.on("disconnect", () => {
            console.log("[WEB APP] DISCONNECTED");
        });

        socket.on("alert", async (alert: any) => {
            console.log(`[WEB APP] Received an Alert from Django: ${await alert.data}`);
            socket.emit("newAlert", { data: "[WEB APP] Sending new alert from client" });
        });

        socket.on("pushAlert", async (alert: any) => {
            console.log(`[WEB APP] Received a PUSH Alert: ${await alert.data}`);
        });
    }, [setSocket]);


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
