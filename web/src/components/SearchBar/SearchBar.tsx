import React from "react";
import { InputBase, InputBaseProps, useTheme } from "@material-ui/core";
import { SearchIcon } from "@material-ui/data-grid";
import { useTranslation } from "react-i18next";

import { useStyles } from "./SearchBar.styles";

const SearchBar = (props: InputBaseProps) => {
    const theme = useTheme();
    // const styles = useStyles(theme);  todosd: remove
    const { t } = useTranslation();

    // todosd: move back to styles file?  How to apply theme better
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
                        // input root
                        // todosd: verifiy this is appying correctly
                        color: "inherit",
                    },
                    input: {
                        // inputInput
                        // todosd: verifiy this is appying correctly
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
