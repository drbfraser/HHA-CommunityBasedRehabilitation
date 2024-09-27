import React, { useRef, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import { Cancel } from "@material-ui/icons";
import {
    DataGrid,
    DensityTypes,
    RowsProp,
    GridOverlay,
    ValueFormatterParams,
} from "@material-ui/data-grid";
import { LinearProgress, IconButton, Typography } from "@material-ui/core";

import { useStyles } from "./ZoneList.styles";
import { useDataGridStyles } from "styles/DataGrid.styles";
import SearchBar from "components/SearchBar/SearchBar";
import reqeustZoneRows from "./reqeustZoneRows";

const RenderText = (params: ValueFormatterParams) => (
    <Typography variant={"body2"}>{params.value}</Typography>
);
const RenderLoadingOverlay = () => (
    <GridOverlay>
        <div style={{ position: "absolute", top: 0, width: "100%" }}>
            <LinearProgress />
        </div>
    </GridOverlay>
);
const RenderNoRowsOverlay = () => {
    const styles = useDataGridStyles();
    return (
        <GridOverlay className={styles.noRows}>
            <Cancel color="primary" className={styles.noRowsIcon} />
            <Typography color="primary">No Zones Found</Typography>
        </GridOverlay>
    );
};

const ZoneList = () => {
    const [searchValue, setSearchValue] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [isZoneHidden, setZoneHidden] = useState<boolean>(false);
    const [filteredRows, setFilteredRows] = useState<RowsProp>([]);
    const [serverRows, setServerRows] = useState<RowsProp>([]);
    const styles = useStyles();
    const dataGridStyle = useDataGridStyles();
    const history = useHistory();
    const { t } = useTranslation();

    const onZoneAddClick = () => history.push("/zone/new");
    const adminColumns = [
        {
            field: "zone",
            headerName: t("admin.zone"),
            flex: 1,
            renderCell: RenderText,
            hide: isZoneHidden,
            hideFunction: setZoneHidden,
        },
    ];
    const onRowClick = (row: any) => {
        const zone = row.row;
        console.log(zone);
        history.push("/zone/edit/" + zone.id);
    };
    const initialDataLoaded = useRef(false);

    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            await reqeustZoneRows(setFilteredRows, setServerRows, setLoading);
            setLoading(false);
            initialDataLoaded.current = true;
        };
        loadInitialData();
    }, []);

    useEffect(() => {
        if (!initialDataLoaded.current) {
            return;
        }

        const filteredRows: RowsProp = serverRows.filter((r) => r.zone.startsWith(searchValue));
        setFilteredRows(filteredRows);
    }, [searchValue, serverRows]);

    return (
        <div className={styles.container}>
            <div className={styles.topContainer}>
                <IconButton onClick={onZoneAddClick} className={styles.icon}>
                    <AddLocationIcon />
                </IconButton>
                <SearchBar value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
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
                            field: "zone",
                            sort: "asc",
                        },
                    ]}
                />
            </div>
        </div>
    );
};

export default ZoneList;
