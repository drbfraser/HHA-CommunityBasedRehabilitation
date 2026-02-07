import React, { useState } from "react";
import {
    Modal,
    Box,
    Typography,
    Button,
    Grid,
    TextField,
} from "@mui/material";

interface PatientNoteModalProps {
    open: boolean;
    note: string;
    onClose: () => void;
    onSave: (updatedNote: string) => void;
    title?: string;
}

const PatientNoteModal: React.FC<PatientNoteModalProps> = ({
    open,
    note,
    onClose,
    onSave,
    title = "Patient Note",
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [localNote, setLocalNote] = useState(note);

    const handleClose = () => {
        setIsEditing(false);
        setLocalNote(note); // reset if cancelled
        onClose();
    };

    const handleSave = () => {
        onSave(localNote);
        setIsEditing(false);
        onClose();
    };

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

                {!isEditing ? (
                    <>
                        <Typography
                            variant="body1"
                            sx={{ whiteSpace: "pre-line", mb: 2 }}
                        >
                            {localNote}
                        </Typography>

                        <Button
                            variant="contained"
                            onClick={() => setIsEditing(true)}
                        >
                            Edit
                        </Button>
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
                        />

                        <Grid container spacing={2} justifyContent="flex-end">
                            <Grid item>
                                <Button variant="outlined" onClick={handleClose}>
                                    Cancel
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    variant="contained"
                                    onClick={handleSave}
                                >
                                    Submit
                                </Button>
                            </Grid>
                        </Grid>
                    </>
                )}
            </Box>
        </Modal>
    );
};

export default PatientNoteModal;
