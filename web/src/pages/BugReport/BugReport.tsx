import React, { useEffect, useMemo, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
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
import UnsavedChanges from "components/Dialogs/UnsavedChanges";
import { bugReportStyles } from "./BugReport.styles";

const MAX_DESCRIPTION_LENGTH = 1200;
type ReportType = "bug_report" | "suggestion";
type UserViewLocationState = {
    bugReportSuccessMessage?: string;
};

const BugReport = () => {
    const history = useHistory();
    const [reportType, setReportType] = useState<ReportType>("bug_report");
    const [description, setDescription] = useState("");
    const [attachedImage, setAttachedImage] = useState<File | null>(null);
    const [previewURL, setPreviewURL] = useState<string | null>(null);
    const [isOffline, setIsOffline] = useState(
        typeof navigator !== "undefined" ? !navigator.onLine : false
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [confirmLeaveOpen, setConfirmLeaveOpen] = useState(false);
    const [pendingNavigation, setPendingNavigation] =
        useState<{
            pathname: string;
            search: string;
            hash: string;
            state: unknown;
            action: "POP" | "PUSH" | "REPLACE";
        } | null>(null);
    const allowNavigationRef = useRef(false);

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

    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    const onImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedImage = event.target.files?.[0] ?? null;
        setAttachedImage(selectedImage);
        setSubmitError(null);
        event.target.value = "";
    };

    const descriptionLength = useMemo(() => description.trim().length, [description]);
    const isDirty = descriptionLength > 0 || attachedImage !== null;

    useEffect(() => {
        if (!isDirty) {
            return;
        }

        const unblock = history.block((nextLocation, action) => {
            if (allowNavigationRef.current) {
                return;
            }

            if (
                history.location.pathname === nextLocation.pathname &&
                history.location.search === nextLocation.search &&
                history.location.hash === nextLocation.hash
            ) {
                return;
            }

            setPendingNavigation({
                pathname: nextLocation.pathname,
                search: nextLocation.search,
                hash: nextLocation.hash,
                state: nextLocation.state,
                action,
            });
            setConfirmLeaveOpen(true);

            return false;
        });

        return unblock;
    }, [history, isDirty]);

    useEffect(() => {
        if (!isDirty) {
            return;
        }

        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            event.returnValue = "";
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [isDirty]);

    const handleLeaveCancel = () => {
        setConfirmLeaveOpen(false);
        setPendingNavigation(null);
    };

    const handleLeaveConfirm = () => {
        if (!pendingNavigation) {
            setConfirmLeaveOpen(false);
            return;
        }

        allowNavigationRef.current = true;
        setConfirmLeaveOpen(false);

        if (pendingNavigation.action === "REPLACE") {
            history.replace({
                pathname: pendingNavigation.pathname,
                search: pendingNavigation.search,
                hash: pendingNavigation.hash,
                state: pendingNavigation.state,
            });
            return;
        }

        if (pendingNavigation.action === "POP") {
            history.goBack();
            return;
        }

        history.push({
            pathname: pendingNavigation.pathname,
            search: pendingNavigation.search,
            hash: pendingNavigation.hash,
            state: pendingNavigation.state,
        });
    };

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (descriptionLength === 0 || isOffline) {
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
                const successMessage =
                    reportType === "suggestion"
                        ? "Your suggestion was created successfully."
                        : "Your bug report was created successfully.";

                allowNavigationRef.current = true;
                setDescription("");
                setAttachedImage(null);
                history.push("/user", {
                    bugReportSuccessMessage: successMessage,
                } as UserViewLocationState);
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
            {isOffline && (
                <Alert severity="error">
                    No internet connection. Connect to Wi-Fi or mobile data before submitting.
                </Alert>
            )}

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
                        type="submit"
                        variant="contained"
                        color="primary"
                        startIcon={<SendIcon />}
                        disabled={isSubmitting || descriptionLength === 0 || isOffline}
                    >
                        {isSubmitting ? "Submitting..." : submitLabel}
                    </Button>
                </CardActions>
            </Card>

            {submitError && <Alert severity="error">{submitError}</Alert>}

            <UnsavedChanges
                open={confirmLeaveOpen}
                setOpen={setConfirmLeaveOpen}
                title="Discard this draft?"
                description={`Your ${reportTypeLabel} has unsaved changes. Leaving now will discard the draft.`}
                saveBtnMsg="Leave page"
                cancelBtnMsg="Stay here"
                onSave={handleLeaveConfirm}
                onCancel={handleLeaveCancel}
            />
        </Box>
    );
};

export default BugReport;
