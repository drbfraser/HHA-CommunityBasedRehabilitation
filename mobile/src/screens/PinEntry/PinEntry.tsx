import React, { useContext, useEffect, useState } from "react";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, Text, TextInput, Title } from "react-native-paper";
import Alert from "../../components/Alert/Alert";
import { PinContext } from "../../context/PinContext/PinContext";
import { useAppTheme } from "../../util/theme.styles";
import { PIN_MAX_ATTEMPTS, PIN_MAX_LENGTH, PIN_MIN_LENGTH } from "../../util/pinStorage";
import useStyles from "./PinEntry.styles";

type Status = { status: "idle" } | { status: "submitting" } | { status: "error"; message: string };

const PinEntry = () => {
    const styles = useStyles();
    const theme = useAppTheme();
    const { verifyPin, fallbackToPassword, pinState } = useContext(PinContext);

    const [pin, setPin] = useState("");
    const [status, setStatus] = useState<Status>({ status: "idle" });

    const failedAttempts = pinState.state === "locked" ? pinState.failedAttempts : 0;
    const remaining = Math.max(PIN_MAX_ATTEMPTS - failedAttempts, 0);

    useEffect(() => {
        if (pinState.state !== "locked") {
            return;
        }
        if (failedAttempts >= PIN_MAX_ATTEMPTS) {
            fallbackToPassword();
        }
    }, [failedAttempts, pinState.state]);

    const handleSubmit = async () => {
        if (pin.length < PIN_MIN_LENGTH) {
            setStatus({
                status: "error",
                message: `PIN must be at least ${PIN_MIN_LENGTH} digits.`,
            });
            return;
        }
        setStatus({ status: "submitting" });
        try {
            const ok = await verifyPin(pin);
            if (ok) {
                // Navigation handled by App once pin state flips to unlocked.
                return;
            }
            setPin("");
            const nextRemaining = Math.max(remaining - 1, 0);
            setStatus({
                status: "error",
                message:
                    nextRemaining > 0
                        ? `Incorrect PIN. ${nextRemaining} attempt${
                              nextRemaining === 1 ? "" : "s"
                          } remaining.`
                        : "Too many failed attempts. Please sign in with your password.",
            });
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
            <Title style={styles.title}>Enter your PIN</Title>
            <Text style={styles.subtitle}>Enter your PIN to unlock the app.</Text>

            {status.status === "error" ? (
                <Alert style={styles.alert} severity="error" text={status.message} />
            ) : null}

            <View>
                <TextInput
                    label="PIN"
                    value={pin}
                    onChangeText={(v) => setPin(v.replace(/\D/g, "").slice(0, PIN_MAX_LENGTH))}
                    keyboardType="number-pad"
                    secureTextEntry
                    mode="flat"
                    style={styles.input}
                    disabled={status.status === "submitting"}
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit}
                    maxLength={PIN_MAX_LENGTH}
                    autoFocus
                    testID="pin-entry-input"
                />
            </View>

            <Button
                mode="contained"
                buttonColor={theme.colors.accent}
                onPress={handleSubmit}
                disabled={status.status === "submitting"}
                loading={status.status === "submitting"}
                style={styles.button}
                testID="pin-entry-submit"
            >
                Unlock
            </Button>

            <Button
                mode="text"
                textColor={theme.colors.onPrimary}
                onPress={fallbackToPassword}
                disabled={status.status === "submitting"}
                style={styles.fallback}
                testID="pin-entry-fallback"
            >
                Use password instead
            </Button>
        </KeyboardAwareScrollView>
    );
};

export default PinEntry;
