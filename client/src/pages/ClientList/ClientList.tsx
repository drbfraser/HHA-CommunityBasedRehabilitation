import { useEffect, useState } from "react";
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
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import IOSSwitch from "components/IOSSwitch/IOSSwitch";
import SearchBar from "components/SearchBar/SearchBar";
import RiskChip from "components/RiskChip/RiskChip";
import { IRisk, riskCategories, IRiskCategory, RiskCategory } from "util/riskOptions";
import { SearchOption } from "./searchOptions";
import { MoreVert, Cancel, FiberManualRecord } from "@material-ui/icons";
import requestClientRows from "./requestClientRows";

const riskComparator = (v1: CellValue, v2: CellValue, params1: CellParams, params2: CellParams) => {
    const risk1: IRisk = Object(params1.value);
    const risk2: IRisk = Object(params2.value);
    return risk1.level - risk2.level;
};

const RenderRiskHeader = (params: ColParams): JSX.Element => {
    const riskCategory: IRiskCategory = riskCategories[params.field];

    return (
        <div className="MuiDataGrid-colCellTitle">
            {window.innerWidth >= compressedDataGridWidth ? (
                riskCategory.name
            ) : (
                <riskCategory.Icon />
            )}
        </div>
    );
};

const RenderText = (params: ValueFormatterParams) => {
    return <Typography variant={"body2"}>{params.value}</Typography>;
};

const RenderBadge = (params: ValueFormatterParams) => {
    const risk: IRisk = Object(params.value);

    return window.innerWidth >= compressedDataGridWidth ? (
        <RiskChip clickable risk={risk} />
    ) : (
        <FiberManualRecord style={{ color: risk.color }} />
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
    const [searchField, setSearchField] = useState<string>("");
    const [searchOption, setSearchOption] = useState<string>(SearchOption.ID);
    const [rows, setRows] = useState<RowsProp>([]);

    const styles = useStyles();
    const dataGridStyle = useDataGridStyles();
    const history = useHistory();

    const isOptionsOpen = Boolean(optionsAnchorEl);

    const onRowClick = (rowParams: RowParams) => history.push(`/client/${rowParams.row.id}`);
    const onOptionsClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
        setOptionsAnchorEl(event.currentTarget);
    const onOptionsClose = () => setOptionsAnchorEl(null);
    // debounce search input
    let delayTimer: NodeJS.Timeout;
    const onSearch = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        clearTimeout(delayTimer);
        delayTimer = setTimeout(function () {
            setSearchField(event.target.value.trim());
        }, 1000);
    };

    const riskColumnStates: {
        [key: string]: { hide: boolean; hideFunction: (isHidden: boolean) => void };
    } = {
        [RiskCategory.HEALTH]: {
            hide: isHealthHidden,
            hideFunction: setHealthHidden,
        },
        [RiskCategory.EDUCATION]: {
            hide: isEducationHidden,
            hideFunction: setEducationHidden,
        },
        [RiskCategory.SOCIAL]: {
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
        ...Object.entries(riskCategories).map(([value, { name }]) => ({
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

    useEffect(() => {
        requestClientRows(setRows, setLoading, searchField, searchOption);
    }, [searchField, searchOption]);

    return (
        <div className={styles.root}>
            <IconButton className={styles.optionsButton} onClick={onOptionsClick}>
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
                <div className={styles.optionsContainer}>
                    {columns.map(
                        (column): JSX.Element => {
                            return (
                                <div key={column.field} className={styles.optionsRow}>
                                    <Typography component={"span"} variant={"body2"}>
                                        {column.headerName}
                                    </Typography>
                                    <Switch
                                        checked={!column.hide}
                                        onClick={() => column.hideFunction(!column.hide)}
                                    />
                                </div>
                            );
                        }
                    )}
                </div>
            </Popover>
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
                <div className={styles.searchOptions}>
                    <Select
                        color={"primary"}
                        defaultValue={SearchOption.ID}
                        value={searchOption}
                        onChange={(event) => {
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
                <SearchBar onChange={onSearch} />
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
            />
        </div>
    );
};

export default ClientList;
