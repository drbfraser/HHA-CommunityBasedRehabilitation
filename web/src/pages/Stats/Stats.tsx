import { Button, Chip, Divider, Typography } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import React, { useEffect, useState } from "react";
import { timestampFromFormDate } from "@cbr/common/util/dates";
import { apiFetch, Endpoint } from "@cbr/common/util/endpoints";
import { IStats } from "@cbr/common/util/stats";
import { IUser } from "@cbr/common/util/users";
import DisabilityStats from "./DisabilityStats";
import ExportStats from "./ExportStats";
import ReferralStats from "./ReferralStats";
import StatsDateFilter, { blankDateRange, IDateRange } from "./StatsDateFilter";
import StatsUserFilter from "./StatsUserFilter";
import VisitStats from "./VisitStats";
import IOSSwitch from "components/IOSSwitch/IOSSwitch";

const Stats = () => {
    const [dateFilterOpen, setDateFilterOpen] = useState(false);
    const [dateRange, setDateRange] = useState(blankDateRange);
    const [userFilterOpen, setUserFilterOpen] = useState(false);
    const [users, setUsers] = useState<IUser[]>([]);
    const [user, setUser] = useState<IUser | null>(null);
    const [exportOpen, setExportOpen] = useState(false);
    const [stats, setStats] = useState<IStats>();
    const [errorLoading, setErrorLoading] = useState(false);
    const [archiveMode, setArchiveMode] = useState(false);
    const milliSecondPerDay = 86400000;

    const FilterBar = () => (
        <div style={{ textAlign: "center" }}>
            <Button variant="outlined" onClick={() => setDateFilterOpen(true)}>
                Filter by Date
            </Button>{" "}
            <Button variant="outlined" onClick={() => setUserFilterOpen(true)}>
                Filter by User
            </Button>{" "}
            <Button variant="outlined" onClick={() => setExportOpen(true)}>
                Export to CSV
            </Button>{" "}
            <br />
            <br />
            {dateRange.from.length && dateRange.to.length ? (
                <Chip
                    label={`From ${dateRange.from} to ${dateRange.to}`}
                    onDelete={() => setDateRange(blankDateRange)}
                />
            ) : (
                <Chip label="All Time" />
            )}{" "}
            {user ? (
                <Chip
                    label={`${user.first_name} (${user.username})`}
                    onDelete={() => setUser(null)}
                />
            ) : (
                <Chip label="All Users" />
            )}
        </div>
    );

    useEffect(() => {
        apiFetch(Endpoint.USERS)
            .then((resp) => resp.json())
            .then((users) => setUsers(users))
            .catch(() => setErrorLoading(true));
    }, []);

    useEffect(() => {
        const urlParams = new URLSearchParams();
        urlParams.append("is_active", String(archiveMode));

        ["from", "to"].forEach((field) => {
            const fieldVal = dateRange[field as keyof IDateRange];

            if (fieldVal) {
                if (field === "from") {
                    urlParams.append(field, String(timestampFromFormDate(fieldVal)));
                } else {
                    urlParams.append(
                        field,
                        String(timestampFromFormDate(fieldVal) + milliSecondPerDay)
                    );
                }
            }
        });

        if (user) {
            urlParams.append("user_id", String(user.id));
        }

        apiFetch(Endpoint.STATS, `?${urlParams.toString()}`)
            .then((resp) => resp.json())
            .then((stats) => {
                console.log(stats);
                return setStats(stats);
            })
            .catch(() => setErrorLoading(true));
    }, [dateRange, user, archiveMode]);

    return errorLoading ? (
        <Alert severity="error">
            Something went wrong loading the statistics. Please try again.
        </Alert>
    ) : (
        <>
            <FilterBar />
            <StatsDateFilter
                open={dateFilterOpen}
                onClose={() => setDateFilterOpen(false)}
                range={dateRange}
                setRange={setDateRange}
            />
            <StatsUserFilter
                open={userFilterOpen}
                onClose={() => setUserFilterOpen(false)}
                users={users}
                user={user}
                setUser={setUser}
            />
            <ExportStats open={exportOpen} onClose={() => setExportOpen(false)} stats={stats} />
            <br />
            <Divider />
            <br />
            <Typography variant="h2" align="center">
                Visits
            </Typography>
            <VisitStats stats={stats} />
            <br />
            <Divider />
            <br />
            <Typography variant="h2" align="center">
                Referrals
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
                    All Clients
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
                    Active Clients
                </Typography>
            </div>
            <Typography variant="h2" align="center" display="block">
                Disabilities
            </Typography>
            <Typography variant="body1" align="center">
                Filters do not apply to disabilities.
            </Typography>
            <br />
            <DisabilityStats stats={stats} />
        </>
    );
};

export default Stats;
