import React from "react";
import { useState } from "react";
import { Timeline } from "@material-ui/lab";
import { IClient } from "@cbr/common/util/clients";
import { getDateFormatterFromReference } from "@cbr/common/util/dates";
import SkeletonEntry from "../Timeline/SkeletonEntry";
import ClientCreatedEntry from "../Timeline/ClientCreatedEntry";
import VisitEntry from "./VisitEntry";
import { useTimelineStyles } from "../Timeline/timelines.styles";
import ReferralEntry from "./ReferralEntry";
import BaseSurveyEntry from "./BaseSurveyEntry";
import ShowMoreEntry from "../Timeline/ShowMoreEntry";

interface IProps {
    client?: IClient;
    refreshClient: () => void;
}

const ClientTimeline = ({ client, refreshClient }: IProps) => {
    const timelineStyles = useTimelineStyles();
    const dateFormatter = getDateFormatterFromReference(client?.created_date);
    const [showAllEntries, setShowAllEntries] = useState<boolean>(false);
    const numEntriesToShow = 10;

    const timelineItems = client
        ? [
              ...client.visits.slice().map((v) => ({
                  timestamp: v.date_visited,
                  Component: (
                      <VisitEntry
                          key={`visit${v.id}`}
                          visitSummary={v}
                          dateFormatter={dateFormatter}
                      />
                  ),
              })),
              ...client.referrals.slice().map((r) => ({
                  timestamp: r.date_referred,
                  Component: (
                      <ReferralEntry
                          key={`referral${r.id}`}
                          referral={r}
                          refreshClient={refreshClient}
                          dateFormatter={dateFormatter}
                      />
                  ),
              })),
              ...client.baseline_surveys.slice().map((s) => ({
                  timestamp: s.survey_date,
                  Component: (
                      <BaseSurveyEntry
                          key={`survey${s.id}`}
                          survey={s}
                          dateFormatter={dateFormatter}
                      />
                  ),
              })),
          ].sort((a, b) => b.timestamp - a.timestamp)
        : [];

    const topTimelineItems = timelineItems?.slice(0, numEntriesToShow);

    return (
        <Timeline className={timelineStyles.timeline}>
            {client && timelineItems && topTimelineItems ? (
                <>
                    {!showAllEntries || timelineItems.length < numEntriesToShow
                        ? topTimelineItems.map((entry) => entry.Component)
                        : timelineItems.map((entry) => entry.Component)}
                    {!showAllEntries && timelineItems.length > numEntriesToShow && (
                        <ShowMoreEntry
                            onClick={() => {
                                setShowAllEntries(true);
                            }}
                        />
                    )}
                    <ClientCreatedEntry createdDate={dateFormatter(client.created_date)} />
                </>
            ) : (
                [1, 2, 3, 4].map((i) => <SkeletonEntry key={i} />)
            )}
        </Timeline>
    );
};

export default ClientTimeline;
