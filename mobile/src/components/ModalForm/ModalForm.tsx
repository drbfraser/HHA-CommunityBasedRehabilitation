import React, { useState } from "react";
import { TextInput, Portal, Modal, Text, Button } from "react-native-paper";

const ModalForm = () => {
    const [visible, setVisible] = useState(false);

    return (
        <>
            <Portal>
                <Modal
                    visible={visible}
                    onDismiss={() => setVisible(false)}
                    contentContainerStyle={{ backgroundColor: "white" }}
                >
                    <Text>inside my modal</Text>
                    <TextInput mode="outlined" />
                </Modal>
            </Portal>
            <Button onPress={() => setVisible(true)}>Show Modal</Button>
        </>
    );
};

export default ModalForm;
