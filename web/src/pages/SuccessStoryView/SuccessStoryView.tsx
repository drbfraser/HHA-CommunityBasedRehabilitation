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
import { apiFetch, Endpoint } from "@cbr/common/util/endpoints";
import { getStoryById, ISuccessStory, StoryStatus, PublishPermission } from "util/successStories";

interface IUrlParam {
    clientId: string;
    storyId: string;
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
    const [photoBlobUrl, setPhotoBlobUrl] = useState<string>("");

    useEffect(() => {
        setLoading(true);
        getStoryById(storyId)
            .then((loadedStory) => {
                setStory(loadedStory);
                setError(false);

                if (loadedStory.photo) {
                    apiFetch(Endpoint.SUCCESS_STORY_PHOTO, `${storyId}`)
                        .then((resp) => resp.blob())
                        .then((blob) => setPhotoBlobUrl(URL.createObjectURL(blob)))
                        .catch(() => setPhotoBlobUrl(""));
                }
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
                <Typography variant="h4">Beneficiary Case Study</Typography>
                <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={() => history.push(`/client/${clientId}/stories/${storyId}/edit`)}
                >
                    Edit Story
                </Button>
            </Box>

            <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                    <Grid container spacing={1}>
                        <Grid item xs={6} md={3}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Written By
                            </Typography>
                            <Typography>{story.written_by_name}</Typography>
                        </Grid>
                        <Grid item xs={6} md={2}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Age
                            </Typography>
                            <Typography>{story.beneficiary_age || "—"}</Typography>
                        </Grid>
                        <Grid item xs={6} md={2}>
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
                        <Grid item xs={6} md={2}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Date
                            </Typography>
                            <Typography>{story.date}</Typography>
                        </Grid>
                        <Grid item xs={6} md={4}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Diagnosis
                            </Typography>
                            <Typography>{story.diagnosis || "—"}</Typography>
                        </Grid>
                        <Grid item xs={6} md={4}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Treatment / Service
                            </Typography>
                            <Typography>{story.treatment_service || "—"}</Typography>
                        </Grid>
                        <Grid item xs={6} md={2}>
                            <Chip
                                label={statusLabel(story.status)}
                                color={story.status === StoryStatus.READY ? "success" : "warning"}
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={6} md={2}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Publish Permission
                            </Typography>
                            <Typography>{permissionLabel(story.publish_permission)}</Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <Divider />

            <Section title="Part 1: Background" body={story.part1_background} />
            <Section title="Part 2: Challenge" body={story.part2_challenge} />
            <Section title="Part 3: Introduction" body={story.part3_introduction} />
            <Section title="Part 4: Action" body={story.part4_action} />
            <Section title="Part 5: Impact" body={story.part5_impact} />

            {photoBlobUrl && (
                <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" fontWeight="bold">
                        Photograph
                    </Typography>
                    <Box
                        component="img"
                        src={photoBlobUrl}
                        alt="Beneficiary photograph"
                        sx={{
                            maxWidth: 500,
                            maxHeight: 400,
                            objectFit: "contain",
                            mt: 1,
                            borderRadius: 1,
                        }}
                    />
                </Box>
            )}
        </>
    );
};

export default SuccessStoryView;
