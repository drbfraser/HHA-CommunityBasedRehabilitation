import { FormikProps } from "formik";
import React, { memo, useCallback } from "react";
import { HelperText } from "react-native-paper";
import {
    areFormikComponentPropsEqual,
    TFormikComponentProps,
    shouldShowError,
} from "../../util/formikUtil";
import ExposedDropdownMenu, { Props as ExposedDropdownMenuProps } from "./ExposedDropdownMenu";

export type FormikMenuProps<Field extends string> = Omit<
    ExposedDropdownMenuProps,
    "onDismiss" | "onKeyChange" | "error" | "label" | "value" | "onChangeText" | "onEndEditing"
> &
    TFormikComponentProps<Field> & {
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
    };

const getCurrentSelection = <T extends string>(menuProps: FormikMenuProps<T>): string => {
    // We destructure in order to do a correct cast of other as ExposedDropdownMenuProps.
    const { currentValueOverride, otherOnKeyChange, fieldLabels, field, formikProps, ...other } =
        menuProps;
    const dropdownProps = other as ExposedDropdownMenuProps;

    const valueToUse = currentValueOverride ?? formikProps.values[menuProps.field];
    // Fall back to empty string, otherwise if it's undefined, React won't rerender the TextInput
    // if the component had a value before.
    return (
        (dropdownProps.valuesType === "array"
            ? dropdownProps.values[valueToUse]
            : dropdownProps.valuesType === "map"
            ? dropdownProps.values.get(valueToUse)
            : dropdownProps.values[valueToUse]) ?? ""
    );
};

/**
 * Material Design dropdown menu for use with Formik. The key in the provided `values` prop should
 * correspond to the expected Formik value for the field.
 *
 * @see ExposedDropdownMenu
 */
const BaseFormikExposedDropdownMenu = <T extends string>(props: FormikMenuProps<T>) => {
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
        [props.field]
    );
    const setFieldTouched = () => {
        props.formikProps.setFieldTouched(props.field);
    };

    return (
        <>
            <ExposedDropdownMenu
                {...dropdownProps}
                error={isError}
                label={props.fieldLabels[field]}
                value={getCurrentSelection(props)}
                onChangeText={formikProps.handleChange(field)}
                onDismiss={setFieldTouched}
                onEndEditing={setFieldTouched}
                onKeyChange={keyChangeCallback}
                disabled={dropdownProps.disabled || formikProps.isSubmitting}
                blurOnSubmit={false}
            />
            {isError ? <HelperText type="error">{formikProps.errors[field]}</HelperText> : null}
        </>
    );
};

const FormikExposedDropdownMenu = memo(
    BaseFormikExposedDropdownMenu,
    <T extends string>(oldProps: FormikMenuProps<T>, newProps: FormikMenuProps<T>) => {
        return (
            areFormikComponentPropsEqual(oldProps, newProps) &&
            oldProps.key === newProps.key &&
            oldProps.focusable === newProps.focusable &&
            oldProps.disabled === newProps.disabled &&
            oldProps.currentValueOverride === newProps.currentValueOverride &&
            oldProps.otherOnKeyChange === newProps.otherOnKeyChange &&
            getCurrentSelection(oldProps) === getCurrentSelection(newProps)
        );
    }
);

export default FormikExposedDropdownMenu;
