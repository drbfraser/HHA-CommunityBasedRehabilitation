import React from "react";
import { Skeleton, Typography } from "@mui/material";
import { BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Bar, Legend } from "recharts";
import { IStats, IStatsReferral } from "@cbr/common/util/stats";
import { themeColors } from "@cbr/common/util/colors";

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
        label: "HHANAP",
        key: "nutrition_agriculture_count",
    },
    {
        label: "Mental Health",
        key: "mental_health_count",
    },
    {
        label: "Other",
        key: "other_count",
    },
];

interface IProps {
    stats?: IStats;
}

const ReferralStats = ({ stats }: IProps) => {
    if (!stats) {
        return <Skeleton variant="rectangular" height={400} />;
    }
    const data = dataLabels.map((d) => ({
        label: d.label,
        resolved: stats.referrals_resolved[d.key as keyof IStatsReferral],
        unresolved: stats.referrals_unresolved[d.key as keyof IStatsReferral],
    }));

    return (
        <>
            <Typography variant="body1" align="center">
                <b>Total Unresolved:</b> {stats.referrals_unresolved.total}
                <br />
                <b>Total Resolved:</b> {stats.referrals_resolved.total}
            </Typography>
            <br />
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data}>
                    <XAxis dataKey="label" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="unresolved" name="Unresolved" fill={themeColors.riskRed} />
                    <Bar dataKey="resolved" name="Resolved" fill={themeColors.hhaGreen} />
                </BarChart>
            </ResponsiveContainer>
        </>
    );
};

export default ReferralStats;
