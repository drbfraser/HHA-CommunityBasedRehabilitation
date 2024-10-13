import React, { useEffect, useState } from "react";
import { Card, CardContent, Grid, Typography } from "@mui/material";
import { useDataGridStyles } from "styles/DataGrid.styles";
import { useHistory } from "react-router-dom";
import { Cancel, CheckCircle, FiberManualRecord } from "@mui/icons-material";
import { RiskLevel, IRiskLevel, riskLevels, RiskType } from "@cbr/common/util/risks";
import { IRiskType, riskTypes } from "util/riskIcon";
import { clientPrioritySort, IClientSummary } from "@cbr/common/util/clients";
import { apiFetch, APILoadError, Endpoint } from "@cbr/common/util/endpoints";
import { useZones } from "@cbr/common/util/hooks/zones";
import { timestampToDate } from "@cbr/common/util/dates";
import { IOutstandingReferral } from "@cbr/common/util/referrals";
import { Alert } from '@mui/material';
import {
    DataGrid,
    GridColumnHeaderParams,
    GridCellValue,
    GridRowParams,
    GridDensityTypes,
    GridOverlay,
    GridRowsProp,
    GridRowData,
    GridSortCellParams,
    GridRenderCellParams,
} from "@mui/x-data-grid";
import { IAlert } from "@cbr/common/util/alerts";
import { IUser } from "@cbr/common/util/users";
import { getCurrentUser } from "@cbr/common/util/hooks/currentUser";

const Dashboard = () => {
    const dataGridStyle = useDataGridStyles();
    const history = useHistory();

    const [clients, setClients] = useState<GridRowData[]>([]);
    const [referrals, setReferrals] = useState<GridRowsProp>([]);
    const zones = useZones();
    const [isPriorityClientsLoading, setPriorityClientsLoading] = useState<boolean>(true);
    const [referralsLoading, setReferralsLoading] = useState<boolean>(true);

    const [clientError, setClientError] = useState<string>();
    const [referralError, setReferralError] = useState<string>();
    const [unreadAlertsCount, setUnreadAlertsCount] = useState<number>(0);

    useEffect(() => {
        const fetchClients = async () => {
            setClientError(undefined);
            try {
                const tempClients: IClientSummary[] = await (
                    await apiFetch(Endpoint.CLIENTS, "?is_active=true")
                ).json();

                // const priorityClients: GridRowsProp = tempClients 
                const priorityClients = tempClients  // todo: set type back to GridRowsProp?  not mutable?
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
                            [RiskType.NUTRITION]: row.nutrit_risk_level,
                            [RiskType.MENTAL]: row.mental_risk_level,
                            last_visit_date: row.last_visit_date,
                            is_active: row.is_active,
                        };
                    });
                setClients(priorityClients);
            } catch (e) {
                setClientError(e instanceof Error ? e.message : `${e}`);
            } finally {
                setPriorityClientsLoading(false);
            }
        };
        const fetchReferrals = async () => {
            setReferralError(undefined);
            try {
                const tempReferrals: IOutstandingReferral[] = await (
                    await apiFetch(Endpoint.REFERRALS_OUTSTANDING)
                ).json();

                const outstandingReferrals: GridRowsProp = tempReferrals
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
            } catch (e) {
                setReferralError(e instanceof Error ? e.message : `${e}`);
            } finally {
                setReferralsLoading(false);
            }
        };

        const concatenateReferralType = (row: IOutstandingReferral) => {
            let referralTypes = [];
            if (row.wheelchair) referralTypes.push("Wheelchair");
            if (row.physiotherapy) referralTypes.push("Physiotherapy");
            if (row.hha_nutrition_and_agriculture_project) referralTypes.push("HHANAP");
            if (row.orthotic) referralTypes.push("Orthotic");
            if (row.prosthetic) referralTypes.push("Prosthetic");
            if (row.mental_health) referralTypes.push("Mental Health");
            if (row.services_other) referralTypes.push(row.services_other);

            return referralTypes.join(", ");
        };

        fetchClients();
        fetchReferrals();
    }, []);

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const alertsList = await (await apiFetch(Endpoint.ALERTS)).json();
                const user: IUser | typeof APILoadError = await getCurrentUser();

                if (user !== APILoadError) {
                    let userID = user.id;
                    let unreadAlerts: IAlert[] = alertsList.filter((alert: IAlert) =>
                        alert.unread_by_users.includes(userID)
                    );
                    setUnreadAlertsCount(unreadAlerts.length);
                }
            } catch (e) {
                setReferralError(e instanceof Error ? e.message : `${e}`);
            }
        };
        fetchAlerts();
    }, [unreadAlertsCount]);

    /* TODO I have changed it with an existance check, need to reverse it when backend is ready */
    const RenderBadge = (params: GridRenderCellParams) => {
        const risk: RiskLevel = Object(params.value);
        return (
            <FiberManualRecord
                style={{ color: riskLevels[risk] ? riskLevels[risk].color : "red" }}
            />
        );
    };

    const RenderText = (params: GridRenderCellParams) => {
        return <Typography variant={"body2"}>{String(params.value)}</Typography>; // todo: String() ok?
    };

    const riskComparator = (
        v1: GridCellValue,
        v2: GridCellValue,
        params1: GridSortCellParams, // todo: ok to update GridCellParams to GridSortCellParams?
        params2: GridSortCellParams
    ) => {
        const risk1: IRiskLevel = riskLevels[String(params1.value)];
        const risk2: IRiskLevel = riskLevels[String(params2.value)];
        return risk1.level - risk2.level;
    };

    const RenderRiskHeader = (params: GridColumnHeaderParams): JSX.Element => {
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

    const locale = navigator.language;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const RenderDate = (params: GridRenderCellParams) => {
        return Number(params.value) === 0 ? (
            <Typography variant={"body2"}>No Visits</Typography>
        ) : (
            <Typography variant={"body2"}>
                {timestampToDate(Number(params.value), locale, timezone)}
            </Typography>
        );
    };

    const RenderZone = (params: GridRenderCellParams) => {
        return (
            <Typography variant={"body2"}>
                {zones ? zones.get(Number(params.value)) : ""}
            </Typography>
        );
    };

    const handleClientRowClick = (rowParams: GridRowParams) =>
        history.push(`/client/${rowParams.row.id}`);
    const handleReferralRowClick = (rowParams: GridRowParams) =>
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
                <Typography variant="body1">
                    You have <b>{unreadAlertsCount}</b> new messages in your inbox.
                </Typography>
            </Alert>
            {(clientError || referralError) && (
                <>
                    <br />
                    <Alert severity="error">
                        {clientError && (
                            <Typography variant="body1">
                                Error loading priority clients: {clientError}
                            </Typography>
                        )}
                        {referralError && (
                            <Typography variant="body1">
                                Error loading referrals: {referralError}
                            </Typography>
                        )}
                    </Alert>
                </>
            )}
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
                                    density={GridDensityTypes.Comfortable}
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
                                    density={GridDensityTypes.Comfortable}
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
