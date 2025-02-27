import { RiskLevel } from "@cbr/common/util/risks";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
} from "@mui/material";
import RiskLevelChip from "components/RiskLevelChip/RiskLevelChip";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ParentTableContainer } from "./PreviousGoalsModal.styles";

interface IModalProps {
    close: () => void;
}
const PreviousGoalsModal = (props: IModalProps) => {
    const sampleData = [
        {
            id: 1,
            riskLevel: RiskLevel.CRITICAL,
            area: "Health",
            goalDesc: "Textbooks1",
            startDate: "01/01/2024",
            achDate: "05/05/2024",
            status: "check",
        },
        {
            id: 2,
            riskLevel: RiskLevel.MEDIUM,
            area: "Health",
            goalDesc: "super long",
            startDate: "01/01/2024",
            achDate: "05/05/2024",
            status: "cancelled",
        },
        {
            id: 3,
            riskLevel: RiskLevel.LOW,
            area: "Health",
            goalDesc: "Textbooks3",
            startDate: "01/01/2024",
            achDate: "05/05/2024",
            status: "check",
        },
        {
            id: 4,
            riskLevel: RiskLevel.HIGH,
            area: "Health",
            goalDesc: "Textbooks4",
            startDate: "01/01/2024",
            achDate: "05/05/2024",
            status: "cancelled",
        },
        {
            id: 5,
            riskLevel: RiskLevel.CRITICAL,
            area: "Health",
            goalDesc: "Textbooks5",
            startDate: "01/01/2024",
            achDate: "05/05/2024",
            status: "check",
        },
        {
            id: 6,
            riskLevel: RiskLevel.HIGH,
            area: "Health",
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

    const handleRowClick = (id: number) => {
        console.log("create new modal here", id);
    };

    return (
        <Dialog fullWidth maxWidth="lg" open={true} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Viewing Previous Goals</DialogTitle>
            <DialogContent>
                <ParentTableContainer sx={{ height: 400 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Risk Level</TableCell>
                                <TableCell>Area</TableCell>
                                <TableCell>Goal Description</TableCell>
                                <TableCell>Start Date</TableCell>
                                <TableCell>Achieved Date</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {visibleRows.map((data, index) => {
                                return (
                                    <TableRow key={data.id} onClick={() => handleRowClick(data.id)}>
                                        <TableCell component="th" scope="row">
                                            <RiskLevelChip risk={data.riskLevel} />
                                        </TableCell>
                                        <TableCell>{data.area}</TableCell>
                                        <TableCell>{data.goalDesc}</TableCell>
                                        <TableCell>{data.startDate}</TableCell>
                                        <TableCell>{data.achDate}</TableCell>
                                        <TableCell>
                                            {data.status === "check" ? (
                                                <CheckCircleOutlineIcon color="success" />
                                            ) : (
                                                <CancelOutlinedIcon color="error" />
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </ParentTableContainer>
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
