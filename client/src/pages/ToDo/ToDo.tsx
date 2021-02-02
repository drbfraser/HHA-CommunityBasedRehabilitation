import React, { useEffect, useState } from "react";
import Alert from "@material-ui/lab/Alert";
import { API_EXAMPLE } from "util/endpoints";
import { Typography } from "@material-ui/core";

enum reqState {
    LOADING,
    SUCCESS,
    ERROR,
}

interface IReqDisplay {
    [key: string]: {
        alertSeverity: "info" | "success" | "warning" | "error";
        message: string;
    };
}

const reqDisplay: IReqDisplay = {
    [reqState.LOADING]: {
        alertSeverity: "info",
        message: "Trying to connect to the API...",
    },
    [reqState.SUCCESS]: {
        alertSeverity: "success",
        message: "Client successfully connected to the CBR Manager API.",
    },
    [reqState.ERROR]: {
        alertSeverity: "error",
        message: "Failed to connect to the CBR Manager API.",
    },
};

const ToDo = () => {
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
            <Typography variant="body1">
                Page not yet written. In the mean time, have a test page :)
            </Typography>
            <br />
            <Alert variant="filled" severity="success">
                You're successfully running the CBR Manager client.
            </Alert>
            <br />
            <Alert variant="filled" severity={reqDisplay[reqStatus].alertSeverity}>
                {reqDisplay[reqStatus].message}
            </Alert>
        </div>
    );
};

export default ToDo;
