import { useEffect, useState } from "react";
import {
    DataGrid,
    DensityTypes,
    RowsProp,
    ValueFormatterParams,
} from "@material-ui/data-grid";
import { useStyles } from "./ClientList.styles";
import { MenuItem, Select, Typography } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import IOSSwitch from "components/IOSSwitch/IOSSwitch";
import SearchBar from "components/SearchBar/SearchBar";
import RiskChip from "components/RiskChip/RiskChip";

const getColumns = () => {
    return([
        { field: "id", headerName: "ID", flex: 0.5 },
        { field: "name", headerName: "Name", flex: 1 },
        { field: "zone", headerName: "Zone", flex: 1 },
        { field: "healthRisk", headerName: "Health", flex: 0.5, renderCell: renderBadge },
        { field: "educationRisk", headerName: "Education", flex: 0.5, renderCell: renderBadge },
        { field: "socialRisk", headerName: "Social", flex: 0.5, renderCell: renderBadge },
    ]);
};

const requestClientList = async (setRows: Function, setLoading: Function) => {
    setLoading(true);

    // TODO: add API call to get client list here when its completed

    const rows = [
        {
            id: 1,
            name: "Ali",
            zone: "A",
            healthRisk: "medium",
            educationRisk: "high",
            socialRisk: "high",
        },
        {
            id: 2,
            name: "Eric",
            zone: "B",
            healthRisk: "low",
            educationRisk: "low",
            socialRisk: "high",
        },
        {
            id: 3,
            name: "Ethan",
            zone: "C",
            healthRisk: "high",
            educationRisk: "high",
            socialRisk: "medium",
        },
        {
            id: 4,
            name: "Ahmad Mahmood",
            zone: "Saudi Arabia",
            healthRisk: "critical",
            educationRisk: "critical",
            socialRisk: "critical",
        },
        {
            id: 5,
            name: "Sam",
            zone: "D",
            healthRisk: "low",
            educationRisk: "high",
            socialRisk: "high",
        },
        {
            id: 6,
            name: "Henry",
            zone: "E",
            healthRisk: "high",
            educationRisk: "medium",
            socialRisk: "medium",
        },
        {
            id: 7,
            name: "Griffin",
            zone: "E",
            healthRisk: "low",
            educationRisk: "high",
            socialRisk: "high",
        },
        {
            id: 8,
            name: "Argus",
            zone: "A",
            healthRisk: "high",
            educationRisk: "high",
            socialRisk: "medium",
        },
        {
            id: 9,
            name: "Roger",
            zone: "C",
            healthRisk: "medium",
            educationRisk: "low",
            socialRisk: "high",
        },
        {
            id: 10,
            name: "Roger-Surface",
            zone: "C",
            healthRisk: "medium",
            educationRisk: "high",
            socialRisk: "high",
        },
    ];
    setRows(rows);
    setLoading(false);
};

const renderBadge = (params: ValueFormatterParams) => {
    return <RiskChip clickable label={params.value} />;
};

const ClientList = () => {
    const [allClientsMode, setAllClientsMode] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchOption, setSearchOption] = useState<string>("ID");
    const [rows, setRows] = useState<RowsProp>([]);

    const styles = useStyles();
    const history = useHistory();
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
                        defaultValue={"ID"}
                        value={searchOption}
                        onChange={(event) => {
                            setSearchOption(String(event.target.value));
                        }}
                    >
                        <MenuItem value={"ID"}>ID</MenuItem>
                        <MenuItem value={"Name"}>Name</MenuItem>
                        <MenuItem value={"Zone"}>Zone</MenuItem>
                    </Select>
                </div>
                <SearchBar />
            </div>
            <DataGrid
                className={styles.datagrid}
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
