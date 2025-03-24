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
} from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export interface IGender {
    female: boolean;
    male: boolean;
}

export interface IAge {
    child: boolean;
    adult: boolean;
}

export const defaultGenderConfigs: IGender = {
    female: true,
    male: true,
};

export const defaultAgeConfigs: IAge = {
    child: true,
    adult: true,
};

export const clearedGenderConfigs: IGender = {
    female: false,
    male: false,
};

export const clearedAgeConfigs: IAge = {
    child: false,
    adult: false,
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

    const [selectedGender, setSelectedGender] = useState<IGender>(gender);
    const [selectedAge, setSelectedAge] = useState<IAge>(age);

    const handleSubmit = () => {
        setGender(selectedGender);
        setAge(selectedAge);
        onClose();
    };

    const handleGender = () => {};

    const handleAge = () => {};

    const handleClear = () => {
        setSelectedAge(clearedAgeConfigs);
        setSelectedGender(clearedGenderConfigs);
        // onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{t("statistics.filterByUser")}</DialogTitle>

            <DialogContent>
                <FormGroup>
                    <Typography variant="subtitle1">{t("clientFields.gender")}</Typography>
                    <FormControlLabel
                        control={<Checkbox />}
                        checked={gender.female}
                        label={t("clientFields.female")}
                    />
                    <FormControlLabel
                        control={<Checkbox />}
                        checked={gender.male}
                        label={t("clientFields.male")}
                    />
                    <Typography variant="subtitle1">{t("statistics.age")}</Typography>
                    <FormControlLabel
                        control={<Checkbox />}
                        checked={age.child}
                        label={t("statistics.child")}
                    />
                    <FormControlLabel
                        control={<Checkbox />}
                        checked={age.adult}
                        label={t("statistics.adult")}
                    />
                </FormGroup>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClear}>{t("general.clear")}</Button>
                <Button color="primary" onClick={handleSubmit}>
                    {t("general.filter")}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default StatsDemographicFilter;
