import React from "react";
import { useTranslation } from "react-i18next";
import { BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Bar } from "recharts";
import { Skeleton, Typography } from "@mui/material";

import { useDisabilities } from "@cbr/common/util/hooks/disabilities";
import { IStats } from "@cbr/common/util/stats";
import { themeColors } from "@cbr/common/util/colors";

interface IProps {
    stats?: IStats;
}

const DisabilityStats = ({ stats }: IProps) => {
    const { t } = useTranslation();
    const disabilities = useDisabilities(t);
    const disabilityToName = (id: number) => disabilities.get(id) ?? "Loading";

    if (!stats) {
        return <Skeleton variant="rectangular" height={500} />;
    }

    return (
        <>
            <Typography variant="body1" align="center">
                <b>{t("statistics.clientsWithDisabilities")}</b> {stats.clients_with_disabilities}
            </Typography>
            <br />
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
                    <Bar dataKey="total" name={t("statistics.count")} fill={themeColors.bluePale} />
                </BarChart>
            </ResponsiveContainer>
        </>
    );
};

export default DisabilityStats;
