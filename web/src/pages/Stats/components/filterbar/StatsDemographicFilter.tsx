import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
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
    /** 'child' | 'adult' when using demographic; null when using specific bands */
    demographic: "child" | "adult" | null;
    /** explicit band selections; if non-empty, demographic must be null */
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
    demographic: null, // set to null since both child + adult are covered
    bands: [...CHILD_BANDS, ...ADULT_BANDS],
};
interface IProps {
    open: boolean;
    onClose: () => void;
    gender: IGender;
    age: IAge;
    setGender: (gender: IGender) => void;
    setAge: (age: IAge) => void;
}

const StatsDemographicFilter = ({ open, onClose, gender, age, setGender, setAge }: IProps) => {
    const { t } = useTranslation();
    const [selectedGender, setSelectedGender] = React.useState<IGender>(gender);
    const [selectedAge, setSelectedAge] = React.useState<IAge>(age);

    React.useEffect(() => {
        if (open) {
            setSelectedGender(gender);
            setSelectedAge(age);
        }
    }, [open, gender, age]);

    const onSubmit = () => {
        // Only validation we keep: at least one gender (age filter can be empty = no age filter)
        if (!selectedGender.female && !selectedGender.male) return;
        setGender(selectedGender);
        setAge(selectedAge);
        onClose();
    };

    const toggleGender = (name: keyof IGender) =>
        setSelectedGender((g) => ({ ...g, [name]: !g[name] }));

    // Toggle a demographic group: when toggling ON, add the group's bands; when
    // toggling OFF, remove the group's bands.
    const toggleDemographic = (which: "child" | "adult") => {
        setSelectedAge((prev) => {
            const groupBands = which === "child" ? CHILD_BANDS : ADULT_BANDS;
            const hasGroup = prev.bands.some((b) => groupBands.includes(b));
            let bands = [...prev.bands];

            if (hasGroup) {
                // remove group's bands
                bands = bands.filter((b) => !groupBands.includes(b));
            } else {
                // add group's bands
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
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {t("statistics.filterByDemographic") || "Filter by Demographic"}
            </DialogTitle>
            <DialogContent>
                <FormGroup>
                    <Typography variant="subtitle1">
                        {t("clientFields.gender") || "Gender"}
                    </Typography>
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

                <FormGroup>
                    {/* Render Age title and the age ranges header on the same horizontal row */}
                    <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start", mt: 0 }}>
                        <Box sx={{ display: "flex", flexDirection: "column", minWidth: 220 }}>
                            <Typography variant="subtitle1">
                                {t("statistics.age") || "Age"}
                            </Typography>
                            {/* Child/Adult: disabled if any explicit bands are selected */}
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={
                                            selectedAge.demographic === "child" ||
                                            selectedAge.bands.some((b) => CHILD_BANDS.includes(b))
                                        }
                                        onChange={() =>
                                            toggleDemographic(
                                                selectedAge.demographic === "child"
                                                    ? "child"
                                                    : "child"
                                            )
                                        }
                                    />
                                }
                                label={t("statistics.child")}
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={
                                            selectedAge.demographic === "adult" ||
                                            selectedAge.bands.some((b) => ADULT_BANDS.includes(b))
                                        }
                                        onChange={() =>
                                            toggleDemographic(
                                                selectedAge.demographic === "adult"
                                                    ? "adult"
                                                    : "adult"
                                            )
                                        }
                                    />
                                }
                                label={t("statistics.adult")}
                            />
                        </Box>

                        <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Typography variant="subtitle1" sx={{ mt: 0 }}>
                                    {"Age ranges"}
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 0.5 }}>
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
            </DialogContent>
            <DialogActions>
                <Button onClick={onReset}>{t("sync.reset") || "Reset"}</Button>
                <Button onClick={onSubmit} variant="contained" color="primary">
                    {t("general.filter") || "Filter"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default StatsDemographicFilter;
