import { RiskLevel, RiskType } from "@cbr/common/util/risks";
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
import PreviousGoalCard from "../PreviousGoalCard.tsx/PreviousGoalCard";

interface IModalProps {
    close: () => void;
}

// TODO: Replace with IRisk once changes are made
interface ITempRisk {
    id: number;
    risk_level: RiskLevel;
    risk_type: RiskType;
    goal: string;
    timestamp: string;
    end_date: string;
    // maybe use an ENUM here instead?
    goal_status: string;
}

// TODO: Need to take in the current user ID
const PreviousGoalsModal = (props: IModalProps, clientId?: string) => {
    //TODO: Make API call in here to get the current users previous goals
    const sampleData: ITempRisk[] = [
        {
            id: 1,
            risk_level: RiskLevel.CRITICAL,
            risk_type: RiskType.HEALTH,
            goal: "Textbooks1",
            timestamp: "01/01/2024",
            end_date: "05/05/2024",
            goal_status: "Achieved",
        },
        {
            id: 2,
            risk_level: RiskLevel.MEDIUM,
            risk_type: RiskType.SOCIAL,
            goal: "super long",
            timestamp: "01/01/2024",
            end_date: "05/05/2024",
            goal_status: "Cancelled",
        },
        {
            id: 3,
            risk_level: RiskLevel.LOW,
            risk_type: RiskType.MENTAL,
            goal: "Textbooks3",
            timestamp: "01/01/2024",
            end_date: "05/05/2024",
            goal_status: "Achieved",
        },
        {
            id: 4,
            risk_level: RiskLevel.HIGH,
            risk_type: RiskType.EDUCATION,
            goal: "Textbooks4",
            timestamp: "01/01/2024",
            end_date: "05/05/2024",
            goal_status: "Cancelled",
        },
        {
            id: 5,
            risk_level: RiskLevel.CRITICAL,
            risk_type: RiskType.EDUCATION,
            goal: "Textbooks5",
            timestamp: "01/01/2024",
            end_date: "05/05/2024",
            goal_status: "Achieved",
        },
        {
            id: 6,
            risk_level: RiskLevel.HIGH,
            risk_type: RiskType.SOCIAL,
            goal: "Textbooks6",
            timestamp: "01/01/2024",
            end_date: "05/05/2024",
            goal_status: "Achieved",
        },
    ];
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

    const defaultUserData: ITempRisk = {
        id: 1,
        risk_level: RiskLevel.CRITICAL,
        risk_type: RiskType.HEALTH,
        goal: "Textbooks1",
        timestamp: "01/01/2024",
        end_date: "05/05/2024",
        goal_status: "check",
    };
    const [isPrevGoalOpen, setPrevGoalOpen] = useState(false);
    const [prevGoalInfo, setPrevGoalInfo] = useState<ITempRisk>(defaultUserData);

    // Table Configs
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
    const memoizedSampleData = useMemo(() => [...sampleData], [sampleData]);

    const visibleRows = useMemo(
        () => [...memoizedSampleData].slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        [page, rowsPerPage, memoizedSampleData]
    );

    const handleRowClick = (data: ITempRisk) => {
        setPrevGoalInfo(data);
        setPrevGoalOpen(true);
    };

    const openPrevGoalModal = () => {
        setPrevGoalOpen(false);
    };

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
                                            <TableCell>{data.goal}</TableCell>
                                            <TableCell>{data.timestamp}</TableCell>
                                            <TableCell>{data.end_date}</TableCell>
                                            <TableCell>
                                                {data.goal_status === "Achieved" ? (
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
                <PreviousGoalCard
                    open={isPrevGoalOpen}
                    risk={prevGoalInfo}
                    close={openPrevGoalModal}
                />
            </Dialog>
        </>
    );
};

export default PreviousGoalsModal;
