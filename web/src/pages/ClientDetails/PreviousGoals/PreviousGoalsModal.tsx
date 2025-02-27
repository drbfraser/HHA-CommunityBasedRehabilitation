import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
} from "@mui/material";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

interface IModalProps {
    close: () => void;
}
const PreviousGoalsModal = (props: IModalProps) => {
    const sampleData = [
        {
            id: 1,
            riskLevel: "Health",
            area: "Bidi Bidi",
            goalDesc: "Textbooks1",
            startDate: "01/01/2024",
            achDate: "05/05/2024",
            status: "check",
        },
        {
            id: 2,
            riskLevel: "Health",
            area: "Bidi Bidi",
            goalDesc: "Textbooks2",
            startDate: "01/01/2024",
            achDate: "05/05/2024",
            status: "check",
        },
        {
            id: 3,
            riskLevel: "Health",
            area: "Bidi Bidi",
            goalDesc: "Textbooks3",
            startDate: "01/01/2024",
            achDate: "05/05/2024",
            status: "check",
        },
        {
            id: 4,
            riskLevel: "Health",
            area: "Bidi Bidi",
            goalDesc: "Textbooks4",
            startDate: "01/01/2024",
            achDate: "05/05/2024",
            status: "check",
        },
        {
            id: 5,
            riskLevel: "Health",
            area: "Bidi Bidi",
            goalDesc: "Textbooks5",
            startDate: "01/01/2024",
            achDate: "05/05/2024",
            status: "check",
        },
        {
            id: 6,
            riskLevel: "Health",
            area: "Bidi Bidi",
            goalDesc: "Textbooks6",
            startDate: "01/01/2024",
            achDate: "05/05/2024",
            status: "check",
        },
    ];
    const { t } = useTranslation();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // TODO: To be used when we make the initial GET for the data, prevents it from having to be loaded again
    const memoizedSampleData = useMemo(() => [...sampleData], []);

    const visibleRows = useMemo(
        () => [...memoizedSampleData].slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        [page, rowsPerPage, memoizedSampleData]
    );

    return (
        <Dialog fullWidth maxWidth="lg" open={true} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Viewing Previous Goals</DialogTitle>
            <DialogContent>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Risk Level</TableCell>
                                <TableCell align="right">Area</TableCell>
                                <TableCell align="right">Goal Description</TableCell>
                                <TableCell align="right">Start Date</TableCell>
                                <TableCell align="right">Achieved Date</TableCell>
                                <TableCell align="right">Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {visibleRows.map((data, index) => {
                                return (
                                    <TableRow key={data.id}>
                                        <TableCell component="th" scope="row">
                                            {data.riskLevel}
                                        </TableCell>
                                        <TableCell align="right">{data.area}</TableCell>
                                        <TableCell align="right">{data.goalDesc}</TableCell>
                                        <TableCell align="right">{data.startDate}</TableCell>
                                        <TableCell align="right">{data.achDate}</TableCell>
                                        <TableCell align="right">{data.status}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[]}
                    component="div"
                    count={sampleData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
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
