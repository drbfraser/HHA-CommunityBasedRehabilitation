import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

interface StackModal {
    visible: boolean;
    onModalDimss: (newVisibility: boolean) => void;
}

export const SyncStackModal = (props: StackModal) => {
    // variables
    const snapPoints = useMemo(() => ["25%", "50%"], []);
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const [modalVisible, setModalVisible] = useState<boolean>(props.visible);

    const handleSheetChanges = useCallback((index: number) => {
        console.log("handleSheetChanges", index);
        if (index == -1) {
            console.log("dismissing");
            props.onModalDimss(false);
        }
    }, []);

    useEffect(() => {
        if (props.visible) {
            bottomSheetModalRef.current?.present();
        }
    });

    return (
        <BottomSheetModal
            ref={bottomSheetModalRef}
            index={1}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
        >
            <View style={styles.contentContainer}>
                <Text>Placeholder to put sync button and/or alert navigation</Text>
            </View>
        </BottomSheetModal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: "center",
        backgroundColor: "grey",
    },
    contentContainer: {
        flex: 1,
        alignItems: "center",
    },
});
