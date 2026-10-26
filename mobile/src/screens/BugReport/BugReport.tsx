import React, { useMemo, useState } from "react";
import { Image, ScrollView, View } from "react-native";
import { apiFetch, themeColors, UPLOAD_FETCH_TIMEOUT_MILLIS } from "@cbr/common";
import { BUG_REPORT_IMAGE_SIZE, resizePhotoToFile } from "../../util/resizePhoto";
import { useNetInfo } from "@react-native-community/netinfo";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import {
    Button,
    Card,
    Chip,
    Divider,
    SegmentedButtons,
    Text,
    TextInput,
    Title,
} from "react-native-paper";
import Alert from "../../components/Alert/Alert";
import ConfirmDialogWithNavListener from "../../components/DiscardDialogs/ConfirmDialogWithNavListener";
import { StackScreenName } from "../../util/StackScreenName";
import { AppStackNavProp } from "../../util/stackScreens";
import { setBugReportFlashMessage } from "../../util/bugReportFlashMessage";
import useStyles from "./BugReport.styles";

const MAX_DESCRIPTION_LENGTH = 1200;
type ReportType = "bug_report" | "suggestion";
const BUG_REPORT_ENDPOINT = "bug_report/";

// The image is emailed, so it is shrunk first (a full-size photo can be several MB). If it cannot
// be resized, the original is sent and the server fits it.
const bugReportImagePart = async (image: ImagePicker.ImagePickerAsset) => {
    const baseName = (image.fileName ?? image.uri.split("/").pop() ?? "attachment").replace(
        /\.[^.]*$/,
        ""
    );
    try {
        const uri = await resizePhotoToFile(image, BUG_REPORT_IMAGE_SIZE);
        return { uri, type: "image/jpeg", name: `${baseName}.jpg` } as any;
    } catch {
        return {
            uri: image.uri,
            type: image.mimeType ?? "image/jpeg",
            name: image.fileName ?? `${baseName}.jpg`,
        } as any;
    }
};

