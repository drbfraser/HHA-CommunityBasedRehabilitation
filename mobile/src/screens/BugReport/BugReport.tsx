import React, { useMemo, useState } from "react";
import { Image, ScrollView, View } from "react-native";
import { APIFetchFailError, apiFetch, themeColors } from "@cbr/common";
import * as ImagePicker from "expo-image-picker";
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
import useStyles from "./BugReport.styles";

const MAX_DESCRIPTION_LENGTH = 1200;
type ReportType = "bug_report" | "suggestion";
const BUG_REPORT_ENDPOINT = "bug_report/";

const BugReport = () => {
    const styles = useStyles();
    const [reportType, setReportType] = useState<ReportType>("bug_report");
    const [description, setDescription] = useState("");
    const [attachedImage, setAttachedImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const descriptionLength = useMemo(() => description.trim().length, [description]);
    const submitLabel = reportType === "suggestion" ? "Submit Suggestion" : "Submit Bug Report";
    const reportTypeLabel = reportType === "suggestion" ? "suggestion" : "bug report";

    const onImageSelect = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.status !== "granted") {
            setSubmitError("Permission to access your photos is required.");
            return;
        }

        const imagePickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: "images",
            allowsEditing: false,
            quality: 1,
        });

        if (imagePickerResult.canceled) {
            return;
        }

        setAttachedImage(imagePickerResult.assets?.[0] ?? null);
        setIsSubmitted(false);
        setSubmitError(null);
    };

    const onClear = () => {
        setDescription("");
        setAttachedImage(null);
        setIsSubmitted(false);
        setSubmitError(null);
    };

    const onSubmit = async () => {
        if (descriptionLength === 0 || isSubmitting) {
            return;
        }

        const payload = new FormData();
        payload.append("report_type", reportType);
        payload.append("description", description.trim());

        if (attachedImage) {
            const fileName =
                attachedImage.fileName ?? attachedImage.uri.split("/").pop() ?? "attachment.jpg";
            payload.append("image", {
                uri: attachedImage.uri,
                type: attachedImage.mimeType ?? "image/jpeg",
                name: fileName,
            } as any);
        }

        setIsSubmitting(true);
        setSubmitError(null);
        try {
            await apiFetch(BUG_REPORT_ENDPOINT as any, "", {
                method: "POST",
                body: payload,
            });
            setIsSubmitted(true);
            setDescription("");
            setAttachedImage(null);
        } catch (e) {
            const message = e instanceof APIFetchFailError ? e.details ?? e.message : `${e}`;
            setSubmitError(message);
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
                                    setIsSubmitted(false);
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
                                    setIsSubmitted(false);
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
                                mode="outlined"
                                style={[styles.outlinedActionButton, styles.clearButton]}
                                textColor={themeColors.errorRed}
                                onPress={onClear}
                            >
                                Clear
                            </Button>
                            <Button
                                mode="contained"
                                icon="send"
                                onPress={onSubmit}
                                disabled={isSubmitting || descriptionLength === 0}
                            >
                                {isSubmitting ? "Submitting..." : submitLabel}
                            </Button>
                        </Card.Actions>
                    </Card>

                    {submitError && <Alert severity="error" text={submitError} />}

                    {isSubmitted && (
                        <View style={styles.successAlert}>
                            <Text style={styles.successAlertText}>
                                Your {reportTypeLabel} email has been submitted with your
                                description and image.
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

export default BugReport;
