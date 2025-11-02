import { formatDate, themeColors } from "@cbr/common";
import React from "react";
import { View, Text, NativeModules } from "react-native";
import * as Localization from "expo-localization";
import { IconButton } from "react-native-paper";
import useStyles from "./Timeline.style";
import { useTranslation } from "react-i18next";

interface SummaryProps {
    date: Date;
}

const locale = Localization.locale;
const timezone = Localization.timezone; // todo: deprecated

export const TimelineDate = (props: SummaryProps) => {
    const styles = useStyles();
    const { t } = useTranslation();

    return (
        <View style={styles.container}>
            <Text style={styles.textGray}>{formatDate(props.date, locale, timezone)}</Text>
            <View style={styles.activityTypeView}>
                <View style={styles.verticleLine} />
                <IconButton
                    style={styles.logoButton}
                    icon="account-plus"
                    mode="outlined"
                    size={16}
                    iconColor={themeColors.blueBgDark}
                />
                <View style={styles.verticleLine} />
            </View>
            <View>
                <View style={styles.subItem}>
                    <Text style={styles.subItemText}>{t("clientAttr.clientCreated")}</Text>
                </View>
            </View>
        </View>
    );
};
