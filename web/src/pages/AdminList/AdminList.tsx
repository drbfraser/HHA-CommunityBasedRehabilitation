import { useStyles } from "./AdminList.styles";
import SearchBar from "components/SearchBar/SearchBar";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import {
    DataGrid,
    DensityTypes,
    RowsProp,
    GridOverlay,
    ValueFormatterParams,
} from "@material-ui/data-grid";
import { Tabs, Tab, Box } from "@mui/material";
import {
    LinearProgress,
    IconButton,
    Typography,
    Select,
    MenuItem,
    Popover,
    Switch,
} from "@material-ui/core";
import { useDataGridStyles } from "styles/DataGrid.styles";
import { useSearchOptionsStyles } from "styles/SearchOptions.styles";
import { useHideColumnsStyles } from "styles/HideColumns.styles";
import { useRef } from "react";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import requestUserRows from "./requestUserRows";
import React from "react";
import { Cancel, MoreVert } from "@material-ui/icons";
import { SearchOption } from "../ClientList/searchOptions";
import { useZones } from "@cbr/common/util/hooks/zones";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}
const RenderText = (params: ValueFormatterParams) => {
    return <Typography variant={"body2"}>{params.value}</Typography>;
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
            <Typography color="primary">No Users Found</Typography>
        </GridOverlay>
    );
};
function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

const AdminList = () => {
    const [searchValue, setSearchValue] = useState<string>("");
    const [searchOption, setSearchOption] = useState<string>(SearchOption.NAME);
    const [loading, setLoading] = useState<boolean>(true);
    const [isNameHidden, setNameHidden] = useState<boolean>(false);
    const [isRoleHidden, setRoleHidden] = useState<boolean>(false);
    const [isZoneHidden, setZoneHidden] = useState<boolean>(false);
    const [isStatusHidden, setStatusHidden] = useState<boolean>(false);
    const [isLastUpdatedDateHidden, setLastUpdatedDateHidden] = useState<boolean>(false);
    const [filteredRows, setFilteredRows] = useState<RowsProp>([]);
    const [serverRows, setServerRows] = useState<RowsProp>([]);
    const [optionsAnchorEl, setOptionsAnchorEl] = useState<Element | null>(null);
    const isOptionsOpen = Boolean(optionsAnchorEl);

    const zones = useZones();
    const styles = useStyles();
    const dataGridStyle = useDataGridStyles();
    const searchOptionsStyle = useSearchOptionsStyles();
    const hideColumnsStyle = useHideColumnsStyles();
    const history = useHistory();

    const onRowClick = (row: any) => {
        const user = row.row;
        history.push("/admin/view/" + user.id);
    };
    const onAdminAddClick = () => history.push("/admin/new");
    const onZoneAddClick = () => history.push("/admin/");
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
    ];

    const zoneColumns = [
        {
            field: "zone",
            headerName: "Zone",
            flex: 1,
            renderCell: RenderText,
            hide: isZoneHidden,
            hideFunction: setZoneHidden,
        },
        {
            field: "name",
            headerName: "Last Updated Date",
            flex: 1,
            renderCell: RenderText,
            hide: isLastUpdatedDateHidden,
            hideFunction: setLastUpdatedDateHidden,
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
            const filteredRows: RowsProp = serverRows.filter(
                (r) =>
                    r.name.toLowerCase().startsWith(searchValue) ||
                    r.last_name.toLowerCase().startsWith(searchValue)
            );
            setFilteredRows(filteredRows);
        } else if (searchOption === SearchOption.ZONE) {
            const filteredRows: RowsProp = serverRows.filter((r) => r.zone.startsWith(searchValue));
            setFilteredRows(filteredRows);
        }
    }, [searchValue, searchOption, serverRows]);
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    return (
        <div>
            <Box sx={{ width: "100%" }}>
                <Box sx={{ borderBottom: 1, borderColor: "divider", width: "100%" }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs">
                        <Tab label="Admins" {...a11yProps(0)} />
                        <Tab label="Zones" {...a11yProps(1)} />
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                    <div className={styles.container}>
                        <div className={styles.topContainer}>
                            <IconButton onClick={onAdminAddClick} className={styles.icon}>
                                <PersonAddIcon />
                            </IconButton>
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
                                        onChange={(event) =>
                                            setSearchValue(String(event.target.value))
                                        }
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
                                className={hideColumnsStyle.optionsButton}
                                onClick={onOptionsClick}
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
                                <div className={hideColumnsStyle.optionsContainer}>
                                    {adminColumns.map((column): JSX.Element => {
                                        return (
                                            <div
                                                key={column.field}
                                                className={hideColumnsStyle.optionsRow}
                                            >
                                                <Typography component={"span"} variant={"body2"}>
                                                    {column.headerName}
                                                </Typography>
                                                <Switch
                                                    checked={!column.hide}
                                                    onClick={() =>
                                                        column.hideFunction(!column.hide)
                                                    }
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </Popover>
                        </div>
                        <div className={styles.dataGridWrapper}>
                            <DataGrid
                                className={dataGridStyle.datagrid}
                                loading={loading}
                                components={{
                                    LoadingOverlay: RenderLoadingOverlay,
                                    NoRowsOverlay: RenderNoRowsOverlay,
                                }}
                                rows={filteredRows}
                                columns={adminColumns}
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
                        </div>
                    </div>
                </TabPanel>

                <TabPanel value={value} index={1}>
                    <div className={styles.container}>
                        <div className={styles.topContainer}>
                            <IconButton onClick={onZoneAddClick} className={styles.icon}>
                                <AddLocationAltIcon />
                            </IconButton>
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
                                        onChange={(event) =>
                                            setSearchValue(String(event.target.value))
                                        }
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
                                className={hideColumnsStyle.optionsButton}
                                onClick={onOptionsClick}
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
                                <div className={hideColumnsStyle.optionsContainer}>
                                    {zoneColumns.map((column): JSX.Element => {
                                        return (
                                            <div
                                                key={column.field}
                                                className={hideColumnsStyle.optionsRow}
                                            >
                                                <Typography component={"span"} variant={"body2"}>
                                                    {column.headerName}
                                                </Typography>
                                                <Switch
                                                    checked={!column.hide}
                                                    onClick={() =>
                                                        column.hideFunction(!column.hide)
                                                    }
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </Popover>
                        </div>
                        <div className={styles.dataGridWrapper}>
                            <DataGrid
                                className={dataGridStyle.datagrid}
                                loading={loading}
                                components={{
                                    LoadingOverlay: RenderLoadingOverlay,
                                    NoRowsOverlay: RenderNoRowsOverlay,
                                }}
                                rows={filteredRows}
                                columns={zoneColumns}
                                density={DensityTypes.Comfortable}
                                onRowClick={onRowClick}
                                pagination
                                sortModel={[
                                    {
                                        field: "zone",
                                        sort: "asc",
                                    },
                                ]}
                            />
                        </div>
                    </div>
                </TabPanel>
            </Box>
        </div>
    );
};

export default AdminList;
