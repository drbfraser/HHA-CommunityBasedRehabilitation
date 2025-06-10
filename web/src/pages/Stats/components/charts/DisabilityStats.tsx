import React from "react";
import { useTranslation } from "react-i18next";
import { BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Bar } from "recharts";
import { Skeleton, styled, Typography } from "@mui/material";

import { useDisabilities } from "@cbr/common/util/hooks/disabilities";
import { IStats } from "@cbr/common/util/stats";
import { themeColors } from "@cbr/common/util/colors";
import IOSSwitch from "components/IOSSwitch/IOSSwitch";

const ChartHeader = styled("section")({
    marginBottom: "1rem",
});

interface IProps {
    stats?: IStats;
    archiveMode: boolean;
    onArchiveModeChange: (val: boolean) => void;
}

const DisabilityStats = ({ stats, archiveMode, onArchiveModeChange }: IProps) => {
    const { t } = useTranslation();
    const disabilities = useDisabilities(t);
    const disabilityToName = (id: number) => disabilities.get(id) ?? "Loading";

    if (!stats) {
        return <Skeleton variant="rectangular" height={500} />;
    }
    return (
        <section>
            <menu>
                <Typography
                    color={archiveMode ? "textSecondary" : "textPrimary"}
                    component={"span"}
                    variant={"body2"}
                >
                    {t("statistics.allClients")}
                </Typography>
                <IOSSwitch
                    checked={archiveMode}
                    onChange={(event) => onArchiveModeChange(event.target.checked)}
                />
                <Typography
                    color={archiveMode ? "textPrimary" : "textSecondary"}
                    component={"span"}
                    variant={"body2"}
                >
                    {t("statistics.activeClients")}
                </Typography>
            </menu>

            <ChartHeader>
                <Typography variant="h2" align="center" display="block">
                    {t("statistics.disabilities")}
                </Typography>
                <Typography variant="body1" align="center">
                    {t("statistics.filtersDoNotApplyToDisabilities")}
                </Typography>
                <Typography variant="body1" align="center">
                    <b>{t("statistics.clientsWithDisabilities")}</b>{" "}
                    {stats.clients_with_disabilities}
                </Typography>
            </ChartHeader>

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
        </section>
    );
};

export default DisabilityStats;
