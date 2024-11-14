import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Link, Skeleton, Typography } from "@mui/material";
import {
    BarChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
    Bar,
    PieChart,
    Pie,
    Cell,
} from "recharts";

import { useZones } from "@cbr/common/util/hooks/zones";
import { IStats, IStatsVisit } from "@cbr/common/util/stats";
import { themeColors } from "@cbr/common/util/colors";

interface IProps {
    stats?: IStats;
}

const VisitStats = ({ stats }: IProps) => {
    const CHART_HEIGHT = 400;
    const { t } = useTranslation();

    const zones = useZones();
    const zoneToName = (id: number) => zones.get(id) ?? "";

    const [breakdownZoneId, setBreakdownZoneId] = useState(0);
    const breakdownZone = stats?.visits.find((v) => v.zone_id === breakdownZoneId);

    useEffect(() => {
        setBreakdownZoneId(0);
    }, [stats]);

    const getBreakdownCount = (key: keyof IStatsVisit): number => {
        if (breakdownZone) {
            return breakdownZone[key];
        }
        return stats?.visits.reduce((count, visit) => (count += visit[key]), 0) ?? 0;
    };
    const breakdownData = [
        {
            label: t("general.health"),
            count: getBreakdownCount("health_count"),
            color: themeColors.hhaGreen,
        },
        {
            label: t("general.education"),
            count: getBreakdownCount("educat_count"),
            color: themeColors.hhaPurple,
        },
        {
            label: t("general.social"),
            count: getBreakdownCount("social_count"),
            color: themeColors.hhaBlue,
        },
        {
            label: t("general.nutrition"),
            count: getBreakdownCount("nutrit_count"),
            color: themeColors.yellow,
        },
        {
            label: t("general.mental"),
            count: getBreakdownCount("mental_count"),
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
        <Grid container spacing={3} style={{ minHeight: CHART_HEIGHT }}>
            {/* Zones with visits */}
            <Grid item xs={12} lg={7} xl={8}>
                <Typography variant="h3">{t("statistics.byZone")}</Typography>
                <Typography variant="body1">
                    {Boolean(!stats || stats.visits.length)
                        ? t("statistics.onlyZonesWithVisits")
                        : t("statistics.noVisitsFound")}
                </Typography>
                <br />

                {stats ? (
                    <ResponsiveContainer
                        width="100%"
                        height={stats.visits.length ? CHART_HEIGHT : 0}
                    >
                        <BarChart layout="vertical" data={stats.visits} onClick={handleChartClick}>
                            <XAxis type="number" allowDecimals={false} />
                            <YAxis
                                type="category"
                                dataKey="zone_id"
                                width={150}
                                tickFormatter={zoneToName}
                            />
                            <Tooltip labelFormatter={zoneToName} />
                            <Bar
                                dataKey="total"
                                name={t("statistics.visits")}
                                fill={themeColors.blueAccent}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <Skeleton variant="rectangular" height={400} />
                )}
            </Grid>

            {/* Visits by Type */}
            <Grid item xs={12} lg={5} xl={4}>
                <Typography variant="h3">{t("statistics.byType")}</Typography>
                <Typography variant="body1">
                    {t("statistics.showingDataFor")}:{" "}
                    <b>{zones.get(breakdownZoneId) ?? t("statistics.allZones")}</b>.<br />
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

                {stats ? (
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
                    <Skeleton variant="rectangular" height={400} />
                )}
            </Grid>
        </Grid>
    );
};

export default VisitStats;
