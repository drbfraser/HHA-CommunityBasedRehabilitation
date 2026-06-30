import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Grid,
    Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import history from "@cbr/common/util/history";
import {
    getStoryById,
    ISuccessStory,
    PublishPermission,
    PHOTO_FIELDS,
    fetchStoryPhotoUrl,
    storyStatusLabel,
    storyStatusChipColor,
} from "util/successStories";

interface IUrlParam {
    clientId: string;
    storyId: string;
}

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

const Section = ({ title, body }: { title: string; body: string }) =>
    body ? (
        <Box sx={{ mt: 2 }}>
            <Typography variant="h6" fontWeight="bold">
                {title}
            </Typography>
            <Typography sx={{ whiteSpace: "pre-wrap", mt: 0.5 }}>{body}</Typography>
        </Box>
    ) : null;

const SuccessStoryView = () => {
    const { clientId, storyId } = useParams<IUrlParam>();
    const { t } = useTranslation();
    const [story, setStory] = useState<ISuccessStory>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [photoBlobUrls, setPhotoBlobUrls] = useState<string[]>([]);

    useEffect(() => {
        setLoading(true);
        getStoryById(storyId)
            .then((loadedStory) => {
                setStory(loadedStory);
                setError(false);

                PHOTO_FIELDS.forEach((field, index) => {
                    if (!loadedStory[field]) return;
                    fetchStoryPhotoUrl(storyId, index + 1).then((url) => {
                        if (!url) return;
                        setPhotoBlobUrls((prev) => {
                            const next = [...prev];
                            next[index] = url;
                            return next;
                        });
                    });
                });
            })
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, [storyId]);

    if (loading) {
        return (
            <>
                <Button startIcon={<ArrowBackIcon />} onClick={() => history.goBack()}>
                    {t("general.goBack")}
                </Button>
                <Alert severity="info">Loading success story...</Alert>
            </>
        );
    }

    if (error || !story) {
        return (
            <>
                <Button startIcon={<ArrowBackIcon />} onClick={() => history.goBack()}>
                    {t("general.goBack")}
                </Button>
                {error && <Alert severity="error">Could not load the success story.</Alert>}
            </>
        );
    }

    return (
        <>
            <Button startIcon={<ArrowBackIcon />} onClick={() => history.goBack()} sx={{ mb: 1 }}>
                {t("general.goBack")}
            </Button>

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                }}
            >
                <Typography variant="h4">{story.title || "Beneficiary Case Study"}</Typography>
                <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={() => history.push(`/client/${clientId}/stories/${storyId}/edit`)}
                >
                    Edit Story
                </Button>
            </Box>

            <Section title="Part 1: Background" body={story.part1_background} />
            <Section title="Part 2: Challenge" body={story.part2_challenge} />
            <Section title="Part 3: Introduction" body={story.part3_introduction} />
            <Section title="Part 4: Action" body={story.part4_action} />
            <Section title="Part 5: Impact" body={story.part5_impact} />

            {photoBlobUrls.some(Boolean) && (
                <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" fontWeight="bold">
                        Photographs
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                        {photoBlobUrls.filter(Boolean).map((url, index) => (
                            <Box
                                key={index}
                                component="img"
                                src={url}
                                alt={`Beneficiary photograph ${index + 1}`}
                                sx={{
                                    maxWidth: 500,
                                    maxHeight: 400,
                                    objectFit: "contain",
                                    borderRadius: 1,
                                }}
                            />
                        ))}
                    </Box>
                </Box>
            )}

            <Divider sx={{ mt: 3 }} />

            <Card variant="outlined" sx={{ mt: 2, mb: 2 }}>
                <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                        Beneficiary Information
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={6} md={3}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Name
                            </Typography>
                            <Typography>
                                {story.client_name || `Client #${story.client_id}`}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Age
                            </Typography>
                            <Typography>{story.beneficiary_age || "—"}</Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Gender
                            </Typography>
                            <Typography>
                                {story.beneficiary_gender === "M"
                                    ? "Male"
                                    : story.beneficiary_gender === "F"
                                    ? "Female"
                                    : "—"}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Community Status
                            </Typography>
                            <Typography>
                                {story.hcr_status || "—"}
                                {story.hcr_status === "Refugee" &&
                                    story.refugee_origin &&
                                    ` (from ${story.refugee_origin})`}
                                {story.hcr_status === "Refugee" &&
                                    story.refugee_duration &&
                                    `, ${story.refugee_duration} in Uganda`}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Diagnosis
                            </Typography>
                            <Typography>{story.diagnosis || "—"}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Treatment / Service
                            </Typography>
                            <Typography>{story.treatment_service || "—"}</Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                        Story Details
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={6} md={3}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Written By
                            </Typography>
                            <Typography>{story.written_by_name}</Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Story Date
                            </Typography>
                            <Typography>{story.date}</Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Status
                            </Typography>
                            <Chip
                                label={storyStatusLabel(story.status)}
                                color={storyStatusChipColor(story.status)}
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Publish Permission
                            </Typography>
                            <Typography>{permissionLabel(story.publish_permission)}</Typography>
                        </Grid>
                    </Grid>
                    <Divider sx={{ my: 1.5 }} />
                    <Typography variant="caption" color="text.secondary">
                        Created{" "}
                        {new Date(story.created_at).toLocaleString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                        })}
                        {" · "}
                        Updated{" "}
                        {new Date(story.updated_at).toLocaleString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                        })}
                    </Typography>
                </CardContent>
            </Card>
        </>
    );
};

export default SuccessStoryView;
