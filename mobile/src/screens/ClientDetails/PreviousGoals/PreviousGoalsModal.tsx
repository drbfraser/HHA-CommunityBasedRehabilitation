import {
    goalStatuses,
    getRiskGoalsTranslationKey,
    IRisk,
    OutcomeGoalMet,
    riskLevels,
    RiskType,
    timestampToFormDate,
} from "@cbr/common";
import React, { useEffect, useMemo, useState } from "react";
import { ScrollView } from "react-native";
import { Button, DataTable, Dialog, Portal, Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import PreviousGoalCard from "./PreviousGoalCard";
import styles from "./PreviousGoalsModal.styles";

interface PreviousGoalsModalProps {
    open: boolean;
    close: () => void;
    clientRisks: IRisk[];
}

const ROWS_PER_PAGE = 5;

const PreviousGoalsModal = ({ open, close, clientRisks }: PreviousGoalsModalProps) => {
    const { t } = useTranslation();
    const [page, setPage] = useState(0);
    const [selectedGoal, setSelectedGoal] = useState<IRisk | null>(null);
    const [openGoalCard, setOpenGoalCard] = useState(false);

    const getRiskTypeLabel = (riskType: RiskType): string => {
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

    const previousGoals = useMemo(
        () =>
            [...clientRisks]
                .filter(
                    (goal) =>
                        goal.goal_status === OutcomeGoalMet.CANCELLED ||
                        goal.goal_status === OutcomeGoalMet.CONCLUDED
                )
                .sort((a, b) => b.timestamp - a.timestamp),
        [clientRisks]
    );

    const visibleRows = useMemo(
        () => previousGoals.slice(page * ROWS_PER_PAGE, page * ROWS_PER_PAGE + ROWS_PER_PAGE),
        [page, previousGoals]
    );

    const numberOfPages = Math.max(1, Math.ceil(previousGoals.length / ROWS_PER_PAGE));

    useEffect(() => {
        if (!open) {
            setPage(0);
            setSelectedGoal(null);
            setOpenGoalCard(false);
        }
    }, [open]);

    useEffect(() => {
        const maxPage = Math.max(Math.ceil(previousGoals.length / ROWS_PER_PAGE) - 1, 0);
        if (page > maxPage) {
            setPage(maxPage);
        }
    }, [page, previousGoals.length]);

    const handleRowClick = (goal: IRisk) => {
        setSelectedGoal(goal);
        setOpenGoalCard(true);
    };

    const closeGoalCard = () => {
        setOpenGoalCard(false);
    };

    const paginationLabel =
        previousGoals.length === 0
            ? "0-0 / 0"
            : `${page * ROWS_PER_PAGE + 1}-${Math.min(
                  (page + 1) * ROWS_PER_PAGE,
                  previousGoals.length
              )} / ${previousGoals.length}`;

    return (
        <Portal>
            <Dialog visible={open} onDismiss={close} style={styles.dialog}>
                <Dialog.Title>{t("goals.viewingPreviousGoals")}</Dialog.Title>
                <Dialog.Content>
                    {previousGoals.length === 0 ? (
                        <Text style={styles.emptyText}>
                            {t("goals.noCurrentGoalSet", {
                                defaultValue: "No previous goals available.",
                            })}
                        </Text>
                    ) : (
                        <>
                            <ScrollView horizontal style={styles.tableContainer}>
                                <DataTable style={styles.table}>
                                    <DataTable.Header>
                                        <DataTable.Title
                                            style={[styles.headerCell, styles.riskLevelColumn]}
                                        >
                                            {t("risks.riskLevel")}
                                        </DataTable.Title>
                                        <DataTable.Title
                                            style={[styles.headerCell, styles.areaColumn]}
                                        >
                                            {t("risks.area")}
                                        </DataTable.Title>
                                        <DataTable.Title
                                            style={[styles.headerCell, styles.goalColumn]}
                                        >
                                            {t("risks.goalDescription")}
                                        </DataTable.Title>
                                        <DataTable.Title
                                            style={[styles.headerCell, styles.dateColumn]}
                                        >
                                            {t("general.startDate")}
                                        </DataTable.Title>
                                        <DataTable.Title
                                            style={[styles.headerCell, styles.dateColumn]}
                                        >
                                            {t("general.endDate")}
                                        </DataTable.Title>
                                        <DataTable.Title
                                            style={[styles.headerCell, styles.statusColumn]}
                                        >
                                            {t("general.status")}
                                        </DataTable.Title>
                                    </DataTable.Header>

                                    {visibleRows.map((goal) => (
                                        <DataTable.Row
                                            key={`${goal.id}-${goal.timestamp}`}
                                            onPress={() => handleRowClick(goal)}
                                        >
                                            <DataTable.Cell
                                                style={[styles.cell, styles.riskLevelColumn]}
                                            >
                                                {riskLevels[goal.risk_level]?.name ??
                                                    goal.risk_level}
                                            </DataTable.Cell>
                                            <DataTable.Cell
                                                style={[styles.cell, styles.areaColumn]}
                                            >
                                                {getRiskTypeLabel(goal.risk_type)}
                                            </DataTable.Cell>
                                            <DataTable.Cell
                                                style={[styles.cell, styles.goalColumn]}
                                            >
                                                {t(
                                                    `${getRiskGoalsTranslationKey(
                                                        goal.risk_type
                                                    )}.${goal.goal_name}`,
                                                    { defaultValue: goal.goal_name }
                                                )}
                                            </DataTable.Cell>
                                            <DataTable.Cell
                                                style={[styles.cell, styles.dateColumn]}
                                            >
                                                {timestampToFormDate(goal.start_date, true)}
                                            </DataTable.Cell>
                                            <DataTable.Cell
                                                style={[styles.cell, styles.dateColumn]}
                                            >
                                                {timestampToFormDate(goal.end_date, true)}
                                            </DataTable.Cell>
                                            <DataTable.Cell
                                                style={[styles.cell, styles.statusColumn]}
                                            >
                                                {goalStatuses[goal.goal_status]?.name ??
                                                    goal.goal_status}
                                            </DataTable.Cell>
                                        </DataTable.Row>
                                    ))}
                                </DataTable>
                            </ScrollView>
                            <DataTable.Pagination
                                style={styles.pagination}
                                page={page}
                                numberOfPages={numberOfPages}
                                onPageChange={setPage}
                                label={paginationLabel}
                                showFastPaginationControls
                            />
                        </>
                    )}
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={close}>{t("general.goBack")}</Button>
                </Dialog.Actions>
            </Dialog>
            {selectedGoal && (
                <PreviousGoalCard open={openGoalCard} risk={selectedGoal} close={closeGoalCard} />
            )}
        </Portal>
    );
};

export default PreviousGoalsModal;
