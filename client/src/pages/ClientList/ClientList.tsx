import { useEffect, useState } from "react";
import {
    CellParams,
    CellValue,
    DataGrid,
    DensityTypes,
    RowsProp,
    ValueFormatterParams,
} from "@material-ui/data-grid";
import { useStyles } from "./ClientList.styles";
import { useStyles as useDataGridStyles } from "styles/DataGrid.styles";
import { MenuItem, Select, Typography } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import IOSSwitch from "components/IOSSwitch/IOSSwitch";
import SearchBar from "components/SearchBar/SearchBar";
import RiskChip from "components/RiskChip/RiskChip";
import { IRisk, RiskType, riskOptions } from "util/riskOptions";
import { SearchOption } from "./searchOptions";

const riskComparator = (v1: CellValue, v2: CellValue, params1: CellParams, params2: CellParams) => {
    const risk1: IRisk = Object(params1.value);
    const risk2: IRisk = Object(params2.value);
    return risk1.level - risk2.level;
};

const getColumns = () => {
    return [
        { field: "id", headerName: SearchOption.ID, flex: 0.5, renderCell: renderText },
        { field: "name", headerName: SearchOption.NAME, flex: 1, renderCell: renderText },
        { field: "zone", headerName: SearchOption.ZONE, flex: 1, renderCell: renderText },
        {
            field: "healthRisk",
            headerName: "Health",
            flex: 0.5,
            renderCell: renderBadge,
            sortComparator: riskComparator,
        },
        {
            field: "educationRisk",
            headerName: "Education",
            flex: 0.5,
            renderCell: renderBadge,
            sortComparator: riskComparator,
        },
        {
            field: "socialRisk",
            headerName: "Social",
            flex: 0.5,
            renderCell: renderBadge,
            sortComparator: riskComparator,
        },
    ];
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
            healthRisk: riskOptions[RiskType.MEDIUM],
            educationRisk: riskOptions[RiskType.HIGH],
            socialRisk: riskOptions[RiskType.HIGH],
        },
        {
            id: 2,
            name: "Eric",
            zone: "B",
            healthRisk: riskOptions[RiskType.LOW],
            educationRisk: riskOptions[RiskType.MEDIUM],
            socialRisk: riskOptions[RiskType.LOW],
        },
        {
            key: 3,
            id: 3,
            name: "Ethan",
            zone: "C",
            healthRisk: riskOptions[RiskType.HIGH],
            educationRisk: riskOptions[RiskType.HIGH],
            socialRisk: riskOptions[RiskType.MEDIUM],
        },
        {
            id: 4,
            name: "Ahmad Mahmood",
            zone: "Saudi Arabia",
            healthRisk: riskOptions[RiskType.CRITICAL],
            educationRisk: riskOptions[RiskType.CRITICAL],
            socialRisk: riskOptions[RiskType.CRITICAL],
        },
        {
            id: 5,
            name: "Sam",
            zone: "D",
            healthRisk: riskOptions[RiskType.HIGH],
            educationRisk: riskOptions[RiskType.LOW],
            socialRisk: riskOptions[RiskType.HIGH],
        },
        {
            key: 6,
            id: 6,
            name: "Henry",
            zone: "E",
            healthRisk: riskOptions[RiskType.LOW],
            educationRisk: riskOptions[RiskType.LOW],
            socialRisk: riskOptions[RiskType.MEDIUM],
        },
        {
            id: 7,
            name: "Griffin",
            zone: "E",
            healthRisk: riskOptions[RiskType.HIGH],
            educationRisk: riskOptions[RiskType.HIGH],
            socialRisk: riskOptions[RiskType.HIGH],
        },
        {
            id: 8,
            name: "Argus",
            zone: "A",
            healthRisk: riskOptions[RiskType.LOW],
            educationRisk: riskOptions[RiskType.HIGH],
            socialRisk: riskOptions[RiskType.MEDIUM],
        },
        {
            id: 9,
            name: "Roger",
            zone: "C",
            healthRisk: riskOptions[RiskType.MEDIUM],
            educationRisk: riskOptions[RiskType.HIGH],
            socialRisk: riskOptions[RiskType.HIGH],
        },
        {
            id: 10,
            name: "Roger-Surface",
            zone: "C",
            healthRisk: riskOptions[RiskType.MEDIUM],
            educationRisk: riskOptions[RiskType.HIGH],
            socialRisk: riskOptions[RiskType.LOW],
        },
    ];
    setRows(rows);
    setLoading(false);
};

const renderText = (params: ValueFormatterParams) => {
    return <Typography variant={"body2"}>{params.value}</Typography>;
};

const renderBadge = (params: ValueFormatterParams) => {
    const risk: IRisk = Object(params.value);
    return <RiskChip clickable risk={risk} />;
};

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

    const columns = getColumns();
    useEffect(() => {
        const initializeRows = async () => {
            await requestClientList(setRows, setLoading);
        };
        initializeRows();
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
