import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { Timeline } from "@mui/lab";
import UpdateIcon from "@mui/icons-material/Update";

import { IClient } from "@cbr/common/util/clients";
import { getDateFormatterFromReference, timestampToDateTime } from "@cbr/common/util/dates";
import { IRisk, RiskChangeType } from "@cbr/common/util/risks";
import RiskLevelChip from "components/RiskLevelChip/RiskLevelChip";
import ClientCreatedEntry from "../Timeline/ClientCreatedEntry";
import SkeletonEntry from "../Timeline/SkeletonEntry";
import TimelineEntry from "../Timeline/TimelineEntry";
import { translateGoalEntrySummary, translateRiskEntrySummary } from "./helper";
import { timelineStyles } from "../Timeline/Timeline.styles";
import GoalStatusChip from "components/GoalStatusChip/GoalStatusChip";
import { OutcomeGoalMet } from "@cbr/common/util/visits";

interface IProps {
    client?: IClient;
}

const RiskHistoryTimeline = ({ client }: IProps) => {
    const { t } = useTranslation();
    const dateFormatter = getDateFormatterFromReference(client?.created_at);

    interface IEntryProps {
        risk: IRisk;
        isInitial: boolean;
    }

    const RiskEntry = ({ risk, isInitial }: IEntryProps) => {
        const [expanded, setExpanded] = useState(false);

        const RiskSummary = ({ clickable }: { clickable?: boolean }) => (
            <>
                {translateRiskEntrySummary(risk.risk_type, isInitial)}{" "}
                <RiskLevelChip risk={risk.risk_level} clickable={clickable ?? false} />
            </>
        );

        const GoalSummary = () => (
            <>
                {translateGoalEntrySummary(risk.risk_type)}{" "}
                <GoalStatusChip goalStatus={risk.goal_status} />
            </>
        );

        const renderDialog = () => (
            <Dialog fullWidth maxWidth="sm" open={expanded} onClose={() => setExpanded(false)}>
                <DialogTitle>
                    {(risk.change_type === RiskChangeType.BOTH &&
                        risk.goal_status !== OutcomeGoalMet.NOTSET) ||
                    (risk.change_type === RiskChangeType.INITIAL &&
                        risk.goal_status !== OutcomeGoalMet.NOTSET) ? (
                        <>
                            <div style={{ marginBottom: 4 }}>
                                <RiskSummary />
                            </div>
                            <div>
                                <GoalSummary />
                            </div>
                        </>
                    ) : risk.change_type === RiskChangeType.RISK_LEVEL ? (
                        <RiskSummary />
                    ) : (
                        <GoalSummary />
                    )}
                </DialogTitle>
                <DialogContent>
                    <b>{t("general.when")}:</b> {timestampToDateTime(risk.timestamp)}
                </DialogContent>
                <DialogContent>
                    <b>{t("risks.requirements")}:</b> {risk.requirement}
                </DialogContent>
                <DialogContent>
                    <b>{t("risks.goals")}:</b> {risk.goal_name}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setExpanded(false)} color="primary">
                        {t("general.close")}
                    </Button>
                </DialogActions>
            </Dialog>
        );

        const combinedContent = (
            <>
                <div style={{ marginBottom: 4 }}>
                    {translateRiskEntrySummary(risk.risk_type, isInitial)}{" "}
                    <RiskLevelChip risk={risk.risk_level} clickable />
                </div>
                <div>
                    {translateGoalEntrySummary(risk.risk_type)}{" "}
                    <GoalStatusChip goalStatus={risk.goal_status} />
                </div>
            </>
        );

        if (
            (risk.change_type === RiskChangeType.BOTH &&
                risk.goal_status !== OutcomeGoalMet.NOTSET) ||
            (risk.change_type === RiskChangeType.INITIAL &&
                risk.goal_status !== OutcomeGoalMet.NOTSET)
        ) {
            return (
                <>
                    <TimelineEntry
                        date={dateFormatter(risk.timestamp)}
                        content={combinedContent}
                        DotIcon={UpdateIcon}
                        onClick={() => setExpanded(true)}
                    />
                    {renderDialog()}
                </>
            );
        } else if (
            risk.change_type === RiskChangeType.RISK_LEVEL ||
            risk.goal_status === OutcomeGoalMet.NOTSET
        ) {
            return (
                <>
                    <TimelineEntry
                        date={dateFormatter(risk.timestamp)}
                        content={<RiskSummary clickable />}
                        DotIcon={UpdateIcon}
                        onClick={() => setExpanded(true)}
                    />
                    {renderDialog()}
                </>
            );
        } else if (risk.change_type === RiskChangeType.GOAL_STATUS) {
            return (
                <>
                    <TimelineEntry
                        date={dateFormatter(risk.timestamp)}
                        content={<GoalSummary />}
                        DotIcon={UpdateIcon}
                        onClick={() => setExpanded(true)}
                    />
                    {renderDialog()}
                </>
            );
        } else {
            return null;
        }
    };

    const riskSort = (a: IRisk, b: IRisk) => {
        if (a.timestamp === b.timestamp) {
            return b.risk_type.localeCompare(a.risk_type);
        }
        return b.timestamp - a.timestamp;
    };

    return (
        <Timeline sx={timelineStyles.timeline}>
            {client ? (
                <>
                    {client.risks
                        .filter((risk) => risk.change_type !== RiskChangeType.OTHER)
                        .slice()
                        .sort(riskSort)
                        .map((risk) => (
                            <RiskEntry
                                key={risk.id}
                                risk={risk}
                                isInitial={risk.timestamp === client.created_at}
                            />
                        ))}
                    <ClientCreatedEntry createdDate={dateFormatter(client.created_at)} />
                </>
            ) : (
                [1, 2, 3, 4].map((i) => <SkeletonEntry key={i} />)
            )}
        </Timeline>
    );
};

export default RiskHistoryTimeline;
