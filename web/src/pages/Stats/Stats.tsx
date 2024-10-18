import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Divider, Typography } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

import { timestampFromFormDate } from "@cbr/common/util/dates";
import { apiFetch, Endpoint } from "@cbr/common/util/endpoints";
import { IStats } from "@cbr/common/util/stats";
import { IUser } from "@cbr/common/util/users";
import IOSSwitch from "components/IOSSwitch/IOSSwitch";
import { DisabilityStats, FilterBar, ReferralStats, VisitStats } from "./components";
import { blankDateRange, IDateRange } from "./components/filterbar/StatsDateFilter";

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

    if (errorLoading) {
        return <Alert severity="error">{t("alert.loadStatsFailure")}</Alert>;
    }

    return (
        <>
            <FilterBar
                user={user}
                users={users}
                dateRange={dateRange}
                stats={stats}
                setDateRange={setDateRange}
                setUser={setUser}
            />
            <br />
            <Divider />
            <br />

            <Typography variant="h2" align="center">
                {t("statistics.visits")}
            </Typography>
            <VisitStats stats={stats} />
            <br />
            <Divider />
            <br />

            <Typography variant="h2" align="center">
                {t("statistics.referrals")}
            </Typography>
            <ReferralStats stats={stats} />
            <br />
            <Divider />
            <br />

            <div>
                <Typography
                    color={archiveMode ? "textSecondary" : "textPrimary"}
                    component={"span"}
                    variant={"body2"}
                >
                    {t("statistics.allClients")}
                </Typography>
                <IOSSwitch
                    checked={archiveMode}
                    onChange={(event) => setArchiveMode(event.target.checked)}
                />
                <Typography
                    color={archiveMode ? "textPrimary" : "textSecondary"}
                    component={"span"}
                    variant={"body2"}
                >
                    {t("statistics.activeClients")}
                </Typography>
            </div>
            <Typography variant="h2" align="center" display="block">
                {t("statistics.disabilities")}
            </Typography>
            <Typography variant="body1" align="center">
                {t("statistics.filtersDoNotApplyToDisabilities")}
            </Typography>
            <br />
            <DisabilityStats stats={stats} />
        </>
    );
};

export default Stats;
