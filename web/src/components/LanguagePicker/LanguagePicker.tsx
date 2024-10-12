import React, { useState } from "react";
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

interface IProps {
    sx?: SxProps<Theme>;
}

const LanguagePicker = ({ sx }: IProps) => {
    const [language, setLanguage] = useState("en");
    const { t, i18n } = useTranslation();

    const handleLanguageChange = (e: SelectChangeEvent) => {
        i18n.changeLanguage(e.target.value);
        setLanguage(e.target.value);
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
                <MenuItem value={"en"}>{t("languagePicker.english")}</MenuItem>
                <MenuItem value={"bari"}>{t("languagePicker.bari")}</MenuItem>
            </Select>
        </FormControl>
    );
};

export default LanguagePicker;
