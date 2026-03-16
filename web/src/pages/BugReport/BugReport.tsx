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
    Typography,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SendIcon from "@mui/icons-material/Send";
import { bugReportStyles } from "./BugReport.styles";

const MAX_DESCRIPTION_LENGTH = 1200;

const BugReport = () => {
    const [description, setDescription] = useState("");
    const [attachedImage, setAttachedImage] = useState<File | null>(null);
    const [previewURL, setPreviewURL] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

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
        event.target.value = "";
    };

    const onClear = () => {
        setDescription("");
        setAttachedImage(null);
        setIsSubmitted(false);
    };

    const descriptionLength = useMemo(() => description.trim().length, [description]);

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (descriptionLength === 0) {
            return;
        }

        // Frontend-only placeholder submit behavior until backend endpoint is available.
        setIsSubmitting(true);
        window.setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
            setDescription("");
            setAttachedImage(null);
        }, 450);
    };

    const imageSizeInKB = attachedImage ? Math.max(1, Math.round(attachedImage.size / 1024)) : 0;

    return (
        <Box component="form" onSubmit={onSubmit} sx={bugReportStyles.form}>
            <Alert severity="info">
                Frontend preview only: this form does not send data to the server yet.
            </Alert>

            <Card sx={bugReportStyles.card}>
                <CardContent>
                    <Typography variant="h6" sx={bugReportStyles.subheading}>
                        Describe the bug
                    </Typography>
                    <TextField
                        value={description}
                        onChange={(event) => {
                            setDescription(event.target.value);
                            setIsSubmitted(false);
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
                        {isSubmitting ? "Submitting..." : "Submit Bug Report"}
                    </Button>
                </CardActions>
            </Card>

            {isSubmitted && (
                <Alert severity="success">
                    Bug report captured in the UI preview. Backend submission will be added later.
                </Alert>
            )}
        </Box>
    );
};

export default BugReport;
