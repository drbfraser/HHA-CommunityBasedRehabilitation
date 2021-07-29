import { IVisitSummary } from "@cbr/common";
import * as React from "react";
import { View } from "react-native";
import { TimelineDate } from "./TimelineDate";
import Timeline, { IActivity } from "./Timeline";

interface IActivityProps {
    clientVisits: IVisitSummary[];
    activity: IActivity[];
    clientCreateDate: number;
}

export const RecentActivity = (props: IActivityProps) => {
    return (
        <View>
            {props.activity.map((presentActivity) => {
                return <Timeline key={presentActivity.id} activity={presentActivity} />;
            })}
            <TimelineDate date={props.clientCreateDate} />
        </View>
    );
};
