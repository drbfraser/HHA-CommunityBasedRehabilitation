import { Alert, Divider, styled } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { timestampFromFormDate } from "@cbr/common/util/dates";
import { apiFetch, Endpoint } from "@cbr/common/util/endpoints";
import { IStats } from "@cbr/common/util/stats";
import { IUser } from "@cbr/common/util/users";
import {
    DisabilityStats,
    FilterBar,
    FollowUpVistsStats,
    NewClientsStats,
    ReferralStats,
    VisitStats,
} from "./components";
import { blankDateRange, IDateRange } from "./components/filterbar/StatsDateFilter";
import {
    defaultAgeConfigs,
    defaultGenderConfigs,
} from "./components/filterbar/StatsDemographicFilter";
import DischargedClientsStats from "./components/charts/DischargedClientsStats";

const Container = styled("div")({
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
});

const Stats = () => {
    const [dateRange, setDateRange] = useState(blankDateRange);
    const [users, setUsers] = useState<IUser[]>([]);
    const [user, setUser] = useState<IUser | null>(null);

    // Filtering the demographic will not call on the API
    // It will return the demographic statistics by default. This was done in order to prevent recalls for a large amount of data
    const [gender, setGender] = useState(defaultGenderConfigs);
    const [age, setAge] = useState(defaultAgeConfigs);
    const [stats, setStats] = useState<IStats>();
    const [errorLoading, setErrorLoading] = useState(false);
    const [archiveMode, setArchiveMode] = useState(false);

    const { t } = useTranslation();

    useEffect(() => {
        apiFetch(Endpoint.USERS)
            .then((resp) => resp.json())
            .then((users) => setUsers(users))
            .catch(() => setErrorLoading(true));
    }, []);

    useEffect(() => {
        const milliSecondPerDay = 86400000;
        const urlParams = new URLSearchParams();
        urlParams.append("is_active", String(archiveMode));

        ["from", "to"].forEach((field) => {
            const fieldVal = dateRange[field as keyof IDateRange];
            if (!fieldVal) return;

            if (field === "from") {
                urlParams.append(field, String(timestampFromFormDate(fieldVal)));
            } else {
                urlParams.append(
                    field,
                    String(timestampFromFormDate(fieldVal) + milliSecondPerDay)
                );
            }
        });

        if (user) {
            urlParams.append("user_id", String(user.id));
        }

        // Apply gender filter to backend (M/F) for consistency with grouped/export paths
        const genders: string[] = [];
        if (gender.male) genders.push("M");
        if (gender.female) genders.push("F");
        if (genders.length) urlParams.append("genders", genders.join(","));

        apiFetch(Endpoint.STATS, `?${urlParams.toString()}`)
            .then((resp) => resp.json())
            .then((stats) => setStats(stats))
            .catch(() => setErrorLoading(true));
    }, [dateRange, user, archiveMode, gender, age]);

    if (errorLoading) {
        return <Alert severity="error">{t("alert.loadStatsFailure")}</Alert>;
    }
    return (
        <Container>
            <FilterBar
                user={user}
                users={users}
                age={age}
                gender={gender}
                dateRange={dateRange}
                stats={stats}
                setDateRange={setDateRange}
                setUser={setUser}
                setGender={setGender}
                setAge={setAge}
                archiveMode={archiveMode}
                onArchiveModeChange={setArchiveMode}
            />
            <Divider />

            <VisitStats stats={stats} age={age} gender={gender} />
            <Divider />

            <NewClientsStats stats={stats} age={age} gender={gender} />
            <Divider />

            <DischargedClientsStats stats={stats} age={age} gender={gender} />
            <Divider />

            <FollowUpVistsStats stats={stats} age={age} gender={gender} />
            <Divider />

            <ReferralStats stats={stats} age={age} gender={gender} />
            <Divider />

            <DisabilityStats stats={stats} age={age} gender={gender} />
        </Container>
    );
};

export default Stats;
