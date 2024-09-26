import { Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Alert from "@material-ui/lab/Alert";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { doLogin } from "@cbr/common/util/auth";
import { useStyles } from "./Login.styles";
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
    const styles = useStyles();
    const { t } = useTranslation();

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
        switch (status.status) {
            case "submitting": {
                return (
                    <Alert variant="filled" severity="info">
                        {t("login.loggingIn")}
                    </Alert>
                );
            }
            case "failed": {
                return (
                    <Alert variant="filled" severity="error">
                        {`${t("login.loginFailed")}:\n${status.error}`}
                    </Alert>
                );
            }
            default: {
                return <></>;
            }
        }
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
                    {t("login.login")}
                </Typography>
                <LoginAlert />
                <br />
                <form onSubmit={(e) => handleLogin(e)}>
                    <TextField
                        label={t("general.username")}
                        fullWidth
                        inputProps={{ autoCapitalize: "off" }}
                        required
                        InputLabelProps={{ required: false }}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <br /> {/* this should be handled by styling */}
                    <br />
                    <TextField
                        label={t("general.password")}
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
                        disabled={status.status === "submitting"}
                    >
                        {t("login.login")}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default Login;
