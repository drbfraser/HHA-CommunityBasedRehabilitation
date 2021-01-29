import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import styles from './Login.module.css';

const Login = () => {
    const history = useHistory();
    const handleLogin = () => history.push('/dashboard');

    return (
        <div className={styles.container}>
            <img
                className={styles.logo}
                src="/images/hha_logo_white.png"
                alt="Hope Health Action"
            />
            <div className={styles.formContainer}>
                <h2>Login</h2>
                <Form>
                    <Form.Group>
                        <Form.Label>Username</Form.Label>
                        <Form.Control htmlSize={50} type="text" />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control htmlSize={50} type="password" />
                    </Form.Group><br />
                    <Button onClick={handleLogin} block>
                        Login
                    </Button>
                </Form>
            </div>
        </div>
    )
}

export default Login;