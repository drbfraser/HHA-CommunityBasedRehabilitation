import React, { useContext, useRef, useState } from "react";
import { Image, TextInput as NativeTextInput, useWindowDimensions, View } from "react-native";
import useStyles from "./Login.styles";
import LoginBackgroundSmall from "./LoginBackgroundSmall";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, HelperText, Text, TextInput, Title, useTheme } from "react-native-paper";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import Alert from "../../components/Alert/Alert";
import LoginBackground from "./LoginBackground";
import { SMALL_WIDTH } from "../../util/theme.styles";
import { StackNavigationProp } from "@react-navigation/stack";
import { stackParamList, stackScreenName } from "../../util/screens";
import { Navigation } from "react-native-navigation";

interface LoginProps {
    navigation: StackNavigationProp<stackParamList, stackScreenName.LOGIN>;
}

enum LoginStatus {
    INITIAL,
    SUBMITTING,
    FAILED,
}

const Login = (props: LoginProps) => {
    const theme = useTheme();
    const styles = useStyles();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState(LoginStatus.INITIAL);

    // This is for selecting the next TextInput: https://stackoverflow.com/a/59626713
    // Importing RN's TextInput as NativeTextInput fixes the typing as mentioned in
    // https://github.com/callstack/react-native-paper/issues/1453#issuecomment-699163546
    const passwordTextRef = useRef<NativeTextInput>(null);

    const { login, logout, authState } = useContext(AuthContext);

    const handleLogin = async () => {
        const usernameToUse =
            authState.state == "previouslyLoggedIn" ? authState.currentUser.username : username;

        if (!usernameToUse.length || !password.length) {
            setStatus(LoginStatus.FAILED);
            return;
        }
        setStatus(LoginStatus.SUBMITTING);

        const loginSucceeded = await login(usernameToUse, password);

        if (!loginSucceeded) {
            setStatus(LoginStatus.FAILED);
        } else {
            props.navigation.navigate(stackScreenName.HOME);
        }
    };

    const { width, height } = useWindowDimensions();

    return (
        <KeyboardAwareScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
        >
            {width <= SMALL_WIDTH ? (
                <LoginBackgroundSmall style={styles.background} height={height * 1.05} />
            ) : (
                <LoginBackground style={styles.background} height={height * 2} />
            )}

            <View style={styles.formContainer}>
                <Image
                    style={styles.logo}
                    resizeMode="contain"
                    source={require("../../../assets/hha_logo_white.png")}
                />

                {authState.state !== "previouslyLoggedIn" ? (
                    <Text style={styles.loginHeader}>Login</Text>
                ) : (
                    <Alert
                        style={styles.alert}
                        severity="info"
                        text="Logged out due to inactivity. Please login again."
                    />
                )}

                {status === LoginStatus.FAILED ? (
                    <Alert
                        style={styles.alert}
                        severity="error"
                        text="Login failed. Please try again."
                    />
                ) : status === LoginStatus.SUBMITTING ? (
                    <Alert style={styles.alert} severity="info" text="Logging in" />
                ) : (
                    <></>
                )}
                {/*
                    React Native Paper does not have "standard styling" TextFields as described in
                    https://material-ui.com/components/text-fields/. They only have the outlined
                    and filled ("flat") stylings:
                    https://callstack.github.io/react-native-paper/text-input.html
                */}
                {authState.state == "previouslyLoggedIn" ? (
                    <Title style={styles.loginAgain}>
                        Logging in as: {authState.currentUser.username}
                    </Title>
                ) : (
                    <View>
                        <TextInput
                            label="Username"
                            error={status === LoginStatus.FAILED && !username}
                            value={username}
                            onChangeText={(newUsername) => setUsername(newUsername)}
                            mode="flat"
                            disabled={status === LoginStatus.SUBMITTING}
                            blurOnSubmit={false}
                            autoCapitalize="none"
                            autoCorrect={false}
                            autoCompleteType="username"
                            textContentType="username"
                            onSubmitEditing={() => passwordTextRef.current?.focus()}
                        />
                        <HelperText
                            type="error"
                            visible={status === LoginStatus.FAILED && !username}
                        >
                            Please enter a username.
                        </HelperText>
                    </View>
                )}
                <View>
                    <TextInput
                        label="Password"
                        error={status === LoginStatus.FAILED && !password}
                        value={password}
                        onChangeText={(newPassword) => setPassword(newPassword)}
                        mode="flat"
                        secureTextEntry
                        disabled={status === LoginStatus.SUBMITTING}
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoCompleteType="password"
                        textContentType="password"
                        onSubmitEditing={handleLogin}
                        ref={passwordTextRef}
                    />
                    <HelperText type="error" visible={status === LoginStatus.FAILED && !password}>
                        Please enter a password.
                    </HelperText>
                </View>
                <Button
                    color={theme.colors.accent}
                    contentStyle={{ backgroundColor: theme.colors.accent }}
                    disabled={status === LoginStatus.SUBMITTING}
                    loading={status === LoginStatus.SUBMITTING}
                    onPress={handleLogin}
                    mode="contained"
                >
                    Login
                </Button>
                {authState.state == "previouslyLoggedIn" ? (
                    <Button
                        style={styles.logoutButton}
                        color={theme.colors.onPrimary}
                        disabled={status === LoginStatus.SUBMITTING}
                        onPress={logout}
                        mode="text"
                    >
                        Logout
                    </Button>
                ) : (
                    <></>
                )}
            </View>
        </KeyboardAwareScrollView>
    );
};

export default Login;
