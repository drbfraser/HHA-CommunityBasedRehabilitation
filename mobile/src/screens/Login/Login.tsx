import React, { useRef, useState } from "react";
import { Image, TextInput as NativeTextInput, View } from "react-native";
import useStyles from "./Login.styles";
import LoginBackground from "./LoginBackground";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, TextInput, Title, useTheme } from "react-native-paper";
import { doLogin } from "@cbr/common";

enum LoginStatus {
    INITIAL,
    SUBMITTING,
    FAILED,
}

const Login = (props: any) => {
    const theme = useTheme()
    const styles = useStyles(theme);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState(LoginStatus.INITIAL);

    // This is for selecting the next TextInput: https://stackoverflow.com/a/59626713
    // Importing RN's TextInput as NativeTextInput fixes the typing as mentioned in
    // https://github.com/callstack/react-native-paper/issues/1453#issuecomment-699163546
    const passwordTextRef = useRef<NativeTextInput>(null)

    const handleLogin = async () => {
        if (!username.length || !password.length) {
            return;
        }
        setStatus(LoginStatus.SUBMITTING);

        const loginSucceeded = await doLogin(username, password);
        if (loginSucceeded) {
            console.log("login succeeded")
        } else {
            console.log("login failed")
            setStatus(LoginStatus.FAILED);
        }
    };

    // TODO: Use the other login background when the user uses landscape mode.
    return (
        <KeyboardAwareScrollView
            style={{ flex: 1, backgroundColor: theme.colors.primary }}
            showsVerticalScrollIndicator={false}
        >
            <LoginBackground style={styles.container}  />

            <View style={styles.formContainer}>
                <Image
                    style={styles.logo}
                    resizeMode="contain"
                    source={require("../../../assets/hha_logo_white.png")}
                />
                <Title
                    style={{
                        fontSize: 40,
                        paddingTop: 20,
                        color: theme.colors.onPrimary
                    }}
                >
                    {status == LoginStatus.FAILED ? "Login - failed" : "Login"}
                </Title>
                <View style={{ margin: 10 }} />
                {/*
                    React Native Paper does not have standard styling TextFields as described in
                    https://material-ui.com/components/text-fields/. They only have the outlined
                    and filled ("flat") stylings:
                    https://callstack.github.io/react-native-paper/text-input.html
                */}
                <TextInput
                    label="Username"
                    value={username}
                    onChangeText={(newUsername) => setUsername(newUsername)}
                    mode="flat"
                    blurOnSubmit={false}
                    autoCapitalize="none"
                    autoCorrect={false}
                    onSubmitEditing={() => passwordTextRef.current?.focus()}
                />
                <View style={{ margin: 10 }} />
                <TextInput
                    label="Password"
                    value={password}
                    onChangeText={(newPassword) => setPassword(newPassword)}
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                    ref={passwordTextRef}
                />
                <View style={{ margin: 10 }} />
                <Button
                    color={theme.colors.accent}
                    // To make sure ripple works
                    contentStyle={{ backgroundColor: "transparent" }}
                    onPress={() => handleLogin()}
                    mode="contained"
                >Login</Button>

            </View>
        </KeyboardAwareScrollView>
    );
}

export default Login;