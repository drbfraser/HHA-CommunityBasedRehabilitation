import React, { FC, useState } from "react";
import { TextInput, Portal, Modal, Text, Button } from "react-native-paper";
import TextCheckBox from "../TextCheckBox/TextCheckBox";

interface IProps {
    title: string;
    checkboxLabels?: string[];
    hasFreeFormText?: boolean;
}

const ModalForm: FC<IProps> = ({ title, checkboxLabels = [], hasFreeFormText = false }) => {
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
                    contentContainerStyle={{ backgroundColor: "white" }}
                >
                    <Text>{title}</Text>
                    {checkboxLabels.map((label, index) => (
                        <TextCheckBox
                            key={index}
                            field={label}
                            value={checkedItems[label]}
                            label={label}
                            setFieldValue={() => null}
                            onChange={(checked) =>
                                setCheckedItems({ ...checkedItems, [label]: checked })
                            }
                        />
                    ))}
                    {hasFreeFormText && <TextInput mode="outlined" />}
                </Modal>
            </Portal>
            <Button onPress={() => setVisible(true)}>Show Modal</Button>
        </>
    );
};

export default ModalForm;
