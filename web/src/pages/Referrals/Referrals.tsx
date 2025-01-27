import React  from "react";
import { useTranslation } from "react-i18next";
// import { CSVLink } from "react-csv";
// import { LinearProgress, Typography, debounce, Button, Box } from "@mui/material";
// import {
//     GridColumnHeaderParams,
//     DataGrid,
//     GridDensityTypes,
//     GridOverlay,
//     GridRowParams,
//     GridRowsProp,
//     GridSortCellParams,
//     GridRenderCellParams,
// } from "@mui/x-data-grid";
// import { Cancel, FiberManualRecord } from "@mui/icons-material";
// import { clientListStyles } from "./Referrals.styles";

// manually define this type, as GridCellValue deprecated in MUI 5
// type GridCellValue = string | number | boolean | object | Date | null | undefined;

// const RenderRiskHeader = (params: GridColumnHeaderParams): JSX.Element => {
//     const { t } = useTranslation();
//     const riskType: IRiskType = riskTypes[params.field];

//     return (
//         <div className="MuiDataGrid-colCellTitle">
//             {window.innerWidth >= compressedDataGridWidth ? (
//                 getTranslatedRiskName(t, params.field as RiskType)
//             ) : (
//                 <riskType.Icon />
//             )}
//         </div>
//     );
// };

// const RenderText = (params: GridRenderCellParams) => {
//     return (
//         <Typography
//             variant={"body2"}
//             color={params.row.is_active ? "textPrimary" : "textSecondary"}
//         >
//             {String(params.value)}
//         </Typography>
//     );
// };

// const RenderBadge = (params: GridRenderCellParams) => {
//     const risk: RiskLevel = Object(params.value);

//     return window.innerWidth >= compressedDataGridWidth ? (
//         <RiskLevelChip clickable risk={risk} />
//     ) : (
//         <FiberManualRecord style={{ color: riskLevels[risk].color }} />
//     );
// };

// const RenderLoadingOverlay = () => {
//     return (
//         <GridOverlay>
//             <div style={{ position: "absolute", top: 0, width: "100%" }}>
//                 <LinearProgress />
//             </div>
//         </GridOverlay>
//     );
// };

// const RenderNoRowsOverlay = () => {
//     const { t } = useTranslation();

//     return (
//         <GridOverlay sx={dataGridStyles.noRows}>
//             <Cancel color="primary" sx={dataGridStyles.noRowsIcon} />
//             <Typography color="primary">{t("dashboard.noClients")}</Typography>
//         </GridOverlay>
//     );
// };

const ClientList = () => {
    // const [loading, setLoading] = useState<boolean>(true);

    const { t } = useTranslation();

    // const initialDataLoaded = useRef(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    // const requestClientRowsDebounced = useCallback(debounce(requestClientRows, 500), []);
    // useEffect(() => {
    //     if (!initialDataLoaded.current) {
    //         return;
    //     }

    //     requestClientRowsDebounced(
    //         setRows,
    //         setLoading,
    //         searchValue,
    //         searchOption,
    //         allClientsMode,
    //         archivedMode
    //     );
    // }, [searchValue, searchOption, allClientsMode, archivedMode, requestClientRowsDebounced]);

    // useEffect(() => {
    //     const loadInitialData = async () => {
    //         setLoading(true);
    //         await requestClientRows(setRows, setLoading, "", "", true, false);
    //         setLoading(false);
    //         initialDataLoaded.current = true;
    //     };

    //     loadInitialData();
    // }, []);

    // const onRowClick = (rowParams: GridRowParams) => history.push(`/client/${rowParams.row.id}`);

    // const riskColumnStates: {
    //     [key: string]: { hide: boolean; hideFunction: (isHidden: boolean) => void };
    // } = {
    //     [RiskType.HEALTH]: {
    //         hide: isHealthHidden,
    //         hideFunction: setHealthHidden,
    //     },
    //     [RiskType.EDUCATION]: {
    //         hide: isEducationHidden,
    //         hideFunction: setEducationHidden,
    //     },
    //     [RiskType.SOCIAL]: {
    //         hide: isSocialHidden,
    //         hideFunction: setSocialHidden,
    //     },
    //     [RiskType.NUTRITION]: {
    //         hide: isNutritionHidden,
    //         hideFunction: setNutritionHidden,
    //     },
    //     [RiskType.MENTAL]: {
    //         hide: isMentalHidden,
    //         hideFunction: setMentalHidden,
    //     },
    // };

    // const sortClientsById = (rows: GridRowsProp) => {
    //     let sortById = rows.slice(0);

    //     sortById.sort((a: any, b: any) => {
    //         return a.id - b.id;
    //     });

    //     return sortById;
    // };

    // const columns = [
    //     {
    //         field: "name",
    //         headerName: t("general.name"),
    //         flex: 1,
    //         renderCell: RenderText,
    //         hide: isNameHidden,
    //         hideFunction: setNameHidden,
    //     },
    //     {
    //         field: "zone",
    //         headerName: t("general.zone"),
    //         flex: 1,
    //         renderCell: RenderText,
    //         hide: isZoneHidden,
    //         hideFunction: setZoneHidden,
    //     },
    //     ...Object.entries(riskTypes).map(([value]) => ({
    //         field: value,
    //         headerName: getTranslatedRiskName(t, value as RiskType),
    //         flex: 0.7,
    //         renderHeader: RenderRiskHeader,
    //         renderCell: RenderBadge,
    //         sortComparator: (
    //             _v1: GridCellValue,
    //             _v2: GridCellValue,
    //             params1: GridSortCellParams,
    //             params2: GridSortCellParams
    //         ) => {
    //             return (
    //                 riskLevels[String(params1.value)].level -
    //                 riskLevels[String(params2.value)].level
    //             );
    //         },
    //         hide: riskColumnStates[value].hide,
    //         hideFunction: riskColumnStates[value].hideFunction,
    //     })),
    // ];
    
    return <p>{t('login.test')}</p>
    // return (
    //     <Box sx={clientListStyles.root}>
    //         <Toolbar
    //             allClientsMode={allClientsMode}
    //             archivedMode={archivedMode}
    //             searchValue={searchValue}
    //             searchOption={searchOption}
    //             columns={columns}
    //             onClientModeChange={setAllClientsMode}
    //             onArchivedModeChange={setArchivedMode}
    //             onSearchValueChange={setSearchValue}
    //             onSearchOptionChange={setSearchOption}
    //         />

    //         <DataGrid
    //             sx={dataGridStyles.datagrid}
    //             columns={columns}
    //             rows={rows}
    //             loading={loading}
    //             components={{
    //                 LoadingOverlay: RenderLoadingOverlay,
    //                 NoRowsOverlay: RenderNoRowsOverlay,
    //             }}
    //             density={GridDensityTypes.Comfortable}
    //             onRowClick={onRowClick}
    //             pagination
    //             initialState={{
    //                 sorting: {
    //                     sortModel: [
    //                         {
    //                             field: "name",
    //                             sort: "asc",
    //                         },
    //                     ],
    //                 },
    //             }}
    //         />

    //         <Box sx={clientListStyles.downloadSVC}>
    //             <CSVLink
    //                 filename="ClientList.csv"
    //                 data={sortClientsById(rows)}
    //                 style={{ textDecoration: "none" }}
    //             >
    //                 <Button variant="outlined" size="small">
    //                     {t("dashboard.csvExport")}
    //                 </Button>
    //             </CSVLink>
    //         </Box>
    //     </Box>
    // );
};

export default ClientList;
