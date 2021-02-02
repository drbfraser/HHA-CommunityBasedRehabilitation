import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import SideNav from "./components/SideNav/SideNav";
import { pages } from "util/pages";
import Login from "pages/Login/Login";
import Typography from "@material-ui/core/Typography";

const App = () => (
    <Router>
        <Switch>
            <Route exact path="/">
                <Login />
            </Route>
            <Route path="/">
                <div className="appWrapper">
                    <SideNav />
                    <div className="appPageContainer">
                        <Switch>
                            {pages.map((page) => (
                                <Route key={page.path} exact path={page.path}>
                                    <Typography variant="h2" component="h1">
                                        {page.name}
                                    </Typography>
                                    <div className="appPageContent">
                                        <page.Component />
                                    </div>
                                </Route>
                            ))}
                        </Switch>
                    </div>
                </div>
            </Route>
        </Switch>
    </Router>
);

export default App;
