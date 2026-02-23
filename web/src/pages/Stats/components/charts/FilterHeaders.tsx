import React from "react";
import { Box, Chip } from "@mui/material";
import { IUser } from "@cbr/common/util/users";
import {
    IGender,
    IAge,
    CHILD_BANDS,
    ADULT_BANDS,
    AGE_BANDS,
} from "../filterbar/StatsDemographicFilter";
import { IDateRange } from "../filterbar/StatsDateFilter";

interface FilterHeadersProps {
    user?: IUser | null;
    gender?: IGender;
    age?: IAge;
    dateRange?: IDateRange;
    archiveMode?: boolean;
}

const FilterHeaders: React.FC<FilterHeadersProps> = ({
    archiveMode,
    user,
    gender,
    age,
    dateRange,
}) => {
    // Return null if no filters are provided
    if (
        !user &&
        !gender &&
        !age?.demographic &&
        (!age?.bands || age.bands.length === 0) &&
        !dateRange &&
        !archiveMode
    )
        return null;
    const chipColors: Record<string, "primary" | "secondary" | "success" | "warning"> = {
        user: "primary",
        gender: "secondary",
        age: "success",
        date: "warning",
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 1,
                mb: 1,
            }}
        >
            {/* User */}
            {user && (
                <Chip
                    label={`User: ${
                        [user.first_name, user.last_name].filter(Boolean).join(" ") || user.username
                    }`}
                    color={chipColors.user}
                    size="small"
                />
            )}

            {/* Gender */}
            {gender && (
                <>
                    {((gender.male && !gender.female) || (!gender.male && gender.female)) && (
                        <Chip
                            label={
                                gender.male
                                    ? "Gender: Male"
                                    : gender.female
                                    ? "Gender: Female"
                                    : undefined
                            }
                            color={chipColors.gender}
                            size="small"
                        />
                    )}
                </>
            )}

            {(() => {
                if (!age?.bands || age.bands.length === 0) return null;

                const selectedBands = age.bands;

                const allChildSelected = CHILD_BANDS.every((b) => selectedBands.includes(b));
                const allAdultSelected = ADULT_BANDS.every((b) => selectedBands.includes(b));
                const onlyChild =
                    allChildSelected && selectedBands.every((b) => CHILD_BANDS.includes(b));
                const onlyAdult =
                    allAdultSelected && selectedBands.every((b) => ADULT_BANDS.includes(b));
                const allBandsSelected = AGE_BANDS.map((b) => b.label).every((b) =>
                    selectedBands.includes(b)
                );

                if (allBandsSelected) return null;

                if (onlyChild) {
                    return (
                        <Chip
                            label="Age: Child"
                            color={chipColors.age}
                            variant="outlined"
                            size="small"
                        />
                    );
                }

                if (onlyAdult) {
                    return (
                        <Chip
                            label="Age: Adult"
                            color={chipColors.age}
                            variant="outlined"
                            size="small"
                        />
                    );
                }

                return (
                    <Chip
                        label={`Age: ${selectedBands.join(", ")}`}
                        color={chipColors.age}
                        variant="outlined"
                        size="small"
                    />
                );
            })()}

            {/* Date Range */}
            {dateRange?.from && dateRange?.to && (
                <Chip
                    label={`Date: ${new Date(dateRange.from).toLocaleDateString()} – ${new Date(
                        dateRange.to
                    ).toLocaleDateString()}`}
                    color={chipColors.date}
                    variant="outlined"
                    size="small"
                />
            )}
            {archiveMode && (
                <Chip label="Clients: Active" color="info" variant="filled" size="small" />
            )}
        </Box>
    );
};

export default FilterHeaders;
