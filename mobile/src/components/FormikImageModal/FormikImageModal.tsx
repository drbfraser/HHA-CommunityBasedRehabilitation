import { themeColors } from "@cbr/common";
import * as ImagePicker from "expo-image-picker";
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { Platform, View, Text, Animated, Dimensions } from "react-native";
import { ActivityIndicator, Button, Modal, Portal, Title } from "react-native-paper";
import { TFormikComponentProps } from "../../util/formikUtil";
import useStyles from "./FormikImageModal.styles";
import * as FileSystem from "expo-file-system";
import { manipulateAsync, FlipType, SaveFormat } from "expo-image-manipulator";
import { useTranslation } from "react-i18next";

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

const MAX_FILE_SIZE = 500000;

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

    const getFileInfo = async (fileURI: string) => {
        const fileInfo = await FileSystem.getInfoAsync(fileURI);
        return fileInfo;
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
                    base64: true,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 0.7,
                });

                if (!image.canceled) {
                    const fileInfo = await getFileInfo(image.assets[0].uri);
                    let uri;
                    if (fileInfo.exists && fileInfo.size && fileInfo.size >= MAX_FILE_SIZE) {
                        const resizedUri = await manipulateAsync(
                            `data:image/jpeg;base64,${image.assets[0].base64}`,
                            [{ resize: { width: 300 } }],
                            {
                                compress: 0.7,
                                base64: true,
                            },
                        );
                        uri = `data:image/jpeg;base64,${resizedUri.base64}`;
                    } else {
                        uri = `data:image/jpeg;base64,${image.assets[0].base64}`;
                    }

                    props.onPictureChange(uri);
                    props.formikProps.setFieldTouched(props.field, true);
                    props.formikProps.setFieldValue(props.field, uri);
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
