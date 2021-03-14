import React from "react";
import { Timeline } from "@material-ui/lab";
import { IClient } from "util/clients";
import { timestampToDateFromReference } from "util/dates";
import { IVisitSummary } from "util/visits";
import { IZone } from "util/cache";
import SkeletonEntry from "../Timeline/SkeletonEntry";
import ClientCreatedEntry from "../Timeline/ClientCreatedEntry";
import VisitEntry from "./VisitEntry";
import { useTimelineStyles } from "../Timeline/timelines.styles";

interface IProps {
    client?: IClient;
    zones: IZone[];
}

const VisitHistoryTimeline = ({ client, zones }: IProps) => {
    const timelineStyles = useTimelineStyles();
    const dateFormatter = timestampToDateFromReference(client?.created_date);

    const visitSort = (a: IVisitSummary, b: IVisitSummary) => {
        return b.date_visited - a.date_visited;
    };

    return (
        <Timeline className={timelineStyles.timeline}>
            {client ? (
                <>
                    {client.visits
                        .slice()
                        .sort(visitSort)
                        .map((visit) => (
                            <VisitEntry
                                key={visit.id}
                                visitSummary={visit}
                                zones={zones}
                                dateFormatter={dateFormatter}
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

export default VisitHistoryTimeline;
