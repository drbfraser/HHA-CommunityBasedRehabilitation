import { formatDate, IReferral, ISurvey, themeColors, useZones } from "@cbr/common";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, NativeModules } from "react-native";
import * as Localization from "expo-localization";
import { IconButton, Modal, Portal } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import { riskTypes } from "../../../util/riskIcon";
import { IVisitSummary } from "../../../../../common/src/util/visits";
import useStyles from "./Timeline.style";
import BaselineEntry from "./Entries/BaselineEntry";
import ReferralEntry from "./Entries/ReferralEntry";
import VisitEntry from "./Entries/VisitEntry";
import { useDatabase } from "@nozbe/watermelondb/hooks";
import { useTranslation } from "react-i18next";

interface ISummaryProps {
    activity: IActivity;
    refreshClient: () => void;
}

export enum ActivityType {
    SURVEY = "survey",
    REFERAL = "referral",
    VISIT = "visit",
}

export interface IActivity {
    id: number;
    type: ActivityType;
    date: number;
    visit: IVisitSummary | undefined;
    referral: IReferral | undefined;
    survey: ISurvey | undefined;
}

const ACTIVITY_ICONS: Record<ActivityType, string> = {
    [ActivityType.VISIT]: "walk",
    [ActivityType.REFERAL]: "navigation",
    [ActivityType.SURVEY]: "account-box-outline",
};

const Timeline = (props: ISummaryProps) => {
    const zones = useZones(false);
    const zone = props.activity.visit ? zones.get(props.activity.visit.zone) : "";
    const { t } = useTranslation();

    const [detailsVisible, setDetailsVisible] = useState(false);
    const showDetails = () => setDetailsVisible(true);
    const hideDetails = () => setDetailsVisible(false);
    const styles = useStyles();
    const icon = ACTIVITY_ICONS[props.activity.type] ?? "";

    const locale = Localization.locale;
    const timezone = Localization.timezone; // todo: update deprecated

    const database = useDatabase();

    return (
        <TouchableOpacity
            onPress={() => {
                showDetails();
            }}
        >
            <View>
                <View style={styles.container}>
                    <Text style={styles.dateText}>
                        {formatDate(new Date(props.activity.date), locale, timezone)}
                    </Text>
                    <View style={styles.activityTypeView}>
                        <View style={styles.verticleLine}></View>
                        <IconButton
                            style={styles.logoButton}
                            icon={icon}
                            mode="outlined"
                            size={16}
                            iconColor={themeColors.blueBgDark}
                        />
                        <View style={styles.verticleLine}></View>
                    </View>
                    <View style={styles.contentColumn}>
                        {props.activity.type === ActivityType.VISIT && props.activity.visit ? (
                            <View style={styles.rowContainer}>
                                <View>
                                    <Text style={styles.textGray}>
                                        {zone} {t("visitAttr.visitVerb")}
                                    </Text>
                                    {props.activity.visit.educat_visit ? (
                                        <View style={styles.subItem}>
                                            {riskTypes.EDUCAT.Icon(themeColors.riskBlack)}
                                            <Text style={styles.subItemText}>
                                                {t("general.education")}
                                            </Text>
                                        </View>
                                    ) : (
                                        <></>
                                    )}
                                    {props.activity.visit.health_visit ? (
                                        <View style={styles.subItem}>
                                            {riskTypes.HEALTH.Icon(themeColors.riskBlack)}
                                            <Text style={styles.subItemText}>
                                                {t("general.health")}
                                            </Text>
                                        </View>
                                    ) : (
                                        <></>
                                    )}
                                    {props.activity.visit.social_visit ? (
                                        <View style={styles.subItem}>
                                            {riskTypes.SOCIAL.Icon(themeColors.riskBlack)}
                                            <Text style={styles.subItemText}>
                                                {t("general.social")}
                                            </Text>
                                        </View>
                                    ) : (
                                        <></>
                                    )}
                                    {props.activity.visit.nutrit_visit ? (
                                        <View style={styles.subItem}>
                                            {riskTypes.NUTRIT.Icon(themeColors.riskBlack)}
                                            <Text style={styles.subItemText}>
                                                {t("general.nutrition")}
                                            </Text>
                                        </View>
                                    ) : (
                                        <></>
                                    )}
                                    {props.activity.visit.mental_visit ? (
                                        <View style={styles.subItem}>
                                            {riskTypes.MENTAL.Icon(themeColors.riskBlack)}
                                            <Text style={styles.subItemText}>
                                                {t("general.mental")}
                                            </Text>
                                        </View>
                                    ) : (
                                        <></>
                                    )}
                                </View>
                                <View style={styles.imageContainer}>
                                    {props.activity.visit.picture ? (
                                        <Icon
                                            name="image"
                                            size={16}
                                            color={themeColors.blueBgDark}
                                        />
                                    ) : (
                                        <></>
                                    )}
                                </View>

                                <Portal>
                                    <Modal
                                        visible={detailsVisible}
                                        onDismiss={hideDetails}
                                        style={styles.popupStyle}
                                    >
                                        <VisitEntry
                                            visitSummary={props.activity.visit as IVisitSummary}
                                            close={hideDetails}
                                        />
                                    </Modal>
                                </Portal>
                            </View>
                        ) : props.activity.type === ActivityType.REFERAL &&
                          props.activity.referral ? (
                            <View style={styles.rowContainer}>
                                <View>
                                    <Text style={styles.subItemText}>
                                        {t("referralAttr.referralPosted")}
                                    </Text>
                                    <View style={styles.subItem}>
                                        {props.activity.referral.resolved ? (
                                            <>
                                                <Text style={styles.subItemText}>
                                                    {t("general.resolved")}
                                                </Text>
                                                <Icon
                                                    name="check-circle"
                                                    size={15}
                                                    color={themeColors.riskGreen}
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <Text style={styles.subItemText}>
                                                    {t("general.unresolved")}
                                                </Text>
                                                <Icon
                                                    name="clock-o"
                                                    size={15}
                                                    color={themeColors.riskRed}
                                                />
                                            </>
                                        )}

                                        <Portal>
                                            <Modal
                                                visible={detailsVisible}
                                                onDismiss={hideDetails}
                                                style={styles.popupStyle}
                                            >
                                                <ReferralEntry
                                                    referral={props.activity.referral as IReferral}
                                                    database={database}
                                                    close={hideDetails}
                                                    refreshClient={props.refreshClient}
                                                />
                                            </Modal>
                                        </Portal>
                                    </View>
                                </View>

                                <View style={styles.imageContainer}>
                                    {props.activity.referral.picture ? (
                                        <Icon
                                            name="image"
                                            size={16}
                                            color={themeColors.blueBgDark}
                                        />
                                    ) : (
                                        <></>
                                    )}
                                </View>
                            </View>
                        ) : (
                            props.activity.type === ActivityType.SURVEY &&
                            props.activity.survey && (
                                <View style={styles.subItem}>
                                    <Text style={styles.subItemText}>
                                        {t("surveyAttr.baselineSurvey")}
                                    </Text>
                                    <Portal>
                                        <Modal
                                            visible={detailsVisible}
                                            onDismiss={hideDetails}
                                            style={styles.popupStyle}
                                        >
                                            <BaselineEntry
                                                survey={props.activity.survey as ISurvey}
                                                close={hideDetails}
                                            />
                                        </Modal>
                                    </Portal>
                                </View>
                            )
                        )}
                    </View>
                </View>
                <View style={styles.dividerStyle} />
            </View>
        </TouchableOpacity>
    );
};

// Memoized so re-renders of the client page don't re-render every entry.
export default React.memo(Timeline);
