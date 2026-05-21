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
import { useDatabase } from "@nozbe/watermelondb/hooks";
import { Q } from "@nozbe/watermelondb";
import { modelName } from "../../models/constant";
import { styles } from "./PatientNoteModal.styles";

interface INote {
    id: string;
    note: string;
    createdAt: Date | null;
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
    const database = useDatabase();
    const [isEditing, setIsEditing] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [dbNote, setDbNote] = useState("");
    const [localNote, setLocalNote] = useState("");
    const [history, setHistory] = useState<INote[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!open || !clientId) return;

        setIsEditing(initialMode === "edit");
        setShowHistory(false);
        setError(null);
        setSuccessMessage(null);

        const init = async () => {
            setIsLoading(true);
            try {
                const notes = await database
                    .get(modelName.patient_notes)
                    .query(
                        Q.where("client_id", clientId),
                        Q.sortBy("created_at", Q.desc),
                        Q.take(1)
                    )
                    .fetch();
                const note = notes.length > 0 ? (notes[0] as any).note ?? "" : "";
                setDbNote(note);
                setLocalNote(note);

                if (initialMode === "history") {
                    const allNotes = await database
                        .get(modelName.patient_notes)
                        .query(Q.where("client_id", clientId), Q.sortBy("created_at", Q.desc))
                        .fetch();
                    setHistory(
                        allNotes.map((n: any) => ({
                            id: n.id,
                            note: n.note,
                            createdAt: n.createdAt,
                        }))
                    );
                    setShowHistory(true);
                }
            } catch {
                setError("Failed to load note.");
            } finally {
                setIsLoading(false);
            }
        };

        init();
    }, [open, clientId, database, initialMode]);

    const refreshLatestNote = useCallback(async () => {
        const notes = await database
            .get(modelName.patient_notes)
            .query(Q.where("client_id", clientId), Q.sortBy("created_at", Q.desc), Q.take(1))
            .fetch();
        const note = notes.length > 0 ? (notes[0] as any).note ?? "" : "";
        setDbNote(note);
        setLocalNote(note);
    }, [clientId, database]);

    const toggleHistory = async () => {
        if (showHistory) {
            setShowHistory(false);
            return;
        }
        setIsLoading(true);
        try {
            const allNotes = await database
                .get(modelName.patient_notes)
                .query(Q.where("client_id", clientId), Q.sortBy("created_at", Q.desc))
                .fetch();
            setHistory(
                allNotes.map((n: any) => ({ id: n.id, note: n.note, createdAt: n.createdAt }))
            );
            setShowHistory(true);
        } catch {
            setError("Could not load history.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            await database.write(async () => {
                const client = await database.get(modelName.clients).find(clientId);
                await database.get(modelName.patient_notes).create((note: any) => {
                    note.note = localNote;
                    note.client.set(client);
                });
            });
            await refreshLatestNote();
            setIsEditing(false);
            setShowHistory(false);
            setError(null);
            setSuccessMessage("Note saved successfully.");
            onNoteUpdated?.();
        } catch {
            setSuccessMessage(null);
            setError("Could not save note.");
        }
    };

    const handleClose = () => {
        setIsEditing(false);
        setShowHistory(false);
        setError(null);
        setSuccessMessage(null);
        onClose();
    };

    const isNoteBlank = localNote.trim() === "";
    const isNoteUnchanged = localNote === dbNote;
    const isSaveDisabled = isNoteUnchanged || isNoteBlank;

    const formatDate = (date: Date | null) => {
        if (!date) return "";
        return (
            date.toLocaleDateString() +
            " " +
            date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        );
    };

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
                                <TouchableOpacity onPress={toggleHistory}>
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
                                    {history.length === 0 ? (
                                        <Text style={{ color: "#888", fontStyle: "italic" }}>
                                            No past notes.
                                        </Text>
                                    ) : (
                                        history.map((item) => (
                                            <View key={item.id} style={styles.historyItem}>
                                                <Text style={styles.historyNote}>{item.note}</Text>
                                                <Text style={styles.historyMeta}>
                                                    {formatDate(item.createdAt)}
                                                </Text>
                                            </View>
                                        ))
                                    )}
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
