import React, { useState } from "react";
import { Button, Chip } from "@material-ui/core";

import { IUser } from "@cbr/common/util/users";
import { IStats } from "@cbr/common/util/stats";
import StatsDateFilter, { blankDateRange, IDateRange } from "./StatsDateFilter";
import StatsUserFilter from "./StatsUserFilter";
import ExportStats from "./ExportStats";

interface IProps {
    user: IUser | null;
    users: IUser[];
    dateRange: IDateRange;
    stats: IStats | undefined;
    setDateRange: (dateRange: IDateRange) => void;
    setUser: (user: IUser | null) => void;
}

const FilterBar = ({ user, users, dateRange, stats, setDateRange, setUser }: IProps) => {
    const [dateFilterOpen, setDateFilterOpen] = useState(false);
    const [userFilterOpen, setUserFilterOpen] = useState(false);
    const [exportOpen, setExportOpen] = useState(false);

    return (
        <>
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
        </>
    );
};

export default FilterBar;
