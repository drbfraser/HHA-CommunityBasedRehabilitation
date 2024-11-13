import React, { FC, useState } from "react";
import { TextInput, Text, TouchableRipple } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import { FormikProps } from "formik";

import TextCheckBox from "../TextCheckBox/TextCheckBox";
import { shouldShowError } from "../../util/formikUtil";
import useStyles from "./ModalForm.styles";
import Modal from "./components/Modal";
import ModalTrigger from "./components/ModalTrigger";
import useFormValueGenerator from "./hooks/useFormValueGenerator";
import { initializeCheckedItems, initializeFreeformText } from "./utils";

// encapsulate conversion between languages into modal form
// database gives text in english and want to show Bari
// take english strings and swap to Bari if possible
// database will always store english
//
// new args:
// 1. current value to populate with
// 2. canonical array of fields in english
// 3. array of checkboxes in current selected langauge

interface IProps {
    label: string;
    formikField: string;
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
    /**
     * Used to initialize the form with pre-populated values.
     * The expected format is a string of items delimited by `",\n"`.
     * Example: "See Friends,\nVolunteer,\nother text"
     */
    defaultValue?: string;
    hasFreeformText?: boolean;
    disabled?: boolean;
}

const ModalForm: FC<IProps> = ({
    label,
    formikField,
    formikProps,
    canonicalFields,
    localizedFields,
    defaultValue = "",
    hasFreeformText = false,
    disabled = false,
}) => {
    console.assert(canonicalFields.length == localizedFields.length);

    const styles = useStyles();
    const [visible, setVisible] = useState(false);
    const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>(
        initializeCheckedItems(defaultValue, canonicalFields, localizedFields)
    );
    const [freeformText, setFreeformText] = useState(
        initializeFreeformText(defaultValue, canonicalFields)
    );

    const [canonicalFormValue, displayedFormValue] = useFormValueGenerator(
        checkedItems,
        freeformText,
        canonicalFields
    );

    const onOpen = () => {
        if (disabled) return;
        setVisible(true);
    };
    const onClose = () => {
        formikProps.setFieldTouched(formikField);
        formikProps.setFieldValue(formikField, canonicalFormValue);
        setVisible(false);
    };

    return (
        <>
            <Modal label={label} visible={visible} onClose={onClose}>
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
            </Modal>

            <ModalTrigger
                label={label}
                displayText={displayedFormValue}
                hasError={shouldShowError(formikProps, formikField)}
                errorMsg={formikProps.errors[formikField] as string}
            >
                <TouchableRipple onPress={onOpen} style={styles.button}>
                    <>
                        <Text style={styles.buttonText}>{displayedFormValue}</Text>
                        <Icon name="edit" size={20} style={styles.editIcon} />
                    </>
                </TouchableRipple>
            </ModalTrigger>
        </>
    );
};

export default ModalForm;
