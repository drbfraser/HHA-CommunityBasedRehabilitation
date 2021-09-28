import React from "react";
import { CSVLink } from "react-csv";
import { useCallback, useEffect, useState, useRef } from "react";
import {
    CellParams,
    CellValue,
    ColParams,
    DataGrid,
    DensityTypes,
    GridOverlay,
    RowParams,
    RowsProp,
    ValueFormatterParams,
} from "@material-ui/data-grid";
import { useStyles } from "./ClientList.styles";
import { compressedDataGridWidth, useDataGridStyles } from "styles/DataGrid.styles";
import {
    LinearProgress,
    IconButton,
    MenuItem,
    Popover,
    Select,
    Switch,
    Typography,
    debounce,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import IOSSwitch from "components/IOSSwitch/IOSSwitch";
import SearchBar from "components/SearchBar/SearchBar";
import RiskLevelChip from "components/RiskLevelChip/RiskLevelChip";
import { RiskLevel, IRiskLevel, riskLevels, RiskType } from "@cbr/common/util/risks";
import { IRiskType, riskTypes } from "util/riskIcon";
import { SearchOption } from "@cbr/common/util/searchOptions";
import { MoreVert, Cancel, FiberManualRecord } from "@material-ui/icons";
import requestClientRows from "./requestClientRows";
import { useSearchOptionsStyles } from "styles/SearchOptions.styles";
import { useHideColumnsStyles } from "styles/HideColumns.styles";
import { useZones } from "@cbr/common/util/hooks/zones";

const riskComparator = (v1: CellValue, v2: CellValue, params1: CellParams, params2: CellParams) => {
    const risk1: IRiskLevel = riskLevels[String(params1.value)];
    const risk2: IRiskLevel = riskLevels[String(params2.value)];
    return risk1.level - risk2.level;
};

const RenderRiskHeader = (params: ColParams): JSX.Element => {
    const riskType: IRiskType = riskTypes[params.field];

    return (
        <div className="MuiDataGrid-colCellTitle">
            {window.innerWidth >= compressedDataGridWidth ? riskType.name : <riskType.Icon />}
        </div>
    );
};

const RenderText = (params: ValueFormatterParams) => {
    return <Typography variant={"body2"}>{params.value}</Typography>;
};

const RenderBadge = (params: ValueFormatterParams) => {
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
    const styles = useDataGridStyles();

    return (
        <GridOverlay className={styles.noRows}>
            <Cancel color="primary" className={styles.noRowsIcon} />
            <Typography color="primary">No Clients Found</Typography>
        </GridOverlay>
    );
};

const ClientList = () => {
    const [allClientsMode, setAllClientsMode] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(true);
    const [isIdHidden, setIdHidden] = useState<boolean>(false);
    const [isNameHidden, setNameHidden] = useState<boolean>(false);
    const [isZoneHidden, setZoneHidden] = useState<boolean>(false);
    const [isHealthHidden, setHealthHidden] = useState<boolean>(false);
    const [isEducationHidden, setEducationHidden] = useState<boolean>(false);
    const [isSocialHidden, setSocialHidden] = useState<boolean>(false);
    const [optionsAnchorEl, setOptionsAnchorEl] = useState<Element | null>(null);
    const [searchValue, setSearchValue] = useState<string>("");
    const [searchOption, setSearchOption] = useState<string>(SearchOption.NAME);
    const [rows, setRows] = useState<RowsProp>([]);

    const zones = useZones();
    const styles = useStyles();
    const dataGridStyle = useDataGridStyles();
    const searchOptionsStyle = useSearchOptionsStyles();
    const hideColumnsStyle = useHideColumnsStyles();
    const history = useHistory();
    const isOptionsOpen = Boolean(optionsAnchorEl);

    const onRowClick = (rowParams: RowParams) => history.push(`/client/${rowParams.row.id}`);
    const onOptionsClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
        setOptionsAnchorEl(event.currentTarget);
    const onOptionsClose = () => setOptionsAnchorEl(null);

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
    };

    const columns = [
        {
            field: "id",
            headerName: "ID",
            flex: 0.55,
            renderCell: RenderText,
            hide: isIdHidden,
            hideFunction: setIdHidden,
        },
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
        ...Object.entries(riskTypes).map(([value, { name }]) => ({
            field: value,
            headerName: name,
            flex: 0.7,
            renderHeader: RenderRiskHeader,
            renderCell: RenderBadge,
            sortComparator: riskComparator,
            hide: riskColumnStates[value].hide,
            hideFunction: riskColumnStates[value].hideFunction,
        })),
    ];

    const initialDataLoaded = useRef(false);

    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            await requestClientRows(setRows, setLoading, "", "", true);
            setLoading(false);
            initialDataLoaded.current = true;
        };

        loadInitialData();
    }, []);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const requestClientRowsDebounced = useCallback(debounce(requestClientRows, 500), []);

    useEffect(() => {
        if (!initialDataLoaded.current) {
            return;
        }

        requestClientRowsDebounced(setRows, setLoading, searchValue, searchOption, allClientsMode);
    }, [searchValue, searchOption, allClientsMode, requestClientRowsDebounced]);

    return (
        <div className={styles.root}>
            <div className={styles.switch}>
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
            </div>
            <div className={styles.search}>
                <div className={searchOptionsStyle.searchOptions}>
                    <Select
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
                </div>
                {searchOption === SearchOption.ZONE ? (
                    <div>
                        <Select
                            className={searchOptionsStyle.zoneOptions}
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
                        {columns.map((column): JSX.Element => {
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
            <DataGrid
                className={dataGridStyle.datagrid}
                columns={columns}
                rows={rows}
                loading={loading}
                components={{
                    LoadingOverlay: RenderLoadingOverlay,
                    NoRowsOverlay: RenderNoRowsOverlay,
                }}
                density={DensityTypes.Comfortable}
                onRowClick={onRowClick}
                pagination
                sortModel={[
                    {
                        field: "name",
                        sort: "asc",
                    },
                ]}
            />
            <div className={styles.downloadSVC}>
                <CSVLink filename="ClientList.csv" data={rows}>
                    <button className={styles.downloadSVCButton}>EXPORT TO CSV</button>
                </CSVLink>
            </div>
        </div>
    );
};

export default ClientList;
