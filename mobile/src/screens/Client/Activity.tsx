import { IReferral, ISurvey, themeColors, timestampToDate } from "@cbr/common";
import React, { useState } from "react";
import { useEffect } from "react";
import { View, Text } from "react-native";
import { Button } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import { riskTypes } from "../../util/riskIcon";
import { IVisitSummary } from "../../util/visits";
import useStyles from "./Activity.style";

interface SummaryProps {
    activity: ActivityDTO;
}

export enum ActivityType {
    SURVEY = "survey",
    REFERAL = "referral",
    VISIT = "visit",
}

export interface ActivityDTO {
    type: ActivityType;
    date: number;
    visit: IVisitSummary | undefined;
    referral: IReferral | undefined;
    survey: ISurvey | undefined;
}

export const SummaryActivity = (props: SummaryProps) => {
    const styles = useStyles();
    const [icon, setIcon] = useState("");

    if (props.activity.type === ActivityType.VISIT)
        useEffect(() => {
            setIcon("walk");
        }, []);
    else if (props.activity.type === ActivityType.REFERAL)
        useEffect(() => {
            setIcon("navigation");
        }, []);
    else if (props.activity.type === ActivityType.SURVEY)
        useEffect(() => {
            setIcon("account-box-outline");
        }, []);

    return (
        <View style={styles.container}>
            <Text>{timestampToDate(props.activity.date)}</Text>
            <View style={styles.activityTypeView}>
                <View style={styles.verticleLine}></View>
                <Button
                    style={styles.logoButton}
                    icon={icon}
                    mode="outlined"
                    compact={true}
                ></Button>
                <View style={styles.verticleLine}></View>
            </View>
            <View>
                {props.activity.type === ActivityType.VISIT && props.activity.visit ? (
                    <View>
                        <Text>Visit in BidiBidi Zone{props.activity.visit.zone}</Text>
                        {props.activity.visit.educat_visit === true ? (
                            <View style={styles.subItem}>
                                {riskTypes.EDUCAT.Icon("black")}
                                <Text style={styles.subItemText}>Education</Text>
                            </View>
                        ) : props.activity.visit.health_visit === true ? (
                            <View style={styles.subItem}>
                                {riskTypes.HEALTH.Icon("black")}
                                <Text style={styles.subItemText}>Health</Text>
                            </View>
                        ) : (
                            <View style={styles.subItem}>
                                {riskTypes.SOCIAL.Icon("black")}
                                <Text style={styles.subItemText}>Social</Text>
                            </View>
                        )}
                    </View>
                ) : props.activity.type === ActivityType.REFERAL && props.activity.referral ? (
                    <View style={styles.subItem}>
                        <View>
                            <Text style={styles.subItemText}>Referral Posted</Text>
                            <View style={styles.subItemRow}>
                                <Text style={styles.subItemText}>
                                    {props.activity.referral.outcome}
                                </Text>
                                {props.activity.referral.outcome === "Resolved" ? (
                                    <Icon name="check" size={15} color="green" />
                                ) : (
                                    <Icon name="check" size={15} color="red" />
                                )}
                            </View>
                        </View>
                    </View>
                ) : (
                    <View style={styles.subItem}>
                        <Text style={styles.subItemText}>Baseline Survey</Text>
                    </View>
                )}
            </View>
        </View>
    );
};
