import React, { useContext, useRef, useState } from "react";
import { TextInput as NativeTextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, HelperText, Text, TextInput, Title } from "react-native-paper";
import Alert from "../../components/Alert/Alert";
import { PinContext } from "../../context/PinContext/PinContext";
import { useAppTheme } from "../../util/theme.styles";
import { isPinFormatValid, PIN_MAX_LENGTH, PIN_MIN_LENGTH } from "../../util/pinStorage";
import useStyles from "./PinSetup.styles";

type Status = { status: "idle" } | { status: "submitting" } | { status: "error"; message: string };

const PinSetup = () => {
    const styles = useStyles();
    const theme = useAppTheme();
    const { setPin } = useContext(PinContext);

    const [pin, setPinValue] = useState("");
    const [confirm, setConfirm] = useState("");
    const [status, setStatus] = useState<Status>({ status: "idle" });

    const confirmRef = useRef<NativeTextInput>(null);

    const handleSubmit = async () => {
        if (!isPinFormatValid(pin)) {
            setStatus({
                status: "error",
                message: `PIN must be ${PIN_MIN_LENGTH}-${PIN_MAX_LENGTH} digits.`,
            });
            return;
        }
        if (pin !== confirm) {
            setStatus({ status: "error", message: "PINs do not match. Please try again." });
            setConfirm("");
            return;
        }
        setStatus({ status: "submitting" });
        try {
            await setPin(pin);
            // Navigation handled by App based on PinState.
        } catch (e: any) {
            setStatus({ status: "error", message: e?.message ?? `${e}` });
        }
    };

    return (
        <KeyboardAwareScrollView
            style={styles.container}
            contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
            keyboardShouldPersistTaps="always"
        >
            <Title style={styles.title}>Set a PIN</Title>
            <Text style={styles.subtitle}>
                Choose a {PIN_MIN_LENGTH}-{PIN_MAX_LENGTH} digit PIN. You will use it to quickly
                unlock the app.
            </Text>

            {status.status === "error" ? (
                <Alert style={styles.alert} severity="error" text={status.message} />
            ) : null}

            <View>
                <TextInput
                    label="New PIN"
                    value={pin}
                    onChangeText={(v) => setPinValue(v.replace(/\D/g, "").slice(0, PIN_MAX_LENGTH))}
                    keyboardType="number-pad"
                    secureTextEntry
                    mode="flat"
                    style={styles.input}
                    disabled={status.status === "submitting"}
                    returnKeyType="next"
                    onSubmitEditing={() => confirmRef.current?.focus()}
                    blurOnSubmit={false}
                    maxLength={PIN_MAX_LENGTH}
                    testID="pin-setup-new"
                />
                <HelperText type="info" visible>
                    {pin.length}/{PIN_MAX_LENGTH} digits
                </HelperText>
            </View>

            <View>
                <TextInput
                    label="Confirm PIN"
                    value={confirm}
                    onChangeText={(v) => setConfirm(v.replace(/\D/g, "").slice(0, PIN_MAX_LENGTH))}
                    keyboardType="number-pad"
                    secureTextEntry
                    mode="flat"
                    style={styles.input}
                    disabled={status.status === "submitting"}
                    ref={confirmRef}
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit}
                    maxLength={PIN_MAX_LENGTH}
                    testID="pin-setup-confirm"
                />
            </View>

            <Button
                mode="contained"
                buttonColor={theme.colors.accent}
                onPress={handleSubmit}
                disabled={status.status === "submitting"}
                loading={status.status === "submitting"}
                style={styles.button}
                testID="pin-setup-submit"
            >
                Save PIN
            </Button>
        </KeyboardAwareScrollView>
    );
};

export default PinSetup;
