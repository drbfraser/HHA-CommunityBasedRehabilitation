import React, { memo, useRef, useState } from "react";
import { Keyboard, StyleSheet, TouchableOpacity, View } from "react-native";
import { Menu, TextInput } from "react-native-paper";
import { TextInputProps } from "react-native-paper/lib/typescript/components/TextInput/TextInput";
import useStyles from "./ExposedDropdownMenu.styles";

interface IBaseDropdownMenuProps extends Omit<TextInputProps, "theme" | "editable"> {}

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
     * @param key The key as given by the `values` prop, as a string.
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
     * @param key The key as given by the `values` prop, as a number.
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
     * @param key The key as given by the `values` prop, represented as an index in the array.
     */
    onKeyChange: (key: number) => void;
}

interface IMapDropdownMenu extends IBaseDropdownMenuProps {
    valuesType: "map";
    /**
     * A {@link ReadonlyMap} that maps keys to labels. {@link onKeyChange} will be invoked with the
     * key (coerced to a string)
     */
    values: ReadonlyMap<any, string>;
    /**
     * A callback that is invoked with the current key when the current picker selection changes.
     *
     * @param key The key as given by the `values` prop.
     */
    onKeyChange: (key: any) => void;
}

export type Props =
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
});

const convertMapToMenuItems = (props: Props, hideMenu: () => void): Array<React.ReactNode> => {
    // for TypeScript smart casting
    if (props.valuesType !== "map") {
        return [];
    }

    const map = props.values;
    const menuItems = new Array<JSX.Element>(map.size);

    const iterator = map.entries();
    let next = iterator.next();
    let index = 0;
    while (!next.done) {
        const [key, label] = next.value;

        menuItems[index] = (
            <Menu.Item
                style={menuItemStyle.itemStyle}
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

const areMenuItemsPropsEqual = (
    prevProps: Readonly<MenuItemsProps>,
    newProps: Readonly<MenuItemsProps>
): boolean => {
    return (
        prevProps.existingProps.valuesType === newProps.existingProps.valuesType &&
        prevProps.existingProps.values === newProps.existingProps.values &&
        prevProps.existingProps.onKeyChange === newProps.existingProps.onKeyChange
    );
};

type MenuItemsProps = { hideMenu: () => void; existingProps: Props };

const MenuItems = ({ hideMenu, existingProps }: MenuItemsProps) => {
    return (
        <>
            {existingProps.valuesType === "record-number" ||
            existingProps.valuesType === "record-string"
                ? Object.entries(existingProps.values).map(([key, label]: [string, string]) => (
                      <Menu.Item
                          style={menuItemStyle.itemStyle}
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
                ? existingProps.values.map((value, index) => (
                      <Menu.Item
                          style={menuItemStyle.itemStyle}
                          onPress={() => {
                              existingProps.onKeyChange(index);
                              hideMenu();
                          }}
                          key={value}
                          title={value}
                      />
                  ))
                : convertMapToMenuItems(existingProps, hideMenu)}
        </>
    );
};

const MemoizedMenuItems = memo(MenuItems, areMenuItemsPropsEqual);

/**
 * A replacement lookalike for exposed dropdown menus from Material Design.
 *
 * Exposed dropdown menus display the currently selected menu item above the menu. They can be used
 * only when a single menu item can be chosen at a time.
 *
 * ## Usage
 *
 * Menu items are either records (`valueTypes === "record"`), string arrays
 * (`valueTypes === "array"`), or maps (`valueTypes === "map"`).
 *
 * @see https://material.io/components/menus#exposed-dropdown-menu
 * @see Props.onKeyChange
 */
const ExposedDropdownMenu = (props: Props) => {
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

    return (
        <TouchableOpacity
            onLayout={(e) => (anchorWidth.current = e.nativeEvent.layout.width)}
            disabled={props.disabled}
            activeOpacity={1}
            onPress={openMenu}
        >
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
                        name={!isOpen ? "chevron-down" : "chevron-up"}
                    />
                }
            />

            {/* Use a nearly invisible anchor to get the menu anchored below the TextInput. */}
            <Menu
                visible={isOpen}
                contentStyle={styles.menuContentStyle}
                onDismiss={() => setIsOpen(false)}
                anchor={<View style={styles.invisibleAnchor} />}
            >
                <MemoizedMenuItems hideMenu={hideMenu} existingProps={props} />
            </Menu>
        </TouchableOpacity>
    );
};

export default ExposedDropdownMenu;
