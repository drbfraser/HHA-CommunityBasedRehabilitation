import React from "react";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import SideNav from "./components/SideNav/SideNav";
import { defaultPage, pages } from "util/pages";
import Login from "pages/Login/Login";
import Typography from "@material-ui/core/Typography";
import { useStyles } from "App.styles";
import history from "util/history";
import { isLoggedIn } from "util/auth";

const App = () => {
    const styles = useStyles();

    const LoginRoute = () => (!isLoggedIn() ? <Login /> : <Redirect to={defaultPage.path} />);

    const PrivateRoutes = () =>
        !isLoggedIn() ? (
            <Redirect to="/" />
        ) : (
            <div className={styles.container}>
                <SideNav />
                <div className={styles.pageContainer}>
                    <Switch>
                        {pages.map((page) => (
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

    return (
        <Router history={history}>
            <Switch>
                <Route exact path="/">
                    <LoginRoute />
                </Route>
                <Route path="/">
                    <PrivateRoutes />
                </Route>
            </Switch>
        </Router>
    );
};

export default App;
