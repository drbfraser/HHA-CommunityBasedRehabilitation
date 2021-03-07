import { useStyles } from "./AdminList.styles";
import SearchBar from "components/SearchBar/SearchBar";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import { DataGrid, DensityTypes, RowsProp, GridOverlay } from "@material-ui/data-grid";
import { LinearProgress, IconButton, debounce, Typography, Select, MenuItem, Popover, Switch } from "@material-ui/core";
import { useDataGridStyles } from "styles/DataGrid.styles";
import { useSearchOptionsStyles } from "styles/SearchOptions.styles";
import { useHideColumnsStyles } from "styles/HideColumns.styles";
import { useRef, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllZones, IZone } from "util/cache";
import requestUserRows from "./requestUserRows";
import React from "react";
import { Cancel, MoreVert } from "@material-ui/icons";
import { SearchOption } from "./searchOptions";

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

const AdminList = () => {
    const styles = useStyles();
    const dataGridStyle = useDataGridStyles();
    const searchOptionsStyle = useSearchOptionsStyles();
    const hideColumnsStyle = useHideColumnsStyles();
    const history = useHistory();
    const [loading, setLoading] = useState<boolean>(true);
    const [isIdHidden, setIdHidden] = useState<boolean>(false);
    const [isNameHidden, setNameHidden] = useState<boolean>(false);
    const [isTypeHidden, setTypeHidden] = useState<boolean>(false);
    const [isStatusHidden, setStatusHidden] = useState<boolean>(false);
    // Will use "zones" once searching is implemented and remove next comment
    // eslint-disable-next-line
    const [zones, setZones] = useState<IZone[]>([]);
    const [rows, setRows] = useState<RowsProp>([]);
    const [optionsAnchorEl, setOptionsAnchorEl] = useState<Element | null>(null);

    const isOptionsOpen = Boolean(optionsAnchorEl);

    const onRowClick = (row: any) => {
        const user = row.row;
        history.push("/admin/view/" + user.id);
    };
    const onAddClick = () => history.push("/admin/new");
    const onOptionsClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
    setOptionsAnchorEl(event.currentTarget);
    const onOptionsClose = () => setOptionsAnchorEl(null);

    const columns = [
        { field: "id", headerName: "ID", flex: 0.55, hide: isIdHidden, hideFunction: setIdHidden },
        { field: "name", headerName: "Name", flex: 1, hide: isNameHidden, hideFunction: setNameHidden},
        { field: "type", headerName: "Type", flex: 1, hide: isTypeHidden, hideFunction: setTypeHidden },
        { field: "status", headerName: "Status", flex: 1, hide: isStatusHidden, hideFunction: setStatusHidden },
    ];

    const initialDataLoaded = useRef(false);

    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            setZones(await getAllZones());
            await requestUserRows(setRows, setLoading);
            setLoading(false);
            initialDataLoaded.current = true;
        };

        loadInitialData();
    }, []);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const requestUserRowsDebounced = useCallback(debounce(requestUserRows, 500), []);

    useEffect(() => {
        if (!initialDataLoaded.current) {
            return;
        }

        requestUserRowsDebounced(setRows, setLoading);
    }, [requestUserRowsDebounced]);

    return (
        <>
            <div className={styles.container}>
                <div className={styles.topContainer}>
                    <IconButton onClick={onAddClick} className={styles.icon}>
                        <PersonAddIcon />
                    </IconButton>
                    <div className={searchOptionsStyle.searchOptions}>
                        <Select
                            color={"primary"}
                            defaultValue={SearchOption.NAME}
                        >
                            {Object.values(SearchOption).map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </div>
                    <SearchBar />
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
                            {columns.map(
                                (column): JSX.Element => {
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
                                }
                            )}
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
                        rows={rows}
                        columns={columns}
                        density={DensityTypes.Comfortable}
                        onRowClick={onRowClick}
                        pagination
                    />
                </div>
            </div>
        </>
    );
};

export default AdminList;
