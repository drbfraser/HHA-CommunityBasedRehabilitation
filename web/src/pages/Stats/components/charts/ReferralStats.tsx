import React from "react";
import { useTranslation } from "react-i18next";
import { BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Bar, Legend } from "recharts";
import { Skeleton, Typography } from "@mui/material";

import { IStats, IStatsReferral } from "@cbr/common/util/stats";
import { themeColors } from "@cbr/common/util/colors";

interface IProps {
    stats?: IStats;
}

const ReferralStats = ({ stats }: IProps) => {
    const { t } = useTranslation();

    if (!stats) {
        return <Skeleton variant="rectangular" height={400} />;
    }

    const dataLabels = [
        {
            label: t("general.wheelchair"),
            key: "wheelchair_count",
        },
        {
            label: t("general.physiotherapy"),
            key: "physiotherapy_count",
        },
        {
            label: t("general.prosthetic"),
            key: "prosthetic_count",
        },
        {
            label: t("general.orthotic"),
            key: "orthotic_count",
        },
        {
            label: t("referral.hhaNutritionAndAgricultureProjectAbbr"),
            key: "nutrition_agriculture_count",
        },
        {
            label: t("general.mentalHealth"),
            key: "mental_health_count",
        },
        {
            label: t("disabilities.other"),
            key: "other_count",
        },
    ];
    const data = dataLabels.map((d) => ({
        label: d.label,
        resolved: stats.referrals_resolved[d.key as keyof IStatsReferral],
        unresolved: stats.referrals_unresolved[d.key as keyof IStatsReferral],
    }));

    return (
        <section>
            <Typography variant="h2" align="center">
                {t("statistics.referrals")}
            </Typography>
            <Typography variant="subtitle1" align="center">
                <b>{t("statistics.totalUnresolved")}</b> {stats.referrals_unresolved.total}
                <br />
                <b>{t("statistics.totalResolved")}</b> {stats.referrals_resolved.total}
            </Typography>

            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data}>
                    <XAxis dataKey="label" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar
                        dataKey="unresolved"
                        name={t("statistics.unresolved")}
                        fill={themeColors.riskRed}
                    />
                    <Bar
                        dataKey="resolved"
                        name={t("statistics.resolved")}
                        fill={themeColors.hhaGreen}
                    />
                </BarChart>
            </ResponsiveContainer>
        </section>
    );
};

export default ReferralStats;
