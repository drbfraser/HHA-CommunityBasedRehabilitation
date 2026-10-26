import { themeColors } from "@cbr/common";
import * as ImagePicker from "expo-image-picker";
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { Platform, View, Text, Animated, Dimensions } from "react-native";
import { ActivityIndicator, Button, Modal, Portal, Title } from "react-native-paper";
import { TFormikComponentProps } from "../../util/formikUtil";
import useStyles from "./FormikImageModal.styles";
import { useTranslation } from "react-i18next";
import { ensureCameraPermission, showImageError } from "../../util/cameraPermission";
import { RECORD_PHOTO_SIZE, resizePhotoToDataUrl } from "../../util/resizePhoto";

interface IFormikImageModal<Field extends string> extends TFormikComponentProps<Field> {
    visible: boolean;
    onDismiss: () => void;
    onPictureChange: (newPictureURL: string) => void;
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
    const { t } = useTranslation();

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
        if (Platform.OS === "web") {
            return;
        }
        setIsLoading(true);
        try {
            // The gallery uses the Android Photo Picker / iOS limited picker, which need
            // no media-library permission. Only the camera path requires a permission.
            if (imageSource === ImageSource.CAMERA && !(await ensureCameraPermission())) {
                return;
            }
            const imagePicker =
                imageSource === ImageSource.CAMERA
                    ? ImagePicker.launchCameraAsync
                    : ImagePicker.launchImageLibraryAsync;
            // Full quality here: the photo is compressed once, when it is resized.
            const image = await imagePicker({
                mediaTypes: "images",
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });

            if (image && !image.canceled) {
                const uri = await resizePhotoToDataUrl(image.assets[0], RECORD_PHOTO_SIZE);

                props.onPictureChange(uri);
                props.formikProps.setFieldTouched(props.field, true);
                props.formikProps.setFieldValue(props.field, uri);
            }
        } catch (error) {
            showImageError(error);
        } finally {
            props.onDismiss();
            setIsLoading(false);
        }
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
                            <Title>{t("clientFields.chooseImageFrom")}</Title>
                            <View style={styles.buttonView}>
                                <Button
                                    labelStyle={styles.button}
                                    icon="image"
                                    onPress={() => pickImage(ImageSource.GALLERY)}
                                >
                                    {t("clientFields.gallery")}
                                </Button>
                                <Button
                                    labelStyle={styles.button}
                                    icon="camera"
                                    onPress={() => pickImage(ImageSource.CAMERA)}
                                >
                                    {t("clientFields.camera")}
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
