import React from "react";
import { Timeline } from "@material-ui/lab";
import { IClient } from "util/clients";
import { timestampToDateFromReference } from "util/dates";
import SkeletonEntry from "../Timeline/SkeletonEntry";
import ClientCreatedEntry from "../Timeline/ClientCreatedEntry";
import VisitEntry from "./VisitEntry";
import { useTimelineStyles } from "../Timeline/timelines.styles";
import ReferralEntry from "./ReferralEntry";
import BaseSurveyEntry from "./BaseSurveyEntry";

interface IProps {
    client?: IClient;
}

const ClientTimeline = ({ client }: IProps) => {
    const timelineStyles = useTimelineStyles();
    const dateFormatter = timestampToDateFromReference(client?.created_date);

    return (
        <Timeline className={timelineStyles.timeline}>
            {client ? (
                <>
                    {[
                        ...client.visits.slice().map((v) => ({
                            timestamp: v.date_visited,
                            Component: (
                                <VisitEntry
                                    key={v.id}
                                    visitSummary={v}
                                    dateFormatter={dateFormatter}
                                />
                            ),
                        })),
                        ...client.referrals.slice().map((r) => ({
                            timestamp: r.date_referred,
                            Component: (
                                <ReferralEntry
                                    key={r.id}
                                    referral={r}
                                    dateFormatter={dateFormatter}
                                />
                            ),
                        })),
                        ...client.baseline_surveys.slice().map((r) => ({
                            timestamp: r.survey_date,
                            Component: (
                                <BaseSurveyEntry
                                    key={r.id}
                                    survey={r}
                                    dateFormatter={dateFormatter}
                                />
                            ),
                        })),
                    ]
                        .sort((a, b) => b.timestamp - a.timestamp)
                        .map((entry) => entry.Component)}
                    <ClientCreatedEntry createdDate={dateFormatter(client.created_date)} />
                </>
            ) : (
                [1, 2, 3, 4].map((i) => <SkeletonEntry key={i} />)
            )}
        </Timeline>
    );
};

export default ClientTimeline;
