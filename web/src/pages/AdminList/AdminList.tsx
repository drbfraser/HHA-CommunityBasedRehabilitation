import React, { useRef, useEffect, useState, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import {
    LinearProgress,
    IconButton,
    Typography,
    Select,
    MenuItem,
    Popover,
    Switch,
    Box,
} from "@mui/material";
import {
    DataGrid,
    GridDensityTypes,
    GridRowsProp,
    GridOverlay,
    GridRenderCellParams,
} from "@mui/x-data-grid";
import { Cancel, MoreVert } from "@mui/icons-material";
import { useZones } from "@cbr/common/util/hooks/zones";
import SearchBar from "components/SearchBar/SearchBar";
import { adminListStyles } from "./AdminList.styles";
import { dataGridStyles } from "styles/DataGrid.styles";
import { searchOptionsStyles } from "styles/SearchOptions.styles";
import { hideColumnsStyles } from "styles/HideColumns.styles";

import requestUserRows from "./requestUserRows";
import { getClientListSearchOptions } from "../ClientList/searchOptions";
import { t } from "i18next";

const RenderText: any = (params: GridRenderCellParams) => (
    <Typography variant={"body2"}>{params.value}</Typography>
);
const RenderLoadingOverlay = () => (
    <GridOverlay>
        <div style={{ position: "absolute", top: 0, width: "100%" }}>
            <LinearProgress />
        </div>
    </GridOverlay>
);
const RenderNoRowsOverlay = () => {
    return (
        <GridOverlay sx={dataGridStyles.noRows}>
            <Cancel color="primary" sx={dataGridStyles.noRowsIcon} />
            <Typography color="primary">{t("admin.noUsersFound")}</Typography>
        </GridOverlay>
    );
};

const AdminList = () => {
    const { t } = useTranslation();
    const searchOptions = useMemo(() => getClientListSearchOptions(t), [t]);

    const [searchValue, setSearchValue] = useState<string>("");
    const [searchOption, setSearchOption] = useState<string>(searchOptions.NAME.value);
    const [loading, setLoading] = useState<boolean>(true);
    const [isNameHidden, setNameHidden] = useState<boolean>(false);
    const [isRoleHidden, setRoleHidden] = useState<boolean>(false);
    const [isZoneHidden, setZoneHidden] = useState<boolean>(false);
    const [isStatusHidden, setStatusHidden] = useState<boolean>(false);
    const [isUsernameHidden, setIsUsernameHidden] = useState<boolean>(false);
    const [filteredRows, setFilteredRows] = useState<GridRowsProp>([]);
    const [serverRows, setServerRows] = useState<GridRowsProp>([]);
    const [optionsAnchorEl, setOptionsAnchorEl] = useState<Element | null>(null);
    const isOptionsOpen = Boolean(optionsAnchorEl);

    const zones = useZones();
    const history = useHistory();

    const onRowClick = (row: any) => {
        const user = row.row;
        history.push(`/admin/view/${user.id}`);
    };
    const onAdminAddClick = () => history.push("/admin/new");
    const onOptionsClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
        setOptionsAnchorEl(event.currentTarget);
    const onOptionsClose = () => setOptionsAnchorEl(null);

    const adminColumns = [
        {
            field: "name",
            headerName: t("admin.name"),
            flex: 1,
            renderCell: RenderText,
            hide: isNameHidden,
            hideFunction: setNameHidden,
        },
        {
            field: "zone",
            headerName: t("admin.zone"),
            flex: 1,
            renderCell: RenderText,
            hide: isZoneHidden,
            hideFunction: setZoneHidden,
        },
        {
            field: "role",
            headerName: t("admin.role"),
            flex: 1,
            renderCell: RenderText,
            hide: isRoleHidden,
            hideFunction: setRoleHidden,
        },
        {
            field: "status",
            headerName: t("admin.status"),
            flex: 1,
            renderCell: RenderText,
            hide: isStatusHidden,
            hideFunction: setStatusHidden,
        },
        {
            field: "username",
            headerName: t("admin.username"),
            flex: 1,
            renderCell: RenderText,
            hide: isUsernameHidden,
            hideFunction: setIsUsernameHidden,
        },
    ];

    const initialDataLoaded = useRef(false);

    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            await requestUserRows(setFilteredRows, setServerRows, setLoading, t);
            setLoading(false);
            initialDataLoaded.current = true;
        };
        loadInitialData();
    }, [t]);

    useEffect(() => {
        if (!initialDataLoaded.current) {
            return;
        }

        switch (searchOption) {
            case searchOptions.NAME.value:
                setFilteredRows(
                    serverRows.filter(
                        (r) =>
                            r.name.toLowerCase().startsWith(searchValue) ||
                            r.last_name.toLowerCase().startsWith(searchValue)
                    )
                );
                break;
            case searchOptions.ZONE.value:
                setFilteredRows(serverRows.filter((r) => r.zone.startsWith(searchValue)));
                break;
        }
    }, [searchValue, searchOption, serverRows, searchOptions.NAME, searchOptions.ZONE]);

    return (
        <Box sx={adminListStyles.container}>
            <Box sx={adminListStyles.topContainer}>
                <IconButton onClick={onAdminAddClick} sx={adminListStyles.icon} size="large">
                    <PersonAddIcon />
                </IconButton>
                <Box sx={searchOptionsStyles.searchOptions}>
                    <Select
                        variant="standard"
                        color={"primary"}
                        value={searchOption}
                        onChange={(event) => {
                            setSearchValue("");
                            setSearchOption(String(event.target.value));
                        }}
                    >
                        {Object.values(searchOptions).map(({ value, display }, index) => (
                            <MenuItem key={index} value={value}>
                                {display}
                            </MenuItem>
                        ))}
                    </Select>
                </Box>

                {searchOption === searchOptions.ZONE.value ? (
                    <div>
                        <Select
                            variant="standard"
                            sx={searchOptionsStyles.zoneOptions}
                            color={"primary"}
                            defaultValue={""}
                            onChange={(event) => setSearchValue(String(event.target.value))}
                        >
                            {Array.from(zones).map(([id, name]) => (
                                <MenuItem key={id} value={name}>
                                    {name}
                                </MenuItem>
                            ))}
                        </Select>
                    </div>
                ) : (
                    <SearchBar
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
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
                        {adminColumns.map((column): JSX.Element => {
                            return (
                                <Box key={column.field} sx={hideColumnsStyles.optionsRow}>
                                    <Typography component={"span"} variant={"body2"}>
                                        {column.headerName}
                                    </Typography>
                                    <Switch
                                        checked={!column.hide}
                                        onClick={() => column.hideFunction(!column.hide)}
                                    />
                                </Box>
                            );
                        })}
                    </Box>
                </Popover>
            </Box>
            <Box sx={adminListStyles.dataGridWrapper}>
                <DataGrid
                    sx={dataGridStyles.datagrid}
                    loading={loading}
                    components={{
                        LoadingOverlay: RenderLoadingOverlay,
                        NoRowsOverlay: RenderNoRowsOverlay,
                    }}
                    rows={filteredRows}
                    columns={adminColumns}
                    density={GridDensityTypes.Comfortable}
                    onRowClick={onRowClick}
                    pagination
                    // todosd: re-add this functionality
                    // sortModel={[
                    //     {
                    //         field: "name",
                    //         sort: "asc",
                    //     },
                    // ]}
                />
            </Box>
        </Box>
    );
};

export default AdminList;
