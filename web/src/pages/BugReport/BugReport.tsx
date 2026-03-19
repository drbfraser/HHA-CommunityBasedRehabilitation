import React, { useEffect, useMemo, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Chip,
    Divider,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SendIcon from "@mui/icons-material/Send";
import { apiFetch, APIFetchFailError, Endpoint } from "@cbr/common/util/endpoints";
import { bugReportStyles } from "./BugReport.styles";

const MAX_DESCRIPTION_LENGTH = 1200;
type ReportType = "bug_report" | "suggestion";

const BugReport = () => {
    const [reportType, setReportType] = useState<ReportType>("bug_report");
    const [description, setDescription] = useState("");
    const [attachedImage, setAttachedImage] = useState<File | null>(null);
    const [previewURL, setPreviewURL] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    useEffect(() => {
        if (!attachedImage) {
            setPreviewURL(null);
            return;
        }

        const localURL = URL.createObjectURL(attachedImage);
        setPreviewURL(localURL);

        return () => {
            URL.revokeObjectURL(localURL);
        };
    }, [attachedImage]);

    const onImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedImage = event.target.files?.[0] ?? null;
        setAttachedImage(selectedImage);
        setIsSubmitted(false);
        setSubmitError(null);
        event.target.value = "";
    };

    const onClear = () => {
        setDescription("");
        setAttachedImage(null);
        setIsSubmitted(false);
        setSubmitError(null);
    };

    const descriptionLength = useMemo(() => description.trim().length, [description]);

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (descriptionLength === 0) {
            return;
        }

        const payload = new FormData();
        payload.append("report_type", reportType);
        payload.append("description", description.trim());
        if (attachedImage) {
            payload.append("image", attachedImage);
        }

        setIsSubmitting(true);
        setSubmitError(null);
        apiFetch(Endpoint.BUG_REPORT, "", {
            method: "POST",
            body: payload,
        })
            .then(() => {
                setIsSubmitted(true);
                setDescription("");
                setAttachedImage(null);
            })
            .catch((e) => {
                const message = e instanceof APIFetchFailError ? e.details ?? e.message : `${e}`;
                setSubmitError(message);
            })
            .finally(() => setIsSubmitting(false));
    };

    const imageSizeInKB = attachedImage ? Math.max(1, Math.round(attachedImage.size / 1024)) : 0;
    const submitLabel = reportType === "suggestion" ? "Submit Suggestion" : "Submit Bug Report";
    const reportTypeLabel = reportType === "suggestion" ? "suggestion" : "bug report";

    return (
        <Box component="form" onSubmit={onSubmit} sx={bugReportStyles.form}>
            <Alert severity="info">
                Submitting this form sends an email with your description and attached image. You
                can choose either Bug report or Suggestion.
            </Alert>

            <Card sx={bugReportStyles.card}>
                <CardContent>
                    <Typography variant="h6" sx={bugReportStyles.subheading}>
                        Type
                    </Typography>
                    <ToggleButtonGroup
                        value={reportType}
                        exclusive
                        onChange={(_event, selectedType: ReportType | null) => {
                            if (!selectedType) {
                                return;
                            }
                            setReportType(selectedType);
                            setIsSubmitted(false);
                            setSubmitError(null);
                        }}
                        sx={bugReportStyles.reportTypeToggle}
                    >
                        <ToggleButton value="bug_report">Bug report</ToggleButton>
                        <ToggleButton value="suggestion">Suggestion</ToggleButton>
                    </ToggleButtonGroup>

                    <Divider sx={{ margin: "18px 0" }} />

                    <Typography variant="h6" sx={bugReportStyles.subheading}>
                        Describe the {reportTypeLabel}
                    </Typography>
                    <TextField
                        value={description}
                        onChange={(event) => {
                            setDescription(event.target.value);
                            setIsSubmitted(false);
                            setSubmitError(null);
                        }}
                        placeholder="What happened, where it happened, and what you expected instead."
                        multiline
                        minRows={6}
                        fullWidth
                        required
                        inputProps={{ maxLength: MAX_DESCRIPTION_LENGTH }}
                        sx={bugReportStyles.descriptionField}
                    />
                    <Typography variant="body2" sx={bugReportStyles.helperText}>
                        {descriptionLength}/{MAX_DESCRIPTION_LENGTH}
                    </Typography>

                    <Divider sx={{ margin: "18px 0" }} />

                    <Typography variant="h6" sx={bugReportStyles.subheading}>
                        Add screenshot or image
                    </Typography>
                    <Typography variant="body2" sx={bugReportStyles.helperText}>
                        Attach a screenshot/photo from your device to show the issue clearly.
                    </Typography>

                    <Box sx={bugReportStyles.attachControls}>
                        <Button component="label" variant="outlined" startIcon={<UploadFileIcon />}>
                            Choose Image
                            <input hidden type="file" accept="image/*" onChange={onImageSelect} />
                        </Button>
                        {attachedImage && (
                            <Button
                                variant="text"
                                color="inherit"
                                startIcon={<DeleteOutlineIcon />}
                                onClick={() => setAttachedImage(null)}
                            >
                                Remove
                            </Button>
                        )}
                    </Box>

                    {attachedImage && (
                        <Box sx={bugReportStyles.imageMeta}>
                            <Chip label={`${attachedImage.name} (${imageSizeInKB} KB)`} />
                        </Box>
                    )}

                    {previewURL && (
                        <Box
                            component="img"
                            src={previewURL}
                            alt="Selected bug report attachment preview"
                            sx={bugReportStyles.imagePreview}
                        />
                    )}
                </CardContent>

                <CardActions sx={bugReportStyles.cardActions}>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={onClear}
                        disabled={isSubmitting}
                    >
                        Clear
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        startIcon={<SendIcon />}
                        disabled={isSubmitting || descriptionLength === 0}
                    >
                        {isSubmitting ? "Submitting..." : submitLabel}
                    </Button>
                </CardActions>
            </Card>

            {submitError && <Alert severity="error">{submitError}</Alert>}

            {isSubmitted && (
                <Alert severity="success">
                    Your {reportTypeLabel} email has been submitted with your description and image.
                </Alert>
            )}
        </Box>
    );
};

export default BugReport;
