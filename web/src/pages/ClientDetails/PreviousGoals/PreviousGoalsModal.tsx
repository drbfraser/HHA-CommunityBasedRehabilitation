import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyledTablePaper } from "./PreviousGoalsModal.styles";

interface IModalProps {
    close: () => void;
}
const PreviousGoalsModal = (props: IModalProps) => {
    const { t } = useTranslation();
    const paginationModel = { page: 0, pageSize: 5 };
    const columns: GridColDef[] = [
        { field: "riskLevel", headerName: "Risk Level" },
        { field: "area", headerName: "Area" },
        { field: "goalDesc", headerName: "Goal Description" },
        { field: "startDate", headerName: "Start Date" },
        { field: "achDate", headerName: "Achieved Date" },
        { field: "status", headerName: "" },
    ];

    const sampleData = [
        {
            id: 1,
            riskLevel: "Health",
            area: "Bidi Bidi",
            goalDesc: "Textbooks",
            startDate: "01/01/2024",
            achDate: "05/05/2024",
            status: "check",
        },
        {
            id: 2,
            riskLevel: "Health",
            area: "Bidi Bidi",
            goalDesc: "Textbooks",
            startDate: "01/01/2024",
            achDate: "05/05/2024",
            status: "check",
        },
        {
            id: 3,
            riskLevel: "Health",
            area: "Bidi Bidi",
            goalDesc: "Textbooks",
            startDate: "01/01/2024",
            achDate: "05/05/2024",
            status: "check",
        },
        {
            id: 4,
            riskLevel: "Health",
            area: "Bidi Bidi",
            goalDesc: "Textbooks",
            startDate: "01/01/2024",
            achDate: "05/05/2024",
            status: "check",
        },
        {
            id: 5,
            riskLevel: "Health",
            area: "Bidi Bidi",
            goalDesc: "Textbooks",
            startDate: "01/01/2024",
            achDate: "05/05/2024",
            status: "check",
        },
        {
            id: 6,
            riskLevel: "Health",
            area: "Bidi Bidi",
            goalDesc: "Textbooks",
            startDate: "01/01/2024",
            achDate: "05/05/2024",
            status: "check",
        },
    ];

    return (
        <Dialog fullWidth maxWidth="lg" open={true} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Viewing Previous Goals</DialogTitle>
            <DialogContent>
                <StyledTablePaper>
                    <DataGrid
                        rows={sampleData}
                        columns={columns}
                        initialState={{ pagination: paginationModel }}
                    />
                </StyledTablePaper>
            </DialogContent>
            <DialogActions>
                <Button
                    variant="outlined"
                    color="primary"
                    type="reset"
                    onClick={() => {
                        props.close();
                    }}
                >
                    {t("general.goBack")}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PreviousGoalsModal;
