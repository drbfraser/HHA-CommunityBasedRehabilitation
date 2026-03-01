import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    Alert,
    Button,
    Grid,
    MenuItem,
    TextField,
    Typography,
    Box,
    FormControl,
    InputLabel,
    Select,
    SelectChangeEvent,
} from "@mui/material";
import GoBackButton from "components/GoBackButton/GoBackButton";
import { PhotoView } from "components/ReferralPhotoView/PhotoView";
import {
    ISuccessStory,
    StoryStatus,
    PublishPermission,
    generateStoryId,
    saveStory,
    getStoryById,
} from "util/successStories";
import { apiFetch, Endpoint } from "@cbr/common/util/endpoints";
import { IUser } from "@cbr/common/util/users";
import history from "@cbr/common/util/history";
import { storyFormStyles } from "./NewSuccessStory.styles";

interface IUrlParam {
    clientId: string;
    storyId?: string;
}

const NewSuccessStory = () => {
    const { clientId, storyId } = useParams<IUrlParam>();
    const { t } = useTranslation();
    const isEditing = Boolean(storyId);

    const [submissionError, setSubmissionError] = useState<string>();
    const [currentUser, setCurrentUser] = useState<IUser>();

    const blank: Omit<ISuccessStory, "id" | "created_at" | "updated_at" | "created_by_user_id"> = {
        client_id: clientId,
        written_by_name: "",
        beneficiary_age: "",
        beneficiary_gender: "",
        hcr_status: "",
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
    };

    const [form, setForm] = useState(blank);
    const [photoUrl, setPhotoUrl] = useState<string>("");

    useEffect(() => {
        apiFetch(Endpoint.USER_CURRENT)
            .then((r) => r.json())
            .then((u: IUser) => setCurrentUser(u))
            .catch(() => {});
    }, []);

    useEffect(() => {
        if (storyId) {
            const existing = getStoryById(storyId);
            if (existing) {
                const { id, created_at, updated_at, created_by_user_id, ...rest } = existing;
                setForm(rest);
                if (existing.photo) setPhotoUrl(existing.photo);
            }
        }
    }, [storyId]);

    const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm((prev) => ({ ...prev, [field]: e.target.value }));

    const setSelect = (field: string) => (e: SelectChangeEvent) =>
        setForm((prev) => ({ ...prev, [field]: e.target.value }));

    const handleSubmit = () => {
        if (!form.written_by_name || !form.part1_background) {
            setSubmissionError("Please fill in at least the writer name and Part 1 (Background).");
            return;
        }
        const now = Date.now();
        const existing = storyId ? getStoryById(storyId) : undefined;
        const story: ISuccessStory = {
            ...form,
            id: existing?.id ?? generateStoryId(),
            created_at: existing?.created_at ?? now,
            updated_at: now,
            created_by_user_id: existing?.created_by_user_id ?? currentUser?.id ?? "",
            photo: photoUrl,
            beneficiary_age: form.beneficiary_age === "" ? "" : Number(form.beneficiary_age),
        };
        saveStory(story);
        history.goBack();
    };

    /* --- helper to build a narrative section --- */
    const renderNarrativeSection = (label: string, field: string, helper?: string) => (
        <React.Fragment key={field}>
            <Typography variant="h6" sx={storyFormStyles.sectionTitle}>
                {label}
            </Typography>
            {helper && <Typography sx={storyFormStyles.helperText}>{helper}</Typography>}
            <TextField
                fullWidth
                multiline
                minRows={4}
                value={(form as any)[field]}
                onChange={set(field)}
                variant="outlined"
            />
        </React.Fragment>
    );

    return (
        <>
            <GoBackButton />
            <Typography variant="h4" gutterBottom>
                {isEditing ? "Edit Success Story" : "New Beneficiary Case Study"}
            </Typography>

            {submissionError && (
                <Alert
                    severity="error"
                    onClose={() => setSubmissionError(undefined)}
                    sx={{ mb: 2 }}
                >
                    {submissionError}
                </Alert>
            )}

            {/* --- HEADER FIELDS --- */}
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        required
                        label="Written By (Name)"
                        variant="outlined"
                        value={form.written_by_name}
                        onChange={set("written_by_name")}
                    />
                </Grid>
                <Grid item xs={6} md={3}>
                    <TextField
                        fullWidth
                        label="Age of Beneficiary"
                        type="number"
                        variant="outlined"
                        value={form.beneficiary_age}
                        onChange={set("beneficiary_age")}
                    />
                </Grid>
                <Grid item xs={6} md={3}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel>Gender</InputLabel>
                        <Select
                            value={form.beneficiary_gender}
                            onChange={setSelect("beneficiary_gender")}
                            label="Gender"
                        >
                            <MenuItem value="M">Male</MenuItem>
                            <MenuItem value="F">Female</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel>Host Community or Refugee?</InputLabel>
                        <Select
                            value={form.hcr_status}
                            onChange={setSelect("hcr_status")}
                            label="Host Community or Refugee?"
                        >
                            <MenuItem value="Host Community">Host Community</MenuItem>
                            <MenuItem value="Refugee">Refugee</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                {form.hcr_status === "Refugee" && (
                    <>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Where are they from?"
                                variant="outlined"
                                value={form.refugee_origin}
                                onChange={set("refugee_origin")}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="How long have they been in Uganda?"
                                variant="outlined"
                                value={form.refugee_duration}
                                onChange={set("refugee_duration")}
                            />
                        </Grid>
                    </>
                )}
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Diagnosis"
                        variant="outlined"
                        value={form.diagnosis}
                        onChange={set("diagnosis")}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Treatment / Service Given"
                        variant="outlined"
                        value={form.treatment_service}
                        onChange={set("treatment_service")}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Date"
                        type="date"
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        value={form.date}
                        onChange={set("date")}
                    />
                </Grid>
            </Grid>

            {/* --- NARRATIVE SECTIONS --- */}
            {renderNarrativeSection(
                "Part 1: Background",
                "part1_background",
                "Give some background about the person's life. Where are they from, where do they live now, who do they live with? If they are a refugee, why did they leave their country?"
            )}
            {renderNarrativeSection(
                "Part 2: Challenge",
                "part2_challenge",
                "Explain the challenge the person had before. What was life like for them before HHA EA helped them? (not just clinically – socially, emotionally, etc.)"
            )}
            {renderNarrativeSection(
                "Part 3: Introduction",
                "part3_introduction",
                "Briefly explain how they found you. Keep it simple and leave out dates, job titles, etc."
            )}
            {renderNarrativeSection(
                "Part 4: Action",
                "part4_action",
                "What did your team do to help make an impact? Describe your role and actions – not just clinically, add emotion."
            )}
            {renderNarrativeSection(
                "Part 5: Impact",
                "part5_impact",
                "Describe life now. What's the lasting impact of your support? Consider the beneficiary, their family, and caregivers."
            )}

            {/* --- PHOTO --- */}
            <Typography variant="h6" sx={storyFormStyles.sectionTitle}>
                Photograph
            </Typography>
            <Typography sx={storyFormStyles.helperText}>
                Please take a photograph if possible.
            </Typography>
            {photoUrl && (
                <Box
                    component="img"
                    src={photoUrl}
                    alt="Story photo"
                    sx={storyFormStyles.photoPreview}
                />
            )}
            <PhotoView onPictureChange={(url) => setPhotoUrl(url)} />

            {/* --- PERMISSION & STATUS --- */}
            <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} md={4}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel>Permission to Publish</InputLabel>
                        <Select
                            value={form.publish_permission}
                            onChange={setSelect("publish_permission")}
                            label="Permission to Publish"
                        >
                            <MenuItem value={PublishPermission.YES}>Yes</MenuItem>
                            <MenuItem value={PublishPermission.NO}>No</MenuItem>
                            <MenuItem value={PublishPermission.ANONYMOUS}>Anonymous</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel>Story Status</InputLabel>
                        <Select
                            value={form.status}
                            onChange={setSelect("status")}
                            label="Story Status"
                        >
                            <MenuItem value={StoryStatus.WORK_IN_PROGRESS}>
                                Work in Progress
                            </MenuItem>
                            <MenuItem value={StoryStatus.READY}>Ready</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            {/* --- SUBMIT --- */}
            <Box sx={{ mt: 3, mb: 4 }}>
                <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mr: 2 }}>
                    {isEditing ? "Save Changes" : "Submit Story"}
                </Button>
                <Button variant="outlined" onClick={() => history.goBack()}>
                    Cancel
                </Button>
            </Box>
        </>
    );
};

export default NewSuccessStory;
