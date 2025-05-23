import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { useZones } from "@cbr/common/util/hooks/zones";
import { IStats } from "@cbr/common/util/stats";
import { IAge, IGender } from "../filterbar/StatsDemographicFilter";
import HorizontalBarGraphStats, {
    IDemographicTotals,
    IHBarGraphStatsData,
    ISubheadings,
} from "./HorizontalBarGraphStats";

interface IProps {
    stats?: IStats;
    age: IAge;
    gender: IGender;
}

const FollowUpVistsStats = ({ stats, age, gender }: IProps) => {
    const [totalFAdults, setTotalFAdults] = useState(0);
    const [totalMAdults, setTotalMAdults] = useState(0);
    const [totalFChild, setTotalFChild] = useState(0);
    const [totalMChild, setTotalMChild] = useState(0);

    const { t } = useTranslation();

    const zones = useZones();

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

            stats.follow_up_visits.forEach((item) => {
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

    let totalData: IHBarGraphStatsData[] = [];

    zones.forEach((k, v) => {
        const femaleAdultTotal =
            stats?.follow_up_visits.find((item) => item.zone_id === v)?.female_adult_total ?? 0;
        const maleAdultTotal =
            stats?.follow_up_visits.find((item) => item.zone_id === v)?.male_adult_total ?? 0;
        const femaleChildTotal =
            stats?.follow_up_visits.find((item) => item.zone_id === v)?.female_child_total ?? 0;
        const maleChildTotal =
            stats?.follow_up_visits.find((item) => item.zone_id === v)?.male_child_total ?? 0;

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
            label: t("statistics.totalFChildFollowUpVisits"),
            total: totalFChild,
        },
        {
            label: t("statistics.totalMChildFollowUpVisits"),
            total: totalMChild,
        },
        {
            label: t("statistics.totalFAdultFollowUpVisits"),
            total: totalFAdults,
        },
        {
            label: t("statistics.totalMAdultFollowUpVisits"),
            total: totalMAdults,
        },
    ];

    return (
        <>
            <HorizontalBarGraphStats
                title={t("statistics.followUpVisits")}
                data={totalData}
                age={age}
                gender={gender}
                subheadings={subheadings}
                totals={demographicTotalsRef.current}
            />
        </>
    );
};

export default FollowUpVistsStats;
