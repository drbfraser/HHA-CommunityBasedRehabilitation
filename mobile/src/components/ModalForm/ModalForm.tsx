import React, { FC, useEffect, useMemo, useState } from "react";
import { Pressable } from "react-native";
import { TextInput, Portal, Modal, Text, Divider, HelperText } from "react-native-paper";
import TextCheckBox from "../TextCheckBox/TextCheckBox";
import useStyles from "./ModalForm.styles";
import { shouldShowError } from "../../util/formikUtil";
import { FormikProps } from "formik";
import { clientFieldLabels } from "@cbr/common";

interface IProps {
    field: string;
    checkboxLabels?: string[];
    hasFreeformText?: boolean;
    formikProps: FormikProps<any>;
}

const ModalForm: FC<IProps> = ({
    field,
    formikProps,
    checkboxLabels = [],
    hasFreeformText = false,
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
                editable={false}
                mode="outlined"
                label={`xxx${label}xxx`}
                value={formValue}
                error={hasError}
                render={() => (
                    <Pressable onPress={onOpen} style={styles.button}>
                        <Text>{formValue}</Text>
                    </Pressable>
                )}
            />
            <HelperText type="error" visible={hasError}>
                {formikProps.errors[field] as string}
            </HelperText>
        </>
    );
};

export default ModalForm;
