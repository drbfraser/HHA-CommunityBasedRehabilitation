import React, { useEffect, useState } from "react";
import { Image, LayoutChangeEvent, Modal, StatusBar, StyleSheet, Text, View } from "react-native";
import { IconButton } from "react-native-paper";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated";

interface IProps {
    visible: boolean;
    /** Image URIs (data: URLs or file/http URIs). */
    images: string[];
    initialIndex?: number;
    onClose: () => void;
}

const MAX_SCALE = 5;
const DOUBLE_TAP_SCALE = 2.5;
const SWIPE_DISTANCE_FRACTION = 0.2;
const SWIPE_VELOCITY = 800;

const clamp = (value: number, min: number, max: number) => {
    "worklet";
    return Math.min(Math.max(value, min), max);
};

interface IZoomableImageProps {
    uri: string;
    /** Called with -1 / +1 when the user swipes to the previous / next image (only when not zoomed). */
    onSwipe?: (direction: -1 | 1) => void;
}

/**
 * Pinch to zoom (around the fingers), drag to pan when zoomed, double-tap to zoom in or reset.
 * When not zoomed, a horizontal swipe calls onSwipe.
 */
const ZoomableImage = ({ uri, onSwipe }: IZoomableImageProps) => {
    // Size of the viewing area, and of the image as displayed when not zoomed ("contain").
    const boxWidth = useSharedValue(0);
    const boxHeight = useSharedValue(0);
    const imageWidth = useSharedValue(0);
    const imageHeight = useSharedValue(0);
    const [naturalSize, setNaturalSize] = useState<{ width: number; height: number }>();

    const scale = useSharedValue(1);
    const savedScale = useSharedValue(1);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const savedTranslateX = useSharedValue(0);
    const savedTranslateY = useSharedValue(0);

    const updateDisplayedSize = (width: number, height: number) => {
        if (!naturalSize || !width || !height) {
            return;
        }
        const fit = Math.min(width / naturalSize.width, height / naturalSize.height);
        imageWidth.value = naturalSize.width * fit;
        imageHeight.value = naturalSize.height * fit;
    };

    useEffect(() => {
        updateDisplayedSize(boxWidth.value, boxHeight.value);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [naturalSize]);

    const onLayout = (event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;
        boxWidth.value = width;
        boxHeight.value = height;
        updateDisplayedSize(width, height);
    };

    // Largest translation that keeps the zoomed image covering the viewing area where it can.
    const maxTranslateX = (s: number) => {
        "worklet";
        return Math.max(0, (imageWidth.value * s - boxWidth.value) / 2);
    };
    const maxTranslateY = (s: number) => {
        "worklet";
        return Math.max(0, (imageHeight.value * s - boxHeight.value) / 2);
    };

    const settle = () => {
        "worklet";
        if (scale.value <= 1) {
            scale.value = withTiming(1);
            translateX.value = withTiming(0);
            translateY.value = withTiming(0);
            return;
        }
        translateX.value = withSpring(
            clamp(translateX.value, -maxTranslateX(scale.value), maxTranslateX(scale.value)),
            { overshootClamping: true }
        );
        translateY.value = withSpring(
            clamp(translateY.value, -maxTranslateY(scale.value), maxTranslateY(scale.value)),
            { overshootClamping: true }
        );
    };

    // Origin of a touch point relative to the centre of the viewing area.
    const originX = useSharedValue(0);
    const originY = useSharedValue(0);

    // Two fingers: zoom, keeping the image point that started between the fingers under them
    // (so moving the fingers also pans).
    const pinch = Gesture.Pinch()
        .onStart((event) => {
            savedScale.value = scale.value;
            savedTranslateX.value = translateX.value;
            savedTranslateY.value = translateY.value;
            originX.value = event.focalX - boxWidth.value / 2;
            originY.value = event.focalY - boxHeight.value / 2;
        })
        .onUpdate((event) => {
            const newScale = clamp(savedScale.value * event.scale, 0.8, MAX_SCALE);
            const ratio = newScale / savedScale.value;
            const focalX = event.focalX - boxWidth.value / 2;
            const focalY = event.focalY - boxHeight.value / 2;
            translateX.value = focalX - ratio * (originX.value - savedTranslateX.value);
            translateY.value = focalY - ratio * (originY.value - savedTranslateY.value);
            scale.value = newScale;
        })
        .onEnd(() => {
            settle();
        });

    // One finger: pan when zoomed, otherwise swipe between images. Two-finger movement is left
    // to the pinch, so the two gestures never both move the image.
    const pan = Gesture.Pan()
        .maxPointers(1)
        .onStart(() => {
            savedTranslateX.value = translateX.value;
            savedTranslateY.value = translateY.value;
        })
        .onUpdate((event) => {
            if (scale.value > 1) {
                translateX.value = savedTranslateX.value + event.translationX;
                translateY.value = savedTranslateY.value + event.translationY;
            } else if (onSwipe) {
                // Not zoomed: follow the finger horizontally as feedback for swiping.
                translateX.value = event.translationX;
            }
        })
        .onEnd((event) => {
            if (scale.value <= 1 && onSwipe) {
                const swiped =
                    Math.abs(event.translationX) > boxWidth.value * SWIPE_DISTANCE_FRACTION ||
                    Math.abs(event.velocityX) > SWIPE_VELOCITY;
                if (swiped) {
                    runOnJS(onSwipe)(event.translationX < 0 ? 1 : -1);
                }
            }
            settle();
        });

    const doubleTap = Gesture.Tap()
        .numberOfTaps(2)
        .onEnd((event) => {
            if (scale.value > 1) {
                scale.value = withTiming(1);
                translateX.value = withTiming(0);
                translateY.value = withTiming(0);
                return;
            }
            const tapX = event.x - boxWidth.value / 2;
            const tapY = event.y - boxHeight.value / 2;
            scale.value = withTiming(DOUBLE_TAP_SCALE);
            translateX.value = withTiming(
                clamp(
                    tapX * (1 - DOUBLE_TAP_SCALE),
                    -maxTranslateX(DOUBLE_TAP_SCALE),
                    maxTranslateX(DOUBLE_TAP_SCALE)
                )
            );
            translateY.value = withTiming(
                clamp(
                    tapY * (1 - DOUBLE_TAP_SCALE),
                    -maxTranslateY(DOUBLE_TAP_SCALE),
                    maxTranslateY(DOUBLE_TAP_SCALE)
                )
            );
        });

    const gesture = Gesture.Race(doubleTap, Gesture.Simultaneous(pinch, pan));

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { scale: scale.value },
        ],
    }));

    return (
        <GestureDetector gesture={gesture}>
            <View style={styles.imageArea} onLayout={onLayout} collapsable={false}>
                <Animated.View style={[styles.fill, animatedStyle]}>
                    <Image
                        source={{ uri }}
                        style={styles.fill}
                        resizeMode="contain"
                        onLoad={(event) => {
                            const { width, height } = event.nativeEvent.source;
                            setNaturalSize({ width, height });
                        }}
                    />
                </Animated.View>
            </View>
        </GestureDetector>
    );
};

