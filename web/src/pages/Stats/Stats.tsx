import React, { useEffect, useState } from "react";
import { Alert, Divider, styled } from "@mui/material";
import { useTranslation } from "react-i18next";

import { timestampFromFormDate } from "@cbr/common/util/dates";
import { apiFetch, Endpoint } from "@cbr/common/util/endpoints";
import { IStats } from "@cbr/common/util/stats";
import { IUser } from "@cbr/common/util/users";
import {
    DisabilityStats,
    FilterBar,
    ReferralStats,
    VisitStats,
    NewClientsStats,
    FollowUpVistsStats,
} from "./components";
import { blankDateRange, IDateRange } from "./components/filterbar/StatsDateFilter";

const Container = styled("div")({
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
});

const Stats = () => {
    const [dateRange, setDateRange] = useState(blankDateRange);
    const [users, setUsers] = useState<IUser[]>([]);
    const [user, setUser] = useState<IUser | null>(null);
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

        apiFetch(Endpoint.STATS, `?${urlParams.toString()}`)
            .then((resp) => resp.json())
            .then((stats) => setStats(stats))
            .catch(() => setErrorLoading(true));
    }, [dateRange, user, archiveMode]);
    console.log("RAHHH");
    console.log(stats?.follow_up_visits);

    if (errorLoading) {
        return <Alert severity="error">{t("alert.loadStatsFailure")}</Alert>;
    }
    return (
        <Container>
            <FilterBar
                user={user}
                users={users}
                dateRange={dateRange}
                stats={stats}
                setDateRange={setDateRange}
                setUser={setUser}
            />
            <Divider />

            <VisitStats stats={stats} />
            <Divider />

            <NewClientsStats stats={stats} />
            <Divider />

            <FollowUpVistsStats stats={stats} />
            <Divider />

            <ReferralStats stats={stats} />
            <Divider />

            <DisabilityStats
                archiveMode={archiveMode}
                onArchiveModeChange={setArchiveMode}
                stats={stats}
            />
        </Container>
    );
};

export default Stats;
