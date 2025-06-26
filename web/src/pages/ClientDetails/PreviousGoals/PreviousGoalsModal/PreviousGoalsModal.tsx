import { RiskType } from "@cbr/common/util/risks";
import {
    Alert,
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
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ParentTableContainer } from "./PreviousGoalsModal.styles";
import PreviousGoalCard from "../PreviousGoalCard.tsx/PreviousGoalCard";
import { apiFetch, Endpoint } from "@cbr/common/util/endpoints";
import { IRisk } from "@cbr/common/util/risks";
import { timestampToFormDate } from "@cbr/common/util/dates";
import GoalStatusChip from "components/GoalStatusChip/GoalStatusChip";

interface IModalProps {
    clientId: string;
    close: () => void;
}

// TODO: Need to take in the current user ID
const PreviousGoalsModal = ({ clientId, close }: IModalProps) => {

    const [goals, setGoals] = useState<IRisk[]>([]);

    const [isPrevGoalOpen, setPrevGoalOpen] = useState(false);
    const [prevGoalInfo, setPrevGoalInfo] = useState<IRisk | null>(null);
    const [loadingError, setLoadingError] = useState(false);

    // Table Configs
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const getPreviousGoals = useCallback(() => {
        apiFetch(Endpoint.RISKS, `?client_id=${clientId}`)
            .then((resp) => resp.json())
            .then((data: IRisk[]) => {
                console.log("Fetched previous goals:", data);
                console.log("clientId", clientId);
                setGoals(data);
            })
            .catch((err) => {
                setLoadingError(true)
                console.error("Failed to load previous goals", err);
            })
    }, [clientId]);

    useEffect(() => {
        getPreviousGoals();
    }, [getPreviousGoals]);

    const { t } = useTranslation();
    const getDialogTitleText = (riskType: RiskType): string => {
        switch (riskType) {
            case RiskType.HEALTH:
                return t("general.health");
            case RiskType.EDUCATION:
                return t("general.education");
            case RiskType.SOCIAL:
                return t("general.social");
            case RiskType.NUTRITION:
                return t("general.nutrition");
            case RiskType.MENTAL:
                return t("general.mental");
            default:
                console.error("Unknown risk type.");
                return "";
        }
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // TODO: To be used when we make the initial GET for the data, prevents it from having to be loaded again
    const memoizedSampleData = useMemo(() => [...goals], [goals]);

    const visibleRows = useMemo(
        () => [...memoizedSampleData].slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        [page, rowsPerPage, memoizedSampleData]
    );

    const handleRowClick = (data: IRisk) => {
        setPrevGoalInfo(data);
        setPrevGoalOpen(true);
    };

    const openPrevGoalModal = () => {
        setPrevGoalOpen(false);
    };

    if (loadingError) {
            // TODO: add loading error for loading risks
            return <Alert severity="error">{t("alert.loadClientFailure")}</Alert>;
        }
    return (
        <>
            <Dialog fullWidth maxWidth="lg" open={true} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Viewing Previous Goals</DialogTitle>
                <DialogContent>
                    <ParentTableContainer>
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
                                        <TableRow
                                            key={data.id}
                                            onClick={() => handleRowClick(data)}
                                        >
                                            <TableCell component="th" scope="row">
                                                <RiskLevelChip risk={data.risk_level} />
                                            </TableCell>
                                            <TableCell>
                                                {getDialogTitleText(data.risk_type)}
                                            </TableCell>
                                            <TableCell>{data.goal_name}</TableCell>
                                            <TableCell>{timestampToFormDate(data.timestamp, true)}</TableCell>
                                            <TableCell>{timestampToFormDate(data.end_date, true)}</TableCell>
                                            <TableCell>
                                                <GoalStatusChip/>
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
                        count={goals.length}
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
                            close();
                        }}
                    >
                        {t("general.goBack")}
                    </Button>
                </DialogActions>
                {prevGoalInfo && (
                    <PreviousGoalCard
                        open={isPrevGoalOpen}
                        risk={prevGoalInfo}
                        close={openPrevGoalModal}
                    />
                )}
            </Dialog>
        </>
    );
};

export default PreviousGoalsModal;
