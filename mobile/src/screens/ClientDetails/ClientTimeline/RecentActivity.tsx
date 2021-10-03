import { IVisitSummary } from "@cbr/common";
import * as React from "react";
import { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { TimelineDate } from "./TimelineDate";
import Timeline, { IActivity, ActivityType } from "./Timeline";

interface IActivityProps {
    clientVisits: IVisitSummary[];
    activity: IActivity[];
    clientCreateDate: number;
    refreshClient: () => void;
}

export const RecentActivity = (props: IActivityProps) => {
    const showMoreActivity = {
        id: -1,
        type: ActivityType.SHOWMORE,
        date: -1,
    };

    const [showAllEntries, setShowAllEntries] = useState<boolean>(false);
    const numEntriesToShow = 1;

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
                    <Timeline
                        key={"showMore"}
                        activity={showMoreActivity}
                        refreshClient={() => {}}
                    />
                </TouchableOpacity>
            )}
            <TimelineDate date={props.clientCreateDate} />
        </View>
    );
};
