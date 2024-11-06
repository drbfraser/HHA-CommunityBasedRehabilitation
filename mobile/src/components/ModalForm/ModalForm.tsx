import React, { FC, useEffect, useState } from "react";
import {
    TextInput,
    Portal,
    Text,
    Divider,
    HelperText,
    TouchableRipple,
    Dialog,
    Button,
} from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import { FormikProps } from "formik";

import { clientFieldLabels } from "@cbr/common";
import TextCheckBox from "../TextCheckBox/TextCheckBox";
import { shouldShowError } from "../../util/formikUtil";
import useStyles from "./ModalForm.styles";
import { generateFormValue } from "./utils";

interface IProps {
    field: string;
    formikProps: FormikProps<any>;
    /**
     *  The fields in the default lanugage (English).
     *  This is for for saving only English strings into the database.
     *  This array should have a 1-to-1 correspondence with the `translatedFields` array.
     */
    canonicalFields: string[];
    /**
     * The fields in the currently selected langauge.
     * This is for displaying to the user.
     * This array should have a 1-to-1 correspondence with the `canonicalFields` array.
     */
    localizedFields: string[];
    hasFreeformText?: boolean;
    disabled?: boolean;
}

const ModalForm: FC<IProps> = ({
    field,
    formikProps,
    canonicalFields,
    localizedFields,
    hasFreeformText = false,
    disabled = false,
}) => {
    console.assert(canonicalFields.length == localizedFields.length);

    const styles = useStyles();
    const [visible, setVisible] = useState(false);
    const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>(
        localizedFields.reduce((acc, label) => ({ ...acc, [label]: false }), {}) ?? {}
    );
    const [freeformText, setFreeformText] = useState("");
    const [canonicalFormValue, setCanonicalFormValue] = useState("");
    const [translatedFormValue, setTranslatedFormValue] = useState("");

    useEffect(() => {
        const fieldsInEnglish: Array<[string, boolean]> = Object.entries(checkedItems).map(
            ([_, checked], i) => [canonicalFields[i], checked]
        );
        const translatedFields = Object.entries(checkedItems);

        setCanonicalFormValue(generateFormValue(fieldsInEnglish, freeformText));
        setTranslatedFormValue(generateFormValue(translatedFields, freeformText));
    }, [checkedItems, freeformText]);

    const onOpen = () => {
        if (disabled) return;
        setVisible(true);
    };
    const onClose = () => {
        formikProps.setFieldTouched(field);
        formikProps.setFieldValue(field, canonicalFormValue);
        setVisible(false);
    };

    const label = clientFieldLabels[field];
    const hasError = shouldShowError(formikProps, field);
    return (
        <>
            <Portal>
                <Dialog visible={visible} dismissable={false} style={styles.modal}>
                    <Dialog.Title>{label}</Dialog.Title>
                    <Divider />
                    <Dialog.Content style={styles.modalContent}>
                        {localizedFields.map((label, index) => (
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
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={onClose} labelStyle={styles.closeButtonText}>
                            Ok
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

            <TextInput
                mode="outlined"
                disabled={disabled}
                label={label}
                value={translatedFormValue}
                error={hasError}
                render={() => (
                    <TouchableRipple onPress={onOpen} style={styles.button}>
                        <>
                            <Text style={styles.buttonText}>{translatedFormValue}</Text>
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
