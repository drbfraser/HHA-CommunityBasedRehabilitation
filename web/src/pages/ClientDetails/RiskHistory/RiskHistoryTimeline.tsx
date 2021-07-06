import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@material-ui/core";
import { Timeline } from "@material-ui/lab";
import RiskLevelChip from "components/RiskLevelChip/RiskLevelChip";
import React, { useState } from "react";
import { IClient } from "@cbr/common/util/clients";
import { timestampToDateFromReference, timestampToDateTime } from "@cbr/common/util/dates";
import { IRisk } from "@cbr/common/util/risks";
import { riskTypes } from "util/riskIcon";
import ClientCreatedEntry from "../Timeline/ClientCreatedEntry";
import SkeletonEntry from "../Timeline/SkeletonEntry";
import TimelineEntry from "../Timeline/TimelineEntry";
import { useTimelineStyles } from "../Timeline/timelines.styles";
import UpdateIcon from "@material-ui/icons/Update";

interface IProps {
    client?: IClient;
}

const RiskHistoryTimeline = ({ client }: IProps) => {
    const timelineStyles = useTimelineStyles();
    const dateFormatter = timestampToDateFromReference(client?.created_date);

    interface IEntryProps {
        risk: IRisk;
        isInitial: boolean;
    }

    const RiskEntry = ({ risk, isInitial }: IEntryProps) => {
        const [expanded, setExpanded] = useState(false);
        const riskType = riskTypes[risk.risk_type];

        const Summary = ({ clickable }: { clickable?: boolean }) => (
            <>
                <b>{riskType.name}</b> risk {isInitial ? "set" : "changed"} to{" "}
                <RiskLevelChip risk={risk.risk_level} clickable={clickable ?? false} />
            </>
        );

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
                        <b>When:</b> {timestampToDateTime(risk.timestamp)}
                    </DialogContent>
                    <DialogContent>
                        <b>Requirements:</b> {risk.requirement}
                    </DialogContent>
                    <DialogContent>
                        <b>Goals:</b> {risk.goal}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setExpanded(false)} color="primary">
                            Close
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
                        .slice()
                        .sort(riskSort)
                        .map((risk) => (
                            <RiskEntry
                                key={risk.id}
                                risk={risk}
                                isInitial={risk.timestamp === client.created_date}
                            />
                        ))}
                    <ClientCreatedEntry createdDate={dateFormatter(client.created_date)} />
                </>
            ) : (
                [1, 2, 3, 4].map((i) => <SkeletonEntry key={i} />)
            )}
        </Timeline>
    );
};

export default RiskHistoryTimeline;
