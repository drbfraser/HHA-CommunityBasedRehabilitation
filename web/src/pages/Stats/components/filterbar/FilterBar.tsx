import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Chip, styled } from "@mui/material";

import { IUser } from "@cbr/common/util/users";
import { IStats } from "@cbr/common/util/stats";
import StatsDateFilter, { blankDateRange, IDateRange } from "./StatsDateFilter";
import StatsUserFilter from "./StatsUserFilter";
import ExportStats from "./ExportStats";
import StatsDemographicFilter, { IAge, IGender } from "./StatsDemographicFilter";
import IOSSwitch from "components/IOSSwitch/IOSSwitch";
import { Typography } from "@mui/material";

const FilterControls = styled("div")({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
});

const FilterButtons = styled("div")({
    display: "flex",
    gap: "1em",
});

const FilterLabels = styled("div")({
    display: "flex",
    gap: "1em",
});

interface IProps {
    user: IUser | null;
    users: IUser[];
    dateRange: IDateRange;
    stats: IStats | undefined;
    gender: IGender;
    age: IAge;
    setDateRange: (dateRange: IDateRange) => void;
    setUser: (user: IUser | null) => void;
    setGender: (gender: IGender) => void;
    setAge: (age: IAge) => void;
    archiveMode: boolean;
    onArchiveModeChange: (val: boolean) => void;
}

const FilterBar = ({
    user,
    users,
    dateRange,
    stats,
    gender,
    age,
    setDateRange,
    setUser,
    setGender,
    setAge,
    archiveMode,
    onArchiveModeChange,
}: IProps) => {
    const [dateFilterOpen, setDateFilterOpen] = useState(false);
    const [demographicOpen, setDemographicOpen] = useState(false);
    const [userFilterOpen, setUserFilterOpen] = useState(false);
    const [exportOpen, setExportOpen] = useState(false);
    const { t } = useTranslation();

    return (
        <menu>
            <FilterControls>
                <FilterButtons>
                    <Button variant="outlined" onClick={() => setDemographicOpen(true)}>
                        {t("statistics.filterByDemographic")}
                    </Button>
                    <Button variant="outlined" onClick={() => setDateFilterOpen(true)}>
                        {t("statistics.filterByDate")}
                    </Button>
                    <Button variant="outlined" onClick={() => setUserFilterOpen(true)}>
                        {t("statistics.filterByUser")}
                    </Button>
                    <Button variant="outlined" onClick={() => setExportOpen(true)}>
                        {t("dashboard.csvExport")}
                    </Button>
                </FilterButtons>

                <FilterLabels>
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
                    )}
                    {user ? (
                        <Chip
                            label={`${user.first_name} (${user.username})`}
                            onDelete={() => setUser(null)}
                        />
                    ) : (
                        <Chip label={t("statistics.allUsers")} />
                    )}
                </FilterLabels>
                <FilterLabels>
                    <menu>
                        <Typography
                            color={archiveMode ? "textSecondary" : "textPrimary"}
                            component={"span"}
                            variant={"body2"}
                        >
                            {t("statistics.allClients")}
                        </Typography>
                        <IOSSwitch
                            checked={archiveMode}
                            onChange={(event) => onArchiveModeChange(event.target.checked)}
                        />
                        <Typography
                            color={archiveMode ? "textPrimary" : "textSecondary"}
                            component={"span"}
                            variant={"body2"}
                        >
                            {t("statistics.activeClients")}
                        </Typography>
                    </menu>
                </FilterLabels>
            </FilterControls>
            <StatsDemographicFilter
                open={demographicOpen}
                onClose={() => setDemographicOpen(false)}
                gender={gender}
                age={age}
                setGender={setGender}
                setAge={setAge}
            />
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
            <ExportStats
                open={exportOpen}
                onClose={() => setExportOpen(false)}
                stats={stats}
                age={age}
                gender={gender}
            />
        </menu>
    );
};

export default FilterBar;
