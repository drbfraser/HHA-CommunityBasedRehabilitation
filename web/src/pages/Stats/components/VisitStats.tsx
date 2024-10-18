import { Link, Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Skeleton from "@material-ui/lab/Skeleton";
import React, { useEffect, useState } from "react";
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
            label: "Health",
            count: getBreakdownCount("health_count"),
            color: themeColors.hhaGreen,
        },
        {
            label: "Education",
            count: getBreakdownCount("educat_count"),
            color: themeColors.hhaPurple,
        },
        {
            label: "Social",
            count: getBreakdownCount("social_count"),
            color: themeColors.hhaBlue,
        },
        {
            label: "Nutrition",
            count: getBreakdownCount("nutrit_count"),
            color: themeColors.yellow,
        },
        {
            label: "Mental",
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
            <Grid item xs={12} lg={7} xl={8}>
                <Typography variant="h3">By Zone</Typography>
                <Typography variant="body1">
                    {Boolean(!stats || stats.visits.length)
                        ? "Only zones with visits are shown."
                        : "No visits found. If you are filtering, perhaps there were no visits during the date period selected or the user selected has not visited any clients yet."}
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
                                name="Total Visits"
                                fill={themeColors.blueAccent}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <Skeleton variant="rect" height={400} />
                )}
            </Grid>
            <Grid item xs={12} lg={5} xl={4}>
                <Typography variant="h3">By Type</Typography>
                <Typography variant="body1">
                    Showing data for <b>{zones.get(breakdownZoneId) ?? "all zones"}</b>.<br />
                    {Boolean(!breakdownZone) ? (
                        "For zone-specific data, click on a zone in the zone chart."
                    ) : (
                        <Link
                            component="button"
                            variant="body1"
                            onClick={() => setBreakdownZoneId(0)}
                        >
                            View data for all zones.
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
                    <Skeleton variant="rect" height={400} />
                )}
            </Grid>
        </Grid>
    );
};

export default VisitStats;
