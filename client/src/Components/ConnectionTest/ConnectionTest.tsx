import React, { useEffect, useState } from "react";
import Alert from "react-bootstrap/esm/Alert";
import { API_EXAMPLE } from "../../endpoints";

enum reqState {
    LOADING,
    SUCCESS,
    ERROR,
}

const reqAlertClass = {
    [reqState.LOADING]: "primary",
    [reqState.SUCCESS]: "success",
    [reqState.ERROR]: "danger",
};

const reqMessage = {
    [reqState.LOADING]: "Trying to connect to the API...",
    [reqState.SUCCESS]: (
        <>
            <i className="fa fa-check"></i> Client successfully connected to the CBR Manager API.
        </>
    ),
    [reqState.ERROR]: (
        <>
            <i className="fa fa-exclamation-triangle"></i> Failed to connect to the CBR Manager API.
        </>
    ),
};

const ConnectionTest = () => {
    const [reqStatus, setReqStatus] = useState(reqState.LOADING);

    useEffect(() => {
        const testAPIConnection = async () => {
            try {
                const resp = await fetch(API_EXAMPLE);

                if (!resp.ok) {
                    throw new Error("Response not ok");
                }

                setReqStatus(reqState.SUCCESS);
            } catch (e) {
                setReqStatus(reqState.ERROR);
            }
        };

        testAPIConnection();
    }, []);

    return (
        <div>
            <h1>CBR Manager</h1>
            <Alert variant="success">
                <i className="fa fa-check"></i> You're successfully running the CBR Manager client.
            </Alert>
            <Alert variant={reqAlertClass[reqStatus]}>{reqMessage[reqStatus]}</Alert>
        </div>
    );
};

export default ConnectionTest;
