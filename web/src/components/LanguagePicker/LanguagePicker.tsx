import React, { useState } from "react";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";

const LanguagePicker = () => {
    const [language, setLanguage] = useState("english");

    return (
        <FormControl
            sx={{
                width: 150,
            }}
            variant="standard"
        >
            <InputLabel id="language-input">
                <LanguageOutlinedIcon sx={{ verticalAlign: "top" }} /> Language
            </InputLabel>
            <Select
                labelId="language-input"
                value={language}
                onChange={(e: SelectChangeEvent) => setLanguage(e.target.value)}
            >
                <MenuItem value={"english"}>English</MenuItem>
                <MenuItem value={"bari"}>Bari</MenuItem>
            </Select>
        </FormControl>
    );
};

export default LanguagePicker;
