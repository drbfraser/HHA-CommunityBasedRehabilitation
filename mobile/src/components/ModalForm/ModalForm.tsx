import React, { FC, useEffect, useState } from "react";
import { Pressable } from "react-native";
import {
    TextInput,
    Portal,
    Modal,
    Text,
    Divider,
    HelperText,
    TouchableRipple,
} from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import { FormikProps } from "formik";

import { clientFieldLabels } from "@cbr/common";
import TextCheckBox from "../TextCheckBox/TextCheckBox";
import { shouldShowError } from "../../util/formikUtil";
import useStyles from "./ModalForm.styles";

interface IProps {
    field: string;
    formikProps: FormikProps<any>;
    checkboxLabels?: string[];
    hasFreeformText?: boolean;
    disabled?: boolean;
}

const ModalForm: FC<IProps> = ({
    field,
    formikProps,
    checkboxLabels = [],
    hasFreeformText = false,
    disabled = false,
}) => {
    const styles = useStyles();
    const [visible, setVisible] = useState(false);
    const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>(
        checkboxLabels.reduce((acc, label) => ({ ...acc, [label]: false }), {}) ?? {}
    );
    const [freeformText, setFreeformText] = useState("");
    const [formValue, setFormValue] = useState("");

    useEffect(() => {
        let newValue = Object.entries(checkedItems)
            .filter(([_, isChecked]) => isChecked)
            .map(([label, _]) => label)
            .join(",\n");
        if (freeformText) {
            newValue = newValue ? newValue.concat(`,\n${freeformText}`) : freeformText;
        }

        setFormValue(newValue);
    }, [checkedItems, freeformText]);

    const onOpen = () => {
        if (disabled) return;
        setVisible(true);
    };
    const onClose = () => {
        formikProps.setFieldTouched(field);
        formikProps.setFieldValue(field, formValue);
        setVisible(false);
    };

    const label = clientFieldLabels[field];
    const hasError = shouldShowError(formikProps, field);
    return (
        <>
            <Portal>
                <Modal visible={visible} onDismiss={onClose} contentContainerStyle={styles.modal}>
                    <Text>{label}</Text>
                    <Divider />
                    {checkboxLabels.map((label, index) => (
                        <TextCheckBox
                            key={index}
                            field={label}
                            label={label}
                            value={checkedItems[label]}
                            setFieldValue={() => null}
                            onChange={(checked) =>
                                setCheckedItems({ ...checkedItems, [label]: checked })
                            }
                        />
                    ))}
                    {hasFreeformText && (
                        <TextInput
                            mode="outlined"
                            label="Other"
                            value={freeformText}
                            onChangeText={(text) => setFreeformText(text)}
                        />
                    )}
                </Modal>
            </Portal>

            <TextInput
                mode="outlined"
                disabled={disabled}
                label={label}
                value={formValue}
                error={hasError}
                render={() => (
                    <TouchableRipple onPress={onOpen} style={styles.button}>
                        <>
                            <Text style={styles.buttonText}>{formValue}</Text>
                            <Icon name="edit" size={20} style={styles.editIcon} />
                        </>
                    </TouchableRipple>
                )}
            />
            {hasError && (
                <HelperText type="error">{formikProps.errors[field] as string}</HelperText>
            )}
        </>
    );
};

export default ModalForm;
