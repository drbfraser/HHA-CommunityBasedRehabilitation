import { useEffect, useState } from "react";
import {
    CellParams,
    CellValue,
    ColParams,
    DataGrid,
    DensityTypes,
    RowsProp,
    ValueFormatterParams,
} from "@material-ui/data-grid";
import { useStyles } from "./ClientList.styles";
import { compressedDataGridWidth, useDataGridStyles } from "styles/DataGrid.styles";
import { IconButton, MenuItem, Popover, Select, Switch, Typography } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import IOSSwitch from "components/IOSSwitch/IOSSwitch";
import SearchBar from "components/SearchBar/SearchBar";
import RiskChip from "components/RiskChip/RiskChip";
import {
    IRisk,
    RiskType,
    riskOptions,
    riskCategories,
    RiskCategory,
    IRiskCategory,
} from "util/riskOptions";
import { SearchOption } from "./searchOptions";
import { FiberManualRecord, MoreVert } from "@material-ui/icons";

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

const requestClientList = async (
    setRows: (rows: RowsProp) => void,
    setLoading: (loading: boolean) => void
) => {
    setLoading(true);

    // TODO: add API call to get client list here when its completed

    const rows = [
        {
            id: 1,
            name: "Ali",
            zone: "A",
            [RiskCategory.HEALTH]: riskOptions[RiskType.MEDIUM],
            [RiskCategory.EDUCATION]: riskOptions[RiskType.HIGH],
            [RiskCategory.SOCIAL]: riskOptions[RiskType.HIGH],
        },
        {
            id: 2,
            name: "Eric",
            zone: "B",
            [RiskCategory.HEALTH]: riskOptions[RiskType.LOW],
            [RiskCategory.EDUCATION]: riskOptions[RiskType.MEDIUM],
            [RiskCategory.SOCIAL]: riskOptions[RiskType.LOW],
        },
        {
            key: 3,
            id: 3,
            name: "Ethan",
            zone: "C",
            [RiskCategory.HEALTH]: riskOptions[RiskType.HIGH],
            [RiskCategory.EDUCATION]: riskOptions[RiskType.HIGH],
            [RiskCategory.SOCIAL]: riskOptions[RiskType.MEDIUM],
        },
        {
            id: 4,
            name: "Ahmad Mahmood",
            zone: "Saudi Arabia",
            [RiskCategory.HEALTH]: riskOptions[RiskType.CRITICAL],
            [RiskCategory.EDUCATION]: riskOptions[RiskType.CRITICAL],
            [RiskCategory.SOCIAL]: riskOptions[RiskType.CRITICAL],
        },
        {
            id: 5,
            name: "Sam",
            zone: "D",
            [RiskCategory.HEALTH]: riskOptions[RiskType.HIGH],
            [RiskCategory.EDUCATION]: riskOptions[RiskType.LOW],
            [RiskCategory.SOCIAL]: riskOptions[RiskType.HIGH],
        },
        {
            key: 6,
            id: 6,
            name: "Henry",
            zone: "E",
            [RiskCategory.HEALTH]: riskOptions[RiskType.LOW],
            [RiskCategory.EDUCATION]: riskOptions[RiskType.LOW],
            [RiskCategory.SOCIAL]: riskOptions[RiskType.MEDIUM],
        },
        {
            id: 7,
            name: "Griffin",
            zone: "E",
            [RiskCategory.HEALTH]: riskOptions[RiskType.HIGH],
            [RiskCategory.EDUCATION]: riskOptions[RiskType.HIGH],
            [RiskCategory.SOCIAL]: riskOptions[RiskType.HIGH],
        },
        {
            id: 8,
            name: "Argus",
            zone: "A",
            [RiskCategory.HEALTH]: riskOptions[RiskType.LOW],
            [RiskCategory.EDUCATION]: riskOptions[RiskType.HIGH],
            [RiskCategory.SOCIAL]: riskOptions[RiskType.MEDIUM],
        },
        {
            id: 9,
            name: "Roger",
            zone: "C",
            [RiskCategory.HEALTH]: riskOptions[RiskType.MEDIUM],
            [RiskCategory.EDUCATION]: riskOptions[RiskType.HIGH],
            [RiskCategory.SOCIAL]: riskOptions[RiskType.HIGH],
        },
        {
            id: 10,
            name: "Roger-Surface",
            zone: "C",
            [RiskCategory.HEALTH]: riskOptions[RiskType.MEDIUM],
            [RiskCategory.EDUCATION]: riskOptions[RiskType.HIGH],
            [RiskCategory.SOCIAL]: riskOptions[RiskType.LOW],
        },
    ];
    setRows(rows);
    setLoading(false);
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
    const [searchOption, setSearchOption] = useState<string>(SearchOption.ID);
    const [rows, setRows] = useState<RowsProp>([]);

    const styles = useStyles();
    const dataGridStyle = useDataGridStyles();
    const history = useHistory();

    const isOptionsOpen = Boolean(optionsAnchorEl);

    // TODO: update path to be wherever client details will be
    const onRowClick = () => history.push("/clients/new");
    const onOptionsClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
        setOptionsAnchorEl(event.currentTarget);
    const onOptionsClose = () => setOptionsAnchorEl(null);

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
        requestClientList(setRows, setLoading);
    }, []);

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
                <SearchBar />
            </div>
            <DataGrid
                className={dataGridStyle.datagrid}
                columns={columns}
                rows={rows}
                loading={loading}
                density={DensityTypes.Comfortable}
                onRowClick={onRowClick}
                pagination
            />
        </div>
    );
};

export default ClientList;
