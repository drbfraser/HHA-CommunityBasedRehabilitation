import { zoneListStyles } from "./ZoneList.styles";
import { dataGridStyles } from "styles/DataGrid.styles";
import SearchBar from "components/SearchBar/SearchBar";

import AddLocationIcon from "@mui/icons-material/AddLocation";
import {
    DataGrid,
    GridDensityTypes,
    GridRowsProp,
    GridOverlay,
    GridRenderCellParams,
} from "@mui/x-data-grid";
import { LinearProgress, IconButton, Typography, Box } from "@mui/material";
import { useRef } from "react";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import reqeustZoneRows from "./reqeustZoneRows";
import React from "react";
import { Cancel } from "@mui/icons-material";
import { SearchOption } from "./searchOptions";

// import { IRouteParams } from "@cbr/common/forms/Zone/zoneFields";
const RenderText = (params: GridRenderCellParams) => {
    return <Typography variant={"body2"}>{String(params.value)}</Typography>; // todo: String() ok?
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
    return (
        <GridOverlay sx={dataGridStyles.noRows}>
            <Cancel color="primary" sx={dataGridStyles.noRowsIcon} />
            <Typography color="primary">No Zones Found</Typography>
        </GridOverlay>
    );
};

const ZoneList = () => {
    const [searchValue, setSearchValue] = useState<string>("");
    const [searchOption] = useState<string>(SearchOption.ZONE);
    const [loading, setLoading] = useState<boolean>(true);
    const [isZoneHidden, setZoneHidden] = useState<boolean>(false);
    const [filteredRows, setFilteredRows] = useState<GridRowsProp>([]); // todo: RowsProp -> GridRowsProp ok?
    const [serverRows, setServerRows] = useState<GridRowsProp>([]);
    const history = useHistory();
    const onZoneAddClick = () => history.push("/zone/new");
    // const { zone_name } = useRouteMatch<IRouteParams>().params;
    const adminColumns = [
        {
            field: "zone",
            headerName: "Zone",
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

        const filteredRows: GridRowsProp = serverRows.filter((r) => r.zone.startsWith(searchValue));
        setFilteredRows(filteredRows);
    }, [searchValue, searchOption, serverRows]);

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
                    sortModel={[
                        {
                            field: "zone",
                            sort: "asc",
                        },
                    ]}
                />
            </Box>
        </Box>
    );
};

export default ZoneList;
