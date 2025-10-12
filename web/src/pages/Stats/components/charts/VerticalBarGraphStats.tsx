import { Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { themeColors } from "@cbr/common/util/colors";
import { Box, Stack } from "@mui/material";
import { IAge, IGender } from "../filterbar/StatsDemographicFilter";

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

export interface IVBarGraphStatsData {
    label: string;
    female_adult: number;
    male_adult: number;
    female_child: number;
    male_child: number;
}

interface IProps {
    title: string;
    subtitle?: string;
    data: IVBarGraphStatsData[];
    age: IAge;
    gender: IGender;
    subheadings?: ISubheadings[];
    totals: IDemographicTotals;
}

const VerticalBarGraphStats = ({
    title,
    subtitle,
    data,
    age,
    gender,
    subheadings,
    totals,
}: IProps) => {
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
                        {gender.female && age.demographic === "child" && (
                            <Typography>
                                <b>{subheadings?.[0]?.label ?? t("statistics.totalFChild")}</b>{" "}
                                {subheadings?.[0]?.total ?? totals.female_child}
                            </Typography>
                        )}
                        {gender.male && age.demographic === "child" && (
                            <Typography>
                                <b>{subheadings?.[1]?.label ?? t("statistics.totalMChild")}</b>{" "}
                                {subheadings?.[1]?.total ?? totals.male_child}
                            </Typography>
                        )}
                    </Stack>
                    <Stack spacing={1} alignItems="center">
                        {gender.female && age.demographic === "adult" && (
                            <Typography>
                                <b>{subheadings?.[2]?.label ?? t("statistics.totalFAdult")}</b>{" "}
                                {subheadings?.[2]?.total ?? totals.female_adult}
                            </Typography>
                        )}
                        {gender.male && age.demographic === "adult" && (
                            <Typography>
                                <b>{subheadings?.[3]?.label ?? t("statistics.totalMAdult")}</b>{" "}
                                {subheadings?.[3]?.total ?? totals.male_adult}
                            </Typography>
                        )}
                    </Stack>
                </Stack>
            </Box>

            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data}>
                    <XAxis dataKey="label" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar
                        dataKey="female_adult"
                        name={t("statistics.femaleAdult")}
                        fill={themeColors.hhaPurple}
                        hide={!gender.female || age.demographic !== "adult"}
                        barSize={80}
                    />
                    <Bar
                        dataKey="male_adult"
                        name={t("statistics.maleAdult")}
                        fill={themeColors.hhaBlue}
                        hide={!gender.male || age.demographic !== "adult"}
                        barSize={80}
                    />
                    <Bar
                        dataKey="female_child"
                        name={t("statistics.femaleChild")}
                        fill={themeColors.lilac}
                        hide={!gender.female || age.demographic !== "child"}
                        barSize={80}
                    />
                    <Bar
                        dataKey="male_child"
                        name={t("statistics.maleChild")}
                        fill={themeColors.pistachio}
                        hide={!gender.male || age.demographic !== "child"}
                        barSize={80}
                    />
                </BarChart>
            </ResponsiveContainer>
        </section>
    );
};

export default VerticalBarGraphStats;
