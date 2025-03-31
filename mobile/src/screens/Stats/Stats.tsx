import {
    ClientField,
    ReferralField,
    ReferralFormField,
    referralStatsChartLabels,
    serviceTypes,
    themeColors,
    useDisabilities,
    useZones,
    VisitField,
} from "@cbr/common";
import { Q } from "@nozbe/watermelondb";
import { useDatabase } from "@nozbe/watermelondb/hooks";
import { useIsFocused } from "@react-navigation/core";
import i18n from "i18next";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import { Button, Divider, Switch, Text } from "react-native-paper";
import { VictoryPie } from "victory-native";
import { modelName } from "../../models/constant";
import BarGraph from "./BarGraph";
import useStyles from "./Stats.styles";

export type BarStat = {
    name: string;
    count: number;
};

export type PieStat = {
    x: string;
    y: number;
};

export type BarGraphData = {
    data: BarStat[];
    colour: string;
};

export type LegendColours = {
    name: string;
    symbol: string;
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
    const [showVisits, setShowVisits] = useState<boolean>(true);
    const [showReferrals, setShowReferrals] = useState<boolean>(false);
    const [showDisabilites, setShowDisabilites] = useState<boolean>(false);
    const [archiveMode, setArchiveMode] = useState<boolean>(false);
    const { t } = useTranslation();
    const disabilityMap = useDisabilities(t);

    const [loading, setLoading] = useState<boolean>(true);

    const allZone = i18n.t("statistics.allZones");
    const [zoneOption, setZoneOption] = useState<string>(allZone);
    const [visitCount, setVisitCount] = useState<number>(0);
    const [graphicData, setGraphicData] = useState<any>([
        { x: "", y: 0 },
        { x: "", y: 0 },
        { x: "", y: 0 },
    ]);

    const [resolvedCount, setResolvedCount] = useState<number>(0);
    const [unresolvedCount, setUnresolvedCount] = useState<number>(0);
    const [disabilityCount, setDisabilityCount] = useState<number>(0);

    const [visitGraphData, setVisitGraphData] = useState<BarGraphData[]>([]);
    const [disabitiesGraphData, setDisabilitiesGraphData] = useState<BarGraphData[]>([]);
    const [referralsGraphData, setReferralsGraphData] = useState<BarGraphData[]>([]);
    const [referralsGraphLegend, setReferralsGraphLegend] = useState<LegendColours[]>([]);

    const graphicColor = [
        themeColors.hhaGreen,
        themeColors.hhaPurple,
        themeColors.hhaBlue,
        themeColors.yellow,
        themeColors.bluePale,
    ];

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

        const barGraphData: BarGraphData = {
            data: fetchVisitData,
            colour: themeColors.blueAccent,
        };
        const barGraphDataArray: BarGraphData[] = [barGraphData];

        setVisitGraphData(barGraphDataArray);
        setVisitCount(sum);
    };

    const RiskStats = async (zoneCode?: number) => {
        const visitType = [
            VisitField.health_visit,
            VisitField.social_visit,
            VisitField.educat_visit,
            VisitField.nutrit_visit,
            VisitField.mental_visit,
        ];
        const visitName = [
            i18n.t("newVisit.health"),
            i18n.t("newVisit.social"),
            i18n.t("newVisit.education"),
            i18n.t("newVisit.nutrition"),
            i18n.t("newVisit.mental"),
        ];

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
                name: referralStatsChartLabels[type],
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
        } else {
            setUnresolvedCount(sum);
        }

        const resolvedData: BarGraphData = {
            data: fetchResovledReferralData,
            colour: themeColors.riskGreen,
        };

        const unresolved: BarGraphData = {
            data: fetchUnResovledReferralData,
            colour: themeColors.riskRed,
        };

        const barGraphDataArray: BarGraphData[] = [resolvedData, unresolved];
        setReferralsGraphData(barGraphDataArray);
        const legendColours: LegendColours[] = [
            {
                name: t("statistics.unresolved"),
                symbol: themeColors.riskRed,
            },
            {
                name: t("statistics.resolved"),
                symbol: themeColors.riskGreen,
            },
        ];

        setReferralsGraphLegend(legendColours);
    };

    const DisabilityStat = async () => {
        for (const type of disabilityMap) {
            let count = database
                .get(modelName.clients)
                .query(
                    Q.or(
                        Q.where(ClientField.disability, `[${type[0]}]`),
                        Q.where(ClientField.disability, Q.like(`[${type[0]},%`)),
                        Q.where(ClientField.disability, Q.like(`%,${type[0]},%`)),
                        Q.where(ClientField.disability, Q.like(`%, ${type[0]}]`)),
                        Q.where(ClientField.disability, Q.like(`%,${type[0]}]`))
                    )
                );
            if (archiveMode) {
                count = count.extend(Q.where(ClientField.is_active, true));
            }
            const result: number = await count.fetchCount();

            if (result != 0) {
                var record: BarStat = {
                    name: type[1],
                    count: result,
                };
                fetchDisabilityData.push(record);
            }
        }
        let clientCount = database
            .get(modelName.clients)
            .query(Q.where(ClientField.disability, Q.notEq("")));
        if (archiveMode) {
            clientCount = clientCount.extend(Q.where(ClientField.is_active, true));
        }
        const result: number = await clientCount.fetchCount();

        const barGraphData: BarGraphData = {
            data: fetchDisabilityData,
            colour: themeColors.blueAccent,
        };
        const barGraphDataArray: BarGraphData[] = [barGraphData];

        setDisabilitiesGraphData(barGraphDataArray);
        setDisabilityCount(result);
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
    }, [isFocused, archiveMode]);

    return (
        <ScrollView>
            <View style={styles.row}>
                <Text style={styles.title}>{t("statistics.statistics")}</Text>
            </View>
            {!loading ? (
                <>
                    <View style={styles.btnRow}>
                        <View style={styles.btnWrapper}>
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
                                {t("statistics.visits")}
                            </Button>
                        </View>
                        <View style={styles.btnWrapper}>
                            <Button
                                mode="contained"
                                style={{
                                    backgroundColor: !showReferrals
                                        ? "grey"
                                        : themeColors.blueBgDark,
                                }}
                                onPress={() => {
                                    if (!showReferrals) {
                                        setShowVisits(false);
                                        setShowReferrals(true);
                                        setShowDisabilites(false);
                                    }
                                }}
                            >
                                {t("statistics.referrals")}
                            </Button>
                        </View>
                        <View style={styles.btnWrapper}>
                            <Button
                                mode="contained"
                                style={{
                                    backgroundColor: !showDisabilites
                                        ? "grey"
                                        : themeColors.blueBgDark,
                                }}
                                onPress={() => {
                                    if (!showDisabilites) {
                                        setShowVisits(false);
                                        setShowReferrals(false);
                                        setShowDisabilites(true);
                                    }
                                }}
                            >
                                {t("statistics.disabilities")}
                            </Button>
                        </View>
                    </View>
                    {showVisits ? (
                        <>
                            <Divider />
                            <Text style={styles.cardSectionTitle}>{t("statistics.visits")}</Text>
                            <Divider />
                            <Text style={styles.chartTitle}>{t("statistics.byType")}</Text>
                            <Text style={styles.graphStat}>
                                <Text>{t("statistics.showingDataFor")} </Text>
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
                                    {t("statistics.viewAllZone")}
                                </Button>
                            ) : (
                                <></>
                            )}
                            <View style={styles.graphContainer}>
                                <VictoryPie
                                    data={graphicData}
                                    colorScale={graphicColor}
                                    width={500}
                                    height={250}
                                    animate={{ easing: "exp" }}
                                    innerRadius={30}
                                />
                            </View>
                            <Text style={styles.chartTitle}>{t("statistics.byZone")}</Text>
                            <Text style={styles.graphStat}>
                                <Text style={{ fontWeight: "bold" }}>
                                    {t("statistics.totalVisits")}{" "}
                                </Text>
                                <Text>{visitCount}</Text>
                            </Text>
                            {zoneOption === allZone ? (
                                <Text style={styles.graphStat}>
                                    {t("statistics.clickBarToFilter")}
                                </Text>
                            ) : (
                                <></>
                            )}
                            <BarGraph barData={visitGraphData} onBarPress={filterVisitByZone} />
                        </>
                    ) : (
                        <></>
                    )}

                    {showReferrals ? (
                        <>
                            <Divider />
                            <Text style={styles.cardSectionTitle}>{t("statistics.referrals")}</Text>
                            <Text style={styles.graphStat}>
                                <Text style={{ fontWeight: "bold" }}>
                                    {t("statistics.totalUnresolved")}{" "}
                                </Text>
                                <Text>{unresolvedCount}</Text>
                            </Text>
                            <Text style={styles.graphStat}>
                                <Text style={{ fontWeight: "bold" }}>
                                    {t("statistics.totalResolved")}{" "}
                                </Text>
                                <Text>{resolvedCount}</Text>
                            </Text>
                            <BarGraph barData={referralsGraphData} legend={referralsGraphLegend} />
                        </>
                    ) : (
                        <></>
                    )}
                    {showDisabilites ? (
                        <>
                            <Divider />
                            <View style={styles.row}>
                                <Text>{t("statistics.allClients")}</Text>
                                <Switch
                                    style={styles.switch}
                                    thumbColor={archiveMode ? themeColors.white : themeColors.white}
                                    onValueChange={setArchiveMode}
                                    value={archiveMode}
                                />
                                <Text>{t("statistics.activeClients")}</Text>
                            </View>
                            <Text style={styles.cardSectionTitle}>
                                {t("statistics.disabilities")}
                            </Text>
                            <Text style={styles.graphStat}>
                                <Text style={{ fontWeight: "bold" }}>
                                    {t("statistics.clientsWithDisabilities")}{" "}
                                </Text>
                                <Text>{disabilityCount}</Text>
                            </Text>
                            <BarGraph barData={disabitiesGraphData} />
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
