import React, { useEffect, useState } from "react";
import { useTranslation, Trans } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Alert, Box, Card, CardContent, Grid, Typography } from "@mui/material";
import { Cancel, CheckCircle, FiberManualRecord } from "@mui/icons-material";
import {
    DataGrid,
    GridColumnHeaderParams,
    GridRowParams,
    GridDensityTypes,
    GridOverlay,
    GridRowsProp,
    GridRowModel,
    GridSortCellParams,
    GridRenderCellParams,
} from "@mui/x-data-grid";

import { clientPrioritySort, IClientSummary } from "@cbr/common/util/clients";
import { apiFetch, APILoadError, Endpoint } from "@cbr/common/util/endpoints";
import { useZones } from "@cbr/common/util/hooks/zones";
import { timestampToDate } from "@cbr/common/util/dates";
import { IOutstandingReferral, otherServices } from "@cbr/common/util/referrals";
import { IAlert } from "@cbr/common/util/alerts";
import { IUser } from "@cbr/common/util/users";
import { getCurrentUser } from "@cbr/common/util/hooks/currentUser";
import { RiskLevel, IRiskLevel, riskLevels, RiskType } from "@cbr/common/util/risks";
import { IRiskType, riskTypes } from "util/risks";
import { dataGridStyles } from "styles/DataGrid.styles";

// manually define this type, as GridCellValue deprecated in MUI 5
type GridCellValue = string | number | boolean | object | Date | null | undefined;

const Dashboard = () => {
    const history = useHistory();
    const { t } = useTranslation();

    const [clients, setClients] = useState<GridRowModel[]>([]);
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

                const priorityClients = tempClients
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
            const referralTypes = [];
            if (row.wheelchair) referralTypes.push(t("referral.wheelchair"));
            if (row.physiotherapy) referralTypes.push(t("referral.physiotherapy"));
            if (row.hha_nutrition_and_agriculture_project)
                referralTypes.push(t("referral.hhaNutritionAndAgricultureProjectAbbr"));
            if (row.orthotic) referralTypes.push(t("referral.orthotic"));
            if (row.prosthetic) referralTypes.push(t("referral.prosthetic"));
            if (row.mental_health) referralTypes.push(t("referral.mentalHealth"));
            if (row.services_other) referralTypes.push(otherServices[row.services_other]);

            return referralTypes.join(", ");
        };

        fetchClients();
        fetchReferrals();
    }, [t]);

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const alertsList = await (await apiFetch(Endpoint.ALERTS)).json();
                const user: IUser | typeof APILoadError = await getCurrentUser();

                if (user !== APILoadError) {
                    const userID = user.id;
                    const unreadAlerts: IAlert[] = alertsList.filter((alert: IAlert) =>
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

    const RenderText = (params: GridRenderCellParams) => (
        <Typography variant={"body2"}>{String(params.value)}</Typography>
    );
    const riskComparator = (
        v1: GridCellValue,
        v2: GridCellValue,
        params1: GridSortCellParams,
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
        <GridOverlay sx={dataGridStyles.noRows}>
            <Cancel color="primary" sx={dataGridStyles.noRowsIcon} />
            <Typography color="primary">{t("dashboard.noPriorityClients")}</Typography>
        </GridOverlay>
    );

    const RenderNoOutstandingReferralsOverlay = () => (
        <GridOverlay sx={dataGridStyles.noRows}>
            <CheckCircle color="primary" sx={dataGridStyles.noRowsIcon} />
            <Typography color="primary">{t("dashboard.noOutstandingReferrals")}</Typography>
        </GridOverlay>
    );

    const RenderDate = (params: GridRenderCellParams) => {
        const locale = navigator.language;
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        return (
            <Typography variant="body2">
                {Number(params.value) === 0
                    ? t("dashboard.noVisits")
                    : timestampToDate(Number(params.value), locale, timezone)}
            </Typography>
        );
    };

    const RenderZone = (params: GridRenderCellParams) => (
        <Typography variant={"body2"}>{zones ? zones.get(Number(params.value)) : ""}</Typography>
    );

    const handleClientRowClick = (rowParams: GridRowParams) =>
        history.push(`/client/${rowParams.row.id}`);

    const handleReferralRowClick = (rowParams: GridRowParams) =>
        history.push(`/client/${rowParams.row.client_id}`);

    const priorityClientsColumns = [
        {
            field: "full_name",
            headerName: t("general.name"),
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
            headerName: t("general.zone"),
            flex: 1.2,
            renderCell: RenderZone,
        },
        {
            field: "last_visit_date",
            headerName: t("general.lastVisit"),
            renderCell: RenderDate,
            flex: 1,
        },
    ];

    const outstandingReferralsColumns = [
        {
            field: "full_name",
            headerName: t("general.name"),
            flex: 0.7,
            renderCell: RenderText,
        },
        {
            field: "type",
            headerName: t("general.type"),
            flex: 2,
            renderCell: RenderText,
        },
        {
            field: "date_referred",
            headerName: t("referralAttr.dateReferred"),
            flex: 1,
            renderCell: RenderDate,
        },
    ];

    return (
        <>
            {unreadAlertsCount > 0 && (
                <Alert severity="info">
                    <Typography variant="body1">
                        <Trans i18nKey="dashboard.newInboxMessages" count={unreadAlertsCount}>
                            -You have <b>{unreadAlertsCount}</b> new message
                            {unreadAlertsCount > 1 && "s"} in your inbox
                        </Trans>
                    </Typography>
                </Alert>
            )}
            {(clientError || referralError) && (
                <>
                    <br />
                    <Alert severity="error">
                        {clientError && (
                            <Typography variant="body1">
                                {t("alert.loadingPriorityClientsError")}: {clientError}
                            </Typography>
                        )}
                        {referralError && (
                            <Typography variant="body1">
                                {t("alert.loadingReferralsError")}: {referralError}
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
                                {t("dashboard.clientListPriority")}
                            </Typography>
                            <br />
                            <Box sx={dataGridStyles.dashboardTables}>
                                <DataGrid
                                    sx={dataGridStyles.datagrid}
                                    rows={clients}
                                    hideFooter
                                    loading={isPriorityClientsLoading}
                                    columns={priorityClientsColumns}
                                    pageSize={5}
                                    density={GridDensityTypes.Comfortable}
                                    onRowClick={handleClientRowClick}
                                    components={{
                                        NoRowsOverlay: RenderNoPriorityClientsOverlay,
                                    }}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item lg={6} md={12} xs={12}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h6" component="h2">
                                {t("dashboard.clientListOutstandingRefs")}
                            </Typography>
                            <br />
                            <Box sx={dataGridStyles.dashboardTables}>
                                <DataGrid
                                    sx={dataGridStyles.datagrid}
                                    localeText={{
                                        MuiTablePagination: {
                                            labelDisplayedRows: ({ from, to, count }) =>
                                                t("general.dataGridLabelDisplayedRows", {
                                                    from,
                                                    to,
                                                    count,
                                                }),
                                            labelRowsPerPage: t("general.dataGridLabelRowsPerPage"),
                                        },
                                    }}
                                    rowsPerPageOptions={[5, 25, 50]}
                                    rows={referrals}
                                    loading={referralsLoading}
                                    columns={outstandingReferralsColumns}
                                    density={GridDensityTypes.Comfortable}
                                    onRowClick={handleReferralRowClick}
                                    components={{
                                        NoRowsOverlay: RenderNoOutstandingReferralsOverlay,
                                    }}
                                    initialState={{
                                        pagination: {
                                            pageSize: 5,
                                        },
                                    }}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </>
    );
};

export default Dashboard;
