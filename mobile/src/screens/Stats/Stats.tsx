import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { Button, Divider, Text } from "react-native-paper";
import useStyles from "./Stats.styles";
import { useIsFocused } from "@react-navigation/core";
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
import { modelName } from "../../models/constant";

const allZone = "all zones";

export type BarStat = {
    name: string;
    count: number;
};

export type PieStat = {
    x: string;
    y: number;
};

const Stats = () => {
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
    const [showVisits, setShowVisits] = useState<boolean>(true);
    const [showReferrals, setShowReferrals] = useState<boolean>(false);
    const [showDisabilites, setShowDisabilites] = useState<boolean>(false);

    const [loading, setLoading] = useState<boolean>(true);

    const [zoneOption, setZoneOption] = useState<string>(allZone);
    const [visitData, setVisitData] = useState(fetchVisitData);
    const [visitCount, setVisitCount] = useState<number>(0);
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

    const graphicColor = [themeColors.hhaGreen, themeColors.hhaPurple, themeColors.hhaBlue];

    const VisitStats = async () => {
        let sum = 0;
        for (const zone of zones) {
            const count = await database
                .get(modelName.visits)
                .query(Q.where(VisitField.zone, zone[0]))
                .fetchCount();
            if (count !== 0) {
                sum = sum + count;
                var record: BarStat = { name: zone[1], count: count };
                fetchVisitData.push(record);
            }
        }
        setVisitCount(sum);
        setVisitData(fetchVisitData);
    };

    const RiskStats = async (zoneCode?: number) => {
        const visitType = [
            VisitField.health_visit,
            VisitField.social_visit,
            VisitField.educat_visit,
            VisitField.nutrit_visit,
        ];
        const visitName = ["Health", "Social", "Education", "Nutrition"];
        var index = 0;
        pieData = [];
        for (const type of visitType) {
            let count;
            if (zoneCode) {
                count = await database
                    .get(modelName.visits)
                    .query(Q.where(type, true), Q.where(VisitField.zone, zoneCode))
                    .fetchCount();
            } else {
                count = await database
                    .get(modelName.visits)
                    .query(Q.where(type, true))
                    .fetchCount();
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
                    .get(modelName.referrals)
                    .query(Q.where(type, true), Q.where(ReferralField.resolved, resolved))
                    .fetchCount();
            } else {
                count = await database
                    .get(modelName.referrals)
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
                .get(modelName.clients)
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
            .get(modelName.clients)
            .query(Q.where(ClientField.disability, Q.notEq("")))
            .fetchCount();
        setDisabilityCount(clientCount);
        setDisabilityData(fetchDisabilityData);
    };

    const filterVisitByZone = async (zone?: string) => {
        if (zone) {
            let zoneCode;
            for (const element of zones) {
                if (element[1] === zone) {
                    zoneCode = element[0];
                }
            }
            RiskStats(zoneCode).then(() => {
                setZoneOption(zone);
                setGraphicData(pieData);
            });
        } else {
            RiskStats().then(() => {
                setZoneOption(allZone);
                setGraphicData(pieData);
            });
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
                        DisabilityStat();
                    });
                });
        }
    }, [isFocused]);

    return (
        <ScrollView>
            <View style={styles.row}>
                <Text style={styles.title}>Statistics</Text>
            </View>
            {!loading ? (
                <>
                    <View style={styles.btnRow}>
                        <Button
                            mode="contained"
                            style={{
                                backgroundColor: !showVisits ? "grey" : themeColors.blueBgDark,
                            }}
                            onPress={() => {
                                if (!showVisits) {
                                    setShowVisits(true);
                                    setShowReferrals(false);
                                    setShowDisabilites(false);
                                }
                            }}
                        >
                            {"Visits"}
                        </Button>
                        <Button
                            mode="contained"
                            style={{
                                backgroundColor: !showReferrals ? "grey" : themeColors.blueBgDark,
                            }}
                            onPress={() => {
                                if (!showReferrals) {
                                    setShowVisits(false);
                                    setShowReferrals(true);
                                    setShowDisabilites(false);
                                }
                            }}
                        >
                            {"Referrals"}
                        </Button>
                        <Button
                            mode="contained"
                            style={{
                                backgroundColor: !showDisabilites ? "grey" : themeColors.blueBgDark,
                            }}
                            onPress={() => {
                                if (!showDisabilites) {
                                    setShowVisits(false);
                                    setShowReferrals(false);
                                    setShowDisabilites(true);
                                }
                            }}
                        >
                            {"Disabilites"}
                        </Button>
                    </View>
                    {showVisits ? (
                        <>
                            <Divider />
                            <Text style={styles.cardSectionTitle}>Visits</Text>
                            <Divider />
                            <Text style={styles.chartTitle}>By Type</Text>
                            <Text style={styles.graphStat}>
                                <Text>Showing data for </Text>
                                <Text style={{ fontWeight: "bold" }}>{zoneOption}</Text>
                            </Text>
                            {zoneOption !== allZone ? (
                                <Button
                                    style={styles.filterBtn}
                                    mode="contained"
                                    onPress={() => {
                                        filterVisitByZone();
                                    }}
                                >
                                    View All Zone
                                </Button>
                            ) : (
                                <></>
                            )}
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
                            <Text style={styles.chartTitle}>By Zone</Text>
                            <Text style={styles.graphStat}>
                                <Text style={{ fontWeight: "bold" }}>Total Visits: </Text>
                                <Text>{visitCount}</Text>
                            </Text>
                            {zoneOption === allZone ? (
                                <Text style={styles.graphStat}>
                                    {"Click on bar to filter by zone"}
                                </Text>
                            ) : (
                                <></>
                            )}
                            <Svg>
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

                    {showReferrals ? (
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

export default Stats;
