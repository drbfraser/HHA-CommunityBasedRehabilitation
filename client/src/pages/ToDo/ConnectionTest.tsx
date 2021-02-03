import React, { useEffect, useState } from "react";
import Alert from "@material-ui/lab/Alert";
import { API_EXAMPLE } from "util/endpoints";

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
        <>
            <Alert variant="filled" severity="success">
                You're successfully running the CBR Manager client.
            </Alert>
            <br />
            <Alert variant="filled" severity={reqDisplay[reqStatus].alertSeverity}>
                {reqDisplay[reqStatus].message}
            </Alert>
        </>
    );
};

export default ConnectionTest;
