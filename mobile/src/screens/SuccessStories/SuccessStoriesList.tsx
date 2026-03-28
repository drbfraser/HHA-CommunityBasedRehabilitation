import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { ActivityIndicator, Button } from "react-native-paper";
import { RouteProp, useIsFocused } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { themeColors } from "@cbr/common";
import { StackParamList } from "../../util/stackScreens";
import { StackScreenName } from "../../util/StackScreenName";
import { getStoriesForClient, ISuccessStory, StoryStatus } from "./successStoryApi";
import { styles } from "./SuccessStories.styles";

interface Props {
    route: RouteProp<StackParamList, StackScreenName.SUCCESS_STORIES>;
    navigation: StackNavigationProp<StackParamList, StackScreenName.SUCCESS_STORIES>;
}

const SuccessStoriesList = ({ route, navigation }: Props) => {
    const { clientID, clientName } = route.params;
    const isFocused = useIsFocused();
    const [stories, setStories] = useState<ISuccessStory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const loadStories = useCallback(() => {
        setLoading(true);
        getStoriesForClient(clientID)
            .then((data) => {
                data.sort((a, b) => b.created_at - a.created_at);
                setStories(data);
                setError(false);
            })
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, [clientID]);

    useEffect(() => {
        if (isFocused) {
            loadStories();
        }
    }, [isFocused, loadStories]);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            <View style={styles.headerRow}>
                <Text style={styles.title}>Success Stories</Text>
                <Button
                    mode="contained"
                    compact
                    onPress={() =>
                        navigation.navigate(StackScreenName.SUCCESS_STORY_NEW, {
                            clientID,
                            clientName,
                        })
                    }
                    style={{ borderRadius: 6 }}
                >
                    New Story
                </Button>
            </View>

            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={themeColors.blueAccent} />
                </View>
            )}

            {!loading && error && (
                <View style={styles.errorAlert}>
                    <Text style={styles.errorText}>Could not load success stories.</Text>
                </View>
            )}

            {!loading && !error && stories.length === 0 && (
                <Text style={styles.emptyText}>
                    No success stories yet.{"\n"}Tap "New Story" to create one.
                </Text>
            )}

            {!loading && (
                <>
                    <Text style={styles.subtitle}>
                        {stories.length} {stories.length === 1 ? "story" : "stories"}
                    </Text>
                    {stories.map((story) => (
                        <TouchableOpacity
                            key={story.id}
                            style={styles.storyCard}
                            activeOpacity={0.7}
                            onPress={() =>
                                navigation.navigate(StackScreenName.SUCCESS_STORY_VIEW, {
                                    clientID,
                                    storyId: story.id,
                                    clientName,
                                })
                            }
                        >
                            <View style={styles.storyCardContent}>
                                <View style={styles.storyCardTitleRow}>
                                    <Text
                                        style={styles.storyCardTitle}
                                        numberOfLines={1}
                                        ellipsizeMode="tail"
                                    >
                                        {story.title || "Untitled Story"}
                                    </Text>
                                    <View
                                        style={
                                            story.status === StoryStatus.READY
                                                ? styles.chipReady
                                                : styles.chipWIP
                                        }
                                    >
                                        <Text style={styles.chipText}>
                                            {story.status === StoryStatus.READY
                                                ? "Ready"
                                                : "Work in Progress"}
                                        </Text>
                                    </View>
                                </View>
                                <Text style={styles.storyCardMeta}>
                                    Story Date: {story.date} · {story.written_by_name}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </>
            )}
        </ScrollView>
    );
};

export default SuccessStoriesList;
