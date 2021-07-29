import { IReferral, ISurvey, themeColors, timestampToDate } from "@cbr/common";
import React, { useState } from "react";
import { useEffect } from "react";
import { View, Text } from "react-native";
import { Button } from "react-native-paper";
import useStyles from "./Timeline.style";

interface SummaryProps {
    date: number;
}

export const TimelineDate = (props: SummaryProps) => {
    const styles = useStyles();

    return (
        <View style={styles.container}>
            <Text>{timestampToDate(props.date)}</Text>
            <View style={styles.activityTypeView}>
                <View style={styles.verticleLine} />
                <Button
                    style={styles.logoButton}
                    icon="account-plus"
                    mode="outlined"
                    compact={true}
                />
                <View style={styles.verticleLine} />
            </View>
            <View>
                <View style={styles.subItem}>
                    <Text style={styles.subItemText}>Client Created</Text>
                </View>
            </View>
        </View>
    );
};
