import React, { useCallback, useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { CSVLink } from "react-csv";
import { useHistory } from "react-router-dom";
import { LinearProgress, Typography, debounce, Button } from "@material-ui/core";
import {
    GridColumnHeaderParams,
    DataGrid,
    GridDensityTypes,
    GridOverlay,
    GridRowParams,
    GridRowsProp,
    GridSortCellParams,
    GridRenderCellParams,
} from "@mui/x-data-grid";
import { compressedDataGridWidth, dataGridStyles } from "styles/DataGrid.styles";
import {
    LinearProgress,
    IconButton,
    MenuItem,
    Popover,
    Select,
    Switch,
    Checkbox,
    Typography,
    debounce,
    Button,
    Box,
} from "@mui/material";
import { useHistory } from "react-router-dom";
import IOSSwitch from "components/IOSSwitch/IOSSwitch";
import SearchBar from "components/SearchBar/SearchBar";
import RiskLevelChip from "components/RiskLevelChip/RiskLevelChip";
import { RiskLevel, IRiskLevel, riskLevels, RiskType } from "@cbr/common/util/risks";
import { getTranslatedRiskName, IRiskType, riskTypes } from "util/risks";
import { SearchOption } from "@cbr/common/util/searchOptions";
import { MoreVert, Cancel, FiberManualRecord } from "@mui/icons-material";
import requestClientRows from "./requestClientRows";
import { useSearchOptionsStyles } from "styles/SearchOptions.styles";
import { useHideColumnsStyles } from "styles/HideColumns.styles";
import { useZones } from "@cbr/common/util/hooks/zones";
import Toolbar from "./components/Toolbar";

import { clientListStyles } from "./ClientList.styles";
import { searchOptionsStyles } from "styles/SearchOptions.styles";
import { hideColumnsStyles } from "styles/HideColumns.styles";

// manually define this type, as GridCellValue deprecated in MUI 5
type GridCellValue = string | number | boolean | object | Date | null | undefined;

const riskComparator = (
    v1: GridCellValue,
    v2: GridCellValue,
    params1: GridSortCellParams,
    params2: GridSortCellParams
) => {
    const risk1: IRiskLevel = riskLevels[String(params1.value)];
    const risk2: IRiskLevel = riskLevels[String(params2.value)];
    return risk1.level - risk2.level;
};

const RenderRiskHeader = (params: GridColumnHeaderParams): JSX.Element => {
    const { t } = useTranslation();
    const riskType: IRiskType = riskTypes[params.field];

    return (
        <div className="MuiDataGrid-colCellTitle">
            {window.innerWidth >= compressedDataGridWidth ? (
                getTranslatedRiskName(t, params.field as RiskType)
            ) : (
                <riskType.Icon />
            )}
        </div>
    );
};

const RenderText = (params: GridRenderCellParams) => {
    return (
        <Typography
            variant={"body2"}
            color={params.row.is_active ? "textPrimary" : "textSecondary"}
        >
            {String(params.value)}
        </Typography>
    );
};

const RenderBadge = (params: GridRenderCellParams) => {
    const risk: RiskLevel = Object(params.value);

    return window.innerWidth >= compressedDataGridWidth ? (
        <RiskLevelChip clickable risk={risk} />
    ) : (
        <FiberManualRecord style={{ color: riskLevels[risk].color }} />
    );
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
    const { t } = useTranslation();

    return (
        <GridOverlay sx={dataGridStyles.noRows}>
            <Cancel color="primary" sx={dataGridStyles.noRowsIcon} />
            <Typography color="primary">{t("dashboard.noClients")}</Typography>
        </GridOverlay>
    );
};

const ClientList = () => {
    const [allClientsMode, setAllClientsMode] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(true);
    const [isNameHidden, setNameHidden] = useState<boolean>(false);
    const [isZoneHidden, setZoneHidden] = useState<boolean>(false);
    const [isHealthHidden, setHealthHidden] = useState<boolean>(false);
    const [isEducationHidden, setEducationHidden] = useState<boolean>(false);
    const [isSocialHidden, setSocialHidden] = useState<boolean>(false);
    const [isNutritionHidden, setNutritionHidden] = useState<boolean>(false);
    const [isMentalHidden, setMentalHidden] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState<string>("");
    const [searchOption, setSearchOption] = useState<string>(SearchOption.NAME);
    const [rows, setRows] = useState<GridRowsProp>([]);
    const [archivedMode, setArchivedMode] = useState<boolean>(false);

    const zones = useZones();
    const history = useHistory();
    const { t } = useTranslation();

    const initialDataLoaded = useRef(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const requestClientRowsDebounced = useCallback(debounce(requestClientRows, 500), []);
    useEffect(() => {
        if (!initialDataLoaded.current) {
            return;
        }

        requestClientRowsDebounced(
            setRows,
            setLoading,
            searchValue,
            searchOption,
            allClientsMode,
            archivedMode
        );
    }, [searchValue, searchOption, allClientsMode, archivedMode, requestClientRowsDebounced]);

    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            await requestClientRows(setRows, setLoading, "", "", true, false);
            setLoading(false);
            initialDataLoaded.current = true;
        };

        loadInitialData();
    }, []);

    const onRowClick = (rowParams: GridRowParams) => history.push(`/client/${rowParams.row.id}`);

    const riskColumnStates: {
        [key: string]: { hide: boolean; hideFunction: (isHidden: boolean) => void };
    } = {
        [RiskType.HEALTH]: {
            hide: isHealthHidden,
            hideFunction: setHealthHidden,
        },
        [RiskType.EDUCATION]: {
            hide: isEducationHidden,
            hideFunction: setEducationHidden,
        },
        [RiskType.SOCIAL]: {
            hide: isSocialHidden,
            hideFunction: setSocialHidden,
        },
        [RiskType.NUTRITION]: {
            hide: isNutritionHidden,
            hideFunction: setNutritionHidden,
        },
        [RiskType.MENTAL]: {
            hide: isMentalHidden,
            hideFunction: setMentalHidden,
        },
    };

    const sortClientsById = (rows: GridRowsProp) => {
        // let sortById: GridRowsProp = rows.slice(0);

        // sortById.sort((a: any, b: any) => {
        //     return a.id - b.id;
        // });

        let sortById = rows.slice(0); // todosd: re-add type?  still has functionality?

        sortById.sort((a: any, b: any) => {
            return a.id - b.id;
        });

        return sortById;
    };

    const columns = [
        {
            field: "name",
            headerName: t("general.name"),
            flex: 1,
            renderCell: RenderText,
            hide: isNameHidden,
            hideFunction: setNameHidden,
        },
        {
            field: "zone",
            headerName: t("general.zone"),
            flex: 1,
            renderCell: RenderText,
            hide: isZoneHidden,
            hideFunction: setZoneHidden,
        },
        ...Object.entries(riskTypes).map(([value]) => ({
            field: value,
            headerName: getTranslatedRiskName(t, value as RiskType),
            flex: 0.7,
            renderHeader: RenderRiskHeader,
            renderCell: RenderBadge,
            sortComparator: (
                _v1: CellValue,
                _v2: CellValue,
                params1: CellParams,
                params2: CellParams
            ) => {
                return (
                    riskLevels[String(params1.value)].level -
                    riskLevels[String(params2.value)].level
                );
            },
            hide: riskColumnStates[value].hide,
            hideFunction: riskColumnStates[value].hideFunction,
        })),
    ];

    return (
        <div className={styles.root}>
            <Toolbar
                allClientsMode={allClientsMode}
                archivedMode={archivedMode}
                searchValue={searchValue}
                searchOption={searchOption}
                columns={columns}
                onClientModeChange={setAllClientsMode}
                onArchivedModeChange={setArchivedMode}
                onSearchValueChange={setSearchValue}
                onSearchOptionChange={setSearchOption}
            />

        <Box sx={clientListStyles.root}>
            <div>
                <Box sx={clientListStyles.switch}>
                    <Typography
                        color={allClientsMode ? "textSecondary" : "textPrimary"}
                        component={"span"}
                        variant={"body2"}
                    >
                        My Clients
                    </Typography>
                    <IOSSwitch
                        checked={allClientsMode}
                        onChange={(event) => setAllClientsMode(event.target.checked)}
                    />
                    <Typography
                        color={allClientsMode ? "textPrimary" : "textSecondary"}
                        component={"span"}
                        variant={"body2"}
                    >
                        All Clients
                    </Typography>
                </Box>
                <Box sx={clientListStyles.checkbox}>
                    <Typography
                        color={archivedMode ? "textPrimary" : "textSecondary"}
                        component={"span"}
                        variant={"body2"}
                    >
                        Show Archived
                    </Typography>
                    <Checkbox
                        color="secondary"
                        checked={archivedMode}
                        onChange={(e) => {
                            setArchivedMode(e.target.checked);
                        }}
                    />
                </Box>
            </div>
            <Box sx={clientListStyles.search}>
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
                            onChange={(e) => setSearchValue(String(e.target.value))}
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
                        {columns.map((column): JSX.Element => {
                            return (
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
            <DataGrid
                sx={dataGridStyles.datagrid}
                columns={columns}
                rows={rows}
                loading={loading}
                components={{
                    LoadingOverlay: RenderLoadingOverlay,
                    NoRowsOverlay: RenderNoRowsOverlay,
                }}
                density={GridDensityTypes.Comfortable}
                onRowClick={onRowClick}
                pagination
            />
            <Box sx={clientListStyles.downloadSVC}>
                <CSVLink
                    filename="ClientList.csv"
                    data={sortClientsById(rows)}
                    style={{ textDecoration: "none" }}
                >
                    <Button variant="outlined" size="small">
                        {t("dashboard.csvExport")}
                    </Button>
                </CSVLink>
            </Box>
        </Box>
    );
};

export default ClientList;
