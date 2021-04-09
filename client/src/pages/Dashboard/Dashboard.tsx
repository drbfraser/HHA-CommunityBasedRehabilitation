import React, { useEffect, useState } from "react";
import { Card, CardContent, Grid, Typography } from "@material-ui/core";
import { useDataGridStyles } from "styles/DataGrid.styles";
import { useHistory } from "react-router-dom";

import { RiskLevel, IRiskLevel, riskLevels, IRiskType, riskTypes } from "util/risks";
import { Cancel, FiberManualRecord } from "@material-ui/icons";
import { clientPrioritySort, IClientSummary } from "util/clients";
import { apiFetch, Endpoint } from "util/endpoints";
import { getZones } from "util/hooks/zones";
import { timestampToDate } from "util/dates";

import { Alert } from "@material-ui/lab";
import {
    DataGrid,
    ColParams,
    CellValue,
    CellParams,
    RowParams,
    DensityTypes,
    ValueFormatterParams,
    GridOverlay,
} from "@material-ui/data-grid";
import { RenderNoRowsOverlay, RenderText } from "util/datagrid";


const dummyReferrals = [
    {
        id: 1,
        type: "Wheelchair",
        name: "Referral Client 1",
        zone: "Palorinya Zone 2",
        lastReferral: "03-27-2021",
    },
    {
        id: 2,
        type: "Orthotics",
        zone: "Palorinya Zone 2",
        name: "Referral Client 2",
        lastReferral: "03-27-2021",
    },
    {
        id: 3,
        type: "Prosthetic",
        zone: "Palorinya Zone 2",
        name: "Referral Client 3",
        lastReferral: "03-27-2021",
    },
    {
        id: 4,
        type: "Physiotherapy",
        zone: "Palorinya Zone 2",
        name: "Referral Client 4",
        lastReferral: "03-27-2021",
    },
    {
        id: 5,
        type: "Prosthetic",
        zone: "Palorinya Zone 2",
        name: "Referral Client 5",
        lastReferral: "03-27-2021",
    },
];

// TODO: Connecting API endpoints

