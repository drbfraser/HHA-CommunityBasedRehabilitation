import React, { useState } from "react";
import { TextInput, Portal, Modal, Text, Button } from "react-native-paper";
import TextCheckBox from "../TextCheckBox/TextCheckBox";

const ModalForm = (props: {
    title: string;
    checkboxLabels?: string[];
    hasFreeFormText: boolean;
}) => {
    const { title, checkboxLabels } = props;

    const [visible, setVisible] = useState(false);
    const [checkedItems, setCheckedItems] = useState(
        checkboxLabels?.reduce((acc, label) => ({ ...acc, [label]: false }), {}) ?? {}
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
                    {props.checkboxLabels?.map((label, index) => (
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
                    {props.hasFreeFormText && <TextInput mode="outlined" />}
                </Modal>
            </Portal>
            <Button onPress={() => setVisible(true)}>Show Modal</Button>
        </>
    );
};

export default ModalForm;
