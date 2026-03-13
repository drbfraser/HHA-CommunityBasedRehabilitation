import { Box, Typography, styled } from "@mui/material";

export const ModalContainer = styled(Box)(({ theme }) => ({
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 550,
    backgroundColor: theme.palette.background.paper,
    boxShadow: "24px", // matches shadow level 24
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius * 2,
    maxHeight: "90vh",
    overflowY: "auto",
    outline: "none",
}));

export const NoteDisplayBox = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    backgroundColor: theme.palette.grey[100],
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(2),
    whiteSpace: "pre-wrap",
    minHeight: "100px",
    border: `1px solid ${theme.palette.divider}`,
}));

export const HistoryContainer = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(3),
    paddingTop: theme.spacing(2),
    borderTop: `1px solid ${theme.palette.divider}`,
}));

export const HistoryTitle = styled(Typography)(({ theme }) => ({
    variant: "subtitle2",
    fontWeight: 600,
    marginBottom: theme.spacing(1),
    color: theme.palette.text.secondary,
}));
