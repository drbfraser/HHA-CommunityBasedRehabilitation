import View from "pages/User/View";
import Edit from "pages/User/Edit";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const User = () => {
    return (
        <div>
            <Router>
                <Switch>
                    <Route path="/user/edit" component={Edit} />
                    <Route path="/user" component={View} />
                </Switch>
            </Router>
        </div>
    );
};

export default User;
