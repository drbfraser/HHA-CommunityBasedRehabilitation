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

export interface IHBarGraphStatsData {
    label: string;
    key?: string;
    femaleAdult: number;
    maleAdult: number;
    femaleChild: number;
    maleChild: number;
    category?: string;
    zone_id?: number;
}

interface IProps {
    title: string;
    subtitle?: string;
    data: IHBarGraphStatsData[];
    age: IAge;
    gender: IGender;
    subheadings?: ISubheadings[];
    totals: IDemographicTotals;
    onBarClick?: (e: any) => void;
}

const HorizontalBarGraphStats = ({
    title,
    subtitle,
    data,
    age,
    gender,
    subheadings,
    totals,
    onBarClick,
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
                <Stack direction="row" spacing={5} justifyContent="center" alignItems="center">
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
            <ResponsiveContainer width="100%" height={data.length ? CHART_HEIGHT : 0}>
                <BarChart data={data} layout="vertical" onClick={onBarClick}>
                    <XAxis type="number" allowDecimals={false} />
                    <YAxis dataKey="label" type="category" width={150} />
                    <Tooltip />
                    <Legend />
                    <Bar
                        dataKey="femaleAdult"
                        name={t("statistics.femaleAdult")}
                        fill={themeColors.hhaPurple}
                        hide={!gender.female || age.demographic !== "adult"}
                        barSize={100}
                    />
                    <Bar
                        dataKey="maleAdult"
                        name={t("statistics.maleAdult")}
                        fill={themeColors.hhaBlue}
                        hide={!gender.male || age.demographic !== "adult"}
                        barSize={100}
                    />
                    <Bar
                        dataKey="femaleChild"
                        name={t("statistics.femaleChild")}
                        fill={themeColors.lilac}
                        hide={!gender.female || age.demographic !== "child"}
                        barSize={100}
                    />
                    <Bar
                        dataKey="maleChild"
                        name={t("statistics.maleChild")}
                        fill={themeColors.pistachio}
                        hide={!gender.male || age.demographic !== "child"}
                        barSize={100}
                    />
                </BarChart>
            </ResponsiveContainer>
        </section>
    );
};

export default HorizontalBarGraphStats;
