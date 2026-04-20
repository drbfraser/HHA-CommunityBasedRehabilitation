import React, { useEffect, useRef, useState } from "react";
import { TextInput as NativeTextInput, View } from "react-native";
import { Button, Dialog, HelperText, Text, TextInput } from "react-native-paper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { doLogin, IUser } from "@cbr/common";
import Alert from "../Alert/Alert";
import passwordTextInputProps from "../PasswordTextInput/passwordTextInputProps";
import { useStyles } from "./ChangePasswordDialog.styles";
import { isPinFormatValid, PIN_MAX_LENGTH, PIN_MIN_LENGTH } from "../../util/pinStorage";

type Stage = "password" | "newPin";

type Status = { status: "idle" } | { status: "submitting" } | { status: "error"; message: string };

export type Props = {
    user: IUser;
    visible: boolean;
    onDismiss: (changed: boolean) => void;
    setPin: (pin: string) => Promise<void>;
};

const ChangePinDialog = ({ user, visible, onDismiss, setPin }: Props) => {
    const styles = useStyles();

    const [stage, setStage] = useState<Stage>("password");
    const [password, setPassword] = useState("");
    const [pin, setPinValue] = useState("");
    const [confirm, setConfirm] = useState("");
    const [status, setStatus] = useState<Status>({ status: "idle" });

    const confirmRef = useRef<NativeTextInput>(null);

    useEffect(() => {
        if (!visible) {
            setStage("password");
            setPassword("");
            setPinValue("");
            setConfirm("");
            setStatus({ status: "idle" });
        }
    }, [visible]);

    const handleVerifyPassword = async () => {
        if (!password.length) {
            setStatus({ status: "error", message: "Please enter your password." });
            return;
        }
        setStatus({ status: "submitting" });
        try {
            // doLogin issues a fresh token pair on success; this both verifies the password
            // server-side and refreshes the session.
            await doLogin(user.username, password);
            setPassword("");
            setStatus({ status: "idle" });
            setStage("newPin");
        } catch (e: any) {
            setStatus({
                status: "error",
                message: e?.message ? `${e.message}` : "Incorrect password.",
            });
        }
    };

    const handleSavePin = async () => {
        if (!isPinFormatValid(pin)) {
            setStatus({
                status: "error",
                message: `PIN must be ${PIN_MIN_LENGTH}-${PIN_MAX_LENGTH} digits.`,
            });
            return;
        }
        if (pin !== confirm) {
            setStatus({ status: "error", message: "PINs do not match." });
            setConfirm("");
            return;
        }
        setStatus({ status: "submitting" });
        try {
            await setPin(pin);
            onDismiss(true);
        } catch (e: any) {
            setStatus({ status: "error", message: e?.message ?? `${e}` });
        }
    };

    return (
        <Dialog dismissable={false} visible={visible} onDismiss={() => onDismiss(false)}>
            <Dialog.Title>
                {stage === "password" ? "Confirm password" : "Set a new PIN"}
            </Dialog.Title>
            <Dialog.ScrollArea>
                <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
                    {status.status === "error" ? (
                        <Alert style={styles.alert} severity="error" text={status.message} />
                    ) : null}

                    {stage === "password" ? (
                        <TextInput
                            {...passwordTextInputProps}
                            label="Password"
                            value={password}
                            onChangeText={setPassword}
                            mode="flat"
                            style={styles.passwordTextInput}
                            disabled={status.status === "submitting"}
                            returnKeyType="done"
                            onSubmitEditing={handleVerifyPassword}
                        />
                    ) : (
                        <View>
                            <TextInput
                                label="New PIN"
                                value={pin}
                                onChangeText={(v) =>
                                    setPinValue(v.replace(/\D/g, "").slice(0, PIN_MAX_LENGTH))
                                }
                                keyboardType="number-pad"
                                secureTextEntry
                                mode="flat"
                                style={styles.passwordTextInput}
                                disabled={status.status === "submitting"}
                                returnKeyType="next"
                                onSubmitEditing={() => confirmRef.current?.focus()}
                                blurOnSubmit={false}
                                maxLength={PIN_MAX_LENGTH}
                            />
                            <HelperText type="info" visible>
                                {pin.length}/{PIN_MAX_LENGTH} digits
                            </HelperText>
                            <TextInput
                                label="Confirm PIN"
                                value={confirm}
                                onChangeText={(v) =>
                                    setConfirm(v.replace(/\D/g, "").slice(0, PIN_MAX_LENGTH))
                                }
                                keyboardType="number-pad"
                                secureTextEntry
                                mode="flat"
                                style={styles.passwordTextInput}
                                disabled={status.status === "submitting"}
                                ref={confirmRef}
                                returnKeyType="done"
                                onSubmitEditing={handleSavePin}
                                maxLength={PIN_MAX_LENGTH}
                            />
                        </View>
                    )}
                </KeyboardAwareScrollView>
            </Dialog.ScrollArea>
            <Dialog.Actions>
                <Button disabled={status.status === "submitting"} onPress={() => onDismiss(false)}>
                    Cancel
                </Button>
                <Button
                    disabled={status.status === "submitting"}
                    loading={status.status === "submitting"}
                    onPress={stage === "password" ? handleVerifyPassword : handleSavePin}
                >
                    {stage === "password" ? "Continue" : "Save"}
                </Button>
            </Dialog.Actions>
        </Dialog>
    );
};

export default ChangePinDialog;
