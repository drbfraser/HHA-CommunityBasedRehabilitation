import React, { useCallback, useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { CSVLink } from "react-csv";
import { useHistory } from "react-router-dom";
import { LinearProgress, Typography, debounce, Button, Box } from "@mui/material";
import {
    GridColumnHeaderParams,
    DataGrid,
    GridDensityTypes,
    GridOverlay,
    GridRowParams,
    GridRowsProp,
    GridSortCellParams,
    GridRenderCellParams,
} from "@mui/x-data-grid";
import { Cancel, FiberManualRecord } from "@mui/icons-material";

import { RiskLevel, riskLevels, RiskType } from "@cbr/common/util/risks";
import { SearchOption } from "@cbr/common/util/searchOptions";
import RiskLevelChip from "components/RiskLevelChip/RiskLevelChip";
import { getTranslatedRiskName, IRiskType, riskTypes } from "util/risks";
import requestClientRows from "./requestClientRows";
import { compressedDataGridWidth, dataGridStyles } from "styles/DataGrid.styles";
import { clientListStyles } from "./ClientList.styles";
import Toolbar from "./components/Toolbar";

// manually define this type, as GridCellValue deprecated in MUI 5
type GridCellValue = string | number | boolean | object | Date | null | undefined;

const RenderRiskHeader = (params: GridColumnHeaderParams): JSX.Element => {
    const { t } = useTranslation();
    const riskType: IRiskType = riskTypes[params.field];

    return (
        <div className="MuiDataGrid-colCellTitle">
            {window.innerWidth >= compressedDataGridWidth ? (
                getTranslatedRiskName(t, params.field as RiskType)
            ) : (
                <riskType.Icon />
            )}
        </div>
    );
};

const RenderText = (params: GridRenderCellParams) => {
    return (
        <Typography
            variant={"body2"}
            color={params.row.is_active ? "textPrimary" : "textSecondary"}
        >
            {String(params.value)}
        </Typography>
    );
};

const RenderBadge = (params: GridRenderCellParams) => {
    const risk: RiskLevel = Object(params.value);

    return window.innerWidth >= compressedDataGridWidth ? (
        <RiskLevelChip clickable risk={risk} />
    ) : (
        <FiberManualRecord style={{ color: riskLevels[risk].color }} />
    );
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
    const { t } = useTranslation();

    return (
        <GridOverlay sx={dataGridStyles.noRows}>
            <Cancel color="primary" sx={dataGridStyles.noRowsIcon} />
            <Typography color="primary">{t("dashboard.noClients")}</Typography>
        </GridOverlay>
    );
};

const ClientList = () => {
    const [allClientsMode, setAllClientsMode] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(true);
    const [isNameHidden, setNameHidden] = useState<boolean>(false);
    const [isZoneHidden, setZoneHidden] = useState<boolean>(false);
    const [isHealthHidden, setHealthHidden] = useState<boolean>(false);
    const [isEducationHidden, setEducationHidden] = useState<boolean>(false);
    const [isSocialHidden, setSocialHidden] = useState<boolean>(false);
    const [isNutritionHidden, setNutritionHidden] = useState<boolean>(false);
    const [isMentalHidden, setMentalHidden] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState<string>("");
    const [searchOption, setSearchOption] = useState<string>(SearchOption.NAME);
    const [rows, setRows] = useState<GridRowsProp>([]);
    const [archivedMode, setArchivedMode] = useState<boolean>(false);

    const history = useHistory();
    const { t } = useTranslation();

    const initialDataLoaded = useRef(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const requestClientRowsDebounced = useCallback(debounce(requestClientRows, 500), []);
    useEffect(() => {
        if (!initialDataLoaded.current) {
            return;
        }

        requestClientRowsDebounced(
            setRows,
            setLoading,
            searchValue,
            searchOption,
            allClientsMode,
            archivedMode
        );
    }, [searchValue, searchOption, allClientsMode, archivedMode, requestClientRowsDebounced]);

    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            await requestClientRows(setRows, setLoading, "", "", true, false);
            setLoading(false);
            initialDataLoaded.current = true;
        };

        loadInitialData();
    }, []);

    const onRowClick = (rowParams: GridRowParams) => history.push(`/client/${rowParams.row.id}`);

    const riskColumnStates: {
        [key: string]: { hide: boolean; hideFunction: (isHidden: boolean) => void };
    } = {
        [RiskType.HEALTH]: {
            hide: isHealthHidden,
            hideFunction: setHealthHidden,
        },
        [RiskType.EDUCATION]: {
            hide: isEducationHidden,
            hideFunction: setEducationHidden,
        },
        [RiskType.SOCIAL]: {
            hide: isSocialHidden,
            hideFunction: setSocialHidden,
        },
        [RiskType.NUTRITION]: {
            hide: isNutritionHidden,
            hideFunction: setNutritionHidden,
        },
        [RiskType.MENTAL]: {
            hide: isMentalHidden,
            hideFunction: setMentalHidden,
        },
    };

    const sortClientsById = (rows: GridRowsProp) => {
        // let sortById: GridRowsProp = rows.slice(0);

        // sortById.sort((a: any, b: any) => {
        //     return a.id - b.id;
        // });

        let sortById = rows.slice(0); // todosd: re-add type?

        sortById.sort((a: any, b: any) => {
            return a.id - b.id;
        });

        return sortById;
    };

    const columns = [
        {
            field: "name",
            headerName: t("general.name"),
            flex: 1,
            renderCell: RenderText,
            hide: isNameHidden,
            hideFunction: setNameHidden,
        },
        {
            field: "zone",
            headerName: t("general.zone"),
            flex: 1,
            renderCell: RenderText,
            hide: isZoneHidden,
            hideFunction: setZoneHidden,
        },
        ...Object.entries(riskTypes).map(([value]) => ({
            field: value,
            headerName: getTranslatedRiskName(t, value as RiskType),
            flex: 0.7,
            renderHeader: RenderRiskHeader,
            renderCell: RenderBadge,
            sortComparator: (
                _v1: GridCellValue,
                _v2: GridCellValue,
                params1: GridSortCellParams,
                params2: GridSortCellParams
            ) => {
                return (
                    riskLevels[String(params1.value)].level -
                    riskLevels[String(params2.value)].level
                );
            },
            hide: riskColumnStates[value].hide,
            hideFunction: riskColumnStates[value].hideFunction,
        })),
    ];

    return (
        <Box sx={clientListStyles.root}>
            <Toolbar
                allClientsMode={allClientsMode}
                archivedMode={archivedMode}
                searchValue={searchValue}
                searchOption={searchOption}
                columns={columns}
                onClientModeChange={setAllClientsMode}
                onArchivedModeChange={setArchivedMode}
                onSearchValueChange={setSearchValue}
                onSearchOptionChange={setSearchOption}
            />

            <DataGrid
                sx={dataGridStyles.datagrid}
                columns={columns}
                rows={rows}
                loading={loading}
                components={{
                    LoadingOverlay: RenderLoadingOverlay,
                    NoRowsOverlay: RenderNoRowsOverlay,
                }}
                density={GridDensityTypes.Comfortable}
                onRowClick={onRowClick}
                pagination
            />

            <Box sx={clientListStyles.downloadSVC}>
                <CSVLink
                    filename="ClientList.csv"
                    data={sortClientsById(rows)}
                    style={{ textDecoration: "none" }}
                >
                    <Button variant="outlined" size="small">
                        {t("dashboard.csvExport")}
                    </Button>
                </CSVLink>
            </Box>
        </Box>
    );
};

export default ClientList;
