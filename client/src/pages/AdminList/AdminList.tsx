import { useStyles } from "./AdminList.styles";
import SearchBar from "components/SearchBar/SearchBar";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import { DataGrid, ColDef, DensityTypes, RowsProp, GridOverlay } from "@material-ui/data-grid";
import { LinearProgress, IconButton, debounce, Typography } from "@material-ui/core";
import { useDataGridStyles } from "styles/DataGrid.styles";
import { useRef, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllZones, IZone } from "util/cache";
import requestUserRows from "./requestUserRows";
import React from "react";
import { Cancel } from "@material-ui/icons";

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

const columns: ColDef[] = [
    { field: "id", headerName: "ID", flex: 0.55 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "type", headerName: "Type", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
];

const AdminList = () => {
    const styles = useStyles();
    const dataGridStyle = useDataGridStyles();
    const history = useHistory();
    const [loading, setLoading] = useState<boolean>(true);
    // Will use "zones" once searching is implemented and remove next comment
    // eslint-disable-next-line
    const [zones, setZones] = useState<IZone[]>([]);
    const [rows, setRows] = useState<RowsProp>([]);

    const onRowClick = (row: any) => {
        const user = row.row;
        history.push("/admin/view/" + user.id);
    };
    const onAddClick = () => history.push("/admin/new");

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
                    <SearchBar />
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
