import React from "react";
import { InputBase, InputBaseProps, useTheme } from "@material-ui/core";
import { SearchIcon } from "@material-ui/data-grid";
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
