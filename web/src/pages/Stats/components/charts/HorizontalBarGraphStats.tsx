import { Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { themeColors } from "@cbr/common/util/colors";
import { useZones } from "@cbr/common/util/hooks/zones";
import { IStats } from "@cbr/common/util/stats";
import IOSSwitch from "components/IOSSwitch/IOSSwitch";
import { IAge, IGender } from "../filterbar/StatsDemographicFilter";
import { Stack, Box } from "@mui/material";
export interface ISubheadings {
    label: string;
    total: number;
}

export interface IDemographicTotals {
    female_adult: number;
    female_child: number;
    male_adult: number;
    male_child: number;
}

interface IProps {
    title: string;
    subtitle?: string;
    data: any[];
    age: IAge;
    gender: IGender;
    subheadings?: ISubheadings[];
    totals: IDemographicTotals;
}

const HorizontalBarGraphStats = ({
    title,
    subtitle,
    data,
    age,
    gender,
    subheadings,
    totals,
}: IProps) => {
    const CHART_HEIGHT = 400;

    const { t } = useTranslation();

    return (
        <section>
            <Typography variant="h2" align="center">
                {title}
            </Typography>
            <Typography variant="h3" align="center">
                {subtitle}
            </Typography>
            <Box>
                <Stack direction="row" spacing={4} justifyContent="center" alignItems="center">
                    <Stack spacing={1} alignItems="center">
                        {gender.female && age.child && (
                            <Typography>
                                <b>{subheadings?.[0]?.label ?? t("statistics.totalFChild")}</b>{" "}
                                {subheadings?.[0]?.total ?? totals.female_child}
                            </Typography>
                        )}
                        {gender.male && age.child && (
                            <Typography>
                                <b>{subheadings?.[1]?.label ?? t("statistics.totalMChild")}</b>{" "}
                                {subheadings?.[1]?.total ?? totals.male_child}
                            </Typography>
                        )}
                    </Stack>
                    <Stack spacing={1} alignItems="center">
                        {gender.female && age.adult && (
                            <Typography>
                                <b>{subheadings?.[2]?.label ?? t("statistics.totalFAdult")}</b>{" "}
                                {subheadings?.[2]?.total ?? totals.female_adult}
                            </Typography>
                        )}
                        {gender.male && age.adult && (
                            <Typography>
                                <b>{subheadings?.[3]?.label ?? t("statistics.totalMAdult")}</b>{" "}
                                {subheadings?.[3]?.total ?? totals.male_adult}
                            </Typography>
                        )}
                    </Stack>
                </Stack>
            </Box>

            <ResponsiveContainer width="100%" height={data.length ? CHART_HEIGHT : 0}>
                <BarChart data={data} layout="vertical">
                    <XAxis type="number" allowDecimals={false} />
                    <YAxis dataKey="label" type="category" width={150} />
                    <Tooltip />
                    <Legend />
                    <Bar
                        dataKey="femaleAdult"
                        name={t("statistics.femaleAdult")}
                        fill={themeColors.hhaPurple}
                        hide={!gender.female && !age.adult}
                        barSize={50}
                    />
                    <Bar
                        dataKey="maleAdult"
                        name={t("statistics.maleAdult")}
                        fill={themeColors.hhaBlue}
                        hide={!gender.male && !age.adult}
                        barSize={50}
                    />
                    <Bar
                        dataKey="femaleChild"
                        name={t("statistics.femaleChild")}
                        fill={themeColors.lilac}
                        hide={!gender.female && !age.child}
                        barSize={50}
                    />
                    <Bar
                        dataKey="maleChild"
                        name={t("statistics.maleChild")}
                        fill={themeColors.pistachio}
                        hide={!gender.male && !age.child}
                        barSize={50}
                    />
                </BarChart>
            </ResponsiveContainer>
        </section>
    );
};

export default HorizontalBarGraphStats;
