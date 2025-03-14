import { Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { themeColors } from "@cbr/common/util/colors";
import { useZones } from "@cbr/common/util/hooks/zones";
import { IStats } from "@cbr/common/util/stats";
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

    const handleViewToggle = () => {
        setViewAdults((prev) => !prev);
    };

    useEffect(() => {
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

    zones.forEach((k, v) => {
        const femaleAdultTotal =
            stats?.new_clients.find((item) => item.zone_id === v)?.female_adult_total ?? 0;
        const maleAdultTotal =
            stats?.new_clients.find((item) => item.zone_id === v)?.male_adult_total ?? 0;
        const femaleChildTotal =
            stats?.new_clients.find((item) => item.zone_id === v)?.female_child_total ?? 0;
        const maleChildTotal =
            stats?.new_clients.find((item) => item.zone_id === v)?.male_child_total ?? 0;

        adultData.push({
            label: k,
            key: `${k}_adult_count`,
            female: femaleAdultTotal ?? 0,
            male: maleAdultTotal ?? 0,
        });

        childData.push({
            label: k,
            key: `${k}_child_count`,
            female: femaleChildTotal ?? 0,
            male: maleChildTotal ?? 0,
        });
    });

    return (
        <section>
            <menu>
                <Typography
                    color={viewAdults ? "textSecondary" : "textPrimary"}
                    component={"span"}
                    variant={"body2"}
                >
                    {/* TODO: Replace with Translation */}
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
                        {/* TODO: Replace with Translation */}
                        <b>Total New Female Adult Clients:</b> {totalFAdults}
                        <br />
                        {/* TODO: Replace with Translation */}
                        <b>Total New Male Adult Clients:</b> {totalMAdults}
                    </Typography>

                    <ResponsiveContainer
                        width="100%"
                        height={stats?.new_clients.length ? CHART_HEIGHT : 0}
                    >
                        <BarChart data={adultData} layout="vertical">
                            <YAxis interval={0} dataKey="label" type="category" width={150} />
                            <XAxis allowDecimals={false} />
                            <Tooltip />
                            <Legend />
                            <Bar
                                dataKey="female"
                                name={t("clientFields.female")}
                                fill={themeColors.hhaPurple}
                                barSize={100}
                            />
                            <Bar
                                dataKey="male"
                                name={t("clientFields.male")}
                                fill={themeColors.hhaBlue}
                                barSize={100}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </>
            ) : (
                <>
                    <Typography variant="subtitle1" align="center">
                        {/* TODO: Replace with Translation */}
                        <b>Total New Female Child Clients:</b> {totalFChild}
                        <br />
                        {/* TODO: Replace with Translation */}
                        <b>Total New Male Child Clients:</b> {totalMChild}
                    </Typography>

                    <ResponsiveContainer
                        width="100%"
                        height={stats?.new_clients.length ? CHART_HEIGHT : 0}
                    >
                        <BarChart data={childData} layout="vertical">
                            <XAxis type="number" allowDecimals={false} />
                            <YAxis dataKey="label" type="category" width={150} />
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
