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
import { compressedDataGridWidth, useStyles as useDataGridStyles } from "styles/DataGrid.styles";
import { MenuItem, Select, Typography } from "@material-ui/core";
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
import { FiberManualRecord } from "@material-ui/icons";

const riskComparator = (v1: CellValue, v2: CellValue, params1: CellParams, params2: CellParams) => {
    const risk1: IRisk = Object(params1.value);
    const risk2: IRisk = Object(params2.value);
    return risk1.level - risk2.level;
};

const renderRiskHeader = (params: ColParams): JSX.Element => {
    const riskCategory: IRiskCategory = riskCategories[params.field];

    return (
        <div>
            {window.innerWidth >= compressedDataGridWidth ? (
                <Typography variant={"body2"}>{params.field}</Typography>
            ) : (
                <riskCategory.Icon />
            )}
        </div>
    );
};

const renderText = (params: ValueFormatterParams) => {
    return <Typography variant={"body2"}>{params.value}</Typography>;
};

const renderBadge = (params: ValueFormatterParams) => {
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

const columns = [
    { field: "id", headerName: SearchOption.ID, flex: 0.5, renderCell: renderText },
    { field: "name", headerName: SearchOption.NAME, flex: 1, renderCell: renderText },
    { field: "zone", headerName: SearchOption.ZONE, flex: 1, renderCell: renderText },
    {
        field: RiskCategory.HEALTH,
        headerName: RiskCategory.HEALTH,
        flex: 0.5,
        renderHeader: renderRiskHeader,
        renderCell: renderBadge,
        sortComparator: riskComparator,
    },
    {
        field: RiskCategory.EDUCATION,
        headerName: RiskCategory.EDUCATION,
        flex: 0.5,
        renderHeader: renderRiskHeader,
        renderCell: renderBadge,
        sortComparator: riskComparator,
    },
    {
        field: RiskCategory.SOCIAL,
        headerName: RiskCategory.SOCIAL,
        flex: 0.5,
        renderHeader: renderRiskHeader,
        renderCell: renderBadge,
        sortComparator: riskComparator,
    },
];

const ClientList = () => {
    const [allClientsMode, setAllClientsMode] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchOption, setSearchOption] = useState<string>(SearchOption.ID);
    const [rows, setRows] = useState<RowsProp>([]);

    const styles = useStyles();
    const dataGridStyle = useDataGridStyles();
    const history = useHistory();

    // TODO: update path to be wherever client details will be
    const onRowClick = () => history.push("/clients/new");

    useEffect(() => {
        requestClientList(setRows, setLoading);
    }, []);

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
