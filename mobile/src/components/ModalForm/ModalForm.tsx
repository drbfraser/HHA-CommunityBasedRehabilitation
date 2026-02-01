import React, { FC, useState } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { useTranslation } from "react-i18next";
import { TextInput, Text, TouchableRipple } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import { FormikProps } from "formik";

import { shouldShowError } from "../../util/formikUtil";
import TextCheckBox from "../TextCheckBox/TextCheckBox";
import useStyles from "./ModalForm.styles";
import ModalWindow from "./components/ModalWindow";
import ModalTrigger from "./components/ModalTrigger";
import useFormValueGenerator from "./hooks/useFormValueGenerator";
import { initializeCheckedItems, initializeFreeformText } from "./utils";
import { RiskGoalOptions, RiskRequirementOptions } from "@cbr/common";

interface IProps {
    label: string;
    formikField: string;
    formikProps: FormikProps<any>;
    /**
     * The translation key of the array of values that will be used for the modal form's checkboxes
     */
    transKey: RiskRequirementOptions | RiskGoalOptions;
    /**
     * Used to initialize the form with pre-populated values.
     * The expected format is a string of items delimited by `",\n"`.
     *
     * Example: "See Friends,\nVolunteer,\nother text"
     */
    defaultValue?: string;
    hasFreeformText?: boolean;
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
}

const ModalForm: FC<IProps> = ({
    label,
    formikField,
    formikProps,
    transKey,
    defaultValue = "",
    hasFreeformText = true,
    disabled = false,
    style: styleProp = {},
}) => {
    const { t } = useTranslation();
    const styles = useStyles();
    const [visible, setVisible] = useState(false);

    /**
     *  The fields in the default lanugage (English),
     *  for saving only English strings into the database.
     *
     *  This array should have a **1-to-1** correspondence with the `localizedFields` array.
     */
    // todo: this method of converting from JSON object to string[] could be cleaner
    const canonicalFields: string[] = Object.values(
        t(transKey, { returnObjects: true, lng: "en" })
    );
    /**
     * The fields in the currently selected langauge, for displaying to the user.
     *
     * This array should have a **1-to-1** correspondence with the `canonicalFields` array.
     */
    // todo: this method of converting from JSON object to string[] could be cleaner
    const localizedFields: string[] = Object.values(t(transKey, { returnObjects: true }));
    console.assert(canonicalFields.length == localizedFields.length);

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
            <ModalWindow label={label} visible={visible} onClose={onClose}>
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
                        label={t("survey.other")}
                        value={freeformText}
                        onChangeText={(text) => setFreeformText(text)}
                    />
                )}
            </ModalWindow>

            <ModalTrigger
                label={label}
                displayText={displayedFormValue}
                hasError={shouldShowError(formikProps, formikField)}
                errorMsg={formikProps.errors[formikField] as string}
            >
                <TouchableRipple
                    style={[styleProp, styles.button]}
                    onPress={onOpen}
                    disabled={disabled}
                >
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
