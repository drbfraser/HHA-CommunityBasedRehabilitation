import { Box, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Alert from '@mui/material/Alert';
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { doLogin } from "@cbr/common/util/auth";
import { clientListStyles } from "./Login.styles";
import { loginState } from "../../util/hooks/loginState";
import { APIFetchFailError } from "@cbr/common/util/endpoints";
import LanguagePicker from "components/LanguagePicker/LanguagePicker";

interface IBaseLoginStatus {
    status: "initial" | "submitting";
}

interface ILoginStatusFailed {
    status: "failed";
    error: string;
}

type LoginStatus = ILoginStatusFailed | IBaseLoginStatus;

const Login = () => {
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
        <Box sx={clientListStyles.container}>
            <Box sx={clientListStyles.formContainer}>
                <Box
                    component="img"
                    sx={clientListStyles.logo}
                    src="/images/hha_logo_white.png"
                    alt="Hope Health Action"
                />

                <Typography variant="h4" gutterBottom>
                    {t("login.login")}
                </Typography>
                <LoginAlert />
                <form style={clientListStyles.loginForm as React.CSSProperties} onSubmit={(e) => handleLogin(e)}>
                    <TextField
                        label={t("general.username")}
                        variant="standard"
                        fullWidth
                        inputProps={{ autoCapitalize: "off" }}
                        required
                        InputLabelProps={{ required: false }}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        variant="standard"
                        label={t("general.password")}
                        type="password"
                        fullWidth
                        required
                        InputLabelProps={{ required: false }}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
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

                <LanguagePicker
                    sx={{
                        right: "0",
                        marginTop: "10%",
                        alignSelf: "flex-end",
                    }}
                />
            </Box>
        </Box>
    );
};

export default Login;
