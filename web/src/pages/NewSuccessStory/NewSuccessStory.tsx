import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
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
import { Gender, HCRType, IClient } from "@cbr/common/util/clients";
import {
    ISuccessStory,
    StoryStatus,
    PublishPermission,
    ISuccessStoryWritePayload,
    createStory,
    getStoryById,
    updateStory,
} from "../../util/successStories";
import { apiFetch, Endpoint } from "@cbr/common/util/endpoints";
import { IUser } from "@cbr/common/util/users";
import history from "@cbr/common/util/history";
import { storyFormStyles } from "./NewSuccessStory.styles";

interface IUrlParam {
    clientId: string;
    storyId?: string;
}

const getAgeFromBirthDate = (birthDate?: number | string): number | "" => {
    if (!birthDate && birthDate !== 0) return "";

    const parsedDate =
        typeof birthDate === "number"
            ? new Date(birthDate)
            : /^\d+$/.test(String(birthDate))
            ? new Date(Number(birthDate))
            : new Date(String(birthDate));

    if (Number.isNaN(parsedDate.getTime())) return "";

    const today = new Date();
    let age = today.getFullYear() - parsedDate.getFullYear();
    const monthDiff = today.getMonth() - parsedDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < parsedDate.getDate())) {
        age -= 1;
    }

    return age >= 0 ? age : "";
};

const getGenderLabel = (gender?: Gender): string => {
    if (gender === Gender.MALE) return "Male";
    if (gender === Gender.FEMALE) return "Female";
    return "";
};

const getHcrStatusLabel = (hcrType?: HCRType): string => {
    if (hcrType === HCRType.REFUGEE) return "Refugee";
    if (hcrType === HCRType.HOST_COMMUNITY) return "Host Community";
    return "";
};

