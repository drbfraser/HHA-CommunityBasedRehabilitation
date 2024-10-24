import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    SxProps,
    Theme,
} from "@mui/material";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import { getLanguageFromLocalStorage, Language, LANGUAGE_KEY } from "./utils";

interface IProps {
    sx?: SxProps<Theme>;
}

const LanguagePicker = ({ sx }: IProps) => {
    const [language, setLanguage] = useState(getLanguageFromLocalStorage());
    const { t, i18n } = useTranslation();

    useEffect(() => {
        i18n.changeLanguage(language);
    }, [i18n, language]);

    const handleLanguageChange = (e: SelectChangeEvent) => {
        const newLanguage = e.target.value;

        setLanguage(newLanguage as Language);
        try {
            localStorage.setItem(LANGUAGE_KEY, newLanguage);
        } catch (e) {
            console.error("error setting language in localStorage:", e);
        }
    };

    return (
        <FormControl
            id="language-picker-form"
            sx={{
                width: 100,
                ...sx,
            }}
            variant="standard"
        >
            <InputLabel id="language-label">
                <LanguageOutlinedIcon sx={{ verticalAlign: "middle" }} /> {t("general.language")}
            </InputLabel>
            <Select
                id="language-select"
                labelId="language-input"
                value={language}
                onChange={handleLanguageChange}
            >
                <MenuItem value={Language.EN}>{t("languagePicker.english")}</MenuItem>
                <MenuItem value={Language.BARI}>{t("languagePicker.bari")}</MenuItem>
            </Select>
        </FormControl>
    );
};

export default LanguagePicker;
