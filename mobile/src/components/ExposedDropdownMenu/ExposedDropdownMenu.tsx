import React, { memo, useRef, useState } from "react";
import { Keyboard, TouchableOpacity, View } from "react-native";
import { Menu, TextInput } from "react-native-paper";
import { TextInputProps } from "react-native-paper/lib/typescript/components/TextInput/TextInput";
import useStyles from "./ExposedDropdownMenu.styles";

interface BaseDropdownMenuProps extends Omit<TextInputProps, "theme" | "editable"> {
    valuesType: "record" | "array" | "map";
    /**
     * A callback that is invoked when the current picker selection changes.
     *
     * If {@link valuesType} is `array`, the index of the selected string
     * element in the `values` array will be used.
     *
     * If {@link valuesType} is `record` or `map`, the key of the selected element will be used
     * (and coerced to a string if the key is an integer).
     *
     * @param key
     */
    onKeyChange: (key: string) => void;
}

interface RecordDropdownMenu extends BaseDropdownMenuProps {
    valuesType: "record";
    /**
     * A {@link Record} that maps keys to labels. {@link onKeyChange} will be invoked with the key
     * (coerced to a string)
     */
    values: Record<React.Key, string>;
}

interface ArrayDropdownMenu extends BaseDropdownMenuProps {
    valuesType: "array";
    /**
     * An {@link Array} containing labels. {@link onKeyChange} will be invoked with the index of
     * the element that is selected from this array (coerced to a string).
     */
    values: Array<string>;
}

interface MapDropdownMenu extends BaseDropdownMenuProps {
    valuesType: "map";
    /**
     * A {@link ReadonlyMap} that maps keys to labels. {@link onKeyChange} will be invoked with the
     * key (coerced to a string)
     */
    values: ReadonlyMap<React.Key, string>;
}

export type Props = RecordDropdownMenu | ArrayDropdownMenu | MapDropdownMenu;

function convertMapToMenuItems(props: Props, hideMenu: () => void) {
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
                onPress={() => {
                    props.onKeyChange(typeof key === "string" ? key : `${key}`);
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
}

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
            {existingProps.valuesType === "record"
                ? Object.entries(existingProps.values).map(([key, label]: [string, string]) => (
                      <Menu.Item
                          onPress={() => {
                              existingProps.onKeyChange(key);
                              hideMenu();
                          }}
                          key={key}
                          title={label}
                      />
                  ))
                : existingProps.valuesType === "array"
                ? existingProps.values.map((value, index) => (
                      <Menu.Item
                          onPress={() => {
                              existingProps.onKeyChange(`${index}`);
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
    const width = useRef<number>(100);
    const iconWidth = useRef<number>(10);

    const styles = useStyles(width.current + iconWidth.current);

    const openMenu = () => {
        Keyboard.dismiss();
        setIsOpen(true);
    };
    const hideMenu = () => setIsOpen(false);

    return (
        <TouchableOpacity disabled={props.disabled} activeOpacity={1} onPress={openMenu}>
            <TextInput
                {...props}
                onLayout={(event) => (width.current = event.nativeEvent.layout.width)}
                onTouchStart={openMenu}
                editable={false}
                right={
                    <TextInput.Icon
                        onLayout={(event) => (iconWidth.current = event.nativeEvent.layout.width)}
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
