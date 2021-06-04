import { Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Alert from "@material-ui/lab/Alert";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { doLogin } from "util/auth";
import { defaultPagePath } from "util/pages";
import { useStyles } from "./Login.styles";

enum LoginStatus {
    INITIAL,
    SUBMITTING,
    FAILED,
}

const Login = () => {
    const styles = useStyles();
    const history = useHistory();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState(LoginStatus.INITIAL);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!username.length || !password.length) {
            return;
        }

        setStatus(LoginStatus.SUBMITTING);

        const loginSucceeded = await doLogin(username, password);

        if (loginSucceeded) {
            history.push(defaultPagePath);
        } else {
            setStatus(LoginStatus.FAILED);
        }
    };

    const LoginAlert = () => {
        if (status === LoginStatus.SUBMITTING) {
            return (
                <Alert variant="filled" severity="info">
                    Logging in...
                </Alert>
            );
        }

        if (status === LoginStatus.FAILED) {
            return (
                <Alert variant="filled" severity="error">
                    Login failed. Please try again.
                </Alert>
            );
        }

        return <></>;
    };

    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <img
                    className={styles.logo}
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
                        label="Username"
                        fullWidth
                        inputProps={{ autoCapitalize: "off" }}
                        required
                        InputLabelProps={{ required: false }}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <br />
                    <br />
                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        required
                        InputLabelProps={{ required: false }}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <br />
                    <br />
                    <Button
                        type="submit"
                        variant="contained"
                        color="secondary"
                        fullWidth
                        disabled={status === LoginStatus.SUBMITTING}
                    >
                        Login
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default Login;
