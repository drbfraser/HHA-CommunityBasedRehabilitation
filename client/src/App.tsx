import React from 'react';
import Alert from 'react-bootstrap/esm/Alert';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>CBR Manager</h1>
      <Alert variant="success">
        <i className="fa fa-check"></i> You're successfully running the CBR Manager client.
      </Alert>
    </div>
  );
}

export default App;
