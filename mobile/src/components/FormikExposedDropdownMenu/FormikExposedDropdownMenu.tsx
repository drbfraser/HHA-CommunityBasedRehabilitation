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
    /**
     * A secondary `onKeyChange` prop that is executed after the formik values have been set.
     * @param key The key as given by {@link ExposedDropdownMenuProps.values}
     */
    otherOnKeyChange?: (key: string) => void;
    /**
     * An override for the value to override the displayed label, where the labels and values should
     * be covered by {@link ExposedDropdownMenuProps.values}.
     */
    currentValueOverride?: any;
    fieldLabels: Record<Field, string>;
    field: Field;
    formikProps: FormikProps<any>;
    /**
     * Whether the key for the provided values is a number or not. This has no effect when
     * `valuesType` is `"array"`, as that uses integer indexing.
     *
     * This is required for `"record"` and `"map"`, because JavaScript object keys are coerced to
     * strings by default.
     */
    numericKey: boolean;
};

/**
 * Material Design dropdown menu for use with Formik. The key in the provided `values` prop should
 * correspond to the expected Formik value for the field.
 *
 * @see ExposedDropdownMenu
 */
const FormikExposedDropdownMenu = (props: FormikMenuProps<string>) => {
    const {
        currentValueOverride,
        otherOnKeyChange,
        fieldLabels,
        field,
        formikProps,
        numericKey,
        ...other
    } = props;
    const dropdownProps = other as ExposedDropdownMenuProps;

    const isError = shouldShowError(formikProps, field);

    // useCallback to prevent unnecessary dropdown menu item array rerenders
    const keyChangeCallback = useCallback(
        (key: string) => {
            const value = numericKey || props.valuesType === "array" ? Number(key) : key;
            formikProps.setFieldValue(field, value);
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
    const currentSelectionToDisplay =
        dropdownProps.valuesType === "array"
            ? dropdownProps.values[valueToUse]
            : dropdownProps.valuesType === "map"
            ? dropdownProps.values.get(valueToUse)
            : dropdownProps.values[valueToUse];

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
