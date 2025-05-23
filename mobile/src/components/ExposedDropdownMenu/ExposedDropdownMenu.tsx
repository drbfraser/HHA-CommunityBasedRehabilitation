import React, { useRef, useState } from "react";
import { Keyboard, StyleSheet, TouchableOpacity } from "react-native";
import { Menu, TextInput, TextInputProps } from "react-native-paper";
import useStyles from "./ExposedDropdownMenu.styles";
import { countObjectKeys } from "@cbr/common";
import { color } from "react-native-elements/dist/helpers";
import theme from "../../util/theme.styles";

interface IBaseDropdownMenuProps extends Omit<TextInputProps, "theme" | "editable"> {
    /**
     *  A callback that is invoked when the menu is dismissed.
     */
    onDismiss: () => void;
}

interface IRecordDropdownMenuString extends IBaseDropdownMenuProps {
    valuesType: "record-string";
    /**
     * An {@link Record} containing labels. {@link onKeyChange} will be invoked with the key of
     * the element that is selected from this array (string key).
     */
    values: Record<string, string>;
    /**
     * A callback that is invoked with the current key when the current picker selection changes.
     *
     * @param key The key of the selection as given by the `values` prop, as a string.
     */
    onKeyChange: (key: string) => void;
}

interface IRecordDropdownMenuNumeric extends IBaseDropdownMenuProps {
    valuesType: "record-number";
    /**
     * An {@link Record} containing labels. {@link onKeyChange} will be invoked with the key of
     * the element that is selected from this array (numeric key).
     */
    values: Record<number, string>;
    /**
     * A callback that is invoked with the current key when the current picker selection changes.
     *
     * @param key The key of the selection as given by the `values` prop, as a number.
     */
    onKeyChange: (key: number) => void;
}

interface IArrayDropdownMenu extends IBaseDropdownMenuProps {
    valuesType: "array";
    /**
     * An {@link Array} containing labels. {@link onKeyChange} will be invoked with the index of
     * the element that is selected from this array (coerced to a string).
     */
    values: Array<string>;
    /**
     * A callback that is invoked with the current key when the current picker selection changes.
     *
     * @param key The key of the selection as given by the `values` prop, represented as an index in
     * the array.
     */
    onKeyChange: (key: number) => void;
}

interface IMapDropdownMenu extends IBaseDropdownMenuProps {
    valuesType: "map";
    /**
     * A {@link ReadonlyMap} that maps keys to labels. {@link onKeyChange} will be invoked with the
     * key (not coerced to a string)
     */
    values: ReadonlyMap<any, string>;
    /**
     * A callback that is invoked with the current key when the current picker selection changes.
     *
     * @param key The key of the selection as given by the `values` prop, not coerced to a string.
     */
    onKeyChange: (key: any) => void;
}

export type TDropdownMenuProps =
    | IRecordDropdownMenuString
    | IRecordDropdownMenuNumeric
    | IArrayDropdownMenu
    | IMapDropdownMenu;

const menuItemStyle = StyleSheet.create({
    itemStyle: {
        // react-native-paper sets a maxWidth for menu items.
        // Make it undefined to fill the entire menu width.
        maxWidth: undefined,
    },
    selectedItemStyle: {
        maxWidth: undefined,
        backgroundColor: color(theme.colors.text).alpha(0.15).rgb().string(),
    },
});

const convertMapToMenuItems = (
    props: TDropdownMenuProps,
    hideMenu: () => void
): Array<React.ReactNode> => {
    // for TypeScript smart casting
    if (props.valuesType !== "map") {
        return [];
    }

    const map = props.values;
    const menuItems = new Array<React.ReactNode>(map.size);

    const iterator = map.entries();
    let next = iterator.next();
    let index = 0;
    while (!next.done) {
        const [key, label] = next.value;

        menuItems[index] = (
            <Menu.Item
                style={
                    props.value === label
                        ? menuItemStyle.selectedItemStyle
                        : menuItemStyle.itemStyle
                }
                onPress={() => {
                    props.onKeyChange(key);
                    hideMenu();
                }}
                key={key}
                title={label}
            />
        );
        index++;

        next = iterator.next();
    }

    return menuItems;
};

