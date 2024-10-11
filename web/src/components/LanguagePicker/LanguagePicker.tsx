import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";

const LanguagePicker = () => {
    const [language, setLanguage] = useState("en");
    const { t, i18n } = useTranslation();

    const handleLanguageChange = (e: SelectChangeEvent) => {
        i18n.changeLanguage(e.target.value);
        setLanguage(e.target.value);
    };

    return (
        <FormControl
            sx={{
                width: 100,
            }}
            variant="standard"
        >
            <InputLabel id="language-input">
                <LanguageOutlinedIcon sx={{ verticalAlign: "middle" }} />
                {t("general.language")}
            </InputLabel>
            <Select labelId="language-input" value={language} onChange={handleLanguageChange}>
                <MenuItem value={"en"}>{t("languagePicker.english")}</MenuItem>
                <MenuItem value={"bari"}>{t("languagePicker.bari")}</MenuItem>
            </Select>
        </FormControl>
    );
};

export default LanguagePicker;
