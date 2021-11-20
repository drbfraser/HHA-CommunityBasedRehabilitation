import React, { useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { View } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Button } from "react-native-paper";
import { AppStackNavProp } from "../../util/stackScreens";
import { StackScreenName } from "../../util/StackScreenName";
import CustomBackdrop from "./CustomBackDrop";
import useStyles from "./SyncModal.styles";
import { Icon, withBadge } from "react-native-elements";
import { SyncContext } from "../../context/SyncContext/SyncContext";
import { SyncModalIcon } from "./ModalIcon";

interface StackModal {
    visible: boolean;
    onModalDimss: (newVisibility: boolean) => void;
    navigation: AppStackNavProp;
}

const SyncIcon = () => {
    const syncAlert = useContext(SyncContext);
    const BadgedIcon = withBadge("")(Icon);
    if (syncAlert.unSyncedChanges) {
        return <BadgedIcon type="material-community" name={SyncModalIcon.syncIcon} color="white" />;
    }
    return <Icon type="material-community" name={SyncModalIcon.syncIcon} color="white" />;
};

export const SyncStackModal = (props: StackModal) => {
    //chooses how high the modal can go using snapPoints
    const snapPoints = useMemo(() => ["15%"], []);
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const styles = useStyles();

    const handleSheetChanges = useCallback((index: number) => {
        if (index == -1) {
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
                    icon={SyncIcon}
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
                    icon={SyncModalIcon.alert}
                    style={styles.buttonContainer}
                    onPress={() => {
                        bottomSheetModalRef.current?.dismiss();
                        // to add Alert Page
                    }}
                >
                    Alerts
                </Button>
            </View>
        </BottomSheetModal>
    );
};
