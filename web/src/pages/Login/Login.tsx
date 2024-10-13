import { Box, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Alert from '@mui/material/Alert';
import React, { useState } from "react";
import { doLogin } from "@cbr/common/util/auth";
import { clientListStyles } from "./Login.styles";
import { loginState } from "../../util/hooks/loginState";
import { APIFetchFailError } from "@cbr/common/util/endpoints";

interface IBaseLoginStatus {
    status: "initial" | "submitting";
}

interface ILoginStatusFailed {
    status: "failed";
    error: string;
}

type LoginStatus = ILoginStatusFailed | IBaseLoginStatus;

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState<LoginStatus>({ status: "initial" });

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!username.length || !password.length) {
            return;
        }

        setStatus({ status: "submitting" });

        try {
            await doLogin(username, password);
            // The App component handles navigation to dashboard
            loginState.emit(true);
        } catch (e) {
            const errorMessage = e instanceof APIFetchFailError && e.details ? e.details : `${e}`;
            setStatus({ status: "failed", error: errorMessage });
        }
    };

    const LoginAlert = () => {
        if (status.status === "submitting") {
            return (
                <Alert variant="filled" severity="info">
                    Logging in...
                </Alert>
            );
        }

        if (status.status === "failed") {
            return (
                <Alert variant="filled" severity="error">
                    Login failed: {"\n" + status.error}
                </Alert>
            );
        }

        return <></>;
    };

    return (
        (<Box sx={clientListStyles.container}>
            <Box sx={clientListStyles.formContainer}>
                <Box
                    component="img"
                    sx={clientListStyles.logo}
                    src="/images/hha_logo_white.png"
                    alt="Hope Health Action"
                />
                <br />
                <br />
                <Typography variant="h4" gutterBottom>
                    Login
                </Typography>
                <LoginAlert />
                <br />
                <form onSubmit={(e) => handleLogin(e)}>
                    <TextField
                        variant="standard"
                        label="Username"
                        fullWidth
                        inputProps={{ autoCapitalize: "off" }}
                        required
                        InputLabelProps={{ required: false }}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)} />
                    <br />
                    <br />
                    <TextField
                        variant="standard"
                        label="Password"
                        type="password"
                        fullWidth
                        required
                        InputLabelProps={{ required: false }}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} />
                    <br />
                    <br />
                    <Button
                        type="submit"
                        variant="contained"
                        color="secondary"
                        fullWidth
                        disabled={status.status === "submitting"}
                    >
                        Login
                    </Button>
                </form>
            </Box>
        </Box>)
    );
};

export default Login;
