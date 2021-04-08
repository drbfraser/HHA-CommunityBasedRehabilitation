import { Divider, Grid, Typography } from "@material-ui/core";
import { Alert, Skeleton } from "@material-ui/lab";
import React, { useEffect, useState } from "react";
import {
    Bar,
    BarChart,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { themeColors } from "theme.styles";
import { apiFetch, Endpoint } from "util/endpoints";
import { useDisabilities } from "util/hooks/disabilities";
import { useZones } from "util/hooks/zones";

interface IDisabilityStats {
    disability_id: number;
    total: number;
}

interface IVisitStats {
    zone_id: number;
    total: number;
    health_count: number;
    educat_count: number;
    social_count: number;
}

interface IReferralStats {
    total: number;
    wheelchair_count: number;
    physiotherapy_count: number;
    prosthetic_count: number;
    orthotic_count: number;
    other_count: number;
}

interface IStats {
    disabilities: IDisabilityStats[];
    clients_with_disabilities: number;
    visits: IVisitStats[];
    referrals_unresolved: IReferralStats;
    referrals_resolved: IReferralStats;
}

const Stats = () => {
    const [stats, setStats] = useState<IStats>();
    const [errorLoading, setErrorLoading] = useState(false);
    const disabilities = useDisabilities();
    const zones = useZones();

    useEffect(() => {
        apiFetch(Endpoint.STATS)
            .then((resp) => resp.json())
            .then((stats) => setStats(stats))
            .catch(() => setErrorLoading(true));
    }, []);

    if (errorLoading) {
        return (
            <Alert severity="error">
                Something went wrong loading the statistics. Please try again.
            </Alert>
        );
    }

    if (!stats || !zones.size || !disabilities.size) {
        return <Skeleton variant="rect" height={500} />;
    }

    const zoneToName = (id: number) => zones.get(id)!;
    const disabilityToName = (id: number) => disabilities.get(id)!;

    const VisitsCharts = () => {
        const [visitZoneId, setVisitZoneId] = useState(0);
        const visitZoneStats = stats?.visits.find((v) => v.zone_id === visitZoneId);

        const zoneData = [
            {
                label: "Health",
                count: visitZoneStats?.health_count,
                color: themeColors.hhaGreen,
            },
            {
                label: "Education",
                count: visitZoneStats?.educat_count,
                color: themeColors.hhaPurple,
            },
            {
                label: "Social",
                count: visitZoneStats?.social_count,
                color: themeColors.hhaBlue,
            },
        ].filter((z) => z.count);

        return (
            <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                    <Typography variant="h3">All Zones</Typography>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart layout="vertical" data={stats.visits}>
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
                                onClick={(v: IVisitStats) => setVisitZoneId(v.zone_id)}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Typography variant="h3">
                        {visitZoneStats ? zoneToName(visitZoneStats.zone_id) : "Specific Zone"}
                    </Typography>
                    {visitZoneStats ? (
                        <ResponsiveContainer width="100%" height={400}>
                            <PieChart>
                                <Pie
                                    data={zoneData}
                                    dataKey="count"
                                    nameKey="label"
                                    label={(a) => a.label}
                                    labelLine={true}
                                    innerRadius={60}
                                >
                                    {zoneData.map((entry, i) => (
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

    const ReferralChart = () => {
        const dataLabels = [
            {
                label: "Wheelchair",
                key: "wheelchair_count",
            },
            {
                label: "Physiotherapy",
                key: "physiotherapy_count",
            },
            {
                label: "Prosthetic",
                key: "prosthetic_count",
            },
            {
                label: "Orthotic",
                key: "orthotic_count",
            },
            {
                label: "Other",
                key: "other_count",
            },
        ];

        const data = dataLabels.map((d) => ({
            label: d.label,
            resolved: stats.referrals_resolved[d.key as keyof IReferralStats],
            unresolved: stats.referrals_unresolved[d.key as keyof IReferralStats],
        }));

        return (
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data}>
                    <XAxis dataKey="label" interval={0} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="unresolved" name="Unresolved" fill={themeColors.riskRed} />
                    <Bar dataKey="resolved" name="Resolved" fill={themeColors.hhaGreen} />
                </BarChart>
            </ResponsiveContainer>
        );
    };

    const DisabilitiesChart = () => (
        <ResponsiveContainer width="100%" height={500}>
            <BarChart layout="vertical" data={stats.disabilities}>
                <XAxis type="number" allowDecimals={false} />
                <YAxis
                    type="category"
                    dataKey="disability_id"
                    width={150}
                    tickFormatter={disabilityToName}
                />
                <Tooltip labelFormatter={disabilityToName} />
                <Bar dataKey="total" name="Count" fill={themeColors.bluePale} />
            </BarChart>
        </ResponsiveContainer>
    );

    return (
        <>
            <Typography variant="h2">Visits</Typography>
            <VisitsCharts />
            <br />
            <Divider />
            <br />
            <Typography variant="h2">Referrals</Typography>
            <Typography variant="body1">
                <b>Total Unresolved:</b> {stats.referrals_unresolved.total}
                <br />
                <b>Total Resolved:</b> {stats.referrals_resolved.total}
            </Typography>
            <br />
            <ReferralChart />
            <br />
            <Divider />
            <br />
            <Typography variant="h2">Disabilities (All Time)</Typography>
            <Typography variant="body1">
                <b>Clients with Disabilities:</b> {stats.clients_with_disabilities}
            </Typography>
            <br />
            <DisabilitiesChart />
        </>
    );
};

export default Stats;
