import { FormikProps } from "formik";
import React, { useCallback } from "react";
import { HelperText } from "react-native-paper";
import { shouldShowError } from "../../util/formikUtil";
import ExposedDropdownMenu, { Props as ExposedDropdownMenuProps } from "./ExposedDropdownMenu";

export type FormikMenuProps<Field extends string> = Omit<
    ExposedDropdownMenuProps,
    "onKeyChange" | "error" | "label" | "value" | "onChangeText" | "onEndEditing"
> & {
    /**
     * A secondary `onKeyChange` prop that is executed after the formik values have been set.
     * @param key The key as given by {@link ExposedDropdownMenuProps.values}
     */
    otherOnKeyChange?: (key: any) => void;
    /**
     * An override for the value to override the displayed label, where the selection labels and
     * their respective values / keys should be covered by {@link ExposedDropdownMenuProps.values}.
     */
    currentValueOverride?: any;
    fieldLabels: Record<Field, string>;
    field: Field;
    formikProps: FormikProps<any>;
};

/**
 * Material Design dropdown menu for use with Formik. The key in the provided `values` prop should
 * correspond to the expected Formik value for the field.
 *
 * @see ExposedDropdownMenu
 */
const FormikExposedDropdownMenu = <T extends string>(props: FormikMenuProps<T>) => {
    const { currentValueOverride, otherOnKeyChange, fieldLabels, field, formikProps, ...other } =
        props;
    const dropdownProps = other as ExposedDropdownMenuProps;

    const isError = shouldShowError(formikProps, field);

    // useCallback to prevent unnecessary dropdown menu item array rerenders
    const keyChangeCallback = useCallback(
        (key: any) => {
            formikProps.setFieldValue(field, key);
            // Due to https://github.com/formium/formik/issues/2457, we delay and then validate as a
            // workaround.
            if (!formikProps.touched[field]) {
                setTimeout(() => formikProps.setFieldTouched(field, true, true), 150);
            }

            otherOnKeyChange?.(key);
        },
        [props.field, formikProps.touched, formikProps.setFieldTouched]
    );

    const valueToUse = currentValueOverride ?? formikProps.values[field];
    // Fall back to empty string, otherwise if it's undefined, React won't rerender the TextInput
    // if the component had a value before.
    const currentSelectionToDisplay =
        (dropdownProps.valuesType === "array"
            ? dropdownProps.values[valueToUse]
            : dropdownProps.valuesType === "map"
            ? dropdownProps.values.get(valueToUse)
            : dropdownProps.values[valueToUse]) ?? "";

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
