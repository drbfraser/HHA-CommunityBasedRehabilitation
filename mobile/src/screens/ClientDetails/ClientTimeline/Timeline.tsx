import { IReferral, ISurvey, themeColors, timestampToDate, useZones } from "@cbr/common";
import React, { useState } from "react";
import { useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Button, Modal, Portal } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import { riskTypes } from "../../../util/riskIcon";
import { IVisitSummary } from "../../../../../common/src/util/visits";
import useStyles from "./Timeline.style";
import BaselineEntry from "./Entries/BaselineEntry";
interface ISummaryProps {
    activity: IActivity;
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

const Timeline = (props: ISummaryProps) => {
    const zones = useZones();
    let zone: string;
    if (props.activity.visit) zone = Array.from(zones.values())[props.activity.visit!.zone - 1];
    else zone = "";

    const [detailsVisible, setDetailsVisible] = useState(false);
    const showDetails = () => setDetailsVisible(true);
    const hideDetails = () => setDetailsVisible(false);
    const styles = useStyles();
    const [icon, setIcon] = useState("");

    useEffect(() => {
        if (props.activity.type === ActivityType.VISIT) setIcon("walk");
        if (props.activity.type === ActivityType.REFERAL) setIcon("navigation");
        if (props.activity.type === ActivityType.SURVEY) setIcon("account-box-outline");
    });

    return (
        <TouchableOpacity
            onPress={() => {
                showDetails();
            }}
        >
            <View>
                <View style={styles.container}>
                    <Text>{timestampToDate(props.activity.date)}</Text>
                    <View style={styles.activityTypeView}>
                        <View style={styles.verticleLine}></View>
                        <Button
                            style={styles.logoButton}
                            icon={icon}
                            mode="outlined"
                            compact={true}
                        />
                        <View style={styles.verticleLine}></View>
                    </View>
                    <View>
                        {props.activity.type === ActivityType.VISIT && props.activity.visit ? (
                            <View>
                                <Text>{zone} visit</Text>
                                <View>
                                    {props.activity.visit.educat_visit ? (
                                        <View style={styles.subItem}>
                                            {riskTypes.EDUCAT.Icon(
                                                themeColors.riskBlack,
                                                themeColors.riskBlack
                                            )}
                                            <Text style={styles.subItemText}>Education</Text>
                                        </View>
                                    ) : (
                                        <></>
                                    )}
                                    {props.activity.visit.health_visit ? (
                                        <View style={styles.subItem}>
                                            {riskTypes.HEALTH.Icon(
                                                themeColors.riskBlack,
                                                themeColors.riskBlack
                                            )}
                                            <Text style={styles.subItemText}>Health</Text>
                                        </View>
                                    ) : (
                                        <></>
                                    )}
                                    {props.activity.visit.social_visit ? (
                                        <View style={styles.subItem}>
                                            {riskTypes.SOCIAL.Icon(
                                                themeColors.riskBlack,
                                                themeColors.riskBlack
                                            )}
                                            <Text style={styles.subItemText}>Social</Text>
                                        </View>
                                    ) : (
                                        <></>
                                    )}
                                </View>
                            </View>
                        ) : props.activity.type === ActivityType.REFERAL &&
                          props.activity.referral ? (
                            <View style={styles.subItem}>
                                <View>
                                    <Text style={styles.subItemText}>Referral Posted</Text>
                                    <View style={styles.subItemRow}>
                                        {props.activity.referral.outcome === "Resolved" ? (
                                            <>
                                                <Text style={styles.subItemText}>Resolved</Text>
                                                <Icon
                                                    name="check"
                                                    size={15}
                                                    color={themeColors.riskGreen}
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <Text style={styles.subItemText}>Unresolved</Text>
                                                <Icon
                                                    name="clock-o"
                                                    size={15}
                                                    color={themeColors.riskRed}
                                                />
                                            </>
                                        )}
                                    </View>
                                </View>
                            </View>
                        ) : (
                            <View style={styles.subItem}>
                                <Text style={styles.subItemText}>Baseline Survey</Text>
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
                        )}
                    </View>
                </View>
                <View style={styles.dividerStyle} />
            </View>
        </TouchableOpacity>
    );
};

export default Timeline;
