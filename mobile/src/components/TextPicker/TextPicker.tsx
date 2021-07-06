import React from "react";
import { Picker as SelectPicker } from "@react-native-picker/picker";
import useStyles from "./TextPicker.style";
import { ItemValue } from "@react-native-picker/picker/typings/Picker";

interface IProps {
    field: string;
    setFieldValue: (field: string, value: ItemValue) => void;
    setFieldTouched: (field: string, value: boolean) => void;
    choices: IPickerChoice[];
    // choices: object;
    selectedValue: string | number;
}

export interface IPickerChoice {
    label: string;
    value: string | number;
}

const TextPicker = (props: IProps) => {
    const styles = useStyles();

    return (
        <SelectPicker
            selectedValue={props.selectedValue}
            style={styles.picker}
            onValueChange={(itemValue) => {
                props.setFieldTouched(props.field, true);
                props.setFieldValue(props.field, itemValue);
            }}
        >
            <SelectPicker.Item key={"unselectable"} label={""} value={""} />
            {/* {Object.entries(props.choices).map(([value, name]) => (
                <SelectPicker.Item label={name} value={value} key={name} />
            ))} */}
            {props.choices.map((choice) => (
                <SelectPicker.Item label={choice.label} value={choice.value} key={choice.label} />
            ))}
        </SelectPicker>
    );
};

export default TextPicker;
