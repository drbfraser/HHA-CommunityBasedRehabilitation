import TextField from "@material-ui/core/TextField";
import React from "react";
import { useHistory } from "react-router-dom";
import styles from "./Login.module.css";

const Login = () => {
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
                <h2>Login</h2>
                <form>
                    <TextField label="Username" />
                    <TextField label="Password" />
                    <button onClick={handleLogin}>Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
