import { adminListStyles } from "./AdminList.styles";
import { dataGridStyles } from "styles/DataGrid.styles";
import SearchBar from "components/SearchBar/SearchBar";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import {
    DataGrid,
    GridDensityTypes,
    GridRowsProp,
    GridOverlay,
    GridRenderCellParams,
} from "@mui/x-data-grid";
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
import { searchOptionsStyles } from "styles/SearchOptions.styles";
import { hideColumnsStyles } from "styles/HideColumns.styles";
import { useRef } from "react";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import requestUserRows from "./requestUserRows";
import React from "react";
import { Cancel, MoreVert } from "@mui/icons-material";
import { SearchOption } from "../ClientList/searchOptions";
import { useZones } from "@cbr/common/util/hooks/zones";

const RenderText = (params: GridRenderCellParams) => {
    return <Typography variant={"body2"}>{String(params.value)}</Typography>; // todo: String conversion ok here?
};

const RenderLoadingOverlay = () => {
    return (
        <GridOverlay>
            <div style={{ position: "absolute", top: 0, width: "100%" }}>
                <LinearProgress />
            </div>
        </GridOverlay>
    );
};

const RenderNoRowsOverlay = () => {
    return (
        <GridOverlay sx={dataGridStyles.noRows}>
            <Cancel color="primary" sx={dataGridStyles.noRowsIcon} />
            <Typography color="primary">No Users Found</Typography>
        </GridOverlay>
    );
};

const AdminList = () => {
    const [searchValue, setSearchValue] = useState<string>("");
    const [searchOption, setSearchOption] = useState<string>(SearchOption.NAME);
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
        history.push("/admin/view/" + user.id);
    };
    const onAdminAddClick = () => history.push("/admin/new");
    const onOptionsClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
        setOptionsAnchorEl(event.currentTarget);
    const onOptionsClose = () => setOptionsAnchorEl(null);

    const adminColumns = [
        {
            field: "name",
            headerName: "Name",
            flex: 1,
            renderCell: RenderText,
            hide: isNameHidden,
            hideFunction: setNameHidden,
        },
        {
            field: "zone",
            headerName: "Zone",
            flex: 1,
            renderCell: RenderText,
            hide: isZoneHidden,
            hideFunction: setZoneHidden,
        },
        {
            field: "role",
            headerName: "Role",
            flex: 1,
            renderCell: RenderText,
            hide: isRoleHidden,
            hideFunction: setRoleHidden,
        },
        {
            field: "status",
            headerName: "Status",
            flex: 1,
            renderCell: RenderText,
            hide: isStatusHidden,
            hideFunction: setStatusHidden,
        },
        {
            field: "username",
            headerName: "Username",
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
            await requestUserRows(setFilteredRows, setServerRows, setLoading);
            setLoading(false);
            initialDataLoaded.current = true;
        };
        loadInitialData();
    }, []);

    useEffect(() => {
        if (!initialDataLoaded.current) {
            return;
        }
        if (searchOption === SearchOption.NAME) {
            const filteredRows: GridRowsProp = serverRows.filter(
                (r) =>
                    r.name.toLowerCase().startsWith(searchValue) ||
                    r.last_name.toLowerCase().startsWith(searchValue)
            );
            setFilteredRows(filteredRows);
        } else if (searchOption === SearchOption.ZONE) {
            const filteredRows: GridRowsProp = serverRows.filter((r) =>
                r.zone.startsWith(searchValue)
            );
            setFilteredRows(filteredRows);
        }
    }, [searchValue, searchOption, serverRows]);

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
                        defaultValue={SearchOption.NAME}
                        value={searchOption}
                        onChange={(event) => {
                            setSearchValue("");
                            setSearchOption(String(event.target.value));
                        }}
                    >
                        {Object.values(SearchOption).map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                </Box>
                {searchOption === SearchOption.ZONE ? (
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
                    sortModel={[
                        {
                            field: "name",
                            sort: "asc",
                        },
                    ]}
                />
            </Box>
        </Box>
    );
};

export default AdminList;
