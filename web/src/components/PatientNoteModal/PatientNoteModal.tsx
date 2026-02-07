import React, { useState, useEffect } from "react";
import {
    Modal,
    Box,
    Typography,
    Button,
    Grid,
    TextField,
    CircularProgress,
    Alert,
} from "@mui/material";
import { apiFetch, Endpoint } from "@cbr/common/util/endpoints";

interface PatientNoteModalProps {
    open: boolean;
    clientId: string;
    onClose: () => void;
    title?: string;
}

const PatientNoteModal: React.FC<PatientNoteModalProps> = ({
    open,
    clientId,
    onClose,
    title = "Patient Note",
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [dbNote, setDbNote] = useState(""); // The "original" from DB
    const [localNote, setLocalNote] = useState(""); // The one the user types in
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch latest note when modal opens
    useEffect(() => {
        if (open && clientId) {
            setIsLoading(true);
            setError(null);
            apiFetch(Endpoint.PATIENT_NOTES, `latest/${clientId}/`)
                .then(async (resp) => {
                    if (resp.status === 200) {
                        const data = await resp.json();
                        setDbNote(data.note || "");
                        setLocalNote(data.note || "");
                    } else if (resp.status === 404) {
                        setDbNote("");
                        setLocalNote("");
                    }
                })
                .catch(() => setError("Failed to load note history."))
                .finally(() => setIsLoading(false));
        }
    }, [open, clientId]);

    const handleClose = () => {
        setIsEditing(false);
        setError(null);
        onClose();
    };

    const handleSave = async () => {
        try {
            const response = await apiFetch(Endpoint.PATIENT_NOTES, "", {
                method: "POST",
                body: JSON.stringify({
                    client: clientId,
                    note: localNote,
                }),
            });

            if (response.ok) {
                setDbNote(localNote); // Update reference so Submit disables again
                setIsEditing(false);
                handleClose();
            } else {
                throw new Error();
            }
        } catch (e) {
            setError("Could not save note. Please try again.");
        }
    };

    // Validation logic
    const isNoteEmpty = localNote.trim() === "";
    const isNoteUnchanged = localNote === dbNote;

    return (
        <Modal open={open} onClose={handleClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 500,
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                }}
            >
                <Typography variant="h6" gutterBottom>
                    {title}
                </Typography>

                {isLoading ? (
                    <Box display="flex" justifyContent="center" p={3}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                        {!isEditing ? (
                            <>
                                <Box
                                    sx={{
                                        p: 2,
                                        bgcolor: "#f5f5f5",
                                        borderRadius: 1,
                                        minHeight: "100px",
                                        mb: 2,
                                        whiteSpace: "pre-wrap",
                                    }}
                                >
                                    <Typography>
                                        {dbNote || "No note recorded for this patient."}
                                    </Typography>
                                </Box>
                                <Grid container justifyContent="flex-end" spacing={2}>
                                    <Grid item>
                                        <Button variant="contained" onClick={() => setIsEditing(true)}>
                                            Edit
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button variant="outlined" onClick={handleClose}>
                                            Close
                                        </Button>
                                    </Grid>
                                </Grid>
                            </>
                        ) : (
                            <>
                                <TextField
                                    multiline
                                    rows={6}
                                    fullWidth
                                    value={localNote}
                                    onChange={(e) => setLocalNote(e.target.value)}
                                    sx={{ mb: 2 }}
                                    autoFocus
                                />

                                <Grid container spacing={2} justifyContent="flex-end">
                                    <Grid item>
                                        <Button variant="outlined" onClick={() => setIsEditing(false)}>
                                            Cancel
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            variant="contained"
                                            onClick={handleSave}
                                            disabled={isNoteEmpty || isNoteUnchanged}
                                        >
                                            Submit
                                        </Button>
                                    </Grid>
                                </Grid>
                            </>
                        )}
                    </>
                )}
            </Box>
        </Modal>
    );
};

export default PatientNoteModal;