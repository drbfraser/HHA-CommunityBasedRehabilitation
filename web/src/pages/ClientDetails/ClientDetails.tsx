import React, { useState, useEffect, useCallback } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    Alert,
    Grid,
    Skeleton,
    Typography,
    Button,
    styled,
    Box,
    CircularProgress,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import EditIcon from "@mui/icons-material/Edit";
import HistoryIcon from "@mui/icons-material/History";

import { apiFetch, Endpoint } from "@cbr/common/util/endpoints";
import { IClient } from "@cbr/common/util/clients";
import { IRisk } from "@cbr/common/util/risks";
import { timestampToFormDate } from "@cbr/common/util/dates";
import ClientInfoForm from "./ClientInfoForm";
import ClientRisks from "./Risks/ClientRisks";
import ClientTimeline from "./ClientTimeline/ClientTimeline";
import PreviousGoalsModal from "./PreviousGoals/PreviousGoalsModal/PreviousGoalsModal";
import PatientNoteModal from "components/PatientNoteModal/PatientNoteModal";

interface IUrlParam {
    clientId: string;
}

const SectionHeader = styled(Typography)({
    marginLeft: "20px",
});

const NoteDisplayBox = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    backgroundColor: theme.palette.grey[50],
    borderRadius: theme.shape.borderRadius,
    whiteSpace: "pre-wrap" as const,
    minHeight: "60px",
    border: `1px solid ${theme.palette.divider}`,
}));

const ClientDetails = () => {
    const { clientId } = useParams<IUrlParam>();
    const [clientInfo, setClientInfo] = useState<IClient>();
    const [loadingError, setLoadingError] = useState(false);
    const history = useHistory();
    const { t } = useTranslation();
    const [isPrevGoalsOpen, setPrevGoalsOpen] = useState(false);
    const [patientNote, setPatientNote] = useState<string>("");
    const [noteLoading, setNoteLoading] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [historyModalOpen, setHistoryModalOpen] = useState(false);

    const handlePrevGoalsClick = () => {
        setPrevGoalsOpen((prevGoalsOpen) => !prevGoalsOpen);
    };

    const loadPatientNote = useCallback(() => {
        if (!clientId) return;
        setNoteLoading(true);
        apiFetch(Endpoint.PATIENT_NOTES, `latest/${clientId}/`)
            .then(async (resp) => {
                if (resp.status === 200) {
                    const data = await resp.json();
                    setPatientNote(data.note || "");
                } else {
                    setPatientNote("");
                }
            })
            .catch(() => setPatientNote(""))
            .finally(() => setNoteLoading(false));
    }, [clientId]);

    useEffect(() => {
        loadPatientNote();
    }, [loadPatientNote]);

    const getClient = useCallback(() => {
        apiFetch(Endpoint.CLIENT, clientId)
            .then((resp) => resp.json())
            .then((client: IClient) => {
                client.birth_date = timestampToFormDate(client.birth_date as number, true);
                client.risks.sort((a: IRisk, b: IRisk) => b.timestamp - a.timestamp);
                setClientInfo(client);
            })
            .catch(() => setLoadingError(true));
    }, [clientId]);

    useEffect(() => {
        getClient();
    }, [getClient]);

    if (loadingError) {
        return <Alert severity="error">{t("alert.loadClientFailure")}</Alert>;
    }
    return (
        <>
            {isPrevGoalsOpen && (
                <PreviousGoalsModal clientId={clientId} close={handlePrevGoalsClick} />
            )}
            <Grid container spacing={2} direction="row" justifyContent="flex-start">
                <Grid item xs={12}>
                    {clientInfo ? (
                        <ClientInfoForm clientInfo={clientInfo} />
                    ) : (
                        <Skeleton variant="rectangular" height={500} />
                    )}
                </Grid>

                <Grid item xs={12}>
                    <hr />
                </Grid>

                {/* Patient Note Section */}
                <Grid container justifyContent="space-between" direction="row" alignItems="center">
                    <Grid item xs={6}>
                        <SectionHeader variant="h5">
                            <b>Patient Note</b>
                        </SectionHeader>
                    </Grid>
                    <Grid item xs={6} style={{ textAlign: "right", paddingRight: "20px" }}>
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            startIcon={<EditIcon />}
                            onClick={() => setEditModalOpen(true)}
                            sx={{ mr: 1 }}
                        >
                            Edit
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<HistoryIcon />}
                            onClick={() => setHistoryModalOpen(true)}
                        >
                            View History
                        </Button>
                    </Grid>
                </Grid>
                <Grid item xs={12} sx={{ px: "20px" }}>
                    {noteLoading ? (
                        <CircularProgress size={24} />
                    ) : (
                        <NoteDisplayBox>
                            <Typography>
                                {patientNote || "No note recorded."}
                            </Typography>
                        </NoteDisplayBox>
                    )}
                </Grid>

                <Grid item xs={12}>
                    <hr />
                </Grid>

                <Grid container justifyContent="space-between" direction="row">
                    <Grid item xs={6}>
                        <SectionHeader variant="h5">
                            <b>{t("clientAttr.riskLevels")}</b>
                        </SectionHeader>
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            size="small"
                            style={{ float: "right" }}
                            onClick={() => history.push(`/client/${clientId}/risks`)}
                        >
                            {t("clientAttr.seeRiskHistory")}
                            <ArrowForwardIcon fontSize="small" />
                        </Button>
                    </Grid>
                </Grid>
                <Grid item xs={2}>
                    <Button
                        color="primary"
                        variant="contained"
                        fullWidth
                        onClick={handlePrevGoalsClick}
                    >
                        {t("goals.previousGoals")}
                    </Button>
                </Grid>

                <Grid item xs={12}>
                    <ClientRisks clientInfo={clientInfo} refreshClient={getClient} />
                </Grid>

                <Grid item xs={12}>
                    <hr />
                </Grid>

                <Grid item xs={6}>
                    <SectionHeader variant="h5">
                        <b>{t("clientAttr.visitsRefsSurveys")}</b>
                    </SectionHeader>
                </Grid>
                <Grid item xs={12}>
                    <ClientTimeline refreshClient={getClient} client={clientInfo} />
                </Grid>
            </Grid>

            <PatientNoteModal
                open={editModalOpen}
                clientId={clientId}
                onClose={() => setEditModalOpen(false)}
                initialMode="edit"
                title="Edit Patient Note"
                onNoteUpdated={loadPatientNote}
            />
            <PatientNoteModal
                open={historyModalOpen}
                clientId={clientId}
                onClose={() => setHistoryModalOpen(false)}
                initialMode="history"
                title="Patient Note History"
                onNoteUpdated={loadPatientNote}
            />
        </>
    );
};

export default ClientDetails;
