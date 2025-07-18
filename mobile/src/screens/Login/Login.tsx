import React, { useContext, useEffect, useRef, useState } from "react";
import { Image, TextInput as NativeTextInput, useWindowDimensions, View } from "react-native";
import useStyles from "./Login.styles";
import LoginBackgroundSmall from "./LoginBackgroundSmall";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, IconButton, HelperText, Text, TextInput, Title } from "react-native-paper";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import Alert from "../../components/Alert/Alert";
import LoginBackground from "./LoginBackground";
import { SMALL_WIDTH, useAppTheme } from "../../util/theme.styles";
import passwordTextInputProps from "../../components/PasswordTextInput/passwordTextInputProps";
import { APIFetchFailError } from "@cbr/common";
import { useNavigation } from "@react-navigation/core";
import { VERSION_NAME } from "../Sync/Sync";
// import { column } from "@nozbe/watermelondb/QueryDescription";
import { useTranslation } from "react-i18next";
import LanguagePicker from "../../components/LanguagePicker/LanguagePicker";
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
    const theme = useAppTheme();
    const styles = useStyles();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState<LoginStatus>({ status: "initial" });

    const navigation = useNavigation();

    useEffect(() => {
        return navigation.addListener("focus", () => {
            setUsername("");
            setPassword("");
            setStatus({ status: "initial" });
        });
    }, [navigation]);

    // This is for selecting the next TextInput: https://stackoverflow.com/a/59626713
    // Importing RN's TextInput as NativeTextInput fixes the typing as mentioned in
    // https://github.com/callstack/react-native-paper/issues/1453#issuecomment-699163546
    const passwordTextRef = useRef<NativeTextInput>(null);

    const { login, logout, authState } = useContext(AuthContext);

    const handleLogin = async () => {
        const usernameToUse =
            authState.state == "previouslyLoggedIn" ? authState.currentUser.username : username;

        if (!usernameToUse.length || !password.length) {
            const error =
                !usernameToUse.length && !password.length
                    ? t("login.missingValue", { context: "usernamePassword" })
                    : !usernameToUse.length
                    ? t("login.missingValue", { context: "username" })
                    : t("login.missingValue", { context: "password" });

            setStatus({ status: "failed", error: error });
            return;
        }

        setStatus({ status: "submitting" });
        try {
            await login(usernameToUse, password);
            // Navigation is handled by App component as it updates the AuthState.
        } catch (e) {
            if (e instanceof Error || e instanceof APIFetchFailError) {
                if (e.name === "AbortError") {
                    setStatus({ status: "failed", error: t("login.requestTimeout") });
                } else {
                    const errorMessage =
                        e instanceof APIFetchFailError && e.details ? e.details : `${e}`;
                    setStatus({ status: "failed", error: errorMessage });
                }
            }
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
                <LanguagePicker />
                <Image
                    style={styles.logo}
                    resizeMode="contain"
                    source={require("../../../assets/hha_logo_white.png")}
                />

                {authState.state !== "previouslyLoggedIn" ? (
                    <Text style={styles.loginHeader}>{t("login.login")}</Text>
                ) : (
                    <Alert
                        style={styles.alert}
                        severity="info"
                        text={t("login.inactiveLogoutAlert")}
                    />
                )}

                {status.status === "failed" ? (
                    <Alert
                        style={styles.alert}
                        severity="error"
                        text={`${t("login.loginFailed")}: ${status.error}`}
                    />
                ) : status.status === "submitting" ? (
                    <Alert style={styles.alert} severity="info" text={t("login.loggingIn")} />
                ) : null}
                {/*
                    React Native Paper does not have "standard styling" TextFields as described in
                    https://material-ui.com/components/text-fields/. They only have the outlined
                    and filled ("flat") stylings:
                    https://callstack.github.io/react-native-paper/text-input.html
                */}
                {authState.state == "previouslyLoggedIn" ? (
                    <Title style={styles.loginAgain}>
                        {t("login.loggingInAs")}
                        {authState.currentUser.username}
                    </Title>
                ) : (
                    <View>
                        <TextInput
                            label={t("general.username")}
                            error={status.status === "failed" && !username}
                            value={username}
                            onChangeText={(newUsername) => setUsername(newUsername)}
                            mode="flat"
                            disabled={status.status === "submitting"}
                            blurOnSubmit={false}
                            autoCapitalize="none"
                            autoCorrect={false}
                            autoComplete="username"
                            textContentType="username"
                            returnKeyType="next"
                            onSubmitEditing={() => passwordTextRef.current?.focus()}
                        />
                        <HelperText type="error" visible={status.status === "failed" && !username}>
                            {t("login.enterValue", { context: "username" })}
                        </HelperText>
                    </View>
                )}
                <View>
                    <TextInput
                        {...passwordTextInputProps}
                        label={t("general.password")}
                        error={status.status === "failed" && !password}
                        value={password}
                        onChangeText={(newPassword) => setPassword(newPassword)}
                        mode="flat"
                        disabled={status.status === "submitting"}
                        onSubmitEditing={handleLogin}
                        returnKeyType="done"
                        ref={passwordTextRef}
                    />
                    <HelperText type="error" visible={status.status === "failed" && !password}>
                        {t("login.enterValue", { context: "password" })}
                    </HelperText>
                </View>
                <Button
                    buttonColor={theme.colors.accent}
                    contentStyle={{ backgroundColor: theme.colors.accent }}
                    disabled={status.status === "submitting"}
                    loading={status.status === "submitting"}
                    onPress={handleLogin}
                    mode="contained"
                >
                    {t("login.login")}
                </Button>
                {authState.state == "previouslyLoggedIn" ? (
                    <Button
                        style={styles.logoutButton}
                        buttonColor={theme.colors.onPrimary}
                        disabled={status.status === "submitting"}
                        onPress={logout}
                        mode="text"
                    >
                        {t("login.logout")}
                    </Button>
                ) : (
                    <></>
                )}
                <Text style={styles.versionInfo}>{VERSION_NAME}</Text>
                <View style={styles.settingsButtonContainer}>
                    <IconButton
                        icon="cog"
                        iconColor={theme.colors.onPrimary}
                        onPress={() => navigation.navigate("SwitchServer")}
                    />
                </View>
            </View>
        </KeyboardAwareScrollView>
    );
};

export default Login;
