import React, { useCallback, useEffect, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { ActivityIndicator, Button, Card, Divider } from "react-native-paper";
import { RouteProp, useIsFocused } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { apiFetch, Endpoint, themeColors } from "@cbr/common";
import { StackParamList } from "../../util/stackScreens";
import { StackScreenName } from "../../util/StackScreenName";
import { getStoryById, ISuccessStory, StoryStatus, PublishPermission } from "./successStoryApi";
import { styles } from "./SuccessStories.styles";

interface Props {
    route: RouteProp<StackParamList, StackScreenName.SUCCESS_STORY_VIEW>;
    navigation: StackNavigationProp<StackParamList, StackScreenName.SUCCESS_STORY_VIEW>;
}

const statusLabel = (s: StoryStatus) => (s === StoryStatus.READY ? "Ready" : "Work in Progress");

const permissionLabel = (p: PublishPermission) => {
    switch (p) {
        case PublishPermission.YES:
            return "Yes";
        case PublishPermission.ANONYMOUS:
            return "Anonymous";
        default:
            return "No";
    }
};

const formatTimestamp = (ms: number) =>
    new Date(ms).toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });

const Field = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.fieldRow}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <Text style={styles.fieldValue}>{value || "—"}</Text>
    </View>
);

const Section = ({ title, body }: { title: string; body: string }) =>
    body ? (
        <>
            <Text style={styles.sectionTitle}>{title}</Text>
            <Text style={styles.sectionBody}>{body}</Text>
        </>
    ) : null;

const SuccessStoryView = ({ route, navigation }: Props) => {
    const { clientID, storyId, clientName } = route.params;
    const isFocused = useIsFocused();
    const [story, setStory] = useState<ISuccessStory>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [photoBlobUrl, setPhotoBlobUrl] = useState<string>("");

    const loadStory = useCallback(() => {
        setLoading(true);
        getStoryById(storyId)
            .then((data) => {
                setStory(data);
                setError(false);

                if (data.photo) {
                    apiFetch(Endpoint.SUCCESS_STORY_PHOTO, `${storyId}`)
                        .then((resp) => resp.blob())
                        .then((blob) => {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                                if (typeof reader.result === "string") {
                                    setPhotoBlobUrl(reader.result);
                                }
                            };
                            reader.readAsDataURL(blob);
                        })
                        .catch(() => setPhotoBlobUrl(""));
                }
            })
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, [storyId]);

    useEffect(() => {
        if (isFocused) {
            loadStory();
        }
    }, [isFocused, loadStory]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={themeColors.blueAccent} />
            </View>
        );
    }

    if (error || !story) {
        return (
            <View style={{ padding: 16 }}>
                <View style={styles.errorAlert}>
                    <Text style={styles.errorText}>Could not load the success story.</Text>
                </View>
            </View>
        );
    }

    const genderDisplay =
        story.beneficiary_gender === "M"
            ? "Male"
            : story.beneficiary_gender === "F"
            ? "Female"
            : "—";

    let communityStatus = story.hcr_status || "—";
    if (story.hcr_status === "Refugee") {
        if (story.refugee_origin) communityStatus += ` (from ${story.refugee_origin})`;
        if (story.refugee_duration) communityStatus += `, ${story.refugee_duration} in Uganda`;
    }

    return (
        <ScrollView contentContainerStyle={styles.viewContainer}>
            <View style={styles.headerRow}>
                <Text style={styles.viewTitle}>{story.title || "Beneficiary Case Study"}</Text>
                <Button
                    mode="contained"
                    compact
                    style={styles.viewEditButton}
                    onPress={() =>
                        navigation.navigate(StackScreenName.SUCCESS_STORY_NEW, {
                            clientID,
                            storyId,
                            clientName,
                        })
                    }
                >
                    Edit
                </Button>
            </View>

            <Section title="Part 1: Background" body={story.part1_background} />
            <Section title="Part 2: Challenge" body={story.part2_challenge} />
            <Section title="Part 3: Introduction" body={story.part3_introduction} />
            <Section title="Part 4: Action" body={story.part4_action} />
            <Section title="Part 5: Impact" body={story.part5_impact} />

            {photoBlobUrl ? (
                <View style={styles.photoContainer}>
                    <Text style={styles.sectionTitle}>Photograph</Text>
                    <Image
                        source={{ uri: photoBlobUrl }}
                        style={styles.photo}
                        resizeMode="contain"
                    />
                </View>
            ) : null}

            <Divider style={{ marginTop: 16 }} />

            {/* Beneficiary Information */}
            <Card style={styles.card}>
                <Card.Content>
                    <Text style={styles.cardTitle}>Beneficiary Information</Text>
                    <Field label="Name" value={story.client_name || `Client #${story.client_id}`} />
                    <Field
                        label="Age"
                        value={story.beneficiary_age !== "" ? String(story.beneficiary_age) : "—"}
                    />
                    <Field label="Gender" value={genderDisplay} />
                    <Field label="Community Status" value={communityStatus} />
                    <Field label="Diagnosis" value={story.diagnosis} />
                    <Field label="Treatment / Service" value={story.treatment_service} />
                </Card.Content>
            </Card>

            {/* Story Details */}
            <Card style={styles.card}>
                <Card.Content>
                    <Text style={styles.cardTitle}>Story Details</Text>
                    <Field label="Written By" value={story.written_by_name} />
                    <Field label="Story Date" value={story.date} />
                    <View style={styles.fieldRow}>
                        <Text style={styles.fieldLabel}>Status</Text>
                        <View
                            style={
                                story.status === StoryStatus.READY
                                    ? styles.chipReady
                                    : styles.chipWIP
                            }
                        >
                            <Text style={styles.chipText}>{statusLabel(story.status)}</Text>
                        </View>
                    </View>
                    <Field
                        label="Publish Permission"
                        value={permissionLabel(story.publish_permission)}
                    />
                    <Divider style={{ marginVertical: 8 }} />
                    <Text style={styles.timestampText}>
                        Created {formatTimestamp(story.created_at)} · Updated{" "}
                        {formatTimestamp(story.updated_at)}
                    </Text>
                </Card.Content>
            </Card>
        </ScrollView>
    );
};

export default SuccessStoryView;
