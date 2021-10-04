import { IVisitSummary } from "@cbr/common";
import * as React from "react";
import { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { TimelineDate } from "./TimelineDate";
import Timeline, { IActivity } from "./Timeline";
import ShowMore from "./ShowMore";

interface IActivityProps {
    clientVisits: IVisitSummary[];
    activity: IActivity[];
    clientCreateDate: number;
    refreshClient: () => void;
}

export const RecentActivity = (props: IActivityProps) => {
    const [showAllEntries, setShowAllEntries] = useState<boolean>(false);
    const numEntriesToShow = 10;

    const timelineItems = props.activity;
    const topTimelineItems = timelineItems.slice(0, numEntriesToShow);

    return (
        <View>
            {!showAllEntries
                ? topTimelineItems.map((presentActivity) => {
                      return (
                          <Timeline
                              key={presentActivity.id}
                              activity={presentActivity}
                              refreshClient={props.refreshClient}
                          />
                      );
                  })
                : timelineItems.map((presentActivity) => {
                      return (
                          <Timeline
                              key={presentActivity.id}
                              activity={presentActivity}
                              refreshClient={props.refreshClient}
                          />
                      );
                  })}
            {!showAllEntries && timelineItems.length > numEntriesToShow && (
                <TouchableOpacity
                    onPress={() => {
                        setShowAllEntries(true);
                    }}
                >
                    <ShowMore />
                </TouchableOpacity>
            )}
            <TimelineDate date={props.clientCreateDate} />
        </View>
    );
};
