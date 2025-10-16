import { Button, Chip, styled } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { IStats } from "@cbr/common/util/stats";
import { IUser } from "@cbr/common/util/users";
import { Typography } from "@mui/material";
import IOSSwitch from "components/IOSSwitch/IOSSwitch";
import ExportStats from "./ExportStats";
import StatsDateFilter, { blankDateRange, IDateRange } from "./StatsDateFilter";
import StatsDemographicFilter, { IAge, IGender } from "./StatsDemographicFilter";
import StatsUserFilter from "./StatsUserFilter";
import StatsGroupByPicker from "./StatsGroupByPicker";

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

export type GroupDim = "zone" | "gender" | "host_status" | "age_band";
export const DIM_LABEL: Record<GroupDim, string> = {
    zone: "Zone",
    gender: "Gender",
    host_status: "Host/Refugee",
    age_band: "Age range",
};

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
    const [groupByOpen, setGroupByOpen] = useState(false);
    const [dateFilterOpen, setDateFilterOpen] = useState(false);
    const [demographicOpen, setDemographicOpen] = useState(false);
    const [userFilterOpen, setUserFilterOpen] = useState(false);
    const [exportOpen, setExportOpen] = useState(false);
    const [categorizeBy, setCategorizeBy] = useState<GroupDim | null>("zone");
    const [groupBy, setGroupBy] = useState<Set<GroupDim>>(new Set());
    const ageFilterActive =
        (age.demographic && (age.demographic === "child" || age.demographic === "adult")) ||
        (Array.isArray(age.bands) && age.bands.length > 0);
    const { t } = useTranslation();

    // If an age filter is active, automatically clear any existing "age_band" grouping
    useEffect(() => {
        if (ageFilterActive) {
            if (groupBy.has("age_band")) {
                const next = new Set(groupBy);
                next.delete("age_band");
                setGroupBy(next);
            }
            if (categorizeBy === "age_band") {
                setCategorizeBy(null);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ageFilterActive]);

    return (
        <menu>
            <FilterControls>
                <FilterButtons>
                    <Button variant="outlined" onClick={() => setGroupByOpen(true)}>
                        {/* TODO: add translation */}
                        {"Group By"}
                    </Button>
                    <Button variant="outlined" onClick={() => setDemographicOpen(true)}>
                        {t("statistics.filterByDemographic")}
                    </Button>
                    <Button variant="outlined" onClick={() => setDateFilterOpen(true)}>
                        {t("statistics.filterByDate")}
                    </Button>
                    <Button variant="outlined" onClick={() => setUserFilterOpen(true)}>
                        {t("statistics.filterByUser")}
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => setExportOpen(true)}
                        disabled={ageFilterActive && (groupBy.has("age_band") || categorizeBy === "age_band")}
                        title={
                            ageFilterActive && (groupBy.has("age_band") || categorizeBy === "age_band")
                                ? "Cannot export: Age range grouping conflicts with active age filter"
                                : undefined
                        }
                    >
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
                <FilterLabels>
                    {categorizeBy ? (
                        <Chip
                            label={`Categorized by ${DIM_LABEL[categorizeBy]}`}
                            onDelete={() => setCategorizeBy(null)}
                        />
                    ) : (
                        <Chip label={"No category"} />
                    )}

                    {groupBy.size ? (
                        <Chip
                            label={`Grouped by ${Array.from(groupBy)
                                .map((d) => DIM_LABEL[d])
                                .join(" + ")}`}
                            onDelete={() => setGroupBy(new Set())}
                        />
                    ) : (
                        <Chip label={"No groups"} />
                    )}
                </FilterLabels>
            </FilterControls>
            <StatsGroupByPicker
                open={groupByOpen}
                onClose={() => setGroupByOpen(false)}
                categorizeBy={categorizeBy}
                groupBy={groupBy}
                onApply={(cat, groups) => {
                    setCategorizeBy(cat);
                    setGroupBy(groups);
                    setGroupByOpen(false);
                }}
                // disable 'age_band' grouping when an age filter (child/adult OR ranges) is active
                disableAgeBand={!!ageFilterActive}
            />
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
                date={dateRange}
                user={user}
                archiveMode={archiveMode}
                categorizeBy={categorizeBy}
                groupBy={groupBy}
            />
        </menu>
    );
};

export default FilterBar;