const BugReport = () => {
    const styles = useStyles();
    const navigation = useNavigation<AppStackNavProp>();
    const netInfo = useNetInfo();
    const [reportType, setReportType] = useState<ReportType>("bug_report");
    const [description, setDescription] = useState("");
    const [attachedImage, setAttachedImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
    const [skipDiscardDialog, setSkipDiscardDialog] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const descriptionLength = useMemo(() => description.trim().length, [description]);
    const isDirty = descriptionLength > 0 || attachedImage !== null;
    const isOffline = netInfo.isConnected === false || netInfo.isInternetReachable === false;
    const submitLabel = reportType === "suggestion" ? "Submit Suggestion" : "Submit Bug Report";
    const reportTypeLabel = reportType === "suggestion" ? "suggestion" : "bug report";

    const onImageSelect = async () => {
        // The gallery uses the Android Photo Picker / iOS limited picker, which need no
        // media-library permission, so we go straight to the picker.
        const imagePickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: "images",
            allowsEditing: false,
            quality: 1,
        });

        if (!imagePickerResult || imagePickerResult.canceled) {
            return;
        }

        setAttachedImage(imagePickerResult.assets?.[0] ?? null);
        setSkipDiscardDialog(false);
        setSubmitError(null);
    };

    const onSubmit = async () => {
        if (descriptionLength === 0 || isSubmitting || isOffline) {
            return;
        }

        setIsSubmitting(true);
        setSubmitError(null);
        try {
            const payload = new FormData();
            payload.append("report_type", reportType);
            payload.append("description", description.trim());

            if (attachedImage) {
                payload.append("image", await bugReportImagePart(attachedImage));
            }

            await apiFetch(
                BUG_REPORT_ENDPOINT as any,
                "",
                { method: "POST", body: payload },
                UPLOAD_FETCH_TIMEOUT_MILLIS
            );
            const successMessage =
                reportType === "suggestion"
                    ? "Your suggestion was created successfully."
                    : "Your bug report was created successfully.";

            setBugReportFlashMessage(successMessage);
            setSkipDiscardDialog(true);
            setDescription("");
            setAttachedImage(null);
            setTimeout(() => {
                if (navigation.canGoBack()) {
                    navigation.goBack();
                } else {
                    navigation.navigate(StackScreenName.HOME);
                }
            }, 0);
        } catch (e) {
            setSubmitError("Unable to submit. Please contact your administrator.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const imageFileName =
        attachedImage?.fileName ?? attachedImage?.uri?.split("/").pop() ?? "Selected image";
    const imageSizeInKB = attachedImage?.fileSize
        ? Math.max(1, Math.round(attachedImage.fileSize / 1024))
        : 0;

    return (
        <View style={styles.screen}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.contentContainer}
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled
            >
                <View style={styles.form}>
                    {isOffline && (
                        <Alert
                            severity="error"
                            text="No internet connection. Connect to Wi-Fi or mobile data before submitting."
                        />
                    )}

                    <Alert
                        severity="info"
                        text="Submitting this form sends an email with your description and attached image. You can choose either Bug report or Suggestion."
                    />

                    <Card style={styles.card}>
                        <Card.Content style={styles.cardContent}>
                            <Title style={styles.subheading}>Type</Title>
                            <SegmentedButtons
                                value={reportType}
                                onValueChange={(selectedType) => {
                                    if (!selectedType) {
                                        return;
                                    }
                                    setReportType(selectedType as ReportType);
                                    setSkipDiscardDialog(false);
                                    setSubmitError(null);
                                }}
                                style={styles.reportTypeToggle}
                                buttons={[
                                    {
                                        value: "bug_report",
                                        label: "Bug report",
                                    },
                                    {
                                        value: "suggestion",
                                        label: "Suggestion",
                                    },
                                ]}
                            />

                            <Divider style={styles.divider} />

                            <Title style={styles.subheading}>Describe the {reportTypeLabel}</Title>
                            <TextInput
                                value={description}
                                onChangeText={(value) => {
                                    setDescription(value);
                                    setSkipDiscardDialog(false);
                                    setSubmitError(null);
                                }}
                                placeholder="What happened, where it happened, and what you expected instead."
                                mode="outlined"
                                outlineColor={themeColors.borderGray}
                                activeOutlineColor={themeColors.blueBgDark}
                                multiline
                                numberOfLines={6}
                                maxLength={MAX_DESCRIPTION_LENGTH}
                                style={styles.descriptionField}
                                contentStyle={styles.descriptionFieldContent}
                            />
                            <Text style={styles.helperText}>
                                {descriptionLength}/{MAX_DESCRIPTION_LENGTH}
                            </Text>

                            <Divider style={styles.divider} />

                            <Title style={styles.subheading}>Add screenshot or image</Title>
                            <Text style={styles.helperText}>
                                Attach a screenshot/photo from your device to show the issue
                                clearly.
                            </Text>

                            <View style={styles.attachControls}>
                                <Button
                                    mode="outlined"
                                    style={[styles.outlinedActionButton, styles.chooseImageButton]}
                                    textColor={themeColors.blueBgDark}
                                    icon="file-upload-outline"
                                    onPress={onImageSelect}
                                >
                                    Choose Image
                                </Button>
                                {attachedImage && (
                                    <Button
                                        mode="text"
                                        textColor={themeColors.riskBlack}
                                        icon="delete-outline"
                                        onPress={() => setAttachedImage(null)}
                                    >
                                        Remove
                                    </Button>
                                )}
                            </View>

                            {attachedImage && (
                                <View style={styles.imageMeta}>
                                    <Chip>{`${imageFileName} (${imageSizeInKB} KB)`}</Chip>
                                </View>
                            )}

                            {attachedImage && (
                                <Image
                                    source={{ uri: attachedImage.uri }}
                                    style={styles.imagePreview}
                                    resizeMode="contain"
                                />
                            )}
                        </Card.Content>
                        <Card.Actions style={styles.cardActions}>
                            <Button
                                mode="contained"
                                icon="send"
                                onPress={onSubmit}
                                disabled={isSubmitting || descriptionLength === 0 || isOffline}
                            >
                                {isSubmitting ? "Submitting..." : submitLabel}
                            </Button>
                        </Card.Actions>
                    </Card>

                    {submitError && <Alert severity="error" text={submitError} />}
                </View>
            </ScrollView>
            <ConfirmDialogWithNavListener
                bypassDialog={skipDiscardDialog || !isDirty}
                dialogTitle="Discard this draft?"
                dialogContent={`Your ${reportTypeLabel} has unsaved changes. Leaving now will discard the draft.`}
                confirmButtonText="Leave page"
            />
        </View>
    );
};

export default BugReport;
