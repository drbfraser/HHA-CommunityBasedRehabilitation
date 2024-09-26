import React from "react";
import { InputBase, InputBaseProps, useTheme } from "@material-ui/core";
import { SearchIcon } from "@material-ui/data-grid";
import { useTranslation } from "react-i18next";

import { useStyles } from "./SearchBar.styles";

const SearchBar = (props: InputBaseProps) => {
    const theme = useTheme();
    const styles = useStyles(theme);
    const { t } = useTranslation();

    return (
        <div className={styles.search}>
            <div className={styles.searchIcon}>
                <SearchIcon />
            </div>
            <InputBase
                placeholder={`${t("general.search")}...`}
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
