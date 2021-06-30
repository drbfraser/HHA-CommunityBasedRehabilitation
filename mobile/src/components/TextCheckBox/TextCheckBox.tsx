import React from "react";
import { View } from "react-native";
import { Checkbox, Paragraph, TouchableRipple } from "react-native-paper";
import useStyles from "./TextCheckBox.style";

interface IProps {
    field: string;
    setFieldValue: (field: string, value: boolean) => void;
    value: boolean;
    label: string;
}

const TextCheckBox = (props: IProps) => {
    const styles = useStyles();
    return (
        <TouchableRipple onPress={() => props.setFieldValue(props.field, !props.value)}>
            <View style={styles.checkBoxText}>
                <View pointerEvents="none">
                    <Checkbox status={props.value ? "checked" : "unchecked"} />
                </View>
                <Paragraph style={{ flexGrow: 1 }}>{props.label}</Paragraph>
            </View>
        </TouchableRipple>
    );
};

export default TextCheckBox;
