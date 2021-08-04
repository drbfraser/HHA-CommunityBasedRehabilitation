import React from "react";
import { View } from "react-native";
import { Checkbox, Paragraph, TouchableRipple } from "react-native-paper";
import useStyles from "./TextCheckBox.style";

interface IProps {
    field: string;
    value: boolean;
    disabled?: boolean;
    label: string;
    setFieldTouched: (field: string, value: boolean) => void;
    setFieldValue: (field: string, value: boolean) => void;
    onChange?: (value: boolean) => void;
}

const TextCheckBox = (props: IProps) => {
    const styles = useStyles();
    return (
        <TouchableRipple
            disabled={props.disabled ?? false}
            onPress={() => {
                props.setFieldTouched(props.field, true);
                props.setFieldValue(props.field, !props.value);
                props.onChange?.(!props.value);
            }}
        >
            <View style={styles.checkBoxText}>
                <View pointerEvents="none">
                    <Checkbox
                        disabled={props.disabled ?? false}
                        status={props.value ? "checked" : "unchecked"}
                    />
                </View>
                <Paragraph style={styles.text}>{props.label}</Paragraph>
            </View>
        </TouchableRipple>
    );
};

export default TextCheckBox;
