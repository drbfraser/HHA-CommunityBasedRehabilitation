import React, { FC, useEffect, useState } from "react";
import { Pressable } from "react-native";
import { TextInput, Portal, Modal, Text, Divider, HelperText } from "react-native-paper";
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
        const newValue = Object.entries(checkedItems)
            .filter(([_label, isChecked]) => isChecked)
            .map(([label, _isChecked]) => label)
            .concat(freeformText)
            .join(",\n");
        setFormValue(newValue);
    }, [checkedItems, freeformText]);

    const onOpen = () => {
        if (disabled) return;

        setVisible(true);
    };
    const onClose = () => {
        setVisible(false);
        formikProps.setFieldTouched(field);
        formikProps.setFieldValue(field, formValue);
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
                label={`xxx${label}xxx`}
                value={formValue}
                error={hasError}
                render={() => (
                    <Pressable onPress={onOpen} style={styles.button}>
                        <Text>{formValue}</Text>
                        <Icon name="edit" size={20} style={styles.editIcon} />
                    </Pressable>
                )}
            />
            {hasError && (
                <HelperText type="error">{formikProps.errors[field] as string}</HelperText>
            )}
        </>
    );
};

export default ModalForm;
