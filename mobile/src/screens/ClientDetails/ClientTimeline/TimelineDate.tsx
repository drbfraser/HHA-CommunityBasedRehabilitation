import { formatDate, IReferral, ISurvey, themeColors, timestampToDate } from "@cbr/common";
import React, { useState } from "react";
import { useEffect } from "react";
import { View, Text, NativeModules } from "react-native";
import * as Localization from "expo-localization";
import { Button } from "react-native-paper";
import useStyles from "./Timeline.style";

interface SummaryProps {
    date: Date;
}

const locale = NativeModules.I18nManager.localeIdentifier;
const timezone = Localization.timezone;

export const TimelineDate = (props: SummaryProps) => {
    const styles = useStyles();

    return (
        <View style={styles.container}>
            <Text>{formatDate(props.date, locale, timezone)}</Text>
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
