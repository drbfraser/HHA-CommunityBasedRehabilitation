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
import { socket, SocketContext } from "@cbr/common/context/SocketIOContext";
import { Alert } from "@material-ui/lab";
import { Box, Collapse, IconButton } from "@material-ui/core";
import CloseIcon from "@mui/icons-material/Close";
import AlertNotification from "./components/Alerts/AlertNotification";

const App = () => {
    const isLoggedIn = useIsLoggedIn();
    const styles = useStyles();

    const [open, setOpen] = React.useState(false);
    const [alert, setAlert] = React.useState();

    const PrivateRoutes = () => {
        const user = useCurrentUser();

        return (
            <div className={styles.container}>
                <SideNav />
                <div className={styles.pageContainer}>
                    <Switch>
                        {pagesForUser(user).map((page) => (
                            <Route key={page.path} exact={page.exact ?? true} path={page.path}>
                                {open ? (
                                    <AlertNotification alertInfo={alert} setOpen={setOpen} />
                                ) : (
                                    <></>
                                )}
                                {/* {open ? <AlertPopup alertInfo={alert} /> : <></>} */}
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

    useEffect(() => {
        socket.on("broadcastAlert", (data) => {
            setAlert(data);
            setOpen(true);
        });
    }, []);

    return (
        <Router history={history}>
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
