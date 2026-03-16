import React, { useEffect, useMemo, useState } from "react";
import {
    Alert,
    Box,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Chip,
    Grid,
    MenuItem,
    Typography,
    TextField,
} from "@mui/material";
import PhotoIcon from "@mui/icons-material/Photo";
import history from "@cbr/common/util/history";
import { apiFetch, Endpoint } from "@cbr/common/util/endpoints";
import { getAllStories, ISuccessStory, StoryStatus } from "util/successStories";

type TSortOption = "newest" | "oldest" | "updated" | "author";

/** Fetches and renders a small thumbnail for a story; shows a placeholder icon if none. */
const StoryThumbnail = ({ storyId, hasPhoto }: { storyId: string; hasPhoto: boolean }) => {
    const [blobUrl, setBlobUrl] = useState<string>("");

    useEffect(() => {
        if (!hasPhoto) return;
        let revoked = false;
        apiFetch(Endpoint.SUCCESS_STORY_PHOTO, storyId)
            .then((resp) => resp.blob())
            .then((blob) => {
                if (!revoked) setBlobUrl(URL.createObjectURL(blob));
            })
            .catch(() => {});
        return () => {
            revoked = true;
            if (blobUrl) URL.revokeObjectURL(blobUrl);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [storyId, hasPhoto]);

    if (blobUrl) {
        return (
            <CardMedia
                component="img"
                image={blobUrl}
                alt="Story thumbnail"
                sx={{
                    width: "100%",
                    height: 180,
                    objectFit: "contain",
                    bgcolor: "grey.100",
                }}
            />
        );
    }

    return (
        <Box
            sx={{
                width: "100%",
                height: 180,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "grey.200",
            }}
        >
            <PhotoIcon sx={{ color: "grey.400", fontSize: 48 }} />
        </Box>
    );
};

const SuccessStoriesList = () => {
    const [stories, setStories] = useState<ISuccessStory[]>([]);
    const [sortBy, setSortBy] = useState<TSortOption>("newest");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [permissionFilter, setPermissionFilter] = useState<string>("ALL");
    const [search, setSearch] = useState("");
    const [loadError, setLoadError] = useState(false);

    useEffect(() => {
        getAllStories()
            .then((loadedStories: ISuccessStory[]) => {
                setStories(loadedStories);
                setLoadError(false);
            })
            .catch(() => {
                setStories([]);
                setLoadError(true);
            });
    }, []);

    const filteredStories = useMemo(() => {
        const searchValue = search.trim().toLowerCase();
        const nextStories = stories.filter((story) => {
            const matchesStatus = statusFilter === "ALL" || story.status === statusFilter;
            const matchesPermission =
                permissionFilter === "ALL" || story.publish_permission === permissionFilter;
            const matchesSearch =
                searchValue.length === 0 ||
                (story.title || "").toLowerCase().includes(searchValue) ||
                story.written_by_name.toLowerCase().includes(searchValue) ||
                (story.client_name || "").toLowerCase().includes(searchValue) ||
                story.client_id.toLowerCase().includes(searchValue);

            return matchesStatus && matchesPermission && matchesSearch;
        });

        nextStories.sort((a, b) => {
            switch (sortBy) {
                case "oldest":
                    return a.created_at - b.created_at;
                case "updated":
                    return b.updated_at - a.updated_at;
                case "author":
                    return (a.written_by_name || "").localeCompare(b.written_by_name || "");
                case "newest":
                default:
                    return b.created_at - a.created_at;
            }
        });

        return nextStories;
    }, [permissionFilter, search, sortBy, statusFilter, stories]);

    return (
        <>
            <Typography variant="h4" sx={{ mb: 2 }}>
                All Success Stories
            </Typography>

            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={4}>
                    <TextField
                        fullWidth
                        label="Search"
                        placeholder="Title, writer, or client name"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        select
                        fullWidth
                        label="Sort by"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as TSortOption)}
                    >
                        <MenuItem value="newest">Newest first</MenuItem>
                        <MenuItem value="oldest">Oldest first</MenuItem>
                        <MenuItem value="updated">Recently updated</MenuItem>
                        <MenuItem value="author">Writer name (A–Z)</MenuItem>
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={2.5}>
                    <TextField
                        select
                        fullWidth
                        label="Status"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <MenuItem value="ALL">All statuses</MenuItem>
                        <MenuItem value={StoryStatus.READY}>Ready</MenuItem>
                        <MenuItem value={StoryStatus.WORK_IN_PROGRESS}>Work in Progress</MenuItem>
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={2.5}>
                    <TextField
                        select
                        fullWidth
                        label="Permission"
                        value={permissionFilter}
                        onChange={(e) => setPermissionFilter(e.target.value)}
                    >
                        <MenuItem value="ALL">All permissions</MenuItem>
                        <MenuItem value="YES">Yes</MenuItem>
                        <MenuItem value="NO">No</MenuItem>
                        <MenuItem value="ANON">Anonymous</MenuItem>
                    </TextField>
                </Grid>
            </Grid>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Showing {filteredStories.length} of {stories.length} stories.
            </Typography>

            {loadError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    Could not load success stories.
                </Alert>
            )}

            {filteredStories.length === 0 ? (
                <Typography color="text.secondary">
                    No success stories match the current filters.
                </Typography>
            ) : (
                <Grid container spacing={2}>
                    {filteredStories.map((story) => (
                        <Grid item xs={12} sm={6} md={4} key={story.id}>
                            <Card variant="outlined" sx={{ height: "100%" }}>
                                <CardActionArea
                                    onClick={() =>
                                        history.push(
                                            `/client/${story.client_id}/stories/${story.id}`
                                        )
                                    }
                                    sx={{
                                        height: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "stretch",
                                    }}
                                >
                                    <StoryThumbnail storyId={story.id} hasPhoto={!!story.photo} />
                                    <CardContent sx={{ flex: 1 }}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                gap: 1,
                                                mb: 1,
                                            }}
                                        >
                                            <Typography
                                                variant="subtitle1"
                                                fontWeight="bold"
                                                noWrap
                                            >
                                                {story.title || "Untitled Story"}
                                            </Typography>
                                            <Chip
                                                label={
                                                    story.status === StoryStatus.READY
                                                        ? "Ready"
                                                        : "Work in Progress"
                                                }
                                                color={
                                                    story.status === StoryStatus.READY
                                                        ? "success"
                                                        : "warning"
                                                }
                                                size="small"
                                            />
                                        </Box>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ mb: 0.5 }}
                                        >
                                            {story.date} · {story.written_by_name}
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 1 }} noWrap>
                                            {story.client_name || `Client #${story.client_id}`}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </>
    );
};

export default SuccessStoriesList;
