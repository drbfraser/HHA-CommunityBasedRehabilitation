import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { BottomSheetModal, useBottomSheet } from "@gorhom/bottom-sheet";
import { Button } from "react-native-paper";
import { AppStackNavProp } from "../../util/stackScreens";
import { StackScreenName } from "../../util/StackScreenName";
import bottomSheet from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheet";
import { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import Animated, {
    Extrapolate,
    interpolate,
    runOnJS,
    useAnimatedGestureHandler,
    useAnimatedReaction,
    useAnimatedStyle,
} from "react-native-reanimated";
import { TapGestureHandler, TapGestureHandlerGestureEvent } from "react-native-gesture-handler";

interface StackModal {
    visible: boolean;
    onModalDimss: (newVisibility: boolean) => void;
    navigation: AppStackNavProp;
}

// Revised from source Code
const BottomSheetBackdropComponent = ({
    animatedIndex,
    opacity = 0.5,
    appearsOnIndex = 0,
    disappearsOnIndex = -1,
    enableTouchThrough = false,
    pressBehavior = "close" as const,
    style,
    children,
}: BottomSheetDefaultBackdropProps) => {
    //#region hooks
    const { snapToIndex, close } = useBottomSheet();
    //#endregion

    //#region variables
    const containerRef = useRef<Animated.View>(null);
    const pointerEvents = enableTouchThrough ? "none" : "auto";
    //#endregion

    //#region callbacks
    const handleOnPress = useCallback(() => {
        if (pressBehavior === "close") {
            close();
        } else if (pressBehavior === "collapse") {
            snapToIndex(disappearsOnIndex as number);
        } else if (typeof pressBehavior === "number") {
            snapToIndex(pressBehavior);
        }
    }, [snapToIndex, close, disappearsOnIndex, pressBehavior]);
    const handleContainerTouchability = useCallback((shouldDisableTouchability: boolean) => {
        if (!containerRef.current) {
            return;
        }
        // @ts-ignore
        containerRef.current.setNativeProps({
            pointerEvents: shouldDisableTouchability ? "none" : "auto",
        });
    }, []);
    //#endregion

    //#region tap gesture
    const gestureHandler = useAnimatedGestureHandler<TapGestureHandlerGestureEvent>(
        {
            onFinish: () => {
                runOnJS(handleOnPress)();
            },
        },
        [handleOnPress]
    );
    //#endregion

    //#region styles
    const containerAnimatedStyle = useAnimatedStyle(() => ({
        opacity: interpolate(
            animatedIndex.value,
            [-1, disappearsOnIndex, appearsOnIndex],
            [0, 0, opacity],
            Extrapolate.CLAMP
        ),
        flex: 1,
    }));
    const containerStyle = useMemo(
        () => [styles.container, style, containerAnimatedStyle],
        [style, containerAnimatedStyle]
    );
    //#endregion

    //#region effects
    useAnimatedReaction(
        () => animatedIndex.value <= disappearsOnIndex,
        (shouldDisableTouchability, previous) => {
            if (shouldDisableTouchability === previous) {
                return;
            }
            runOnJS(handleContainerTouchability)(shouldDisableTouchability);
        },
        [disappearsOnIndex]
    );
    //#endregion

    return pressBehavior !== "none" ? (
        <TapGestureHandler onGestureEvent={gestureHandler}>
            <Animated.View
                ref={containerRef}
                style={containerStyle}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Bottom Sheet backdrop"
                accessibilityHint={`Tap to ${
                    typeof pressBehavior === "string" ? pressBehavior : "move"
                } the Bottom Sheet`}
            >
                {children}
            </Animated.View>
        </TapGestureHandler>
    ) : (
        <Animated.View ref={containerRef} pointerEvents={pointerEvents} style={containerStyle}>
            {children}
        </Animated.View>
    );
};

const BottomSheetBackdrop = memo(BottomSheetBackdropComponent);

export const SyncStackModal = (props: StackModal) => {
    // variables
    const snapPoints = useMemo(() => ["25%", "50%"], []);
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

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
            backdropComponent={BottomSheetBackdrop}
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

const styles = StyleSheet.create({
    container: {
        backgroundColor: "black",
    },
    contentContainer: {
        flex: 1,
        marginBottom: 10,
        padding: 10,
    },
    buttonContainer: {
        padding: 2,
    },
});
