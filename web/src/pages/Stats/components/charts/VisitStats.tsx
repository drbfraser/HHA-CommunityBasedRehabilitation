import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { themeColors } from "@cbr/common/util/colors";
import { useZones } from "@cbr/common/util/hooks/zones";
import { IStats, StatsVisitCategory } from "@cbr/common/util/stats";
import { Grid, Link, Skeleton, Typography } from "@mui/material";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { IAge, IGender } from "../filterbar/StatsDemographicFilter";
import HorizontalBarGraphStats, {
    IDemographicTotals,
    IHBarGraphStatsData,
    ISubheadings,
} from "./HorizontalBarGraphStats";

interface IProps {
    stats?: IStats;
    age: IAge;
    gender: IGender;
}

interface ZoneTotals {
    zone_id: number;
    key?: string;
    label?: string;
    health?: number;
    educat?: number;
    social?: number;
    nutrit?: number;
    mental?: number;
}

export interface CategoryTotals {
    mental: number;
    nutrit: number;
    social: number;
    educat: number;
    health: number;
}

const visitsCategoryLabels = ["Health", "Education", "Social", "Nutrition", "Mental"];
const visitCategories: StatsVisitCategory[] = ["health", "educat", "social", "nutrit", "mental"];

const VisitStats = ({ stats, age, gender }: IProps) => {
    const [totalFAdults, setTotalFAdults] = useState(0);
    const [totalMAdults, setTotalMAdults] = useState(0);
    const [totalFChild, setTotalFChild] = useState(0);
    const [totalMChild, setTotalMChild] = useState(0);
    const [totalData, setTotalData] = useState<IHBarGraphStatsData[]>([]);
    const [totalCategory, setTotalCategory] = useState<CategoryTotals>({
        mental: 0,
        nutrit: 0,
        social: 0,
        educat: 0,
        health: 0,
    });

    const [breakdownZoneId, setBreakdownZoneId] = useState(0);
    const [totalPieData, setTotalPieData] = useState<ZoneTotals[]>([]);
    const breakdownZone = totalPieData.find((d) => d.zone_id === breakdownZoneId);
    const zones = useZones();
    const zoneToName = useCallback((id: number) => zones.get(id) ?? "", [zones]);

    useEffect(() => {
        setBreakdownZoneId(0);
    }, [stats]);

    type BreakdownKey = keyof ZoneTotals | keyof CategoryTotals;

    const getBreakdownCount = (key: BreakdownKey) => {
        if (breakdownZone) {
            return breakdownZone[key] ?? 0;
        }

        return totalCategory[key as keyof CategoryTotals] ?? 0;
    };

    const { t } = useTranslation();
    const CHART_HEIGHT = 400;

    const demographicTotalsRef = useRef<IDemographicTotals>({
        female_adult: 0,
        male_adult: 0,
        female_child: 0,
        male_child: 0,
    });

    useEffect(() => {
        if (stats) {
            let fAdults = 0;
            let mAdults = 0;
            let fChild = 0;
            let mChild = 0;

            const { pieData, totalData, categoryTotals } = stats.visits.reduce(
                (acc, v) => {
                    const zoneTotals: ZoneTotals = {
                        zone_id: v.zone_id,
                        label: zoneToName(v.zone_id),
                    };

                    // Totals for the pie chart
                    visitCategories.forEach((category, index) => {
                        acc.categoryTotals[category] = acc.categoryTotals[category] || 0;
                        const categoryTotal =
                            (v[`${category}_female_adult_total`] ?? 0) +
                            (v[`${category}_male_adult_total`] ?? 0) +
                            (v[`${category}_female_child_total`] ?? 0) +
                            (v[`${category}_male_child_total`] ?? 0);

                        zoneTotals[`${category}`] = categoryTotal;
                        zoneTotals.key = visitsCategoryLabels[index];

                        acc.categoryTotals[category] += categoryTotal;
                    });

                    const zoneDemographics: IHBarGraphStatsData = {
                        femaleAdult: 0,
                        maleAdult: 0,
                        femaleChild: 0,
                        maleChild: 0,
                        label: zoneToName(v.zone_id),
                        zone_id: v.zone_id,
                    };

                    // Totals for the Regular Bar Graph
                    visitCategories.forEach((category, index) => {
                        zoneDemographics.femaleAdult =
                            (zoneDemographics.femaleAdult ?? 0) +
                            (v[`${category}_female_adult_total`] ?? 0);
                        zoneDemographics.maleAdult =
                            (zoneDemographics.maleAdult ?? 0) +
                            (v[`${category}_male_adult_total`] ?? 0);
                        zoneDemographics.femaleChild =
                            (zoneDemographics.femaleChild ?? 0) +
                            (v[`${category}_female_child_total`] ?? 0);
                        zoneDemographics.maleChild =
                            (zoneDemographics.maleChild ?? 0) +
                            (v[`${category}_male_child_total`] ?? 0);
                        zoneDemographics.category = category;

                        if (!zoneDemographics.category) {
                            zoneDemographics.category = category;
                        }

                        fAdults += v[`${category}_female_adult_total`] ?? 0;
                        mAdults += v[`${category}_male_adult_total`] ?? 0;
                        fChild += v[`${category}_female_child_total`] ?? 0;
                        mChild += v[`${category}_female_child_total`] ?? 0;
                    });

                    acc.pieData.push(zoneTotals);
                    acc.totalData.push(zoneDemographics);

                    return acc;
                },
                {
                    pieData: [],
                    totalData: [],
                    categoryTotals: { mental: 0, nutrit: 0, social: 0, educat: 0, health: 0 },
                } as {
                    pieData: ZoneTotals[];
                    totalData: IHBarGraphStatsData[];
                    categoryTotals: CategoryTotals;
                }
            );

            setTotalCategory(categoryTotals);
            setTotalPieData(pieData);
            setTotalData(totalData);
            setTotalFAdults(fAdults);
            setTotalMAdults(mAdults);
            setTotalFChild(fChild);
            setTotalMChild(mChild);

            demographicTotalsRef.current = {
                female_adult: fAdults,
                male_adult: mAdults,
                female_child: fChild,
                male_child: mChild,
            };
        }
    }, [stats, zoneToName]);

    const subheadings: ISubheadings[] = [
        {
            label: t("statistics.totalFChild"),
            total: totalFChild,
        },
        {
            label: t("statistics.totalMChild"),
            total: totalMChild,
        },
        {
            label: t("statistics.totalFAdult"),
            total: totalFAdults,
        },
        {
            label: t("statistics.totalMAdult"),
            total: totalMAdults,
        },
    ];

    const breakdownData = [
        {
            label: t("general.health"),
            count: getBreakdownCount("health"),
            color: themeColors.hhaGreen,
        },
        {
            label: t("general.education"),
            count: getBreakdownCount("educat"),
            color: themeColors.hhaPurple,
        },
        {
            label: t("general.social"),
            count: getBreakdownCount("social"),
            color: themeColors.hhaBlue,
        },
        {
            label: t("general.nutrition"),
            count: getBreakdownCount("nutrit"),
            color: themeColors.yellow,
        },
        {
            label: t("general.mental"),
            count: getBreakdownCount("mental"),
            color: themeColors.bluePale,
        },
    ].filter((z) => z.count);

    const handleChartClick = (e: any) => {
        if (!e || !Array.isArray(e.activePayload) || e.activePayload.length === 0) {
            return;
        }

        setBreakdownZoneId(e.activePayload[0].payload?.zone_id);
    };

    return (
        <>
            <Typography variant="h3">{t("statistics.byZone")}</Typography>
            {Boolean(!stats || stats.visits.length)
                ? t("statistics.onlyZonesWithVisits")
                : t("statistics.noVisitsFound")}
            <HorizontalBarGraphStats
                title={t("statistics.visits")}
                data={totalData}
                age={age}
                gender={gender}
                subheadings={subheadings}
                totals={demographicTotalsRef.current}
                onBarClick={handleChartClick}
            />

            <Grid item xs={12} lg={5} xl={4}>
                <Typography variant="h3">{t("statistics.byType")}</Typography>
                <Typography variant="body1">
                    {t("statistics.showingDataFor")}:{" "}
                    <b>{zones.get(breakdownZoneId) ?? t("statistics.allZones")}</b>.
                </Typography>

                <Typography variant="body2">
                    {Boolean(!breakdownZone) ? (
                        t("statistics.clickForZoneSpecificData")
                    ) : (
                        <Link
                            component="button"
                            variant="body1"
                            onClick={() => setBreakdownZoneId(0)}
                        >
                            {t("statistics.viewAllZoneData")}
                        </Link>
                    )}
                </Typography>

                {Boolean(!stats || stats.visits.length) ? (
                    <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
                        <PieChart>
                            <Pie
                                data={breakdownData}
                                dataKey="count"
                                nameKey="label"
                                label={(a) => a.label}
                                labelLine={true}
                                innerRadius={60}
                            >
                                {breakdownData.map((entry, i) => (
                                    <Cell key={i} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <Skeleton variant="rectangular" height={0} />
                )}
            </Grid>
        </>
    );
};

export default VisitStats;
