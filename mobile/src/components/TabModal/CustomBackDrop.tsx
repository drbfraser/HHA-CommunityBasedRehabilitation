import { useBottomSheet } from "@gorhom/bottom-sheet";
import { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import React, { memo, useCallback, useMemo, useRef } from "react";
import { TapGestureHandler, TapGestureHandlerGestureEvent } from "react-native-gesture-handler";
import Animated, {
    Extrapolate,
    interpolate,
    runOnJS,
    useAnimatedGestureHandler,
    useAnimatedReaction,
    useAnimatedStyle,
} from "react-native-reanimated";
import useStyles from "./TabModal.styles";

// Revised from source Code
const BottomSheetBackdropComponent = ({
    animatedIndex,
    opacity = 0.6,
    appearsOnIndex = 0,
    disappearsOnIndex = -1,
    enableTouchThrough = false,
    pressBehavior = "close" as const,
    style,
    children,
}: BottomSheetDefaultBackdropProps) => {
    //#region hooks
    const { snapToIndex, close } = useBottomSheet();
    const styles = useStyles();

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
        [handleOnPress],
    );
    //#endregion

    //#region styles
    const containerAnimatedStyle = useAnimatedStyle(() => ({
        opacity: interpolate(
            animatedIndex.value,
            [-1, disappearsOnIndex, appearsOnIndex],
            [0, 0, opacity],
            Extrapolate.CLAMP,
        ),
        flex: 1,
    }));
    const containerStyle = useMemo(
        () => [styles.container, style, containerAnimatedStyle],
        [style, containerAnimatedStyle],
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
        [disappearsOnIndex],
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

const CustomBackdrop = memo(BottomSheetBackdropComponent);

export default CustomBackdrop;
