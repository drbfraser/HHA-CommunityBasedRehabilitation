import React from "react";
import { alpha, Box, InputBase, InputBaseProps, useTheme } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useTranslation } from "react-i18next";
import { themeColors } from "@cbr/common/util/colors";

const SearchBar = (props: InputBaseProps) => {
    const theme = useTheme();
    const { t } = useTranslation();

    // todosd: move back to styles file, or use styled locally
    return (
        <Box
            sx={{
                // search
                position: "relative",
                borderRadius: 90,
                backgroundColor: alpha(themeColors.blueBgDark, 0.15),
                "&:hover": {
                    backgroundColor: alpha(themeColors.blueBgDark, 0.25),
                },
                marginLeft: 0,
                [theme.breakpoints.up("sm")]: {
                    marginLeft: theme.spacing(1),
                    width: "auto",
                },
            }}
        >
            <Box
                sx={{
                    // searchIcon
                    padding: theme.spacing(0, 2),
                    height: "100%",
                    position: "absolute",
                    pointerEvents: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <SearchIcon />
            </Box>
            <InputBase
                placeholder={`${t("general.search")}...`}
                sx={{
                    root: {
                        // inputRoot
                        color: "inherit",
                    },
                    input: {
                        // inputInput
                        padding: theme.spacing(1, 1, 1, 0),
                        // vertical padding + font size from searchIcon
                        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
                        transition: theme.transitions.create("width"),
                        width: "12ch",
                        "&:focus": {
                            width: "20ch",
                        },
                    },
                }}
                inputProps={{ "aria-label": "search" }}
                {...props}
            />
        </Box>
    );
};

export default SearchBar;
