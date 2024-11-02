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
    Box,
} from "@mui/material";
import { MoreVert } from "@mui/icons-material";

import { SearchOption } from "@cbr/common/util/searchOptions";
import { useZones } from "@cbr/common/util/hooks/zones";
import SearchBar from "components/SearchBar/SearchBar";
import IOSSwitch from "components/IOSSwitch/IOSSwitch";
import { clientListStyles } from "../ClientList.styles";
import { searchOptionsStyles } from "styles/SearchOptions.styles";
import { hideColumnsStyles } from "styles/HideColumns.styles";

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

    const isOptionsOpen = Boolean(optionsAnchorEl);

    const onOptionsClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
        setOptionsAnchorEl(event.currentTarget);
    const onOptionsClose = () => setOptionsAnchorEl(null);

    return (
        <>
            <Box sx={clientListStyles.switch}>
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
            </Box>
            <Box sx={clientListStyles.checkbox} color="secondary">
                <Typography
                    color={archivedMode ? "textPrimary" : "textSecondary"}
                    component={"span"}
                    variant={"body2"}
                >
                    {t("dashboard.showArchived")}
                </Typography>
                <Checkbox
                    checked={archivedMode}
                    color="secondary"
                    onChange={(e) => {
                        onArchivedModeChange(e.target.checked);
                    }}
                />
            </Box>

            <Box sx={clientListStyles.search}>
                <Box sx={searchOptionsStyles.searchOptions}>
                    <Select
                        variant="standard"
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
                                {option === SearchOption.NAME
                                    ? t("general.name")
                                    : t("general.zone")}
                            </MenuItem>
                        ))}
                    </Select>
                </Box>

                {searchOption === SearchOption.ZONE ? (
                    <div>
                        <Select
                            variant="standard"
                            color={"primary"}
                            sx={searchOptionsStyles.zoneOptions}
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

                <IconButton
                    sx={hideColumnsStyles.optionsButton}
                    onClick={onOptionsClick}
                    size="large"
                >
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
                    <Box sx={hideColumnsStyles.optionsContainer}>
                        {columns.map((column: any): JSX.Element => {
                            return (
                                // todosd: possible source of slowdown?
                                <Box key={column.field} sx={hideColumnsStyles.optionsRow}>
                                    <Typography component={"span"} variant={"body2"}>
                                        {column.headerName}
                                    </Typography>
                                    <Switch
                                        color="secondary"
                                        checked={!column.hide}
                                        onClick={() => column.hideFunction(!column.hide)}
                                    />
                                </Box>
                            );
                        })}
                    </Box>
                </Popover>
            </Box>
        </>
    );
};

export default Toolbar;