const NewSuccessStory = () => {
    const { clientId, storyId } = useParams<IUrlParam>();
    const isEditing = Boolean(storyId);

    const [submissionError, setSubmissionError] = useState<string>();
    const [currentUser, setCurrentUser] = useState<IUser>();
    const [clientInfo, setClientInfo] = useState<IClient>();
    const [isLoadingStory, setIsLoadingStory] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const blank: Omit<ISuccessStory, "id" | "created_at" | "updated_at" | "created_by_user_id"> = {
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
    };

    const [form, setForm] = useState(blank);
    const [photoUrl, setPhotoUrl] = useState<string>("");
    const [existingPhotoUrl, setExistingPhotoUrl] = useState<string>("");

    useEffect(() => {
        apiFetch(Endpoint.USER_CURRENT)
            .then((r) => r.json())
            .then((u: IUser) => setCurrentUser(u))
            .catch(() => {});
    }, []);

    useEffect(() => {
        if (!clientId) return;

        apiFetch(Endpoint.CLIENT, clientId)
            .then((resp) => resp.json())
            .then((client: IClient) => setClientInfo(client))
            .catch(() => {});
    }, [clientId]);

    useEffect(() => {
        if (storyId) {
            setIsLoadingStory(true);
            getStoryById(storyId)
                .then((existing: ISuccessStory) => {
                    const { id, created_at, updated_at, created_by_user_id, ...rest } = existing;
                    setForm(rest);

                    // If the story has a photo, fetch it via the photo endpoint and create a blob URL
                    if (existing.photo) {
                        apiFetch(Endpoint.SUCCESS_STORY_PHOTO, `${storyId}`)
                            .then((resp) => resp.blob())
                            .then((blob) => {
                                const url = URL.createObjectURL(blob);
                                setPhotoUrl(url);
                                setExistingPhotoUrl(url);
                            })
                            .catch(() => setPhotoUrl(""));
                    }
                })
                .catch(() => setSubmissionError("Could not load the success story."))
                .finally(() => setIsLoadingStory(false));
        }
    }, [storyId]);

    const beneficiaryName = useMemo(
        () => [clientInfo?.first_name, clientInfo?.last_name].filter(Boolean).join(" "),
        [clientInfo]
    );

    const derivedWrittenByName = useMemo(
        () =>
            form.written_by_name ||
            [currentUser?.first_name, currentUser?.last_name].filter(Boolean).join(" "),
        [currentUser, form.written_by_name]
    );

    const derivedAge = useMemo(() => getAgeFromBirthDate(clientInfo?.birth_date), [clientInfo]);

    const derivedGender = useMemo(() => getGenderLabel(clientInfo?.gender), [clientInfo]);

    const derivedHcrStatus = useMemo(() => getHcrStatusLabel(clientInfo?.hcr_type), [clientInfo]);

    useEffect(() => {
        setForm((prev) => {
            const nextForm = {
                ...prev,
                beneficiary_age: derivedAge !== "" ? derivedAge : prev.beneficiary_age,
                beneficiary_gender: derivedGender || prev.beneficiary_gender,
                hcr_status: derivedHcrStatus || prev.hcr_status,
            };

            return JSON.stringify(nextForm) === JSON.stringify(prev) ? prev : nextForm;
        });
    }, [derivedAge, derivedGender, derivedHcrStatus]);

    const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm((prev) => ({ ...prev, [field]: e.target.value }));

    const setSelect = (field: string) => (e: SelectChangeEvent) =>
        setForm((prev) => ({ ...prev, [field]: e.target.value }));

    const handleSubmit = () => {
        if (!derivedWrittenByName || !form.part1_background) {
            setSubmissionError("Please fill in at least the writer name and Part 1 (Background).");
            return;
        }

        if (!clientId) {
            setSubmissionError("Missing client information for this success story.");
            return;
        }

        const storyPayload: ISuccessStoryWritePayload = {
            client_id: clientId,
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
            photo: "",
            publish_permission: form.publish_permission,
            status: form.status,
            date: form.date,
        };

        setIsSubmitting(true);
        setSubmissionError(undefined);

        const request = storyId
            ? updateStory(storyId, storyPayload, photoUrl)
            : createStory(storyPayload, photoUrl);
        request
            .then(() => history.goBack())
            .catch(() => setSubmissionError("Could not save the success story."))
            .finally(() => setIsSubmitting(false));
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

            {isLoadingStory && (
                <Alert severity="info" sx={{ mb: 2 }}>
                    Loading success story...
                </Alert>
            )}

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
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Story Title"
                        variant="outlined"
                        value={form.title}
                        onChange={set("title")}
                        placeholder="Give your success story a title"
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        required
                        label="Written By (Name)"
                        variant="outlined"
                        value={derivedWrittenByName}
                        InputProps={{ readOnly: true }}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Beneficiary Name"
                        variant="outlined"
                        value={beneficiaryName}
                        InputProps={{ readOnly: true }}
                    />
                </Grid>
                <Grid item xs={6} md={3}>
                    <TextField
                        fullWidth
                        label="Age of Beneficiary"
                        variant="outlined"
                        value={derivedAge !== "" ? derivedAge : form.beneficiary_age}
                        InputProps={{ readOnly: true }}
                    />
                </Grid>
                <Grid item xs={6} md={3}>
                    <TextField
                        fullWidth
                        label="Gender"
                        variant="outlined"
                        value={
                            derivedGender ||
                            getGenderLabel(form.beneficiary_gender as Gender) ||
                            form.beneficiary_gender
                        }
                        InputProps={{ readOnly: true }}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Host Community or Refugee?"
                        variant="outlined"
                        value={derivedHcrStatus || form.hcr_status}
                        InputProps={{ readOnly: true }}
                    />
                </Grid>
                {(derivedHcrStatus || form.hcr_status) === "Refugee" && (
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
            <Box sx={{ mt: 2, mb: 2 }}>
                {existingPhotoUrl && (
                    <Box
                        component="img"
                        src={existingPhotoUrl}
                        alt="Story photo"
                        sx={{ maxWidth: 200, display: "block", mb: 1 }}
                    />
                )}
                <PhotoView
                    onPictureChange={(url) => {
                        setPhotoUrl(url);
                        setExistingPhotoUrl("");
                    }}
                />
            </Box>

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
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    sx={{ mr: 2 }}
                    disabled={isSubmitting || isLoadingStory}
                >
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
