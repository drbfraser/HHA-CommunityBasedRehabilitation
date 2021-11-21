import React, { useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { View } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { AppStackNavProp } from "../../util/stackScreens";
import CustomBackdrop from "./CustomBackDrop";
import useStyles from "./TabModal.styles";
import { useIsFocused } from "@react-navigation/core";

interface StackModal {
    visible: boolean;
    onModalDimss: (newVisibility: boolean) => void;
    navigation: AppStackNavProp;
    children: React.ReactNode;
}

export const TabModal = (props: StackModal) => {
    //chooses how high the modal can go using snapPoints
    const snapPoints = useMemo(() => ["15%"], []);
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const styles = useStyles();
    const isFocused = useIsFocused();

    const handleSheetChanges = useCallback((index: number) => {
        if (index == -1) {
            props.onModalDimss(false);
        }
    }, []);

    useEffect(() => {
        if (!isFocused) {
            console.log("Modal not in focus");
            bottomSheetModalRef.current?.dismiss();
        }
    }, [isFocused]);

    useEffect(() => {
        if (props.visible) {
            bottomSheetModalRef.current?.present();
        }
    }, [props.visible]);

    return (
        <BottomSheetModal
            ref={bottomSheetModalRef}
            index={0}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
            backdropComponent={CustomBackdrop}
        >
            <View style={styles.contentContainer}>{props.children}</View>
        </BottomSheetModal>
    );
};
