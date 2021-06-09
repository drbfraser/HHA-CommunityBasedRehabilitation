import React, { useEffect, useState } from "react";
import { Card, CardContent, Grid, Typography } from "@material-ui/core";
import { useDataGridStyles } from "styles/DataGrid.styles";
import { useHistory } from "react-router-dom";
import { Cancel, CheckCircle, FiberManualRecord } from "@material-ui/icons";
import { RiskLevel, IRiskLevel, riskLevels, IRiskType, riskTypes, RiskType } from "util/risks";
import { clientPrioritySort, IClientSummary } from "util/clients";
import { apiFetch, Endpoint } from "util/endpoints";
import { useZones } from "util/hooks/zones";
import { timestampToDate } from "util/dates";
import { IOutstandingReferral } from "util/referrals";
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
    RowsProp,
    RowData,
} from "@material-ui/data-grid";

const Dashboard = () => {
    const dataGridStyle = useDataGridStyles();
    const history = useHistory();

    const [clients, setClients] = useState<RowData[]>([]);
    const [referrals, setReferrals] = useState<RowsProp>([]);
    const zones = useZones();
    const [isPriorityClientsLoading, setPriorityClientsLoading] = useState<boolean>(true);
    const [referralsLoading, setReferralsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchClients = async () => {
            const tempClients = await apiFetch(Endpoint.CLIENTS)
                .then((resp) => resp.json())
                .catch((err) => alert("Error occured while trying to load priority clients!"));

            const priorityClients: RowsProp = tempClients
                .sort(clientPrioritySort)
                .slice(0, 5)
                .map((row: IClientSummary) => {
                    return {
                        id: row.id,
                        full_name: row.full_name,
                        zone: row.zone,
                        [RiskType.HEALTH]: row.health_risk_level,
                        [RiskType.EDUCATION]: row.educat_risk_level,
                        [RiskType.SOCIAL]: row.social_risk_level,
                        last_visit_date: row.last_visit_date,
                    };
                });

            setClients(priorityClients);
            setPriorityClientsLoading(false);
        };
        const fetchReferrals = async () => {
            const tempReferrals = await apiFetch(Endpoint.REFERRALS_OUTSTANDING)
                .then((resp) => resp.json())
                .catch((err) => alert("Error occured while trying to load outstanding referrals!"));

            const outstandingReferrals: RowsProp = tempReferrals
                .sort(
                    (a: IOutstandingReferral, b: IOutstandingReferral) =>
                        a.date_referred - b.date_referred
                )
                .map((row: IOutstandingReferral, i: Number) => {
                    return {
                        id: i,
                        client_id: row.id,
                        full_name: row.full_name,
                        type: concatenateReferralType(row),
                        date_referred: row.date_referred,
                    };
                });

            setReferrals(outstandingReferrals);
            setReferralsLoading(false);
        };

        const concatenateReferralType = (row: IOutstandingReferral) => {
            let referralTypes = [];
            if (row.wheelchair) referralTypes.push("Wheelchair");
            if (row.physiotherapy) referralTypes.push("Physiotherapy");
            if (row.orthotic) referralTypes.push("Orthotic");
            if (row.prosthetic) referralTypes.push("Prosthetic");
            if (row.services_other) referralTypes.push(row.services_other);

            return referralTypes.join(", ");
        };

        fetchClients();
        fetchReferrals();
    }, []);

    const RenderBadge = (params: ValueFormatterParams) => {
        const risk: RiskLevel = Object(params.value);
        return <FiberManualRecord style={{ color: riskLevels[risk].color }} />;
    };

    const RenderText = (params: ValueFormatterParams) => {
        return <Typography variant={"body2"}>{params.value}</Typography>;
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

    const RenderNoPriorityClientsOverlay = () => (
        <GridOverlay className={dataGridStyle.noRows}>
            <Cancel color="primary" className={dataGridStyle.noRowsIcon} />
            <Typography color="primary">No Priority Clients Found</Typography>
        </GridOverlay>
    );

    const RenderNoOutstandingReferralsOverlay = () => {
        return (
            <GridOverlay className={dataGridStyle.noRows}>
                <CheckCircle color="primary" className={dataGridStyle.noRowsIcon} />
                <Typography color="primary">No Outstanding Referrals Found</Typography>
            </GridOverlay>
        );
    };

    const RenderDate = (params: ValueFormatterParams) => {
        return Number(params.value) === 0 ? (
            <Typography variant={"body2"}>No Visits</Typography>
        ) : (
            <Typography variant={"body2"}>{timestampToDate(Number(params.value))}</Typography>
        );
    };

    const RenderZone = (params: ValueFormatterParams) => {
        return (
            <Typography variant={"body2"}>
                {zones ? zones.get(Number(params.value)) : ""}
            </Typography>
        );
    };

    const handleClientRowClick = (rowParams: RowParams) =>
        history.push(`/client/${rowParams.row.id}`);
    const handleReferralRowClick = (rowParams: RowParams) =>
        history.push(`/client/${rowParams.row.client_id}`);

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
            flex: 2,
            renderCell: RenderText,
        },
        {
            field: "date_referred",
            headerName: "Date Referred",
            flex: 1,
            renderCell: RenderDate,
        },
    ];

    return (
        <>
            <Alert severity="info">
                {/* TODO: Update message alert once message alert functionality is implemented. */}
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
                                    hideFooterPagination
                                    loading={isPriorityClientsLoading}
                                    columns={priorityClientsColumns}
                                    pageSize={5}
                                    onRowClick={handleClientRowClick}
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
                                    className={`${dataGridStyle.datagrid}`}
                                    rows={referrals}
                                    loading={referralsLoading}
                                    columns={outstandingReferralsColumns}
                                    pageSize={5}
                                    density={DensityTypes.Comfortable}
                                    onRowClick={handleReferralRowClick}
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
