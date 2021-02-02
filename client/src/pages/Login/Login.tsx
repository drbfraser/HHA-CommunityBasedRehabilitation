import { Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import React from "react";
import { useHistory } from "react-router-dom";
import { useStyles } from "./Login.styles";

const Login = () => {
    const styles = useStyles();
    const history = useHistory();
    const handleLogin = () => history.push("/dashboard");

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
                <form>
                    <TextField label="Username" fullWidth />
                    <br />
                    <br />
                    <TextField label="Password" fullWidth />
                    <br />
                    <br />
                    <Button onClick={handleLogin} fullWidth>
                        Login
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default Login;
