import React, { useState } from "react";
import { Timeline } from "@mui/lab";

import { IClient } from "@cbr/common/util/clients";
import { getDateFormatterFromReference } from "@cbr/common/util/dates";
import SkeletonEntry from "../Timeline/SkeletonEntry";
import ClientCreatedEntry from "../Timeline/ClientCreatedEntry";
import { timelineStyles } from "../Timeline/Timeline.styles";
import ShowMoreEntry from "../Timeline/ShowMoreEntry";
import VisitEntry from "./VisitEntry";
import ReferralEntry from "./ReferralEntry";
import BaseSurveyEntry from "./BaseSurveyEntry";

interface IProps {
    client?: IClient;
    refreshClient: () => void;
}

const ClientTimeline = ({ client, refreshClient }: IProps) => {
    const [showAllEntries, setShowAllEntries] = useState(false);
    const numEntriesToShow = 10;
    const dateFormatter = getDateFormatterFromReference(client?.created_at);

    const timelineItems = !client
        ? []
        : [
              ...client.visits.slice().map((v) => ({
                  timestamp: v.created_at,
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
          ].sort((a, b) => b.timestamp - a.timestamp);

    const topTimelineItems = !timelineItems ? [] : timelineItems.slice(0, numEntriesToShow);

    return (
        <Timeline sx={timelineStyles.timeline}>
            {client ? (
                <>
                    {!showAllEntries
                        ? topTimelineItems.map((entry) => entry.Component)
                        : timelineItems.map((entry) => entry.Component)}
                    {!showAllEntries && timelineItems.length > numEntriesToShow && (
                        <ShowMoreEntry
                            onClick={() => {
                                setShowAllEntries(true);
                            }}
                        />
                    )}
                    <ClientCreatedEntry createdDate={dateFormatter(client.created_at)} />
                </>
            ) : (
                [1, 2, 3, 4].map((i) => <SkeletonEntry key={i} />)
            )}
        </Timeline>
    );
};

export default ClientTimeline;
