import {
    Button,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Typography,
    Divider,
    Box,
} from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

export type AgeBand = "0-5" | "6-10" | "11-17" | "18-25" | "26-30" | "31-45" | "46+";

export interface IGender {
    female: boolean;
    male: boolean;
}

export interface IAge {
    demographic: "child" | "adult" | null;
    bands: AgeBand[];
}

export const AGE_BANDS: { label: AgeBand; range: [number, number] }[] = [
    { label: "0-5", range: [0, 5] },
    { label: "6-10", range: [6, 10] },
    { label: "11-17", range: [11, 17] },
    { label: "18-25", range: [18, 25] },
    { label: "26-30", range: [26, 30] },
    { label: "31-45", range: [31, 45] },
    { label: "46+", range: [46, 200] },
];

export const CHILD_BANDS: AgeBand[] = ["0-5", "6-10", "11-17"];
export const ADULT_BANDS: AgeBand[] = ["18-25", "26-30", "31-45", "46+"];

export const defaultGenderConfigs: IGender = { female: true, male: true };
export const defaultAgeConfigs: IAge = {
    demographic: null,
    bands: [...CHILD_BANDS, ...ADULT_BANDS],
};

interface IProps {
    gender: IGender;
    age: IAge;
    setGender: (gender: IGender) => void;
    setAge: (age: IAge) => void;

    /** if true, shows Reset/Filter buttons */
    compact?: boolean;
    onClose?: () => void;
}

const StatsDemographicFilter = ({
    gender,
    age,
    setGender,
    setAge,
    compact = false,
    onClose,
}: IProps) => {
    const { t } = useTranslation();
    const [selectedGender, setSelectedGender] = React.useState<IGender>(gender);
    const [selectedAge, setSelectedAge] = React.useState<IAge>(age);

    React.useEffect(() => {
        setSelectedGender(gender);
        setSelectedAge(age);
    }, [gender, age]);

    const onSubmit = () => {
        if (!selectedGender.female && !selectedGender.male) return;
        setGender(selectedGender);
        setAge(selectedAge);
        onClose?.(); // still triggers parent modal close if provided
    };

    const toggleGender = (name: keyof IGender) =>
        setSelectedGender((g) => ({ ...g, [name]: !g[name] }));

    const toggleDemographic = (which: "child" | "adult") => {
        setSelectedAge((prev) => {
            const groupBands = which === "child" ? CHILD_BANDS : ADULT_BANDS;
            const hasGroup = prev.bands.some((b) => groupBands.includes(b));
            let bands = [...prev.bands];

            if (hasGroup) {
                bands = bands.filter((b) => !groupBands.includes(b));
            } else {
                bands = Array.from(new Set([...bands, ...groupBands]));
            }

            const hasChild = bands.some((b) => CHILD_BANDS.includes(b));
            const hasAdult = bands.some((b) => ADULT_BANDS.includes(b));
            const demographic =
                hasChild && !hasAdult ? "child" : hasAdult && !hasChild ? "adult" : null;

            return { demographic, bands };
        });
    };

    const toggleBand = (band: AgeBand) => {
        setSelectedAge((prev) => {
            const set = new Set(prev.bands);
            if (set.has(band)) set.delete(band);
            else set.add(band);
            const bands = Array.from(set);

            const hasChild = bands.some((b) => CHILD_BANDS.includes(b));
            const hasAdult = bands.some((b) => ADULT_BANDS.includes(b));
            const demographic =
                hasChild && !hasAdult ? "child" : hasAdult && !hasChild ? "adult" : null;

            return { demographic, bands };
        });
    };

    const onReset = () => {
        setSelectedGender(defaultGenderConfigs);
        setSelectedAge(defaultAgeConfigs);
    };

    return (
        <Box>
            {/* Gender Section */}
            <FormGroup>
                <Typography variant="subtitle1">{t("clientFields.gender") || "Gender"}</Typography>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={selectedGender.female}
                            onChange={() => toggleGender("female")}
                        />
                    }
                    label={t("clientFields.female")}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={selectedGender.male}
                            onChange={() => toggleGender("male")}
                        />
                    }
                    label={t("clientFields.male")}
                />
            </FormGroup>

            <Divider sx={{ my: 2 }} />

            {/* Age Section */}
            <FormGroup>
                <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>
                    <Box sx={{ display: "flex", flexDirection: "column", minWidth: 220 }}>
                        <Typography variant="subtitle1">{t("statistics.age") || "Age"}</Typography>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={selectedAge.bands.some((b) => CHILD_BANDS.includes(b))}
                                    onChange={() => toggleDemographic("child")}
                                />
                            }
                            label={t("statistics.child")}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={selectedAge.bands.some((b) => ADULT_BANDS.includes(b))}
                                    onChange={() => toggleDemographic("adult")}
                                />
                            }
                            label={t("statistics.adult")}
                        />
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
                        <Typography variant="subtitle1">{"Age ranges"}</Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                            {AGE_BANDS.map(({ label }) => (
                                <FormControlLabel
                                    key={label}
                                    control={
                                        <Checkbox
                                            checked={selectedAge.bands.includes(label)}
                                            onChange={() => toggleBand(label)}
                                        />
                                    }
                                    label={label}
                                    sx={{ width: 120 }}
                                />
                            ))}
                        </Box>
                    </Box>
                </Box>
            </FormGroup>

            <Box display="flex" justifyContent="flex-end" gap={1} mt={2}>
                <Button onClick={onReset}>{t("sync.reset") || "Reset"}</Button>
                <Button onClick={onSubmit} variant="contained">
                    {t("general.filter") || "Filter"}
                </Button>
            </Box>
        </Box>
    );
};

export default StatsDemographicFilter;