const Dashboard = () => {
    const dataGridStyle = useDataGridStyles();
    const history = useHistory();

    const [clients, setClients] = useState<IClientSummary[]>([]);
    const [referrals, setReferrals] = useState<any>([]);
    const [zoneMap, setZoneMap] = useState<Map<Number, String>>();
    const [isPriorityClientsLoading, setPriorityClientsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchClients = async () => {
            await apiFetch(Endpoint.CLIENTS)
                .then((resp) => resp.json())
                .then((clients) => setClients(clients.sort(clientPrioritySort)))
                .then(() => setPriorityClientsLoading(false))
                .catch((err) => alert(err));
        };
        const fetchZones = async () => {
            setZoneMap(await getZones());
        };
        const fetchReferrals = async () => {
            await apiFetch(Endpoint.REFERRALS_OUTSTANDING)
                .then((resp) => resp.json())
                .then((referrals) => setReferrals(referrals))
                .catch((err)=> alert(err));
        }

        fetchClients();
        fetchZones();
        fetchReferrals();

    }, []);

    const RenderBadge = (params: ValueFormatterParams) => {
        const risk: RiskLevel = Object(params.value);
        return <FiberManualRecord style={{ color: riskLevels[risk].color }} />;
    };

    const riskComparator = (
        v1: CellValue,
        v2: CellValue,
        params1: CellParams,
        params2: CellParams
    ) => {
        const risk1: IRiskLevel = riskLevels[String(params1.value)];
        const risk2: IRiskLevel = riskLevels[String(params2.value)];
        return risk1.level - risk2.level;
    };

    const RenderRiskHeader = (params: ColParams): JSX.Element => {
        const riskType: IRiskType = riskTypes[params.field];

        return (
            <div className="MuiDataGrid-colCellTitle">
                <riskType.Icon />
            </div>
        );
    };

    const RenderText = (params: ValueFormatterParams) => {
        return <Typography variant={"body2"}>{params.value}</Typography>;
    };

    const RenderNoPriorityClientsOverlay = () => {
        return (
            <GridOverlay className={dataGridStyle.noRows}>
                <Cancel color="primary" className={dataGridStyle.noRowsIcon} />
                <Typography color="primary">No Priority Clients Found</Typography>
            </GridOverlay>
        );
    };

    const RenderNoOutstandingReferralsOverlay = () => {
        return (
            <GridOverlay className={dataGridStyle.noRows}>
                <Cancel color="primary" className={dataGridStyle.noRowsIcon} />
                <Typography color="primary">No Outstanding Referrals Found</Typography>
            </GridOverlay>
        );
    };

    const RenderDate = (params: ValueFormatterParams) => {
        return <Typography variant={"body2"}>{timestampToDate(Number(params.value))}</Typography>;
      };
      
    const RenderZone = (params: ValueFormatterParams) => {
        return (
            <Typography variant={"body2"}>
                {zoneMap ? zoneMap.get(Number(params.value)) : ""}
            </Typography>
        );
    };
    
    const handleRowClick = (rowParams: RowParams) => history.push(`/client/${rowParams.row.id}`);

    const priorityClientsColumns = [
        {
            field: "full_name",
            headerName: "Name",
            flex: 1,
            renderCell: RenderText,
        },
        ...Object.entries(riskTypes).map(([value, { name }]) => ({
            field: value,
            headerName: name,
            renderHeader: RenderRiskHeader,
            renderCell: RenderBadge,
            sortComparator: riskComparator,
            flex: 0.7,
        })),
        {
            field: "zone",
            headerName: "Zone",
            flex: 1.2,
            renderCell: RenderZone,
        },
        {
            field: "last_visit_date",
            headerName: "Last Visit",
            renderCell: RenderDate,
            flex: 1,
        },
    ];

    const outstandingReferralsColumns = [
        {
            field: "full_name",
            headerName: "Name",
            flex: 0.7,
            renderCell: RenderText,
        },
        {
            field: "type",
            headerName: "Type",
            flex: 1,
            renderCell: RenderText,
        },
        // {
        //     field: "zone",
        //     headerName: "Zone",
        //     flex: 1,
        //     renderCell: RenderText,
        // },
        {
            field: "date_referred",
            headerName: "Last Referral",
            flex: 1,
            renderCell: RenderText,
        },
    ];

    return (
        <>
            <Alert severity="info">
                <Typography variant="body1">You have 0 new messages from an admin.</Typography>
            </Alert>
            <br />
            <Grid container direction="row" spacing={1}>
                <Grid item lg={6} md={12} xs={12}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h6" component="h2">
                                Priority Clients
                            </Typography>
                            <br />
                            <div className={dataGridStyle.dashboardTables}>
                                <DataGrid
                                    className={`${dataGridStyle.datagrid}`}
                                    rows={clients}
                                    // hideFooterPagination
                                    loading={isPriorityClientsLoading}
                                    columns={priorityClientsColumns}
                                    pageSize={5}
                                    onRowClick={handleRowClick}
                                    density={DensityTypes.Comfortable}
                                    components={{
                                        NoRowsOverlay: RenderNoPriorityClientsOverlay,
                                    }}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item lg={6} md={12} xs={12}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h6" component="h2">
                                Outstanding Referrals
                            </Typography>
                            <br />
                            <div className={dataGridStyle.dashboardTables}>
                                <DataGrid
                                    hideFooterPagination
                                    className={`${dataGridStyle.datagrid}`}
                                    rows={dummyReferrals}
                                    // TODO: set loading
                                    columns={outstandingReferralsColumns}
                                    density={DensityTypes.Comfortable}
                                    onRowClick={handleRowClick}
                                    components={{
                                        NoRowsOverlay: RenderNoOutstandingReferralsOverlay,
                                    }}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </>
    );
};

export default Dashboard;
