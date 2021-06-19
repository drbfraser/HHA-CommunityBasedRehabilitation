import * as React from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import {
    Subheading,
    Button,
    Portal,
    Dialog,
    RadioButton,
    TouchableRipple,
} from "react-native-paper";

type Props = {
    visible: boolean;
    close: () => void;
};

type CheckedState = "normal" | "first" | "second" | "third" | "fourth";

const DialogWithRadioBtns = ({ visible, close }: Props) => {
    const [checked, setChecked] = React.useState<CheckedState>("normal");

    return (
        <Portal>
            <Dialog onDismiss={close} visible={visible}>
                <Dialog.Title>Choose an option</Dialog.Title>
                <Dialog.ScrollArea style={{ maxHeight: 170, paddingHorizontal: 0 }}>
                    <ScrollView>
                        <View>
                            <TouchableRipple onPress={() => setChecked("normal")}>
                                <View style={styles.row}>
                                    <View pointerEvents="none">
                                        <RadioButton
                                            value="normal"
                                            status={checked === "normal" ? "checked" : "unchecked"}
                                        />
                                    </View>
                                    <Subheading style={styles.text}>Very Poor</Subheading>
                                </View>
                            </TouchableRipple>
                            <TouchableRipple onPress={() => setChecked("second")}>
                                <View style={styles.row}>
                                    <View pointerEvents="none">
                                        <RadioButton
                                            value="second"
                                            status={checked === "second" ? "checked" : "unchecked"}
                                        />
                                    </View>
                                    <Subheading style={styles.text}>Poor</Subheading>
                                </View>
                            </TouchableRipple>
                            <TouchableRipple onPress={() => setChecked("third")}>
                                <View style={styles.row}>
                                    <View pointerEvents="none">
                                        <RadioButton
                                            value="third"
                                            status={checked === "third" ? "checked" : "unchecked"}
                                        />
                                    </View>
                                    <Subheading style={styles.text}>Fine</Subheading>
                                </View>
                            </TouchableRipple>
                            <TouchableRipple onPress={() => setChecked("fourth")}>
                                <View style={styles.row}>
                                    <View pointerEvents="none">
                                        <RadioButton
                                            value="fourth"
                                            status={checked === "fourth" ? "checked" : "unchecked"}
                                        />
                                    </View>
                                    <Subheading style={styles.text}>Good</Subheading>
                                </View>
                            </TouchableRipple>
                        </View>
                    </ScrollView>
                </Dialog.ScrollArea>
                <Dialog.Actions>
                    <Button onPress={close}>Cancel</Button>
                    <Button onPress={close}>Ok</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
};

export default DialogWithRadioBtns;

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    text: {
        paddingLeft: 8,
    },
});
