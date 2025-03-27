import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Link, Skeleton, Typography } from "@mui/material";
import {
    BarChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
    Bar,
    PieChart,
    Pie,
    Cell,
} from "recharts";

import { useZones } from "@cbr/common/util/hooks/zones";
import { IStats, IStatsVisit } from "@cbr/common/util/stats";
import { themeColors } from "@cbr/common/util/colors";
import HorizontalBarGraphStats, { IDemographicTotals } from "./HorizontalBarGraphStats";
import { StatsVisitCategory } from "@cbr/common/util/stats";
import { ISubheadings } from "./HorizontalBarGraphStats";
import { IAge, IGender } from "../filterbar/StatsDemographicFilter";

interface IProps {
    stats?: IStats;
    age: IAge;
    gender: IGender;
}


const visitsCategoryLabels = ["Health", "Education", "Social", "Nutrition", "Mental"];
const visitCategories: StatsVisitCategory[] = ["health", "educat", "social", "nutrit", "mental"];

const VisitStats = ({ stats, age, gender }: IProps) => {
    const [totalFAdults, setTotalFAdults] = useState(0);
    const [totalMAdults, setTotalMAdults] = useState(0);
    const [totalFChild, setTotalFChild] = useState(0);
    const [totalMChild, setTotalMChild] = useState(0);
    const [totalData, setTotalData] = useState<
        {
            label: string;
            key: string;
            femaleAdult: number;
            maleAdult: number;
            femaleChild: number;
            maleChild: number;
        }[]
    >([]);

    const { t } = useTranslation();

    const demographicTotalsRef = useRef<IDemographicTotals>({
        female_adult: 0,
        male_adult: 0,
        female_child: 0,
        male_child: 0,
    });

    useEffect(() => {
        if (stats) {
            let fAdults = 0;
            let mAdults = 0;
            let fChild = 0;
            let mChild = 0;

            const processedTotalData = visitCategories.map((category, index) => {
                const visitCategoryStats = {
                    femaleAdult: stats.visits.reduce(
                        (total, item) => total + (item[`${category}_female_adult_total`] ?? 0),
                        0
                    ),
                    maleAdult: stats.visits.reduce(
                        (total, item) => total + (item[`${category}_male_adult_total`] ?? 0),
                        0
                    ),
                    femaleChild: stats.visits.reduce(
                        (total, item) => total + (item[`${category}_female_child_total`] ?? 0),
                        0
                    ),
                    maleChild: stats.visits.reduce(
                        (total, item) => total + (item[`${category}_male_child_total`] ?? 0),
                        0
                    ),
                    label: visitsCategoryLabels[index],
                    key: category,
                };

                fAdults += visitCategoryStats.femaleAdult;
                mAdults += visitCategoryStats.maleAdult;
                fChild += visitCategoryStats.femaleChild;
                mChild += visitCategoryStats.maleChild;

                return visitCategoryStats;
            });

            setTotalData(processedTotalData);
            setTotalFAdults(fAdults);
            setTotalMAdults(mAdults);
            setTotalFChild(fChild);
            setTotalMChild(mChild);

            demographicTotalsRef.current = {
                female_adult: fAdults,
                male_adult: mAdults,
                female_child: fChild,
                male_child: mChild,
            };
        }
    }, [stats]);

    const subheadings: ISubheadings[] = [
        {
            label: t("statistics.totalFChild"),
            total: totalFChild,
        },
        {
            label: t("statistics.totalMChild"),
            total: totalMChild,
        },
        {
            label: t("statistics.totalFAdult"),
            total: totalFAdults,
        },
        {
            label: t("statistics.totalMAdult"),
            total: totalMAdults,
        },
    ];
    return (
        <>
            <HorizontalBarGraphStats
                title={t("statistics.visits")}
                data={totalData}
                age={age}
                gender={gender}
                subheadings={subheadings}
                totals={demographicTotalsRef.current}
            />
        </>
    );
};

export default VisitStats;
