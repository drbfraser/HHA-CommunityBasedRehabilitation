import { Chip } from "react-native-paper";
import { goalStatuses, OutcomeGoalMet } from "@cbr/common";
import React from "react";
import i18n from "i18next";

interface GoalChipProps {
    goalStatus: OutcomeGoalMet;
}

export default function GoalStatusChip(props: GoalChipProps) {
    const goalStatus = goalStatuses[props.goalStatus];

    return (
        <Chip
            style={{
                backgroundColor: goalStatus ? goalStatus.color : "primary",
                borderRadius: 2.5,
                height: 24,
                justifyContent: "center",
            }}
            textStyle={{
                color: "white",
                fontSize: 12,
            }}
        >
            {goalStatus ? goalStatus.name : i18n.t("newVisit.PLACEHOLDER-socialGoals.1")}
        </Chip>
    );
}
