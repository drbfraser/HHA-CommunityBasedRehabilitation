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
} from "victory-native";
import { referralFieldLabels, serviceTypes, themeColors, useZones } from "@cbr/common";
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
    const data: VisitStat[] = [];
    const pieData: PieStat[] = [];
    const styles = useStyles();
    const authContext = useContext(AuthContext);
    const [loading, setLoading] = useState<boolean>(true);
    const [visitData, setVisitData] = useState(data);
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
                data.push(record);
            }
        }
        setVisitData(data);
    };

    const RiskStats = async () => {
        console.log("getting new riskstats");
        const visitType = ["health_visit", "social_visit", "educat_visit"];
        const visitName = ["Health", "Social", "Education"];
        var index = 0;
        for (const type of visitType) {
            const count = await database.get("visits").query(Q.where(type, true)).fetchCount();
            if (count !== 0) {
                console.log(`${visitName[index]} has ${count} record`);
                var record = { x: visitName[index], y: count };
                pieData.push(record);
            }
            index++;
        }
    };

    const referralStats = async () => {
        serviceTypes.map((serviceType) => {
            console.log(referralFieldLabels[serviceType]);
        });
    };

    useEffect(() => {
        if (isFocused) {
            VisitStats()
                .catch(() => {})
                .finally(() => {
                    setLoading(false);
                    RiskStats().then(() => {
                        console.log(pieData);
                        setGraphicData(pieData);
                        referralStats();
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
                                barRatio={0.8}
                                style={{ data: { fill: themeColors.blueAccent } }}
                                alignment="middle"
                                data={visitData}
                                x="name"
                                y="count"
                            />
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
