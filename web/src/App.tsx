import React, { useEffect, useState } from "react";
import { Redirect, Route, Router, Switch } from "react-router-dom";
import SideNav from "./components/SideNav/SideNav";
import { defaultPagePath, pagesForUser } from "util/pages";
import Login from "pages/Login/Login";
import Typography from "@material-ui/core/Typography";
import { useStyles } from "App.styles";
import history from "util/history";
import { isLoggedIn } from "util/auth";
import { useCurrentUser } from "util/hooks/currentUser";

const App = () => {
    const styles = useStyles();

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

    const LoginRoute = () => {
        const [loggedIn, setLoggedIn] = useState<boolean | undefined>();
        useEffect(() => {
            const updateLoginState = async () => {
                const newLoginState = await isLoggedIn();
                setLoggedIn(newLoginState);
            };
            updateLoginState();
        });

        if (loggedIn === undefined) {
            return <></>;
        } else if (!loggedIn) {
            return <Login />;
        } else {
            return <Redirect to={defaultPagePath} />;
        }
    };
    const AllRoutes = () => {
        const [loggedIn, setLoggedIn] = useState<boolean | undefined>();
        useEffect(() => {
            const updateLoginState = async () => {
                const newLoginState = await isLoggedIn();
                setLoggedIn(newLoginState);
            };
            updateLoginState();
        });

        if (loggedIn === undefined) {
            return <></>;
        } else if (!loggedIn) {
            return <Redirect to="/" />;
        } else {
            return <PrivateRoutes />;
        }
    };

    return (
        <Router history={history}>
            <Switch>
                <Route exact path="/">
                    <LoginRoute />
                </Route>
                <Route path="/">
                    <AllRoutes />
                </Route>
            </Switch>
        </Router>
    );
};

export default App;
