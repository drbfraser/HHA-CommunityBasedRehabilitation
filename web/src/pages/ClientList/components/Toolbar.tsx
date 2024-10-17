import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    IconButton,
    MenuItem,
    Popover,
    Select,
    Switch,
    Checkbox,
    Typography,
} from "@material-ui/core";
import { MoreVert } from "@material-ui/icons";

import { SearchOption } from "@cbr/common/util/searchOptions";
import { useZones } from "@cbr/common/util/hooks/zones";
import SearchBar from "components/SearchBar/SearchBar";
import { useStyles } from "../ClientList.styles";
import IOSSwitch from "components/IOSSwitch/IOSSwitch";
import { useSearchOptionsStyles } from "styles/SearchOptions.styles";
import { useHideColumnsStyles } from "styles/HideColumns.styles";

interface IProps {
    allClientsMode: boolean;
    archivedMode: boolean;
    searchValue: string;
    searchOption: string;
    columns: any;
    onClientModeChange: (checked: boolean) => void;
    onArchivedModeChange: (checked: boolean) => void;
    onSearchValueChange: (value: string) => void;
    onSearchOptionChange: (value: string) => void;
}

const Toolbar = ({
    allClientsMode,
    archivedMode,
    searchValue,
    searchOption,
    columns,
    onClientModeChange,
    onArchivedModeChange,
    onSearchValueChange,
    onSearchOptionChange,
}: IProps) => {
    const [optionsAnchorEl, setOptionsAnchorEl] = useState<Element | null>(null);
    const { t } = useTranslation();
    const zones = useZones();
    const styles = useStyles();
    const searchOptionsStyle = useSearchOptionsStyles();
    const hideColumnsStyle = useHideColumnsStyles();

    const isOptionsOpen = Boolean(optionsAnchorEl);

    const onOptionsClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
        setOptionsAnchorEl(event.currentTarget);
    const onOptionsClose = () => setOptionsAnchorEl(null);

    return (
        <>
            <div className={styles.switch}>
                <Typography
                    color={allClientsMode ? "textSecondary" : "textPrimary"}
                    component={"span"}
                    variant={"body2"}
                >
                    {t("dashboard.myClients")}
                </Typography>
                <IOSSwitch
                    checked={allClientsMode}
                    onChange={(event) => onClientModeChange(event.target.checked)}
                />
                <Typography
                    color={allClientsMode ? "textPrimary" : "textSecondary"}
                    component={"span"}
                    variant={"body2"}
                >
                    {t("dashboard.allClients")}
                </Typography>
            </div>
            <div className={styles.checkbox}>
                <Typography
                    color={archivedMode ? "textPrimary" : "textSecondary"}
                    component={"span"}
                    variant={"body2"}
                >
                    {t("dashboard.showArchived")}
                </Typography>
                <Checkbox
                    checked={archivedMode}
                    onChange={(e) => {
                        onArchivedModeChange(e.target.checked);
                    }}
                />
            </div>

            <div className={styles.search}>
                <div className={searchOptionsStyle.searchOptions}>
                    <Select
                        color={"primary"}
                        defaultValue={SearchOption.NAME}
                        value={searchOption}
                        onChange={(event) => {
                            onSearchValueChange("");
                            onSearchOptionChange(String(event.target.value));
                        }}
                    >
                        {Object.values(SearchOption).map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                </div>

                {searchOption === SearchOption.ZONE ? (
                    <div>
                        <Select
                            className={searchOptionsStyle.zoneOptions}
                            color={"primary"}
                            defaultValue={""}
                            onChange={(e) => onSearchValueChange(String(e.target.value))}
                        >
                            {Array.from(zones).map(([id, name]) => (
                                <MenuItem key={id} value={id}>
                                    {name}
                                </MenuItem>
                            ))}
                        </Select>
                    </div>
                ) : (
                    <SearchBar
                        value={searchValue}
                        onChange={(e) => onSearchValueChange(e.target.value)}
                    />
                )}

                <IconButton className={hideColumnsStyle.optionsButton} onClick={onOptionsClick}>
                    <MoreVert />
                </IconButton>
                <Popover
                    open={isOptionsOpen}
                    anchorEl={optionsAnchorEl}
                    onClose={onOptionsClose}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "center",
                    }}
                >
                    <div className={hideColumnsStyle.optionsContainer}>
                        {columns.map((column: any): JSX.Element => {
                            return (
                                <div key={column.field} className={hideColumnsStyle.optionsRow}>
                                    <Typography component={"span"} variant={"body2"}>
                                        {column.headerName}
                                    </Typography>
                                    <Switch
                                        checked={!column.hide}
                                        onClick={() => column.hideFunction(!column.hide)}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </Popover>
            </div>
        </>
    );
};

export default Toolbar;
