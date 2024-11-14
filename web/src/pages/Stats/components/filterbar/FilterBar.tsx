import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Chip } from "@mui/material";

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
    const { t } = useTranslation();

    return (
        <>
            <div style={{ textAlign: "center" }}>
                <Button variant="outlined" onClick={() => setDateFilterOpen(true)}>
                    {t("statistics.filterByDate")}
                </Button>{" "}
                <Button variant="outlined" onClick={() => setUserFilterOpen(true)}>
                    {t("statistics.filterByUser")}
                </Button>{" "}
                <Button variant="outlined" onClick={() => setExportOpen(true)}>
                    {t("general.csvExport")}
                </Button>{" "}
                <br />
                <br />
                {dateRange.from.length && dateRange.to.length ? (
                    <Chip
                        label={t("statistics.dateRange", {
                            start: dateRange.from,
                            end: dateRange.to,
                        })}
                        onDelete={() => setDateRange(blankDateRange)}
                    />
                ) : (
                    <Chip label={t("statistics.allTime")} />
                )}{" "}
                {user ? (
                    <Chip
                        label={`${user.first_name} (${user.username})`}
                        onDelete={() => setUser(null)}
                    />
                ) : (
                    <Chip label={t("statistics.allUsers")} />
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
