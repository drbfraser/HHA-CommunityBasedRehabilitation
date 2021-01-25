import React from 'react';
import { 
    BrowserRouter as Router,
    Route, 
} from 'react-router-dom';
import SideNav from './Components/SideNav/SideNav';
import Dashboard from './Components/Dashboard/Dashboard';
import ConnectionTest from './Components/ConnectionTest/ConnectionTest';

const App = () => (
    <div className="App">
        <Router>
            <SideNav/>
            <Route exact path="/">
                <Dashboard/>
            </Route>
            <Route exact path="/test">
                <ConnectionTest/>
            </Route>
        </Router>
    </div>
)

export default App;