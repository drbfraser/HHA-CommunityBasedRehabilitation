import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useIsFocused } from "@react-navigation/core";

export const stackModal = () => {
    const isFocused = useIsFocused();
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    // variables
    const snapPoints = useMemo(() => ["25%", "50%"], []);

    useEffect(() => {
        console.log(`isFocused is ${isFocused}`);
        if (isFocused) {
            bottomSheetModalRef.current?.present();
        }
    }, [isFocused]);

    const handleSheetChanges = useCallback((index: number) => {
        console.log("handleSheetChanges", index);
    }, []);

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
