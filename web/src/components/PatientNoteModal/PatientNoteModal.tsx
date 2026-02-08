import React, { useState, useEffect, useCallback } from "react";
import {
    Modal,
    Typography,
    Button,
    Grid,
    TextField,
    CircularProgress,
    Alert,
    List,
    ListItem,
    ListItemText,
    Box,
} from "@mui/material";
import { apiFetch, Endpoint } from "@cbr/common/util/endpoints";
import * as S from "./PatientNoteModal.styles"; // Import your styles

interface INote {
    id: string;
    note: string;
    created_at: string;
    created_by_username?: string;
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

    const loadLatestNote = useCallback(() => {
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
    }, [clientId]);
    
    useEffect(() => {
        if (open && clientId) {
            loadLatestNote();
        }
    }, [open, clientId, loadLatestNote]);
    

    const loadHistory = () => {
        if (showHistory) {
            setShowHistory(false);
            return;
        }
        setIsLoading(true);
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
                setShowHistory(false);
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
            <S.ModalContainer>
                <Typography variant="h6" gutterBottom>
                    {title}
                </Typography>

                {isLoading && <CircularProgress sx={{ display: "block", m: "20px auto" }} />}

                {!isLoading && (
                    <>
                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}

                        {isEditing ? (
                            <TextField
                                multiline
                                rows={6}
                                fullWidth
                                value={localNote}
                                onChange={(e) => setLocalNote(e.target.value)}
                                sx={{ mb: 2 }}
                                autoFocus
                            />
                        ) : (
                            <S.NoteDisplayBox>
                                <Typography>{dbNote || "No note recorded."}</Typography>
                            </S.NoteDisplayBox>
                        )}

                        <Grid container justifyContent="space-between" alignItems="center">
                            <Button size="small" onClick={loadHistory}>
                                {showHistory ? "Hide History" : "View Past Notes"}
                            </Button>
                            <Box>
                                {isEditing ? (
                                    <>
                                        <Button onClick={() => setIsEditing(false)}>Cancel</Button>
                                        <Button
                                            variant="contained"
                                            onClick={handleSave}
                                            disabled={isNoteEmpty || isNoteUnchanged}
                                        >
                                            Submit
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            variant="contained"
                                            onClick={() => setIsEditing(true)}
                                            sx={{ mr: 1 }}
                                        >
                                            Edit
                                        </Button>
                                        <Button variant="outlined" onClick={handleClose}>
                                            Close
                                        </Button>
                                    </>
                                )}
                            </Box>
                        </Grid>

                        {showHistory && (
                            <S.HistoryContainer>
                                <S.HistoryTitle variant="subtitle2">History Log</S.HistoryTitle>
                                <List dense>
                                    {history.map((item) => (
                                        <ListItem
                                            key={item.id}
                                            alignItems="flex-start"
                                            sx={{ px: 0 }}
                                        >
                                            <ListItemText
                                                primary={item.note}
                                                secondary={`${new Date(
                                                    item.created_at
                                                ).toLocaleDateString()} ${new Date(
                                                    item.created_at
                                                ).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })} - ${item.created_by_username || "System"}`}
                                                secondaryTypographyProps={{ variant: "caption" }}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </S.HistoryContainer>
                        )}
                    </>
                )}
            </S.ModalContainer>
        </Modal>
    );
};

export default PatientNoteModal;
