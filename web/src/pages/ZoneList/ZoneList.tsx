import React, { useRef, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import { Cancel } from "@mui/icons-material";
import {
    DataGrid,
    GridDensityTypes,
    GridRowsProp,
    GridOverlay,
    GridRenderCellParams,
} from "@mui/x-data-grid";
import { Box, IconButton, LinearProgress, Typography } from "@mui/material";

import { zoneListStyles } from "./ZoneList.styles";
import { dataGridStyles } from "styles/DataGrid.styles";
import SearchBar from "components/SearchBar/SearchBar";
import requestZoneRows from "./requestZoneRows";

const RenderText = (params: GridRenderCellParams) => {
    return <Typography variant={"body2"}>{params.value}</Typography>;
};
const RenderLoadingOverlay = () => (
    <GridOverlay>
        <div style={{ position: "absolute", top: 0, width: "100%" }}>
            <LinearProgress />
        </div>
    </GridOverlay>
);
const RenderNoRowsOverlay = () => {
    return (
        <GridOverlay sx={dataGridStyles.noRows}>
            <Cancel color="primary" sx={dataGridStyles.noRowsIcon} />
            <Typography color="primary">No Zones Found</Typography>
        </GridOverlay>
    );
};

const ZoneList = () => {
    const [searchValue, setSearchValue] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [isZoneHidden, setZoneHidden] = useState<boolean>(false);
    const [filteredRows, setFilteredRows] = useState<GridRowsProp>([]);
    const [serverRows, setServerRows] = useState<GridRowsProp>([]);
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
            await requestZoneRows(setFilteredRows, setServerRows, setLoading);
            setLoading(false);
            initialDataLoaded.current = true;
        };
        loadInitialData();
    }, []);

    useEffect(() => {
        if (!initialDataLoaded.current) {
            return;
        }

        const filteredRows: GridRowsProp = serverRows.filter((r) => r.zone.startsWith(searchValue));
        setFilteredRows(filteredRows);
    }, [searchValue, serverRows]);

    return (
        <Box sx={zoneListStyles.container}>
            <Box sx={zoneListStyles.topContainer}>
                <IconButton onClick={onZoneAddClick} sx={zoneListStyles.icon} size="large">
                    <AddLocationIcon />
                </IconButton>
                <SearchBar value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
            </Box>
            <Box sx={zoneListStyles.dataGridWrapper}>
                <DataGrid
                    sx={dataGridStyles.datagrid}
                    loading={loading}
                    components={{
                        LoadingOverlay: RenderLoadingOverlay,
                        NoRowsOverlay: RenderNoRowsOverlay,
                    }}
                    rows={filteredRows}
                    columns={adminColumns}
                    density={GridDensityTypes.Comfortable}
                    onRowClick={onRowClick}
                    pagination
                    initialState={{
                        sorting: {
                            sortModel: [
                                {
                                    field: "zone",
                                    sort: "asc",
                                },
                            ],
                        },
                    }}
                />
            </Box>
        </Box>
    );
};

export default ZoneList;
