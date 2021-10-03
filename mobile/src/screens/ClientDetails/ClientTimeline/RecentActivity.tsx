import { IVisitSummary } from "@cbr/common";
import * as React from "react";
import { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { TimelineDate } from "./TimelineDate";
import Timeline, { IActivity } from "./Timeline";
import { NUM_ACTIVITIES_TO_SHOW, SHOW_MORE_ACTIVITY } from "./TimelineConstants";

interface IActivityProps {
    clientVisits: IVisitSummary[];
    activity: IActivity[];
    clientCreateDate: number;
    refreshClient: () => void;
}

export const RecentActivity = (props: IActivityProps) => {
    const [showAllEntries, setShowAllEntries] = useState<boolean>(false);

    const timelineItems = props.activity;
    const topTimelineItems = timelineItems.slice(0, NUM_ACTIVITIES_TO_SHOW);

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
            {!showAllEntries && (timelineItems.length > NUM_ACTIVITIES_TO_SHOW) && (
                <TouchableOpacity
                    onPress={() => {
                        setShowAllEntries(true);
                    }}
                >
                    <Timeline
                        key={"showMore"}
                        activity={SHOW_MORE_ACTIVITY}
                        refreshClient={() => {}}
                    />
                </TouchableOpacity>
            )}
            <TimelineDate date={props.clientCreateDate} />
        </View>
    );
};
