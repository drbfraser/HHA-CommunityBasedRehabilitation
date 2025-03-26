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

    const handleGenderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name } = event.target;
        setSelectedGender((prevGender) => ({
            ...prevGender,
            [name]: !prevGender[name as keyof IGender],
        }));
    };

    const handleAgeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name } = event.target;
        setSelectedAge((prevAge) => ({
            ...prevAge,
            [name]: !prevAge[name as keyof IAge],
        }));
    };

    const handleClear = () => {
        setSelectedGender(clearedGenderConfigs);
        setSelectedAge(clearedAgeConfigs);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{t("statistics.filterByUser")}</DialogTitle>
            <DialogContent>
                <FormGroup>
                    <Typography variant="subtitle1">{t("clientFields.gender")}</Typography>
                    <FormControlLabel
                        control={
                            <Checkbox
                                name="female"
                                checked={selectedGender.female}
                                onChange={handleGenderChange}
                            />
                        }
                        label={t("clientFields.female")}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                name="male"
                                checked={selectedGender.male}
                                onChange={handleGenderChange}
                            />
                        }
                        label={t("clientFields.male")}
                    />

                    <Typography variant="subtitle1">{t("statistics.age")}</Typography>
                    <FormControlLabel
                        control={
                            <Checkbox
                                name="child"
                                checked={selectedAge.child}
                                onChange={handleAgeChange}
                            />
                        }
                        label={t("statistics.child")}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                name="adult"
                                checked={selectedAge.adult}
                                onChange={handleAgeChange}
                            />
                        }
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
