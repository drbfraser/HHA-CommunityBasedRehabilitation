import React from "react";
import { Route, Switch } from "react-router-dom";
import SideNav from "./components/SideNav/SideNav";
import { pages } from "util/pages";

const App = () => (
    <div className="appWrapper">
        <SideNav />
        <div className="appPageContainer">
            <Switch>
                {pages
                    .filter((page) => page.showInNav)
                    .map((page) => (
                        <Route key={page.path} exact path={page.path}>
                            <h1 className="appPageTitle">{page.name}</h1>
                            <div className="appPageContent">
                                <page.Component />
                            </div>
                        </Route>
                    ))}
            </Switch>
        </div>
    </div>
);

export default App;
