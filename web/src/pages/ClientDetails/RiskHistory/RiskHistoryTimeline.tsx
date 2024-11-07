import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@material-ui/core";
import UpdateIcon from "@material-ui/icons/Update";
import { Timeline } from "@material-ui/lab";

import { IClient } from "@cbr/common/util/clients";
import { getDateFormatterFromReference, timestampToDateTime } from "@cbr/common/util/dates";
import { IRisk } from "@cbr/common/util/risks";
import RiskLevelChip from "components/RiskLevelChip/RiskLevelChip";
import ClientCreatedEntry from "../Timeline/ClientCreatedEntry";
import SkeletonEntry from "../Timeline/SkeletonEntry";
import TimelineEntry from "../Timeline/TimelineEntry";
import { useTimelineStyles } from "../Timeline/timelines.styles";
import { translateRiskEntrySummary } from "./helper";

interface IProps {
    client?: IClient;
}

const RiskHistoryTimeline = ({ client }: IProps) => {
    const { t } = useTranslation();
    const timelineStyles = useTimelineStyles();
    const dateFormatter = getDateFormatterFromReference(client?.created_at);

    interface IEntryProps {
        risk: IRisk;
        isInitial: boolean;
    }

    const RiskEntry = ({ risk, isInitial }: IEntryProps) => {
        const [expanded, setExpanded] = useState(false);

        const Summary = ({ clickable }: { clickable?: boolean }) => {
            return (
                <>
                    {translateRiskEntrySummary(risk.risk_type, isInitial)}
                    <RiskLevelChip risk={risk.risk_level} clickable={clickable ?? false} />
                </>
            );
        };

        return (
            <>
                <TimelineEntry
                    date={dateFormatter(risk.timestamp)}
                    content={<Summary clickable={true} />}
                    DotIcon={UpdateIcon}
                    onClick={() => setExpanded(true)}
                />
                <Dialog fullWidth maxWidth="sm" open={expanded} onClose={() => setExpanded(false)}>
                    <DialogTitle>
                        <Summary />
                    </DialogTitle>
                    <DialogContent>
                        <b>{t("general.when")}:</b> {timestampToDateTime(risk.timestamp)}
                    </DialogContent>
                    <DialogContent>
                        <b>{t("risks.requirements")}:</b> {risk.requirement}
                    </DialogContent>
                    <DialogContent>
                        <b>{t("risks.goals")}:</b> {risk.goal}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setExpanded(false)} color="primary">
                            {t("general.close")}
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    };

    const riskSort = (a: IRisk, b: IRisk) => {
        if (a.timestamp === b.timestamp) {
            return b.risk_type.localeCompare(a.risk_type);
        }
        return b.timestamp - a.timestamp;
    };

    return (
        <Timeline className={timelineStyles.timeline}>
            {client ? (
                <>
                    {client.risks
                        .slice() // creates a copy/clone
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
