import React, { useState, useEffect, useCallback } from "react";
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    Button as RNButton,
} from "react-native";
import { apiFetch, Endpoint } from "@cbr/common";
import { styles } from "./PatientNoteModal.styles";

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
    initialMode?: "view" | "edit" | "history";
    onNoteUpdated?: () => void;
}

const PatientNoteModal: React.FC<PatientNoteModalProps> = ({
    open,
    clientId,
    onClose,
    title = "Patient Note",
    initialMode = "view",
    onNoteUpdated,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [dbNote, setDbNote] = useState("");
    const [localNote, setLocalNote] = useState("");
    const [history, setHistory] = useState<INote[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
            if (initialMode === "edit") {
                setIsEditing(true);
                setShowHistory(false);
            } else if (initialMode === "history") {
                setIsEditing(false);
                setIsLoading(true);
                apiFetch(Endpoint.PATIENT_NOTES, `${clientId}/`)
                    .then(async (resp) => {
                        const data = await resp.json();
                        setHistory(data);
                        setShowHistory(true);
                    })
                    .catch(() => setError("Could not load history."))
                    .finally(() => setIsLoading(false));
            } else {
                setIsEditing(false);
                setShowHistory(false);
            }
        }
    }, [open, clientId, loadLatestNote, initialMode]);

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
            console.log(response);
            if (response.ok) {
                setDbNote(localNote);
                setIsEditing(false);
                setShowHistory(false);
                setError(null);
                setSuccessMessage("Note saved successfully.");
                loadLatestNote();
                onNoteUpdated?.();
            }
        } catch (e) {
            console.log(e);
            setSuccessMessage(null);
            setError("Could not save note.");
        }
    };

    const handleClose = () => {
        setIsEditing(false);
        setShowHistory(false);
        onClose();
    };

    const isNoteBlank = localNote.trim() === "";
    const isNoteUnchanged = localNote === dbNote;
    const isSaveDisabled = isNoteUnchanged || isNoteBlank;

    return (
        <Modal visible={open} transparent={true} animationType="fade" onRequestClose={handleClose}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>{title}</Text>

                    {isLoading && <ActivityIndicator size="large" style={{ marginVertical: 20 }} />}

                    {!isLoading && (
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {error && (
                                <View style={styles.errorAlert}>
                                    <Text style={styles.errorText}>{error}</Text>
                                </View>
                            )}

                            {successMessage && (
                                <View style={styles.successAlert}>
                                    <Text style={styles.successText}>{successMessage}</Text>
                                </View>
                            )}

                            {isEditing ? (
                                <TextInput
                                    style={styles.input}
                                    multiline
                                    numberOfLines={6}
                                    value={localNote}
                                    onChangeText={setLocalNote}
                                    placeholder="No note recorded."
                                    autoFocus
                                />
                            ) : (
                                <View style={styles.noteDisplayBox}>
                                    <Text>{dbNote || "No note recorded."}</Text>
                                </View>
                            )}

                            <View style={styles.buttonRow}>
                                <TouchableOpacity onPress={loadHistory}>
                                    <Text style={{ color: "#1976d2", fontWeight: "600" }}>
                                        {showHistory ? "Hide History" : "View Past Notes"}
                                    </Text>
                                </TouchableOpacity>

                                <View style={styles.actionButtons}>
                                    {isEditing ? (
                                        <>
                                            <RNButton
                                                title="Cancel"
                                                onPress={() => setIsEditing(false)}
                                                color="#757575"
                                            />
                                            <RNButton
                                                title="Submit"
                                                onPress={handleSave}
                                                disabled={isSaveDisabled}
                                                color="#283364"
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <RNButton
                                                title="Edit"
                                                onPress={() => {
                                                    setIsEditing(true);
                                                    setSuccessMessage(null);
                                                }}
                                                color="#283364"
                                            />
                                            <View style={{ width: 8 }} />
                                            <RNButton
                                                title="Close"
                                                onPress={handleClose}
                                                color="#757575"
                                            />
                                        </>
                                    )}
                                </View>
                            </View>

                            {showHistory && (
                                <View style={styles.historyContainer}>
                                    <Text style={styles.historyTitle}>History Log</Text>
                                    {history.map((item) => (
                                        <View key={item.id} style={styles.historyItem}>
                                            <Text style={styles.historyNote}>{item.note}</Text>
                                            <Text style={styles.historyMeta}>
                                                {new Date(item.created_at).toLocaleDateString()}{" "}
                                                {new Date(item.created_at).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}{" "}
                                                - {item.created_by_username || "System"}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </ScrollView>
                    )}
                </View>
            </View>
        </Modal>
    );
};

export default PatientNoteModal;
