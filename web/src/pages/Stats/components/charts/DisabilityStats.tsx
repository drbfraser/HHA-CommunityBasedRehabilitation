import { Skeleton } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { useDisabilities } from "@cbr/common/util/hooks/disabilities";
import { IStats } from "@cbr/common/util/stats";
import { IAge, IGender } from "../filterbar/StatsDemographicFilter";
import HorizontalBarGraphStats, {
    IDemographicTotals,
    ISubheadings,
} from "./HorizontalBarGraphStats";

interface IProps {
    stats?: IStats;
    age: IAge;
    gender: IGender;
}

const DisabilityStats = ({ stats, age, gender }: IProps) => {
    const { t } = useTranslation();
    const disabilities = useDisabilities(t);

    const [totalFAdults, setTotalFAdults] = useState(0);
    const [totalMAdults, setTotalMAdults] = useState(0);
    const [totalFChild, setTotalFChild] = useState(0);
    const [totalMChild, setTotalMChild] = useState(0);

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

            stats.disabilities.forEach((item) => {
                fAdults += item.female_adult_total ?? 0;
                mAdults += item.male_adult_total ?? 0;
                fChild += item.female_child_total ?? 0;
                mChild += item.male_child_total ?? 0;
            });

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

    let totalData: {
        label: string;
        key: string;
        femaleAdult: number;
        maleAdult: number;
        femaleChild: number;
        maleChild: number;
    }[] = [];

    disabilities.forEach((k, v) => {
        const femaleAdultTotal =
            stats?.disabilities.find((item) => item.disability_id === v)?.female_adult_total ?? 0;
        const maleAdultTotal =
            stats?.disabilities.find((item) => item.disability_id === v)?.male_adult_total ?? 0;
        const femaleChildTotal =
            stats?.disabilities.find((item) => item.disability_id === v)?.female_child_total ?? 0;
        const maleChildTotal =
            stats?.disabilities.find((item) => item.disability_id === v)?.male_child_total ?? 0;

        totalData.push({
            label: k,
            key: `${k}_total_count`,
            femaleAdult: femaleAdultTotal,
            maleAdult: maleAdultTotal,
            femaleChild: femaleChildTotal,
            maleChild: maleChildTotal,
        });
    });

    const subheadings: ISubheadings[] = [
        {
            label: t("statistics.totalDisFChild"),
            total: totalFChild,
        },
        {
            label: t("statistics.totalDisMChild"),
            total: totalMChild,
        },
        {
            label: t("statistics.totalDisFAdult"),
            total: totalFAdults,
        },
        {
            label: t("statistics.totalDisMAdult"),
            total: totalMAdults,
        },
    ];

    if (!stats) {
        return <Skeleton variant="rectangular" height={500} />;
    }
    return (
        <>
            <HorizontalBarGraphStats
                title={t("statistics.disabilities")}
                data={totalData}
                age={age}
                gender={gender}
                subheadings={subheadings}
                totals={demographicTotalsRef.current}
            />
        </>
    );
};

export default DisabilityStats;
