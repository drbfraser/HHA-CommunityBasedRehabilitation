import React, { useContext, useEffect, useState } from "react";
import { Alert, SafeAreaView, ScrollView, View } from "react-native";
import { Button, Divider, Text } from "react-native-paper";
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
    VictoryLegend,
} from "victory-native";
import {
    ClientField,
    ReferralField,
    referralFieldLabels,
    ReferralFormField,
    serviceTypes,
    themeColors,
    useDisabilities,
    useZones,
    VisitField,
} from "@cbr/common";
import { Q } from "@nozbe/watermelondb";
import Svg from "react-native-svg";

export type BarStat = {
    name: string;
    count: number;
};

export type PieStat = {
    x: string;
    y: number;
};

const Todo = () => {
    const fetchVisitData: BarStat[] = [];
    let pieData: PieStat[] = [];
    const fetchUnResovledReferralData: BarStat[] = [];
    const fetchResovledReferralData: BarStat[] = [];
    const fetchDisabilityData: BarStat[] = [];
    const styles = useStyles();
    const database = useDatabase();
    const isFocused = useIsFocused();
    const zones = useZones();
    const disabilityMap = useDisabilities();
    const authContext = useContext(AuthContext);
    const [showVisit, setShowVisit] = useState<boolean>(true);
    const [showReferral, setShowReferral] = useState<boolean>(false);
    const [showDisabilites, setShowDisabilites] = useState<boolean>(false);

    const [loading, setLoading] = useState<boolean>(true);

    const [visitData, setVisitData] = useState(fetchVisitData);
    const [graphicData, setGraphicData] = useState<any>([
        { x: "", y: 0 },
        { x: "", y: 0 },
        { x: "", y: 0 },
    ]);

    const [resolvedCount, setResolvedCount] = useState<number>(0);
    const [unresolvedCount, setUnresolvedCount] = useState<number>(0);
    const [unresolvedRef, setUnresolvedRef] = useState(fetchUnResovledReferralData);
    const [resolvedRef, setResolvedRef] = useState(fetchResovledReferralData);

    const [disabilityData, setDisabilityData] = useState(fetchDisabilityData);
    const [disabilityCount, setDisabilityCount] = useState<number>(0);

    useEffect(() => {
        authContext.requireLoggedIn(true);
    }, []);

    const graphicColor = [themeColors.hhaGreen, themeColors.hhaPurple, themeColors.hhaBlue];

    const VisitStats = async () => {
        for (const zone of zones) {
            const count = await database.get("visits").query(Q.where("zone", zone[0])).fetchCount();
            if (count !== 0) {
                var record: BarStat = { name: zone[1], count: count };
                fetchVisitData.push(record);
            }
        }
        setVisitData(fetchVisitData);
    };

    const RiskStats = async (zoneCode?: number) => {
        const visitType = ["health_visit", "social_visit", "educat_visit"];
        const visitName = ["Health", "Social", "Education"];
        var index = 0;
        pieData = [];
        for (const type of visitType) {
            let count;
            if (zoneCode) {
                count = await database
                    .get("visits")
                    .query(Q.where(type, true), Q.where(VisitField.zone, zoneCode))
                    .fetchCount();
            } else {
                count = await database.get("visits").query(Q.where(type, true)).fetchCount();
            }
            if (count !== 0) {
                var record = { x: visitName[index], y: count };
                pieData.push(record);
            }
            index++;
        }
    };

    const referralStats = async (resolved: boolean) => {
        let sum = 0;
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
            sum = sum + count;
            var record: BarStat = {
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
            setResolvedCount(sum);
            setResolvedRef(fetchResovledReferralData);
        } else {
            setUnresolvedCount(sum);
            setUnresolvedRef(fetchUnResovledReferralData);
        }
    };

    const DisabilityStat = async () => {
        for (const type of disabilityMap) {
            const count = await database
                .get("clients")
                .query(
                    Q.or(
                        Q.where(ClientField.disability, `[${type[0]}]`),
                        Q.where(ClientField.disability, Q.like(`[${type[0]},%`)),
                        Q.where(ClientField.disability, Q.like(`%,${type[0]},%`)),
                        Q.where(ClientField.disability, Q.like(`%, ${type[0]}]`)),
                        Q.where(ClientField.disability, Q.like(`%,${type[0]}]`))
                    )
                )
                .fetchCount();
            if (count != 0) {
                var record: BarStat = {
                    name: type[1],
                    count: count,
                };
                fetchDisabilityData.push(record);
            }
        }
        const clientCount = await database
            .get("clients")
            .query(Q.where(ClientField.disability, Q.notEq("")))
            .fetchCount();
        setDisabilityCount(clientCount);
        setDisabilityData(fetchDisabilityData);
    };

    const filterVisitByZone = async (zone: string) => {
        let zoneCode;
        for (const element of zones) {
            if (element[1] === zone) {
                zoneCode = element[0];
            }
        }
        RiskStats(zoneCode).then(() => {
            setGraphicData(pieData);
        });
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
                        DisabilityStat();
                    });
                });
        }
    }, [isFocused]);

    return (
        <ScrollView>
            <View style={styles.row}>
                <Text style={styles.title}>Statistic</Text>
            </View>
            {!loading ? (
                <>
                    <View style={styles.btnRow}>
                        <Button
                            mode="contained"
                            style={{
                                backgroundColor: !showVisit ? "grey" : themeColors.blueBgDark,
                            }}
                            onPress={() => {
                                if (!showVisit) {
                                    setShowVisit(true);
                                    setShowReferral(false);
                                    setShowDisabilites(false);
                                }
                            }}
                        >
                            {"Visits"}
                        </Button>
                        <Button
                            mode="contained"
                            style={{
                                backgroundColor: !showReferral ? "grey" : themeColors.blueBgDark,
                            }}
                            onPress={() => {
                                if (!showReferral) {
                                    setShowVisit(false);
                                    setShowReferral(true);
                                    setShowDisabilites(false);
                                }
                            }}
                        >
                            {"Referral"}
                        </Button>
                        <Button
                            mode="contained"
                            style={{
                                backgroundColor: !showDisabilites ? "grey" : themeColors.blueBgDark,
                            }}
                            onPress={() => {
                                if (!showDisabilites) {
                                    setShowVisit(false);
                                    setShowReferral(false);
                                    setShowDisabilites(true);
                                }
                            }}
                        >
                            {"Disabilites"}
                        </Button>
                    </View>
                    {showVisit ? (
                        <>
                            <Divider />
                            <Text style={styles.cardSectionTitle}>Visits</Text>
                            <Divider />
                            <Text style={styles.graphStat}>By Type</Text>
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
                            <Svg>
                                <Text style={styles.graphStat}>By Zone</Text>
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
                                        events={[
                                            {
                                                target: "data",
                                                eventHandlers: {
                                                    onPressIn: () => {
                                                        return [
                                                            {
                                                                target: "data",
                                                                mutation: (props) => {
                                                                    filterVisitByZone(
                                                                        props.datum.name
                                                                    );
                                                                },
                                                            },
                                                        ];
                                                    },
                                                },
                                            },
                                        ]}
                                        x="name"
                                        y="count"
                                    />
                                </VictoryChart>
                            </Svg>
                        </>
                    ) : (
                        <></>
                    )}

                    {showReferral ? (
                        <>
                            <Divider />
                            <Text style={styles.cardSectionTitle}>Referrals</Text>
                            <Text style={styles.graphStat}>
                                <Text style={{ fontWeight: "bold" }}>Total Unresolved: </Text>
                                <Text>{unresolvedCount}</Text>
                            </Text>
                            <Text style={styles.graphStat}>
                                <Text style={{ fontWeight: "bold" }}>Total Resolved: </Text>
                                <Text>{resolvedCount}</Text>
                            </Text>
                            <VictoryChart
                                animate={{ duration: 500 }}
                                domainPadding={10}
                                containerComponent={<VictoryZoomContainer />}
                                theme={VictoryTheme.material}
                            >
                                <VictoryLegend
                                    x={280}
                                    y={0}
                                    gutter={50}
                                    style={{ title: { fontSize: 20 } }}
                                    data={[
                                        {
                                            name: "Unresolved",
                                            symbol: { fill: themeColors.riskRed },
                                        },
                                        {
                                            name: "Resolved",
                                            symbol: { fill: themeColors.riskGreen },
                                        },
                                    ]}
                                />
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
                        <></>
                    )}
                    {showDisabilites ? (
                        <>
                            <Divider />
                            <Text style={styles.cardSectionTitle}>Disabilities</Text>
                            <Text style={styles.graphStat}>
                                <Text style={{ fontWeight: "bold" }}>
                                    Clients with Disabilities:{" "}
                                </Text>
                                <Text>{disabilityCount}</Text>
                            </Text>
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
                                    data={disabilityData}
                                    x="name"
                                    y="count"
                                />
                            </VictoryChart>
                        </>
                    ) : (
                        <></>
                    )}
                </>
            ) : (
                <></>
            )}
        </ScrollView>
    );
};

export default Todo;
