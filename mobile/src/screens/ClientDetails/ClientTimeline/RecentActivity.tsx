import { IVisitSummary } from "@cbr/common";
import * as React from "react";
import { Component } from "react";
import { View } from "react-native";
import { TimelineDate } from "./TimelineDate";
import { IActivity, SummaryActivity } from "./Activity";

interface ActivityProps {
    clientVisits: IVisitSummary[];
    activityDTO: IActivity[];
    clientCreateDate: number;
}

export const RecentActivity = (props: ActivityProps) => {
    if (props.clientVisits)
        return (
            <View>
                {props.activityDTO.map((presentActivity) => {
                    return <SummaryActivity key={presentActivity.id} activity={presentActivity} />;
                })}
                <TimelineDate date={props.clientCreateDate} />
            </View>
        );
    else
        return (
            <View>
                <TimelineDate date={props.clientCreateDate} />
            </View>
        );
};
