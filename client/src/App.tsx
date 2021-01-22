import React from 'react';
import { 
    BrowserRouter as Router,
    Route, 
} from 'react-router-dom';
import Header from './Components/Header/Header';
import Dashboard from './Components/Dashboard/Dashboard';
import ConnectionTest from './Components/ConnectionTest/ConnectionTest';

const App = () => (
    <div className="App">
        <Router>
            <Header/>
            <Route
                exact
                path="/"
                render={() => <Dashboard/>}
            />
            <Route
                exact
                path="/test"
                render={() => <ConnectionTest/>}
            />
        </Router>
    </div>
)

export default App;