import React, { FC, useState } from "react";
import { Pressable } from "react-native";
import { TextInput, Portal, Modal, Text, Divider } from "react-native-paper";
import TextCheckBox from "../TextCheckBox/TextCheckBox";
import useStyles from "./ModalForm.styles";

interface IProps {
    title: string;
    checkboxLabels?: string[];
    hasFreeFormText?: boolean;
}

const ModalForm: FC<IProps> = ({ title, checkboxLabels = [], hasFreeFormText = false }) => {
    const styles = useStyles();
    const [visible, setVisible] = useState(false);
    const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>(
        checkboxLabels.reduce((acc, label) => ({ ...acc, [label]: false }), {}) ?? {}
    );

    return (
        <>
            <Portal>
                <Modal
                    visible={visible}
                    onDismiss={() => setVisible(false)}
                    contentContainerStyle={styles.modal}
                >
                    <Text>{title}</Text>
                    <Divider />
                    {checkboxLabels.map((label, index) => (
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
                    {hasFreeFormText && <TextInput mode="outlined" label="Other" />}
                </Modal>
            </Portal>

            <TextInput
                editable={false}
                mode="outlined"
                label="show modal"
                render={() => <Pressable onPress={() => setVisible(true)} style={styles.button} />}
            />
        </>
    );
};

export default ModalForm;
