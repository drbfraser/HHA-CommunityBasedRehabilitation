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
    Divider,
    List,
    ListItem,
    ListItemText,
} from "@mui/material";
import { apiFetch, Endpoint } from "@cbr/common/util/endpoints";

interface INote {
    id: string;
    note: string;
    created_at: string;
    created_by_name?: string; // Assuming your serializer provides the name
}

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
    const [showHistory, setShowHistory] = useState(false);
    const [dbNote, setDbNote] = useState("");
    const [localNote, setLocalNote] = useState("");
    const [history, setHistory] = useState<INote[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch initial data
    useEffect(() => {
        if (open && clientId) {
            loadLatestNote();
        }
    }, [open, clientId]);

    const loadLatestNote = () => {
        setIsLoading(true);
        apiFetch(Endpoint.PATIENT_NOTES, `latest/${clientId}/`)
            .then(async (resp) => {
                if (resp.status === 200) {
                    const data = await resp.json();
                    setDbNote(data.note || "");
                    setLocalNote(data.note || "");
                }
            })
            .catch(() => setError("Failed to load note."))
            .finally(() => setIsLoading(false));
    };

    const loadHistory = () => {
        if (showHistory) {
            setShowHistory(false);
            return;
        }
        setIsLoading(true);
        // This hits the NoteList view in your views.py
        apiFetch(Endpoint.PATIENT_NOTES, `${clientId}/`)
            .then(async (resp) => {
                const data = await resp.json();
                setHistory(data);
                setShowHistory(true);
            })
            .catch(() => setError("Could not load history."))
            .finally(() => setIsLoading(false));
    };

    const handleSave = async () => {
        try {
            const response = await apiFetch(Endpoint.PATIENT_NOTES, "", {
                method: "POST",
                body: JSON.stringify({ client: clientId, note: localNote }),
            });
            if (response.ok) {
                setDbNote(localNote);
                setIsEditing(false);
                setShowHistory(false); // Reset history view to show newest
                loadLatestNote(); 
            }
        } catch (e) {
            setError("Could not save note.");
        }
    };

    const handleClose = () => {
        setIsEditing(false);
        setShowHistory(false);
        onClose();
    };

    const isNoteEmpty = localNote.trim() === "";
    const isNoteUnchanged = localNote === dbNote;

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%, -50%)", width: 550,
                bgcolor: "background.paper", boxShadow: 24, p: 4, borderRadius: 2,
                maxHeight: '90vh', overflowY: 'auto'
            }}>
                <Typography variant="h6" gutterBottom>{title}</Typography>

                {isLoading && <CircularProgress sx={{ display: 'block', m: '20px auto' }} />}

                {!isLoading && (
                    <>
                        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                        {isEditing ? (
                            <TextField
                                multiline rows={6} fullWidth value={localNote}
                                onChange={(e) => setLocalNote(e.target.value)}
                                sx={{ mb: 2 }} autoFocus
                            />
                        ) : (
                            <Box sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: 1, mb: 2, whiteSpace: "pre-wrap" }}>
                                <Typography>{dbNote || "No note recorded."}</Typography>
                            </Box>
                        )}

                        <Grid container justifyContent="space-between" alignItems="center">
                            <Button size="small" onClick={loadHistory}>
                                {showHistory ? "Hide History" : "View Past Notes"}
                            </Button>
                            <Box>
                                {isEditing ? (
                                    <>
                                        <Button onClick={() => setIsEditing(false)}>Cancel</Button>
                                        <Button variant="contained" onClick={handleSave} disabled={isNoteEmpty || isNoteUnchanged}>
                                            Submit
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button variant="contained" onClick={() => setIsEditing(true)} sx={{ mr: 1 }}>Edit</Button>
                                        <Button variant="outlined" onClick={handleClose}>Close</Button>
                                    </>
                                )}
                            </Box>
                        </Grid>

                        {showHistory && (
                            <Box sx={{ mt: 3 }}>
                                <Divider sx={{ mb: 2 }} />
                                <Typography variant="subtitle2" gutterBottom>History Log</Typography>
                                <List dense>
                                    {history.map((item) => (
                                        <ListItem key={item.id} alignItems="flex-start" sx={{ px: 0 }}>
                                            <ListItemText
                                                primary={item.note}
                                                secondary={`${new Date(item.created_at).toLocaleDateString()} - ${item.created_by_name || 'System'}`}
                                                secondaryTypographyProps={{ variant: 'caption' }}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        )}
                    </>
                )}
            </Box>
        </Modal>
    );
};

export default PatientNoteModal;