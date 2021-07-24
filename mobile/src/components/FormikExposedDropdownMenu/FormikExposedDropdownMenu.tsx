import { FormikProps } from "formik";
import React, { useCallback } from "react";
import { HelperText } from "react-native-paper";
import { shouldShowError } from "../../util/formikUtil";
import ExposedDropdownMenu, {
    Props as ExposedDropdownMenuProps,
} from "../ExposedDropdownMenu/ExposedDropdownMenu";

export type FormikMenuProps<Field extends string> = Omit<
    ExposedDropdownMenuProps,
    "onKeyChange" | "error" | "label" | "value" | "onChangeText" | "onEndEditing"
> & {
    fieldLabels: {
        // @ts-ignore
        [fieldId: Field]: string;
    };
    field: Field;
    formikProps: FormikProps<any>;
    /** Whether the key for the provided values is a number or not */
    numericKey: boolean;
};

/**
 * Material Design dropdown menu for use with Formik. The key in the provided `values` prop should
 * correspond to the expected Formik value for the field.
 *
 * @see ExposedDropdownMenu
 */
const FormikExposedDropdownMenu = (props: FormikMenuProps<string>) => {
    const { fieldLabels, field, formikProps, numericKey, ...other } = props;
    const dropdownProps = other as ExposedDropdownMenuProps;

    const isError = shouldShowError(formikProps, field);

    // useCallback to prevent unnecessary dropdown menu item array rerenders
    const keyChangeCallback = useCallback(
        (key: string) => {
            const value = numericKey ? Number(key) : key;
            formikProps.setFieldValue(field, value);
            // Due to https://github.com/formium/formik/issues/2457, we delay and then validate as a
            // workaround.
            if (!formikProps.touched[field]) {
                setTimeout(() => formikProps.setFieldTouched(field, true, true), 150);
            }
        },
        [props.field, formikProps.touched, formikProps.setFieldTouched]
    );

    const currentSelectionToDisplay =
        dropdownProps.valuesType === "array"
            ? dropdownProps.values[formikProps.values[field]]
            : dropdownProps.valuesType === "map"
            ? dropdownProps.values.get(formikProps.values[field])
            : dropdownProps.values[formikProps.values[field]];

    return (
        <>
            <ExposedDropdownMenu
                {...dropdownProps}
                error={isError}
                label={props.fieldLabels[field]}
                value={currentSelectionToDisplay}
                onChangeText={formikProps.handleChange(field)}
                onEndEditing={() => formikProps.setFieldTouched(field)}
                onKeyChange={keyChangeCallback}
                disabled={dropdownProps.disabled || formikProps.isSubmitting}
                blurOnSubmit={false}
            />
            {isError ? <HelperText type="error">{formikProps.errors[field]}</HelperText> : null}
        </>
    );
};

export default FormikExposedDropdownMenu;
