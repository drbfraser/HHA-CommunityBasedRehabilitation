import React from "react";
import { Timeline } from "@material-ui/lab";
import { IClient } from "util/clients";
import { timestampToDateFromReference } from "util/dates";
import { IVisitSummary } from "util/visits";
import { useStyles } from "./ClientVisitTimeline.styles";
import { IZone } from "util/cache";
import SkeletonEntry from "./SkeletonEntry";
import CreatedEntry from "./CreatedEntry";
import VisitEntry from "./VisitEntry";

interface IProps {
    client?: IClient;
    zones: IZone[];
}

const VisitHistoryTimeline = ({ client, zones }: IProps) => {
    const styles = useStyles();
    const dateFormatter = timestampToDateFromReference(client?.created_date);

    const visitSort = (a: IVisitSummary, b: IVisitSummary) => {
        return b.date_visited - a.date_visited;
    };

    return (
        <Timeline className={styles.timeline}>
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
                    <CreatedEntry createdDate={dateFormatter(client.created_date)} />
                </>
            ) : (
                [1, 2, 3, 4].map((i) => <SkeletonEntry key={i} />)
            )}
        </Timeline>
    );
};

export default VisitHistoryTimeline;
