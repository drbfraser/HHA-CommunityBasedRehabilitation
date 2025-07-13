import { Chip } from "@rneui/themed";
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
            title={goalStatus ? goalStatus.name : i18n.t("newVisit.PLACEHOLDER-socialGoals.1")}
            type="solid"
            buttonStyle={{
                backgroundColor: goalStatus ? goalStatus.color : "primary",
                borderRadius: 0,
                paddingVertical: 2,
                paddingHorizontal: 6,
                height: 24,
            }}
            containerStyle={{
                borderRadius: 0,
            }}
            titleStyle={{
                fontSize: 12,
            }}
        />
    );
}
