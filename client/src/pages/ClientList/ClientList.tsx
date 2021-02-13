import { useEffect, useState } from "react";
import { DataGrid, DensityTypes, RowsProp, ValueFormatterParams } from "@material-ui/data-grid";
import { useStyles } from "./ClientList.styles";
import { useStyles as useDataGridStyles } from "styles/DataGrid.styles";
import { MenuItem, Select, Typography } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import IOSSwitch from "components/IOSSwitch/IOSSwitch";
import SearchBar from "components/SearchBar/SearchBar";
import RiskChip from "components/RiskChip/RiskChip";
import { criticalRisk, highRisk, mediumRisk, lowRisk, Risk } from "util/riskOptions";
import { ID, NAME, ZONE, searchOptions } from "./searchOptions";

const getColumns = () => {
    return [
        { field: "id", headerName: ID, flex: 0.5, renderCell: renderText },
        { field: "name", headerName: NAME, flex: 1, renderCell: renderText },
        { field: "zone", headerName: ZONE, flex: 1, renderCell: renderText },
        { field: "healthRisk", headerName: "Health", flex: 0.5, renderCell: renderBadge },
        { field: "educationRisk", headerName: "Education", flex: 0.5, renderCell: renderBadge },
        { field: "socialRisk", headerName: "Social", flex: 0.5, renderCell: renderBadge },
    ];
};

const requestClientList = async (setRows: Function, setLoading: Function) => {
    setLoading(true);

    // TODO: add API call to get client list here when its completed

    const rows = [
        {
            id: 1,
            name: "Ali",
            zone: "A",
            healthRisk: mediumRisk,
            educationRisk: highRisk,
            socialRisk: highRisk,
        },
        {
            id: 2,
            name: "Eric",
            zone: "B",
            healthRisk: lowRisk,
            educationRisk: lowRisk,
            socialRisk: highRisk,
        },
        {
            id: 3,
            name: "Ethan",
            zone: "C",
            healthRisk: highRisk,
            educationRisk: highRisk,
            socialRisk: mediumRisk,
        },
        {
            id: 4,
            name: "Ahmad Mahmood",
            zone: "Saudi Arabia",
            healthRisk: criticalRisk,
            educationRisk: criticalRisk,
            socialRisk: criticalRisk,
        },
        {
            id: 5,
            name: "Sam",
            zone: "D",
            healthRisk: lowRisk,
            educationRisk: highRisk,
            socialRisk: highRisk,
        },
        {
            id: 6,
            name: "Henry",
            zone: "E",
            healthRisk: highRisk,
            educationRisk: mediumRisk,
            socialRisk: mediumRisk,
        },
        {
            id: 7,
            name: "Griffin",
            zone: "E",
            healthRisk: lowRisk,
            educationRisk: highRisk,
            socialRisk: highRisk,
        },
        {
            id: 8,
            name: "Argus",
            zone: "A",
            healthRisk: highRisk,
            educationRisk: highRisk,
            socialRisk: mediumRisk,
        },
        {
            id: 9,
            name: "Roger",
            zone: "C",
            healthRisk: mediumRisk,
            educationRisk: lowRisk,
            socialRisk: highRisk,
        },
        {
            id: 10,
            name: "Roger-Surface",
            zone: "C",
            healthRisk: mediumRisk,
            educationRisk: highRisk,
            socialRisk: highRisk,
        },
    ];
    setRows(rows);
    setLoading(false);
};

const renderText = (params: ValueFormatterParams) => {
    return <Typography variant={"body2"}>{params.value}</Typography>;
};

const renderBadge = (params: ValueFormatterParams) => {
    const risk: Risk = Object(params.value);
    return <RiskChip clickable risk={risk} />;
};

const ClientList = () => {
    const [allClientsMode, setAllClientsMode] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchOption, setSearchOption] = useState<string>("ID");
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
                        defaultValue={ID}
                        value={searchOption}
                        onChange={(event) => {
                            setSearchOption(String(event.target.value));
                        }}
                    >
                        {searchOptions.map((searchOption) => (
                            <MenuItem value={searchOption}>{searchOption}</MenuItem>
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
