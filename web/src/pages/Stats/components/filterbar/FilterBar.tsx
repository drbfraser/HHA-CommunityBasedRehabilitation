import { Button, Chip, styled } from "@mui/material";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { IStats } from "@cbr/common/util/stats";
import { IUser } from "@cbr/common/util/users";
import ExportStats from "./ExportStats";
import { blankDateRange, IDateRange } from "./StatsDateFilter";
import { IAge, IGender, AGE_BANDS } from "./StatsDemographicFilter";
import StatsGroupByPicker from "./StatsGroupByPicker";
import StatsUnifiedFilter from "./StatsUnifiedFilter";

export type GroupDim = "zone" | "gender" | "host_status" | "age_band";

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

export const FilterLabels = styled("div")({
    display: "flex",
    gap: "1em",
});

export const DIM_LABEL: Record<GroupDim, string> = {
    zone: "Zone",
    gender: "Gender",
    host_status: "Host/Refugee",
    age_band: "Age range",
};

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

    // NEW: lifted grouping state from Stats.tsx
    categorizeBy: GroupDim | null;
    groupBy: Set<GroupDim>;
    setCategorizeBy: (d: GroupDim | null) => void;
    setGroupBy: (s: Set<GroupDim>) => void;
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
    categorizeBy,
    groupBy,
    setCategorizeBy,
    setGroupBy,
}: IProps) => {
    const [exportOpen, setExportOpen] = useState(false);
    const [groupByOpen, setGroupByOpen] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);
    const { t } = useTranslation();

    const ageFilterActive = useMemo(() => {
        if (!Array.isArray(age.bands)) return false;

        // True if at least 2 age bands are selected
        if (age.bands.length >= 2) return true;

        const allLabels = AGE_BANDS.map((band) => band.label);

        return !allLabels.every((label) => age.bands.includes(label));
    }, [age.bands]);

    const genderFilterActive = useMemo(() => {
        if (!gender) return false;
        const selectedCount = [gender.male, gender.female].filter(Boolean).length;
        return selectedCount === 1; // true if only one is selected
    }, [gender]);
    return (
        <menu>
            <FilterControls>
                <FilterButtons>
                    <Button variant="outlined" onClick={() => setGroupByOpen(true)}>
                        {"Group By"}
                    </Button>
                    <Button variant="outlined" onClick={() => setFilterOpen(true)}>
                        {"Filter By"}
                    </Button>
                    <Button variant="outlined" onClick={() => setExportOpen(true)}>
                        {t("dashboard.csvExport")}
                    </Button>
                </FilterButtons>

                {/* date + user chips */}
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

                {/* grouping chips */}
                <FilterLabels>
                    {categorizeBy ? (
                        <Chip
                            label={`${"Categorized by"} ${DIM_LABEL[categorizeBy]}`}
                            onDelete={() => setCategorizeBy(null)}
                        />
                    ) : (
                        <Chip label={"No category"} />
                    )}
                    {groupBy.size ? (
                        <Chip
                            label={`${"Grouped by"} ${Array.from(groupBy)
                                .map((d) => DIM_LABEL[d])
                                .join(" + ")}`}
                            onDelete={() => setGroupBy(new Set())}
                        />
                    ) : (
                        <Chip label={"No groups"} />
                    )}
                </FilterLabels>

                {/* active/archived toggle */}
            </FilterControls>

            {/* dialogs/modals */}
            <StatsUnifiedFilter
                open={filterOpen}
                onClose={() => setFilterOpen(false)}
                users={users}
                user={user}
                setUser={setUser}
                dateRange={dateRange}
                setDateRange={setDateRange}
                gender={gender}
                age={age}
                setGender={setGender}
                setAge={setAge}
                archiveMode={archiveMode}
                onArchiveModeChange={onArchiveModeChange}
            />
            <ExportStats
                open={exportOpen}
                onClose={() => setExportOpen(false)}
                stats={stats}
                age={age}
                gender={gender}
                date={dateRange}
                user={user ?? undefined}
                archiveMode={archiveMode}
                categorizeBy={categorizeBy ?? undefined}
                groupBy={groupBy}
            />

            {/* NEW: Group By picker modal, driven by lifted state */}
            <StatsGroupByPicker
                open={groupByOpen}
                onClose={() => setGroupByOpen(false)}
                categorizeBy={categorizeBy}
                groupBy={groupBy}
                onApply={(cat, groups) => {
                    setCategorizeBy(cat);
                    setGroupBy(new Set(groups)); // ensure a Set instance
                    setGroupByOpen(false);
                }}
                disableAgeBand={!ageFilterActive}
                disableGender={genderFilterActive}
            />
        </menu>
    );
};

export default FilterBar;
