import React from "react";
import { Box, Chip } from "@mui/material";
import { IUser } from "@cbr/common/util/users";
import { IGender, IAge } from "../filterbar/StatsDemographicFilter";
import { IDateRange } from "../filterbar/StatsDateFilter";

interface FilterHeadersProps {
    user?: IUser | null;
    gender?: IGender;
    age?: IAge;
    dateRange?: IDateRange;
}

const FilterHeaders: React.FC<FilterHeadersProps> = ({ user, gender, age, dateRange }) => {
    // Return null if no filters are provided
    if (
        !user &&
        !gender &&
        !age?.demographic &&
        (!age?.bands || age.bands.length === 0) &&
        !dateRange
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
                <Chip
                    label={
                        gender.male && gender.female
                            ? "Gender: Male & Female"
                            : gender.male
                            ? "Gender: Male"
                            : gender.female
                            ? "Gender: Female"
                            : undefined
                    }
                    color={chipColors.gender}
                    size="small"
                />
            )}

            {/* Age */}
            {age?.demographic && (
                <Chip
                    label={`Age: ${
                        age.demographic.charAt(0).toUpperCase() + age.demographic.slice(1)
                    }`}
                    color={chipColors.age}
                    variant="outlined"
                    size="small"
                />
            )}
            {age?.bands && age.bands.length > 0 && (
                <Chip
                    label={`Age: ${age.bands.join(", ")}`}
                    color={chipColors.age}
                    variant="outlined"
                    size="small"
                />
            )}

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
        </Box>
    );
};

export default FilterHeaders;
