import { IVisitSummary } from "@cbr/common";
import * as React from "react";
import { Component } from "react";
import { View } from "react-native";
import { TimelineDate } from "../../screens/Client/TimeLineDate";
import { ActivityDTO, SummaryActivity } from "./Activity";

interface ActivityProps {
    clientVisits: IVisitSummary[];
    activityDTO: ActivityDTO[];
    clientCreateDate: number;
}

export const RecentActivity = (props: ActivityProps) => {
    if (props.clientVisits)
        return (
            <View>
                {props.activityDTO.map((presentActivity) => {
                    return (
                        <SummaryActivity
                            key={presentActivity.id}
                            activity={presentActivity}
                        ></SummaryActivity>
                    );
                })}
                <TimelineDate date={props.clientCreateDate}></TimelineDate>
            </View>
        );
    else
        return (
            <View>
                <TimelineDate date={props.clientCreateDate}></TimelineDate>
            </View>
        );
};
