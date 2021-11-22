import React, { useContext, useEffect, useState } from "react";
import { Alert, SafeAreaView, ScrollView, View } from "react-native";
import { Button, Divider, Text, TextInput, Title } from "react-native-paper";
import useStyles from "./Todo.styles";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import { AppStackNavProp } from "../../util/stackScreens";
import { useIsFocused, useNavigation } from "@react-navigation/core";
import { useDatabase } from "@nozbe/watermelondb/hooks";
import {
    VictoryBar,
    VictoryChart,
    VictoryTheme,
    VictoryZoomContainer,
    VictoryAxis,
    VictoryPie,
    VictoryGroup,
} from "victory-native";
import {
    ReferralField,
    referralFieldLabels,
    ReferralFormField,
    serviceTypes,
    themeColors,
    useZones,
} from "@cbr/common";
import { Q } from "@nozbe/watermelondb";

export type VisitStat = {
    name: string;
    count: number;
};

export type PieStat = {
    x: string;
    y: number;
};

export type ReferralStat = {
    name: string;
    count: number;
};

const Todo = () => {
    const fetchVisitData: VisitStat[] = [];
    const pieData: PieStat[] = [];
    const fetchUnResovledReferralData: ReferralStat[] = [];
    const fetchResovledReferralData: ReferralStat[] = [];
    const styles = useStyles();
    const authContext = useContext(AuthContext);
    const [loading, setLoading] = useState<boolean>(true);
    const [visitData, setVisitData] = useState(fetchVisitData);
    const [unresolvedRef, setUnresolvedRef] = useState(fetchUnResovledReferralData);
    const [resolvedRef, setResolvedRef] = useState(fetchResovledReferralData);
    const [graphicData, setGraphicData] = useState<any>([
        { x: "", y: 0 },
        { x: "", y: 0 },
        { x: "", y: 0 },
    ]);

    const database = useDatabase();
    const isFocused = useIsFocused();

    useEffect(() => {
        authContext.requireLoggedIn(true);
    }, []);
    const navigation = useNavigation<AppStackNavProp>();

    const zones = useZones();

    const graphicColor = [themeColors.hhaGreen, themeColors.hhaPurple, themeColors.hhaBlue];

    const VisitStats = async () => {
        for (const zone of zones) {
            const count = await database.get("visits").query(Q.where("zone", zone[0])).fetchCount();
            if (count !== 0) {
                var record: VisitStat = { name: zone[1], count: count };
                fetchVisitData.push(record);
            }
        }
        setVisitData(fetchVisitData);
    };

    const RiskStats = async () => {
        const visitType = ["health_visit", "social_visit", "educat_visit"];
        const visitName = ["Health", "Social", "Education"];
        var index = 0;
        for (const type of visitType) {
            const count = await database.get("visits").query(Q.where(type, true)).fetchCount();
            if (count !== 0) {
                var record = { x: visitName[index], y: count };
                pieData.push(record);
            }
            index++;
        }
    };

    const referralStats = async (resolved: boolean) => {
        for (const type of serviceTypes) {
            let count;
            if (type != ReferralFormField.servicesOther) {
                count = await database
                    .get("referrals")
                    .query(Q.where(type, true), Q.where(ReferralField.resolved, resolved))
                    .fetchCount();
            } else {
                count = await database
                    .get("referrals")
                    .query(Q.where(type, Q.notEq("")), Q.where(ReferralField.resolved, resolved))
                    .fetchCount();
            }

            var record: ReferralStat = {
                name: referralFieldLabels[type],
                count: count,
            };
            if (resolved) {
                fetchResovledReferralData.push(record);
            } else {
                fetchUnResovledReferralData.push(record);
            }
        }
        if (resolved) {
            setResolvedRef(fetchResovledReferralData);
        } else {
            setUnresolvedRef(fetchUnResovledReferralData);
        }
    };

    useEffect(() => {
        if (isFocused) {
            VisitStats()
                .catch(() => {})
                .finally(() => {
                    setLoading(false);
                    RiskStats().then(() => {
                        setGraphicData(pieData);
                        referralStats(false);
                        referralStats(true);
                    });
                });
        }
    }, [isFocused]);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollViewStyles}>
                <View style={styles.row}>
                    <Text style={styles.title}>Statistic</Text>
                </View>
                {!loading ? (
                    <>
                        <Divider />
                        <Text style={styles.cardSectionTitle}>Visits</Text>
                        <VictoryChart
                            animate={{ duration: 500 }}
                            domainPadding={10}
                            padding={{ left: 120, right: 50, bottom: 30, top: 30 }}
                            containerComponent={<VictoryZoomContainer />}
                            theme={VictoryTheme.material}
                        >
                            <VictoryAxis
                                style={{
                                    axisLabel: { fontSize: 12 },
                                    tickLabels: {
                                        fontSize: 12,
                                    },
                                    grid: { stroke: "#B3E5FC", strokeWidth: 0.25 },
                                }}
                                dependentAxis
                            />
                            <VictoryAxis
                                style={{
                                    axisLabel: { fontSize: 10 },
                                    tickLabels: {
                                        fontSize: 10,
                                    },
                                }}
                            />
                            <VictoryBar
                                horizontal
                                barRatio={0.8}
                                style={{ data: { fill: themeColors.blueAccent } }}
                                alignment="middle"
                                data={visitData}
                                x="name"
                                y="count"
                            />
                        </VictoryChart>
                        <Divider />
                        <View style={styles.graphContainer}>
                            <VictoryPie
                                data={graphicData}
                                colorScale={graphicColor}
                                width={350}
                                height={250}
                                animate={{ easing: "exp" }}
                                innerRadius={30}
                            />
                        </View>
                        <Divider />
                        <Text style={styles.cardSectionTitle}>Referrals</Text>
                        <VictoryChart
                            animate={{ duration: 500 }}
                            domainPadding={10}
                            containerComponent={<VictoryZoomContainer />}
                            theme={VictoryTheme.material}
                        >
                            <VictoryGroup offset={20} colorScale={"qualitative"}>
                                <VictoryBar
                                    barRatio={0.5}
                                    style={{ data: { fill: themeColors.riskRed } }}
                                    data={unresolvedRef}
                                    x="name"
                                    y="count"
                                />
                                <VictoryBar
                                    barRatio={0.5}
                                    style={{ data: { fill: themeColors.riskGreen } }}
                                    data={resolvedRef}
                                    x="name"
                                    y="count"
                                />
                            </VictoryGroup>
                        </VictoryChart>
                    </>
                ) : (
                    <Text>Not data</Text>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default Todo;
