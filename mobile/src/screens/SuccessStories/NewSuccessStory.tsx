import React, { useEffect, useMemo, useState } from "react";
import { Alert, Image, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { ActivityIndicator, Button, Divider, TextInput } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import * as ImagePicker from "expo-image-picker";
import { apiFetch, Endpoint, themeColors, useCurrentUser } from "@cbr/common";
import { StackParamList } from "../../util/stackScreens";
import { StackScreenName } from "../../util/StackScreenName";
import {
    createStory,
    getStoryById,
    ISuccessStory,
    ISuccessStoryPayload,
    PublishPermission,
    StoryStatus,
    updateStory,
} from "./successStoryApi";
import { styles } from "./SuccessStories.styles";

interface Props {
    route: RouteProp<StackParamList, StackScreenName.SUCCESS_STORY_NEW>;
    navigation: StackNavigationProp<StackParamList, StackScreenName.SUCCESS_STORY_NEW>;
}

type FormState = Omit<ISuccessStory, "id" | "created_at" | "updated_at" | "created_by_user_id">;

const BLANK_FORM = (clientId: string): FormState => ({
    client_id: clientId,
    written_by_name: "",
    beneficiary_age: "",
    beneficiary_gender: "",
    hcr_status: "",
    client_name: "",
    title: "",
    refugee_origin: "",
    refugee_duration: "",
    diagnosis: "",
    treatment_service: "",
    part1_background: "",
    part2_challenge: "",
    part3_introduction: "",
    part4_action: "",
    part5_impact: "",
    photo: "",
    publish_permission: PublishPermission.NO,
    status: StoryStatus.WORK_IN_PROGRESS,
    date: new Date().toISOString().slice(0, 10),
});

const STATUS_OPTIONS: { label: string; value: StoryStatus }[] = [
    { label: "Work in Progress", value: StoryStatus.WORK_IN_PROGRESS },
    { label: "Ready", value: StoryStatus.READY },
];

const PERMISSION_OPTIONS: { label: string; value: PublishPermission }[] = [
    { label: "Yes", value: PublishPermission.YES },
    { label: "No", value: PublishPermission.NO },
    { label: "Anonymous", value: PublishPermission.ANONYMOUS },
];

const NewSuccessStory = ({ route, navigation }: Props) => {
    const { clientID, storyId, clientName } = route.params;
    const isEditing = Boolean(storyId);

    const currentUser = useCurrentUser();
    const [form, setForm] = useState<FormState>(BLANK_FORM(clientID));
    const [photoUri, setPhotoUri] = useState<string>("");
    const [existingPhotoUri, setExistingPhotoUri] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string>();
    const [datePickerVisible, setDatePickerVisible] = useState(false);

    const writerName = useMemo(() => {
        if (form.written_by_name) return form.written_by_name;
        if (currentUser && currentUser !== "APILoadError") {
            return [currentUser.first_name, currentUser.last_name].filter(Boolean).join(" ");
        }
        return "";
    }, [currentUser, form.written_by_name]);

    useEffect(() => {
        if (!storyId) return;
        setIsLoading(true);
        getStoryById(storyId)
            .then((existing) => {
                const { id, created_at, updated_at, created_by_user_id, ...rest } = existing;
                setForm(rest);

                if (existing.photo) {
                    apiFetch(Endpoint.SUCCESS_STORY_PHOTO, `${storyId}`)
                        .then((resp) => resp.blob())
                        .then((blob) => {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                                if (typeof reader.result === "string") {
                                    setExistingPhotoUri(reader.result);
                                }
                            };
                            reader.readAsDataURL(blob);
                        })
                        .catch(() => {});
                }
            })
            .catch(() => setError("Could not load the success story."))
            .finally(() => setIsLoading(false));
    }, [storyId]);

    const set = (field: keyof FormState) => (text: string) =>
        setForm((prev) => ({ ...prev, [field]: text }));

    const pickPhoto = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Permission required", "Photo library permission is needed.");
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.7,
        });
        if (!result.canceled) {
            setPhotoUri(result.assets[0].uri);
            setExistingPhotoUri("");
        }
    };

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Permission required", "Camera permission is needed.");
            return;
        }
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.7,
        });
        if (!result.canceled) {
            setPhotoUri(result.assets[0].uri);
            setExistingPhotoUri("");
        }
    };

    const handleSubmit = () => {
        if (!writerName || !form.part1_background) {
            setError("Please fill in at least the writer name and Part 1 (Background).");
            return;
        }

        const payload: ISuccessStoryPayload = {
            client_id: clientID,
            title: form.title,
            refugee_origin: form.refugee_origin,
            refugee_duration: form.refugee_duration,
            diagnosis: form.diagnosis,
            treatment_service: form.treatment_service,
            part1_background: form.part1_background,
            part2_challenge: form.part2_challenge,
            part3_introduction: form.part3_introduction,
            part4_action: form.part4_action,
            part5_impact: form.part5_impact,
            publish_permission: form.publish_permission,
            status: form.status,
            date: form.date,
        };

        setIsSubmitting(true);
        setError(undefined);

        const request = storyId
            ? updateStory(storyId, payload, photoUri || undefined)
            : createStory(payload, photoUri || undefined);

        request
            .then(() => navigation.goBack())
            .catch(() => setError("Could not save the success story."))
            .finally(() => setIsSubmitting(false));
    };

    const cycleStatus = () => {
        const idx = STATUS_OPTIONS.findIndex((o) => o.value === form.status);
        const next = STATUS_OPTIONS[(idx + 1) % STATUS_OPTIONS.length];
        setForm((prev) => ({ ...prev, status: next.value }));
    };

    const cyclePermission = () => {
        const idx = PERMISSION_OPTIONS.findIndex((o) => o.value === form.publish_permission);
        const next = PERMISSION_OPTIONS[(idx + 1) % PERMISSION_OPTIONS.length];
        setForm((prev) => ({ ...prev, publish_permission: next.value }));
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={themeColors.blueAccent} />
            </View>
        );
    }

    const currentStatusLabel =
        STATUS_OPTIONS.find((o) => o.value === form.status)?.label ?? "Work in Progress";
    const currentPermissionLabel =
        PERMISSION_OPTIONS.find((o) => o.value === form.publish_permission)?.label ?? "No";

    const renderNarrativeSection = (label: string, field: keyof FormState, helper?: string) => (
        <React.Fragment key={field}>
            <Text style={styles.formSectionTitle}>{label}</Text>
            {helper && <Text style={styles.formHelperText}>{helper}</Text>}
            <TextInput
                mode="outlined"
                multiline
                numberOfLines={5}
                value={String(form[field] ?? "")}
                onChangeText={set(field)}
                style={styles.formMultiline}
            />
        </React.Fragment>
    );

    return (
        <ScrollView contentContainerStyle={styles.formContainer}>
            <Text style={styles.title}>
                {isEditing ? "Edit Success Story" : "New Beneficiary Case Study"}
            </Text>

            {error && (
                <View style={styles.errorAlert}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}

            <TextInput
                mode="outlined"
                label="Story Title"
                value={form.title}
                onChangeText={set("title")}
                style={styles.formInput}
            />
            <TextInput
                mode="outlined"
                label="Written By"
                value={writerName}
                editable={false}
                style={styles.formInput}
            />
            <TextInput
                mode="outlined"
                label="Beneficiary Name"
                value={clientName ?? ""}
                editable={false}
                style={styles.formInput}
            />

            <View style={{ flexDirection: "row", gap: 8 }}>
                <TextInput
                    mode="outlined"
                    label="Diagnosis"
                    value={form.diagnosis}
                    onChangeText={set("diagnosis")}
                    style={[styles.formInput, { flex: 1 }]}
                />
            </View>
            <TextInput
                mode="outlined"
                label="Treatment / Service Given"
                value={form.treatment_service}
                onChangeText={set("treatment_service")}
                style={styles.formInput}
            />

            {form.hcr_status === "Refugee" && (
                <>
                    <TextInput
                        mode="outlined"
                        label="Where are they from?"
                        value={form.refugee_origin}
                        onChangeText={set("refugee_origin")}
                        style={styles.formInput}
                    />
                    <TextInput
                        mode="outlined"
                        label="How long have they been in Uganda?"
                        value={form.refugee_duration}
                        onChangeText={set("refugee_duration")}
                        style={styles.formInput}
                    />
                </>
            )}

            <TouchableOpacity onPress={() => setDatePickerVisible(true)}>
                <TextInput
                    mode="outlined"
                    label="Date"
                    value={form.date}
                    style={styles.formInput}
                    editable={false}
                    right={
                        <TextInput.Icon
                            icon="calendar"
                            onPress={() => setDatePickerVisible(true)}
                        />
                    }
                />
            </TouchableOpacity>
            {datePickerVisible && (
                <DateTimePicker
                    value={new Date(form.date + "T00:00:00")}
                    mode="date"
                    display="default"
                    onChange={(event, date) => {
                        setDatePickerVisible(Platform.OS === "ios");
                        if (date && event.type !== "dismissed") {
                            setForm((prev) => ({
                                ...prev,
                                date: date.toISOString().slice(0, 10),
                            }));
                        }
                        if (event.type === "dismissed" || event.type === "set") {
                            setDatePickerVisible(false);
                        }
                    }}
                />
            )}

            <Divider style={{ marginVertical: 8 }} />

            {renderNarrativeSection(
                "Part 1: Background",
                "part1_background",
                "Give some background about the person's life."
            )}
            {renderNarrativeSection(
                "Part 2: Challenge",
                "part2_challenge",
                "Explain the challenge the person had before."
            )}
            {renderNarrativeSection(
                "Part 3: Introduction",
                "part3_introduction",
                "Briefly explain how they found you."
            )}
            {renderNarrativeSection(
                "Part 4: Action",
                "part4_action",
                "What did your team do to help?"
            )}
            {renderNarrativeSection(
                "Part 5: Impact",
                "part5_impact",
                "Describe the lasting impact of your support."
            )}

            <Divider style={{ marginVertical: 8 }} />

            {/* Photo */}
            <Text style={styles.formSectionTitle}>Photograph</Text>
            <Text style={styles.formHelperText}>Please take a photograph if possible.</Text>
            {existingPhotoUri || photoUri ? (
                <Image
                    source={{ uri: photoUri || existingPhotoUri }}
                    style={styles.photoPreview}
                    resizeMode="contain"
                />
            ) : null}
            <View style={styles.photoButtonRow}>
                <Button mode="outlined" icon="image" onPress={pickPhoto} compact>
                    Gallery
                </Button>
                <Button mode="outlined" icon="camera" onPress={takePhoto} compact>
                    Camera
                </Button>
                {existingPhotoUri || photoUri ? (
                    <Button
                        mode="outlined"
                        onPress={() => {
                            setPhotoUri("");
                            setExistingPhotoUri("");
                        }}
                        compact
                    >
                        Remove
                    </Button>
                ) : null}
            </View>

            <Divider style={{ marginVertical: 12 }} />

            {/* Status & Permission - tap to cycle */}
            <Text style={styles.formSectionTitle}>Status & Permission</Text>
            <View style={{ flexDirection: "row", gap: 12, marginTop: 8 }}>
                <Button mode="outlined" onPress={cycleStatus} style={{ flex: 1 }}>
                    Status: {currentStatusLabel}
                </Button>
                <Button mode="outlined" onPress={cyclePermission} style={{ flex: 1 }}>
                    Permission: {currentPermissionLabel}
                </Button>
            </View>

            {/* Submit */}
            <View style={styles.formButtonRow}>
                <Button
                    mode="contained"
                    onPress={handleSubmit}
                    style={styles.formSubmitButton}
                    disabled={isSubmitting}
                    loading={isSubmitting}
                >
                    {isEditing ? "Save Changes" : "Submit Story"}
                </Button>
                <Button
                    mode="outlined"
                    onPress={() => navigation.goBack()}
                    style={styles.formCancelButton}
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>
            </View>
        </ScrollView>
    );
};

export default NewSuccessStory;
