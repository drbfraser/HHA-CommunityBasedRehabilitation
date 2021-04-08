import { Button, Chip, Divider, Typography } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import React, { useEffect, useState } from "react";
import { timestampFromFormDate } from "util/dates";
import { apiFetch, Endpoint } from "util/endpoints";
import { IStats } from "util/stats";
import { IUser } from "util/users";
import DisabilityStats from "./DisabilityStats";
import ReferralStats from "./ReferralStats";
import StatsDateFilter, { blankDateRange, IDateRange } from "./StatsDateFilter";
import VisitStats from "./VisitStats";

const Stats = () => {
    const [dateFilterOpen, setDateFilterOpen] = useState(false);
    const [dateRange, setDateRange] = useState(blankDateRange);
    const [userFilterOpen, setUserFilterOpen] = useState(false);
    const [user, setUser] = useState<IUser>();
    const [stats, setStats] = useState<IStats>();
    const [errorLoading, setErrorLoading] = useState(false);

    const AllTimeChip = () => <Chip label="All Time" />;
    const FilterDatesChip = () => <Chip label={`From ${dateRange.from} to ${dateRange.to}`} />;
    const AllUsersChip = () => <Chip label="All Users" />;

    const FilterChips = () => (
        <>
            {dateRange.from.length && dateRange.to.length ? <FilterDatesChip /> : <AllTimeChip />}{" "}
            <AllUsersChip />
        </>
    );

    useEffect(() => {
        const urlParams = new URLSearchParams();

        ["from", "to"].forEach((field) => {
            const fieldVal = dateRange[field as keyof IDateRange];

            if (fieldVal) {
                urlParams.append(field, String(timestampFromFormDate(fieldVal)));
            }
        });

        apiFetch(Endpoint.STATS, `?${urlParams.toString()}`)
            .then((resp) => resp.json())
            .then((stats) => setStats(stats))
            .catch(() => setErrorLoading(true));
    }, [dateRange]);

    return errorLoading ? (
        <Alert severity="error">
            Something went wrong loading the statistics. Please try again.
        </Alert>
    ) : (
        <>
            <StatsDateFilter
                open={dateFilterOpen}
                onClose={() => setDateFilterOpen(false)}
                range={dateRange}
                setRange={setDateRange}
            />
            <div style={{ textAlign: "center" }}>
                <Button variant="outlined" onClick={() => setDateFilterOpen(true)}>
                    Filter by Date
                </Button>{" "}
                <Button variant="outlined" onClick={() => setUserFilterOpen(true)}>
                    Filter by User
                </Button>{" "}
                <Button variant="outlined" onClick={() => alert("Not yet implemented")}>
                    Export to CSV
                </Button>{" "}
            </div>
            <br />
            <Divider />
            <br />
            <Typography variant="h2">Visits</Typography>
            <FilterChips />
            <br />
            <br />
            <VisitStats stats={stats} />
            <br />
            <Divider />
            <br />
            <Typography variant="h2">Referrals</Typography>
            <FilterChips />
            <br />
            <br />
            <ReferralStats stats={stats} />
            <br />
            <Divider />
            <br />
            <Typography variant="h2">Disabilities</Typography>
            <AllTimeChip /> <AllUsersChip />
            <br />
            <br />
            <DisabilityStats stats={stats} />
        </>
    );
};

export default Stats;
