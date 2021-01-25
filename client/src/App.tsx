import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import SideNav from "./components/SideNav/SideNav";
import { pages } from "util/pages";

const App = () => (
    <Router>
        <div className="appContainer">
            <SideNav />
            <div className="appContent">
                <Switch>
                    {pages
                        .filter((page) => page.showInNav)
                        .map((page) => (
                            <Route exact path={page.path}>
                                <h1 className="appPageTitle">{page.name}</h1>
                                <div className="appPageContainer">
                                    <page.Component />
                                </div>
                            </Route>
                        ))}
                </Switch>
            </div>
        </div>
    </Router>
);

export default App;
