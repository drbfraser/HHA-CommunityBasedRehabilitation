import { themeColors } from "@cbr/common";
import * as ImagePicker from "expo-image-picker";
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { Platform, View, Text, Animated, Dimensions } from "react-native";
import { ActivityIndicator, Button, Modal, Portal, Title } from "react-native-paper";
import { TFormikComponentProps } from "../../util/formikUtil";
import useStyles from "./FormikImageModal.styles";

interface IFormikImageModal<Field extends string> extends TFormikComponentProps<Field> {
    visible: boolean;
    onDismiss: () => void;
}

enum ImageSource {
    CAMERA = "Camera",
    GALLERY = "Gallery",
}

const ANIMATION_TIMING = 400;

const FormikImageModal = (props: IFormikImageModal<string>) => {
    const styles = useStyles();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [modalVisible, setModalVisible] = useState<boolean>(props.visible);

    const modalY = useRef(new Animated.Value(Dimensions.get("screen").height));

    useEffect(() => {
        setModalVisible(props.visible);
    }, [props.visible]);

    useEffect(() => {
        if (modalVisible) {
            openAnimation.start();
        } else {
            openAnimation.reset();
        }
    }, [modalVisible]);

    const openAnimation = Animated.timing(modalY.current, {
        toValue: 0,
        duration: ANIMATION_TIMING,
        useNativeDriver: false,
    });

    const modalAnimationStyle = {
        transform: [{ translateY: modalY.current }],
    };

    const pickImage = async (imageSource: ImageSource) => {
        setIsLoading(true);
        if (Platform.OS !== "web") {
            const { status } =
                imageSource === ImageSource.CAMERA
                    ? await ImagePicker.requestCameraPermissionsAsync()
                    : await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") {
                alert(`Permissions are required to access the ${imageSource}.`);
            } else {
                const imagePicker =
                    imageSource === ImageSource.CAMERA
                        ? ImagePicker.launchCameraAsync
                        : ImagePicker.launchImageLibraryAsync;
                const image = await imagePicker({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 1,
                });

                if (!image.cancelled) {
                    props.formikProps.setFieldTouched(props.field, true);
                    props.formikProps.setFieldValue(props.field, image.uri);
                }
            }
            props.onDismiss();
        }
        setIsLoading(false);
    };

    const handleDismiss = () => {
        props.onDismiss();
    };

    return (
        <Portal>
            <Modal
                style={isLoading ? null : styles.modalView}
                onDismiss={handleDismiss}
                visible={modalVisible}
            >
                {isLoading ? (
                    <ActivityIndicator color={themeColors.yellow} />
                ) : (
                    <View style={styles.container}>
                        <Animated.View style={[styles.content, modalAnimationStyle]}>
                            <Title>Choose an Image from</Title>
                            <View style={styles.buttonView}>
                                <Button
                                    labelStyle={styles.button}
                                    icon="image"
                                    onPress={() => pickImage(ImageSource.GALLERY)}
                                >
                                    {ImageSource.GALLERY}
                                </Button>
                                <Button
                                    labelStyle={styles.button}
                                    icon="camera"
                                    onPress={() => pickImage(ImageSource.CAMERA)}
                                >
                                    {ImageSource.CAMERA}
                                </Button>
                            </View>
                        </Animated.View>
                    </View>
                )}
            </Modal>
        </Portal>
    );
};

export default FormikImageModal;
