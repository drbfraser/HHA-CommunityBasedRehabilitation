import React from "react";
import { InputBase, InputBaseProps, useTheme } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search"; // TODO: was from data-grid - verify same
import { useStyles } from "./SearchBar.styles";

const SearchBar = (props: InputBaseProps) => {
    const theme = useTheme();
    const styles = useStyles(theme);

    return (
        <div className={styles.search}>
            <div className={styles.searchIcon}>
                <SearchIcon />
            </div>
            <InputBase
                placeholder="Search…"
                classes={{
                    root: styles.inputRoot,
                    input: styles.inputInput,
                }}
                inputProps={{ "aria-label": "search" }}
                {...props}
            />
        </div>
    );
};

export default SearchBar;
