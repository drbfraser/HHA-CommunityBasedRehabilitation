import { rateLevel } from "@cbr/common";
import { Picker } from "@react-native-community/picker";
import { ItemValue } from "@react-native-community/picker/typings/Picker";
import React from "react";
import useStyles from "../screens/BaseSurvey/baseSurvey.style";

interface IProps {
    field: string;
    setFieldValue: (field: string, value: ItemValue) => void;
    setFieldTouched: (field: string, value: boolean) => void;
    choices: object;
    values: string;
}

const TextPicker = (props: IProps) => {
    const styles = useStyles();
    return (
        <Picker
            selectedValue={props.values}
            style={styles.picker}
            onValueChange={(itemValue) => {
                props.setFieldTouched(props.field, true);
                props.setFieldValue(props.field, itemValue);
            }}
        >
            <Picker.Item key={"unselectable"} label={""} value={""} />
            {Object.entries(props.choices).map(([value, { name }]) => (
                <Picker.Item label={name} value={value} key={name} />
            ))}
        </Picker>
    );
};

export default TextPicker;