/**
 * Full-screen image viewer: pinch to zoom, drag to pan, double-tap to zoom in/out, and swipe (or
 * the arrow buttons) between several images. Android's back button closes it.
 */
const ImageViewer = ({ visible, images, initialIndex = 0, onClose }: IProps) => {
    const [index, setIndex] = useState(initialIndex);
    const hasMany = images.length > 1;

    useEffect(() => {
        if (visible) {
            setIndex(initialIndex);
        }
    }, [visible, initialIndex]);

    const step = (direction: -1 | 1) =>
        setIndex((i) => (i + direction + images.length) % images.length);

    const uri = images[Math.min(index, images.length - 1)];

    return (
        <Modal
            visible={visible && Boolean(uri)}
            animationType="fade"
            onRequestClose={onClose}
            statusBarTranslucent
            transparent={false}
        >
            {/* A Modal is its own window on Android, so it needs its own gesture root. */}
            <GestureHandlerRootView style={styles.container}>
                {uri ? (
                    // key: start each image unzoomed
                    <ZoomableImage key={index} uri={uri} onSwipe={hasMany ? step : undefined} />
                ) : null}
                {/* The status bar takes touches in its area, so keep the close button below it.
                    (Not useSafeAreaInsets: under a navigation header it reports a top inset of 0.) */}
                <View style={[styles.header, { top: (StatusBar.currentHeight ?? 24) + 4 }]}>
                    <Text style={styles.counter}>
                        {hasMany ? `${index + 1} / ${images.length}` : ""}
                    </Text>
                    <IconButton
                        icon="close"
                        iconColor="#fff"
                        size={28}
                        onPress={onClose}
                        accessibilityLabel="Close"
                    />
                </View>
                {hasMany && (
                    <>
                        <IconButton
                            icon="chevron-left"
                            iconColor="#fff"
                            size={36}
                            style={[styles.arrow, styles.arrowLeft]}
                            onPress={() => step(-1)}
                            accessibilityLabel="Previous image"
                        />
                        <IconButton
                            icon="chevron-right"
                            iconColor="#fff"
                            size={36}
                            style={[styles.arrow, styles.arrowRight]}
                            onPress={() => step(1)}
                            accessibilityLabel="Next image"
                        />
                    </>
                )}
            </GestureHandlerRootView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
    imageArea: {
        flex: 1,
        overflow: "hidden",
    },
    fill: {
        width: "100%",
        height: "100%",
    },
    header: {
        position: "absolute",
        left: 0,
        right: 0,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingLeft: 16,
    },
    counter: {
        color: "#fff",
        fontSize: 16,
    },
    arrow: {
        position: "absolute",
        top: "50%",
        marginTop: -30,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
    },
    arrowLeft: {
        left: 4,
    },
    arrowRight: {
        right: 4,
    },
});

export default ImageViewer;
