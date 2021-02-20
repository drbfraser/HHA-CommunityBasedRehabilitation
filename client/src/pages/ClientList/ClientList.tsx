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
import { MenuItem, Select, Typography } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import IOSSwitch from "components/IOSSwitch/IOSSwitch";
import SearchBar from "components/SearchBar/SearchBar";
import RiskChip from "components/RiskChip/RiskChip";
import {
    IRisk,
    riskCategories,
    RiskCategory,
    IRiskCategory,
} from "util/riskOptions";
import { SearchOption } from "./searchOptions";
import { FiberManualRecord } from "@material-ui/icons";
import { apiFetch, Endpoint } from "util/endpoints";

interface ResponseRows {
    id: number;
    first_name: string;
    last_name: string;
    zone: number;
    [RiskCategory.HEALTH]: string;
    [RiskCategory.SOCIAL]: string;
    [RiskCategory.EDUCATION]: string;
}

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

    const responseRows: ResponseRows[] = await(await apiFetch(Endpoint.CLIENTS)).json();
    const rows: RowsProp = responseRows.map((responseRow) => {
        return ({
            id: responseRow.id,
            name: responseRow.first_name + " " + responseRow.last_name,
            zone: responseRow.zone,
            [RiskCategory.HEALTH]: responseRow[RiskCategory.HEALTH],
            [RiskCategory.EDUCATION]: responseRow[RiskCategory.EDUCATION],
            [RiskCategory.SOCIAL]: responseRow[RiskCategory.SOCIAL],
        });
    });
    
    setRows(rows);
    setLoading(false);
};

const columns = [
    { field: "id", headerName: "ID", flex: 0.55, renderCell: RenderText },
    { field: "name", headerName: "Name", flex: 1, renderCell: RenderText },
    { field: "zone", headerName: "Zone", flex: 1, renderCell: RenderText },
    ...Object.entries(riskCategories).map(([value, { name }]) => ({
        field: value,
        headerName: name,
        flex: 0.7,
        renderHeader: RenderRiskHeader,
        renderCell: RenderBadge,
        sortComparator: riskComparator,
    })),
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
