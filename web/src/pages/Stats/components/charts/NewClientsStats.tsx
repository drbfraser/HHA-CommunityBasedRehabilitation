import { Typography } from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { themeColors } from "@cbr/common/util/colors";
import { useZones } from "@cbr/common/util/hooks/zones";
import { IStats } from "@cbr/common/util/stats";
import IOSSwitch from "components/IOSSwitch/IOSSwitch";
import { IAge, IGender } from "../filterbar/StatsDemographicFilter";
import HorizontalBarGraphStats, { IDemographicTotals } from "./HorizontalBarGraphStats";
import { ISubheadings } from "./HorizontalBarGraphStats";
interface IProps {
    stats?: IStats;
    age: IAge;
    gender: IGender;
}

const NewClientsStats = ({ stats, age, gender }: IProps) => {
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

            demographicTotalsRef.current = {
                female_adult: fAdults,
                male_adult: mAdults,
                female_child: fChild,
                male_child: mChild,
            };
        }
    }, [stats]);

    let adultData: { label: string; key: string; female: number; male: number }[] = [];
    let childData: { label: string; key: string; female: number; male: number }[] = [];
    let totalData: {
        label: string;
        key: string;
        femaleAdult: number;
        maleAdult: number;
        femaleChild: number;
        maleChild: number;
    }[] = [];

    zones.forEach((k, v) => {
        const femaleAdultTotal =
            stats?.new_clients.find((item) => item.zone_id === v)?.female_adult_total ?? 0;
        const maleAdultTotal =
            stats?.new_clients.find((item) => item.zone_id === v)?.male_adult_total ?? 0;
        const femaleChildTotal =
            stats?.new_clients.find((item) => item.zone_id === v)?.female_child_total ?? 0;
        const maleChildTotal =
            stats?.new_clients.find((item) => item.zone_id === v)?.male_child_total ?? 0;

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
            label: t("statistics.totalNewFChild"),
            total: totalFChild,
        },
        {
            label: t("statistics.totalNewMChild"),
            total: totalMChild,
        },
        {
            label: t("statistics.totalNewFAdult"),
            total: totalFAdults,
        },
        {
            label: t("statistics.totalNewMAdult"),
            total: totalMAdults,
        },
    ];
    return (
        <>
            <HorizontalBarGraphStats
                title={t("statistics.newClients")}
                data={totalData}
                age={age}
                gender={gender}
                subheadings={subheadings}
                totals={demographicTotalsRef.current}
            />
        </>
    );
};

export default NewClientsStats;
