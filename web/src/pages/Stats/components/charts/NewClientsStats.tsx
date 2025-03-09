import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    BarChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
    Bar,
    Legend,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import { Grid, Link, Skeleton, Typography } from "@mui/material";

import { IStats, IStatsNewClients, IStatsReferral } from "@cbr/common/util/stats";
import { themeColors } from "@cbr/common/util/colors";
import { useZones } from "@cbr/common/util/hooks/zones";
import IOSSwitch from "components/IOSSwitch/IOSSwitch";

interface IProps {
    stats?: IStats;
}

const NewClientsStats = ({ stats }: IProps) => {
    const [totalFAdults, setTotalFAdults] = useState(0);
    const [totalMAdults, setTotalMAdults] = useState(0);
    const [totalFChild, setTotalFChild] = useState(0);
    const [totalMChild, setTotalMChild] = useState(0);
    const [viewAdults, setViewAdults] = useState(true);

    const CHART_HEIGHT = 400;

    const { t } = useTranslation();

    const zones = useZones();
    const zoneToName = (id: number) => zones.get(id) ?? "";
    console.log(zones);
    const [breakdownZoneId, setBreakdownZoneId] = useState(0);
    const breakdownZone = stats?.new_clients.find((v) => v.zone_id === breakdownZoneId);

    const handleViewToggle = () => {
        setViewAdults((prev) => !prev);
    };

    useEffect(() => {
        setBreakdownZoneId(0);
        if (stats) {
            let fAdults = 0;
            let mAdults = 0;
            let fChild = 0;
            let mChild = 0;

            stats.new_clients.forEach((item) => {
                fAdults += item.female_adult_total ?? 0;
                mAdults += item.male_adult_total ?? 0;
                fChild += item.female_child_total ?? 0;
                mChild += item.male_child_total ?? 0;
            });

            setTotalFAdults(fAdults);
            setTotalMAdults(mAdults);
            setTotalFChild(fChild);
            setTotalMChild(mChild);
        }
    }, [stats]);

    let adultData: { label: string; key: string; female: number; male: number }[] = [];
    let childData: { label: string; key: string; female: number; male: number }[] = [];

    stats?.new_clients.forEach((zone) => {
        let zoneLabel = zones.get(zone.zone_id);
        // console.log(zoneLabel);
        adultData.push({
            label: zoneLabel ?? "",
            key: `${zoneLabel}_adult_count`,
            female: zone.female_adult_total ?? 0,
            male: zone.male_adult_total ?? 0,
        });

        childData.push({
            label: zoneLabel ?? "",
            key: `${zoneLabel}_child_count`,
            female: zone.female_child_total ?? 0,
            male: zone.male_child_total ?? 0,
        });
    });

    // console.log(adultData);

    const handleChartClick = (e: any) => {
        if (!e || !Array.isArray(e.activePayload) || e.activePayload.length === 0) {
            return;
        }
        setBreakdownZoneId(e.activePayload[0].payload?.zone_id);
    };

    return (
        <section>
            <menu>
                <Typography
                    color={viewAdults ? "textSecondary" : "textPrimary"}
                    component={"span"}
                    variant={"body2"}
                >
                    All Children
                </Typography>
                <IOSSwitch checked={viewAdults} onChange={handleViewToggle} />
                <Typography
                    color={viewAdults ? "textPrimary" : "textSecondary"}
                    component={"span"}
                    variant={"body2"}
                >
                    All Adults
                </Typography>
            </menu>
            <Typography variant="h2" align="center">
                {/* TODO: Replace with Translation */}
                New Clients
            </Typography>

            {viewAdults ? (
                <>
                    <Typography variant="subtitle1" align="center">
                        <b>Total New Female Adult Clients:</b> {totalFAdults}
                        <br />
                        <b>Total New Male Adult Clients:</b> {totalMAdults}
                    </Typography>

                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={adultData}>
                            <XAxis dataKey="label" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Legend />
                            <Bar
                                dataKey="female"
                                name={t("clientFields.female")}
                                fill={themeColors.hhaPurple}
                            />
                            <Bar
                                dataKey="male"
                                name={t("clientFields.male")}
                                fill={themeColors.hhaBlue}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </>
            ) : (
                <>
                    <Typography variant="subtitle1" align="center">
                        <b>Total New Female Child Clients:</b> {totalFChild}
                        <br />
                        <b>Total New Male Child Clients:</b> {totalMChild}
                    </Typography>

                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={adultData}>
                            <XAxis dataKey="label" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Legend />
                            <Bar
                                dataKey="female"
                                name={t("clientFields.female")}
                                fill={themeColors.hhaPurple}
                            />
                            <Bar
                                dataKey="male"
                                name={t("clientFields.male")}
                                fill={themeColors.hhaBlue}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </>
            )}
        </section>
    );
};

export default NewClientsStats;
