import React, { useCallback, useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { CSVLink } from "react-csv";
import { useHistory } from "react-router-dom";
import { LinearProgress, Typography, debounce, Button } from "@material-ui/core";
import {
    CellParams,
    CellValue,
    ColParams,
    DataGrid,
    DensityTypes,
    GridOverlay,
    RowParams,
    RowsProp,
    ValueFormatterParams,
} from "@material-ui/data-grid";
import { Cancel, FiberManualRecord } from "@material-ui/icons";

import { RiskLevel, riskLevels, RiskType } from "@cbr/common/util/risks";
import { SearchOption } from "@cbr/common/util/searchOptions";
import RiskLevelChip from "components/RiskLevelChip/RiskLevelChip";
import { getTranslatedRiskName, IRiskType, riskTypes } from "util/risks";
import requestClientRows from "./requestClientRows";
import { compressedDataGridWidth, useDataGridStyles } from "styles/DataGrid.styles";
import { useStyles } from "./ClientList.styles";
import Toolbar from "./components/Toolbar";

const RenderRiskHeader = (params: ColParams): JSX.Element => {
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

const RenderText = (params: ValueFormatterParams) => {
    return (
        <Typography
            variant={"body2"}
            color={params.row.is_active ? "textPrimary" : "textSecondary"}
        >
            {params.value}
        </Typography>
    );
};

const RenderBadge = (params: ValueFormatterParams) => {
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
    const styles = useDataGridStyles();

    return (
        <GridOverlay className={styles.noRows}>
            <Cancel color="primary" className={styles.noRowsIcon} />
            <Typography color="primary">No Clients Found</Typography>
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
    const [rows, setRows] = useState<RowsProp>([]);
    const [archivedMode, setArchivedMode] = useState<boolean>(false);

    const styles = useStyles();
    const dataGridStyle = useDataGridStyles();
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

    const onRowClick = (rowParams: RowParams) => history.push(`/client/${rowParams.row.id}`);

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

    const sortClientsById = (rows: RowsProp) => {
        let sortById: RowsProp = rows.slice(0);

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
                _v1: CellValue,
                _v2: CellValue,
                params1: CellParams,
                params2: CellParams
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
        <div className={styles.root}>
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
                className={dataGridStyle.datagrid}
                columns={columns}
                rows={rows}
                loading={loading}
                components={{
                    LoadingOverlay: RenderLoadingOverlay,
                    NoRowsOverlay: RenderNoRowsOverlay,
                }}
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

            <div className={styles.downloadSVC}>
                <CSVLink
                    filename="ClientList.csv"
                    data={sortClientsById(rows)}
                    className={styles.downloadSVCLink}
                >
                    <Button variant="outlined" size="small">
                        EXPORT TO CSV{" "}
                    </Button>
                </CSVLink>
            </div>
        </div>
    );
};

export default ClientList;
