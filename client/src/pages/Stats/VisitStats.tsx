import { Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Skeleton from "@material-ui/lab/Skeleton";
import React, { useState } from "react";
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
import { themeColors } from "theme.styles";
import { useZones } from "util/hooks/zones";
import { IStats } from "util/stats";

interface IProps {
    stats?: IStats;
}

const VisitStats = ({ stats }: IProps) => {
    const [specificZoneId, setSpecificZoneId] = useState(0);
    const specificZone = stats?.visits.find((v) => v.zone_id === specificZoneId);

    const zones = useZones();
    const zoneToName = (id: number) => zones.get(id) ?? "";

    const specificZoneData = [
        {
            label: "Health",
            count: specificZone?.health_count,
            color: themeColors.hhaGreen,
        },
        {
            label: "Education",
            count: specificZone?.educat_count,
            color: themeColors.hhaPurple,
        },
        {
            label: "Social",
            count: specificZone?.social_count,
            color: themeColors.hhaBlue,
        },
    ].filter((z) => z.count);

    const handleChartClick = (e: any) => {
        if (!e || !Array.isArray(e.activePayload) || e.activePayload.length === 0) {
            return;
        }

        setSpecificZoneId(e.activePayload[0].payload?.zone_id);
    };

    return (
        <Grid container spacing={2} style={{ minHeight: 400 }}>
            <Grid item xs={12} md={8}>
                <Typography variant="h3">All Zones</Typography>
                <Typography variant="body1">Only zones with visits are shown.</Typography>
                {stats ? (
                    <ResponsiveContainer width="100%" height={stats.visits.length ? 400 : 0}>
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
            <Grid item xs={12} md={4}>
                <Typography variant="h3">
                    {specificZone ? zoneToName(specificZoneId) : "Specific Zone"}
                </Typography>
                {specificZoneId ? (
                    <ResponsiveContainer width="100%" height={400}>
                        <PieChart>
                            <Pie
                                data={specificZoneData}
                                dataKey="count"
                                nameKey="label"
                                label={(a) => a.label}
                                labelLine={true}
                                innerRadius={60}
                            >
                                {specificZoneData.map((entry, i) => (
                                    <Cell key={i} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <Typography variant="body1">
                        To view detailed visit stats per zone, click on a zone in the chart.
                    </Typography>
                )}
            </Grid>
        </Grid>
    );
};

export default VisitStats;
