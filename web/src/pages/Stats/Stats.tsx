import { Alert, Divider, styled } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
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
import { blankDateRange } from "./components/filterbar/StatsDateFilter";
import {
    defaultAgeConfigs,
    defaultGenderConfigs,
    IGender,
    IAge,
} from "./components/filterbar/StatsDemographicFilter";
import DischargedClientsStats from "./components/charts/DischargedClientsStats";

// keep aligned with backend accepted dims
export type GroupDim = "zone" | "gender" | "host_status" | "age_band";

const Container = styled("div")({
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
});

const Stats = () => {
    const [dateRange, setDateRange] = useState(blankDateRange);
    const [users, setUsers] = useState<IUser[]>([]);
    const [user, setUser] = useState<IUser | null>(null);

    // Demographic UI state (unchanged)
    const [gender, setGender] = useState<IGender>(defaultGenderConfigs);
    const [age, setAge] = useState<IAge>(defaultAgeConfigs);

    // NEW: grouping state lives here so we can include it in API calls
    const [categorizeBy, setCategorizeBy] = useState<GroupDim | null>("zone");
    const [groupBy, setGroupBy] = useState<Set<GroupDim>>(new Set());

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

    // Build the query string from all filters (including new grouping + age filters)
    const queryString = useMemo(() => {
        const msPerDay = 86400000;
        const urlParams = new URLSearchParams();
        urlParams.append("is_active", String(archiveMode));

        if (dateRange.from) urlParams.append("from", String(timestampFromFormDate(dateRange.from)));
        if (dateRange.to)
            urlParams.append("to", String(timestampFromFormDate(dateRange.to) + msPerDay));

        if (user) urlParams.append("user_id", String(user.id));

        // Age filter: either demographic or explicit bands (mutually exclusive)
        // (This matches your backend contract.)
        if (Array.isArray((age as any).bands) && (age as any).bands.length > 0) {
            urlParams.append("age_bands", (age as any).bands.join(","));
        } else if ((age as any).demographic) {
            urlParams.append("demographics", (age as any).demographic);
        }

        // If you still want to filter by gender M/F at the backend level, keep this block:
        const genders: string[] = [];
        if (gender.male) genders.push("M");
        if (gender.female) genders.push("F");
        if (genders.length) urlParams.append("genders", genders.join(","));

        // NEW: grouping params
        if (categorizeBy) urlParams.append("categorize_by", categorizeBy);
        const groupDims = Array.from(groupBy ?? new Set());
        if (groupDims.length > 0) urlParams.append("group_by", groupDims.join(","));

        return `?${urlParams.toString()}`;
    }, [
        archiveMode,
        dateRange.from,
        dateRange.to,
        user,
        age, // demographic/bands
        gender, // if you keep gender filter
        categorizeBy,
        groupBy,
    ]);

    useEffect(() => {
        setErrorLoading(false);
        apiFetch(Endpoint.STATS, queryString)
            .then((resp) => resp.json())
            .then((data) => setStats(data))
            .catch(() => setErrorLoading(true));
    }, [queryString]);

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
                categorizeBy={categorizeBy}
                groupBy={groupBy}
                setCategorizeBy={setCategorizeBy}
                setGroupBy={setGroupBy}
            />
            <Divider />

            <VisitStats
                stats={stats}
                age={age}
                gender={gender}
                user={user}
                dateRange={dateRange}
                archiveMode={archiveMode}
            />
            <Divider />

            <NewClientsStats
                stats={stats}
                age={age}
                gender={gender}
                user={user}
                dateRange={dateRange}
                archiveMode={archiveMode}
            />
            <Divider />

            <DischargedClientsStats
                stats={stats}
                age={age}
                gender={gender}
                user={user}
                dateRange={dateRange}
                archiveMode={archiveMode}
            />
            <Divider />

            <FollowUpVistsStats
                stats={stats}
                age={age}
                gender={gender}
                user={user}
                dateRange={dateRange}
                archiveMode={archiveMode}
            />
            <Divider />

            <ReferralStats
                stats={stats}
                age={age}
                gender={gender}
                user={user}
                dateRange={dateRange}
                archiveMode={archiveMode}
            />
            <Divider />

            <DisabilityStats
                stats={stats}
                age={age}
                gender={gender}
                user={user}
                dateRange={dateRange}
                archiveMode={archiveMode}
            />
        </Container>
    );
};

export default Stats;
