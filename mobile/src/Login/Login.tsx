import { useState } from "react";
import { doLogin } from "../util/auth";

enum LoginStatus {
    INITIAL,
    SUBMITTING,
    FAILED,
}

const Login = () => {
    const [username, setUsername] = useState("venus");
    const [password, setPassword] = useState("hhaLogin");
    const [status, setStatus] = useState(LoginStatus.INITIAL);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!username.length || !password.length) {
            return;
        }

        setStatus(LoginStatus.SUBMITTING);

        const loginSucceeded = await doLogin(username, password);

        if (loginSucceeded) {
            console.log(`LOGIN SUCCESSFUL`);
        } else {
            setStatus(LoginStatus.FAILED);
        }
    };
};