export const areDropdownMenuValuesPropsEqual = (
    oldPropsParam: Readonly<Pick<TDropdownMenuProps, "values" | "valuesType">>,
    newPropsParam: Readonly<Pick<TDropdownMenuProps, "values" | "valuesType">>
): boolean => {
    // Workaround for TypeScript smart casting.
    const oldProps = oldPropsParam as TDropdownMenuProps;
    const newProps = newPropsParam as TDropdownMenuProps;
    if (oldProps.valuesType !== newProps.valuesType) {
        return false;
    }

    // Although at this point we must have that
    // oldProps.valuesType === newProps.valuesType
    // is true, we check both anyway for TypeScript smart casting.
    if (oldProps.valuesType === "array" && newProps.valuesType === "array") {
        if (oldProps.values.length !== newProps.values.length) {
            return false;
        }

        for (let i = 0; i < oldProps.values.length; i++) {
            if (oldProps.values[i] !== newProps.values[i]) {
                return false;
            }
        }

        return true;
    }

    if (oldProps.valuesType === "map" && newProps.valuesType === "map") {
        if (oldProps.values.size !== newProps.values.size) {
            return false;
        }

        const oldMapIterator = oldProps.values.entries();
        let next = oldMapIterator.next();
        while (!next.done) {
            const [key, oldValue] = next.value;
            if (newProps.values.get(key) !== oldValue) {
                return false;
            }
            next = oldMapIterator.next();
        }

        return true;
    }

    if (oldProps.valuesType === "record-string" || oldProps.valuesType === "record-number") {
        // We know newProps.values should also be a record here.
        if (countObjectKeys(oldProps.values) !== countObjectKeys(newProps.values)) {
            return false;
        }

        for (const key in oldProps.values) {
            if (oldProps.values[key] !== newProps.values[key]) {
                return false;
            }
        }

        return true;
    }

    return true;
};

type TMenuItemsProps = { hideMenu: () => void; existingProps: TDropdownMenuProps };

const MenuItems = ({ hideMenu, existingProps }: TMenuItemsProps) => {
    return (
        <>
            {existingProps.valuesType === "record-number" ||
            existingProps.valuesType === "record-string"
                ? Object.entries(existingProps.values).map(([key, label]: [string, string]) => (
                      <Menu.Item
                          style={
                              existingProps.value === label
                                  ? menuItemStyle.selectedItemStyle
                                  : menuItemStyle.itemStyle
                          }
                          onPress={() => {
                              if (existingProps.valuesType === "record-number") {
                                  // in JavaScript, all keys of objects are strings
                                  // need to convert it to a number if the caller is expecting
                                  // numeric keys
                                  existingProps.onKeyChange(Number(key));
                              } else {
                                  existingProps.onKeyChange(key);
                              }
                              hideMenu();
                          }}
                          key={key}
                          title={label}
                      />
                  ))
                : existingProps.valuesType === "array"
                ? existingProps.values.map((label, index) => (
                      <Menu.Item
                          style={
                              existingProps.value === label
                                  ? menuItemStyle.selectedItemStyle
                                  : menuItemStyle.itemStyle
                          }
                          onPress={() => {
                              existingProps.onKeyChange(index);
                              hideMenu();
                          }}
                          key={label}
                          title={label}
                      />
                  ))
                : convertMapToMenuItems(existingProps, hideMenu)}
        </>
    );
};

/**
 * A replacement lookalike for exposed dropdown menus from Material Design.
 *
 * Exposed dropdown menus display the currently selected menu item above the menu. They can be used
 * only when a single menu item can be chosen at a time.
 *
 * ## Usage
 *
 * Menu items are either records (`valueType === "record-string"` for string keys;
 * `valueTypes === "record-number"` for numeric keys), string arrays (`valueType === "array"`), or
 * maps (`valueType === "map"`).
 *
 * @see https://material.io/components/menus#exposed-dropdown-menu
 * @see TDropdownMenuProps.onKeyChange
 */
const ExposedDropdownMenu = (props: TDropdownMenuProps) => {
    const [isOpen, setIsOpen] = useState(false);

    // useRef instead of useState to avoid unnecessary re-renders
    const width = useRef<number>(288.727);
    const height = useRef<number>(56);

    const anchorWidth = useRef<number>(0);

    const styles = useStyles(anchorWidth.current);

    const openMenu = () => {
        Keyboard.dismiss();
        setIsOpen(true);
    };
    const hideMenu = () => setIsOpen(false);
    const onDismiss = () => {
        hideMenu();
        props.onDismiss();
    };

    return (
        <TouchableOpacity
            onLayout={(e) => (anchorWidth.current = e.nativeEvent.layout.width)}
            disabled={props.disabled}
            activeOpacity={1}
            onPress={openMenu}
        >
            <Menu
                visible={isOpen}
                contentStyle={styles.menuContentStyle}
                onDismiss={onDismiss}
                anchor={
                    <TextInput
                        {...props}
                        onLayout={(event) => {
                            width.current = event.nativeEvent.layout.width;
                            height.current = event.nativeEvent.layout.height;
                        }}
                        editable={false}
                        right={
                            <TextInput.Icon
                                hitSlop={{
                                    top: height.current / 2,
                                    left: width.current,
                                    bottom: height.current / 2,
                                    right: 10,
                                }}
                                disabled={props.disabled}
                                onPress={openMenu}
                                icon={!isOpen ? "chevron-down" : "chevron-up"}
                            />
                        }
                    />
                }
            >
                <MenuItems hideMenu={hideMenu} existingProps={props} />
            </Menu>
        </TouchableOpacity>
    );
};

export default ExposedDropdownMenu;
