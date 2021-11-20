import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { View, StyleSheet } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Button } from "react-native-paper";
import { AppStackNavProp } from "../../util/stackScreens";
import { StackScreenName } from "../../util/StackScreenName";
import CustomBackdrop from "./CustomBackDrop";
import useStyles from "./SyncModal.styles";

interface StackModal {
    visible: boolean;
    onModalDimss: (newVisibility: boolean) => void;
    navigation: AppStackNavProp;
}

export const SyncStackModal = (props: StackModal) => {
    // variables
    const snapPoints = useMemo(() => ["25%", "50%"], []);
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const styles = useStyles();

    const handleSheetChanges = useCallback((index: number) => {
        if (index == -1) {
            console.log("dismissing");
            props.onModalDimss(false);
        }
    }, []);

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
            <View style={styles.contentContainer}>
                <Button
                    mode="contained"
                    style={styles.buttonContainer}
                    onPress={() => {
                        bottomSheetModalRef.current?.dismiss();
                        props.navigation.navigate(StackScreenName.SYNC);
                    }}
                >
                    Sync
                </Button>
                <Button
                    mode="contained"
                    style={styles.buttonContainer}
                    onPress={() => {
                        bottomSheetModalRef.current?.dismiss();
                        props.navigation.navigate(StackScreenName.SYNC);
                    }}
                >
                    Alert
                </Button>
            </View>
        </BottomSheetModal>
    );
};
