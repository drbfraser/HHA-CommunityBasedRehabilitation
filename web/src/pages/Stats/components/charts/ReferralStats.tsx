import React from "react";
import { useTranslation } from "react-i18next";

import { IStats, StatsReferralCategory } from "@cbr/common/util/stats";
import { useEffect, useRef, useState } from "react";
import { IAge, IGender } from "../filterbar/StatsDemographicFilter";
import { IDemographicTotals, ISubheadings } from "./HorizontalBarGraphStats";
import VerticalBarGraphStats, { IVBarGraphStatsData } from "./VerticalBarGraphStats";

interface IProps {
    stats?: IStats;
    gender: IGender;
    age: IAge;
}

interface ILabelledDemographicTotals extends IDemographicTotals {
    label: string;
}

const dataCategories: StatsReferralCategory[] = [
    "wheelchair",
    "physiotherapy",
    "prosthetic",
    "orthotic",
    "nutrition_agriculture",
    "mental_health",
    "other",
];

const categoryTitles: string[] = [
    "Wheelchair",
    "Physiotherapy",
    "Prosthetic",
    "Orthotic",
    "Nutrition",
    "Mental Health",
    "Other",
];

const ReferralStats = ({ stats, gender, age }: IProps) => {
    const { t } = useTranslation();

    const resolvedDemographicTotalsRef = useRef<IDemographicTotals>({
        female_adult: 0,
        male_adult: 0,
        female_child: 0,
        male_child: 0,
    });

    const unresolvedDemographicTotalsRef = useRef<IDemographicTotals>({
        female_adult: 0,
        male_adult: 0,
        female_child: 0,
        male_child: 0,
    });

    const [resolvedResultArray, setResolvedResultArray] = useState<
        { [key: string]: IDemographicTotals }[]
    >([]);

    const [unResolvedResultArray, setUnResolvedResultArray] = useState<
        { [key: string]: IDemographicTotals }[]
    >([]);

    const transformChartData = (dataArray: { [key: string]: any }[]) => {
        if (!dataArray?.[0]) return [];

        return Object.values(dataArray[0]).map(
            (item) =>
                ({
                    label: item.label,
                    female_adult: item.female_adult,
                    male_adult: item.male_adult,
                    female_child: item.female_child,
                    male_child: item.male_child,
                } as IVBarGraphStatsData)
        );
    };

    useEffect(() => {
        if (stats) {
            const resolvedStats: { [key: string]: ILabelledDemographicTotals } = {};
            const unresolvedStats: { [key: string]: ILabelledDemographicTotals } = {};

            let rFAdult = 0;
            let rMAdult = 0;
            let rFChild = 0;
            let rMChild = 0;

            let unFAdult = 0;
            let unMAdult = 0;
            let unFChild = 0;
            let unMChild = 0;

            let i = 0;

            dataCategories.forEach((category) => {
                const resolvedCategoryStats = {
                    female_adult: stats.referrals_resolved[
                        `${category}_female_adult_total`
                    ] as number,
                    male_adult: stats.referrals_resolved[`${category}_male_adult_total`] as number,
                    female_child: stats.referrals_resolved[
                        `${category}_female_child_total`
                    ] as number,
                    male_child: stats.referrals_resolved[`${category}_male_child_total`] as number,
                    label: categoryTitles[i],
                };

                resolvedStats[category] = resolvedCategoryStats;

                rFAdult += resolvedCategoryStats.female_adult;
                rMAdult += resolvedCategoryStats.male_adult;
                rFChild += resolvedCategoryStats.female_child;
                rMChild += resolvedCategoryStats.male_child;
                i += 1;
            });

            setResolvedResultArray([resolvedStats]);

            resolvedDemographicTotalsRef.current = {
                female_adult: rFAdult,
                male_adult: rMAdult,
                female_child: rFChild,
                male_child: rMChild,
            };

            i = 0;
            dataCategories.forEach((category) => {
                const unresolvedCategoryStats = {
                    female_adult: stats.referrals_unresolved[
                        `${category}_female_adult_total`
                    ] as number,
                    male_adult: stats.referrals_unresolved[
                        `${category}_male_adult_total`
                    ] as number,
                    female_child: stats.referrals_unresolved[
                        `${category}_female_child_total`
                    ] as number,
                    male_child: stats.referrals_unresolved[
                        `${category}_male_child_total`
                    ] as number,
                    label: categoryTitles[i],
                };

                unresolvedStats[category] = unresolvedCategoryStats;

                unFAdult += unresolvedCategoryStats.female_adult;
                unMAdult += unresolvedCategoryStats.male_adult;
                unFChild += unresolvedCategoryStats.female_child;
                unMChild += unresolvedCategoryStats.male_child;
                i += 1;
            });

            setUnResolvedResultArray([unresolvedStats]);

            unresolvedDemographicTotalsRef.current = {
                female_adult: unFAdult,
                male_adult: unMAdult,
                female_child: unFChild,
                male_child: unMChild,
            };
        }
    }, [stats]);

    const resolvedSubheadings: ISubheadings[] = [
        {
            label: t("statistics.totalFChild"),
            total: resolvedDemographicTotalsRef.current.female_child,
        },
        {
            label: t("statistics.totalMChild"),
            total: resolvedDemographicTotalsRef.current.male_child,
        },
        {
            label: t("statistics.totalFAdult"),
            total: resolvedDemographicTotalsRef.current.female_adult,
        },
        {
            label: t("statistics.totalMAdult"),
            total: resolvedDemographicTotalsRef.current.male_adult,
        },
    ];

    const unResolvedSubheadings: ISubheadings[] = [
        {
            label: t("statistics.totalFChild"),
            total: unresolvedDemographicTotalsRef.current.female_child,
        },
        {
            label: t("statistics.totalMChild"),
            total: unresolvedDemographicTotalsRef.current.male_child,
        },
        {
            label: t("statistics.totalFAdult"),
            total: unresolvedDemographicTotalsRef.current.female_adult,
        },
        {
            label: t("statistics.totalMAdult"),
            total: unresolvedDemographicTotalsRef.current.male_adult,
        },
    ];

    return (
        <section>
            <VerticalBarGraphStats
                title={t("statistics.unresolved")}
                data={transformChartData(unResolvedResultArray)}
                age={age}
                gender={gender}
                subheadings={unResolvedSubheadings}
                totals={unresolvedDemographicTotalsRef.current}
            />

            <VerticalBarGraphStats
                title={t("statistics.resolved")}
                data={transformChartData(resolvedResultArray)}
                age={age}
                gender={gender}
                subheadings={resolvedSubheadings}
                totals={resolvedDemographicTotalsRef.current}
            />
        </section>
    );
};

export default ReferralStats;
