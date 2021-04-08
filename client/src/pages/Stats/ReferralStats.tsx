import { Typography } from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import React from "react";
import { BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Bar, Legend } from "recharts";
import { themeColors } from "theme.styles";
import { IStats, IStatsReferral } from "util/stats";

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

interface IProps {
    stats?: IStats;
}

const ReferralStats = ({ stats }: IProps) => {
    if (!stats) {
        return <Skeleton variant="rect" height={400} />;
    }

    const data = dataLabels.map((d) => ({
        label: d.label,
        resolved: stats.referrals_resolved[d.key as keyof IStatsReferral],
        unresolved: stats.referrals_unresolved[d.key as keyof IStatsReferral],
    }));

    return (
        <>
            <Typography variant="body1">
                <b>Total Unresolved:</b> {stats.referrals_unresolved.total}
                <br />
                <b>Total Resolved:</b> {stats.referrals_resolved.total}
            </Typography>
            <br />
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
        </>
    );
};

export default ReferralStats;
