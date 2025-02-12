import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import {
    Typography,
    Box,
    Alert,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import {
    DataGrid,
    GridDensityTypes,
    GridRowsProp,
    GridRenderCellParams,
    GridRowParams,
    GridRowModel,
} from "@mui/x-data-grid";
import { Endpoint, apiFetch } from "@cbr/common/util/endpoints";
import { IReferral, Impairments, otherServices } from "@cbr/common/util/referrals";
import { dataGridStyles } from "styles/DataGrid.styles";
import { timestampToDate } from "@cbr/common/util/dates";
import { IClientSummary } from "@cbr/common/util/clients";
import { useZones } from "@cbr/common/util/hooks/zones";
import { CompleteIcon, PendingIcon, referralsStyles } from "./Referrals.styles";

const STATUS = {
    PENDING: "pending",
    RESOLVED: "resolved",
    ALL: "all",
};

const Referrals = () => {
    const history = useHistory();
    const { t } = useTranslation();
    const zones = useZones();

    const [referrals, setReferrals] = useState<GridRowsProp>([]);
    const [filteredReferrals, setFilteredReferrals] = useState<GridRowsProp>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [referralError, setReferralError] = useState<string>();

    const [clients, setClients] = useState<GridRowModel[]>([]);
    const [clientsLoading, setClientsLoading] = useState<boolean>(true);
    const [clientError, setClientError] = useState<string>();
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [filterStatus, setFilterStatus] = useState<string>(STATUS.PENDING);

    useEffect(() => {
        const fetchClients = async () => {
            setClientError(undefined);
            try {
                const tempClients: IClientSummary[] = await (
                    await apiFetch(Endpoint.CLIENTS, "?is_active=true")
                ).json();

                const priorityClients = tempClients.map((row: IClientSummary) => {
                    return {
                        id: row.id,
                        full_name: row.full_name,
                        zone: row.zone,
                    };
                });
                setClients(priorityClients);
            } catch (e) {
                setClientError(e instanceof Error ? e.message : `${e}`);
            } finally {
                setClientsLoading(false);
            }
        };

        fetchClients();
    }, []);

    useEffect(() => {
        if (!clients.length) return;

        const fetchReferrals = async () => {
            setReferralError(undefined);
            try {
                const tempReferrals: IReferral[] = await (
                    await apiFetch(Endpoint.REFERRALS_ALL)
                ).json();
                const formattedReferrals: GridRowsProp = tempReferrals.map((row) => ({
                    id: row.id,
                    client_id: row.client_id,
                    full_name:
                        clients.find((client) => client.id === row.client_id)?.full_name || "",
                    type: concatenateReferralType(row),
                    date_referred: row.date_referred,
                    zone: clients.find((client) => client.id === row.client_id)?.zone || "",
                    resolved: row.resolved,
                }));
                setReferrals(formattedReferrals);
                setFilteredReferrals(formattedReferrals.filter((r) => !r.resolved)); // Default: only pending referrals
            } catch (e) {
                setReferralError(e instanceof Error ? e.message : `${e}`);
            } finally {
                setIsLoading(false);
            }
        };

        const concatenateReferralType = (row: IReferral) => {
            const referralTypes = [];
            if (row.wheelchair) referralTypes.push(t("referral.wheelchair"));
            if (row.physiotherapy) referralTypes.push(t("referral.physiotherapy"));
            if (row.hha_nutrition_and_agriculture_project)
                referralTypes.push(t("referral.hhaNutritionAndAgricultureProjectAbbr"));
            if (row.orthotic) referralTypes.push(t("referral.orthotic"));
            if (row.prosthetic) referralTypes.push(t("referral.prosthetic"));
            if (row.mental_health) referralTypes.push(t("referral.mentalHealth"));
            if (row.services_other) {
                let service = otherServices[row.services_other];

                if (!service) service = Impairments.OTHER;
                referralTypes.push(service);
            }

            return referralTypes.join(", ");
        };

        fetchReferrals();
    }, [t, clients]);

    useEffect(() => {
        let filtered = referrals;

        if (filterStatus === STATUS.PENDING) {
            filtered = referrals.filter((r) => !r.resolved);
        } else if (filterStatus === STATUS.RESOLVED) {
            filtered = referrals.filter((r) => r.resolved);
        }

        if (selectedTypes.length > 0) {
            filtered = filtered.filter((referral) =>
                selectedTypes.some((type) => referral.type.includes(type))
            );
        }

        setFilteredReferrals(filtered);
    }, [selectedTypes, filterStatus, referrals]);

    const RenderText = (params: GridRenderCellParams) => (
        <Typography variant={"body2"}>{String(params.value)}</Typography>
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

    const RenderStatus = (params: GridRenderCellParams) => (
        <Typography variant={"body2"}>
            {params.value ? <CompleteIcon fontSize="small" /> : <PendingIcon fontSize="small" />}
        </Typography>
    );

    const handleReferralRowClick = (rowParams: GridRowParams) =>
        history.push(`/client/${rowParams.row.client_id}?${rowParams.row.id}=open`);

    const getColumns = () => {
        const columns = [
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
                field: "zone",
                headerName: t("general.zone"),
                flex: 1.2,
                renderCell: RenderZone,
            },
            {
                field: "date_referred",
                headerName: t("referralAttr.dateReferred"),
                flex: 1,
                renderCell: RenderDate,
            },
            {
                field: "resolved",
                headerName: t("general.resolved"),
                flex: 0.4,
                renderCell: RenderStatus,
            },
        ];

        if (filterStatus !== STATUS.ALL) {
            return columns.slice(0, columns.length - 1);
        }

        return columns;
    };

    return (
        <>
            {(clientError || referralError) && (
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
            )}
            <br />

            <Box sx={referralsStyles.filterContainer}>
                <FormControl sx={referralsStyles.statusFilter}>
                    <InputLabel>{t("referral.filterByStatus")}</InputLabel>
                    <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                        <MenuItem value={STATUS.PENDING}>{t("general.pending")}</MenuItem>
                        <MenuItem value={STATUS.RESOLVED}>{t("general.resolved")}</MenuItem>
                        <MenuItem value={STATUS.ALL}>{t("general.all")}</MenuItem>
                    </Select>
                </FormControl>

                <Autocomplete
                    multiple
                    options={[
                        t("referral.wheelchair"),
                        t("referral.physiotherapy"),
                        t("referral.hhaNutritionAndAgricultureProjectAbbr"),
                        t("referral.orthotic"),
                        t("referral.prosthetic"),
                        t("referral.mentalHealth"),
                        ...Object.values(otherServices),
                    ]}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={t("referral.filterByType")}
                            variant="outlined"
                        />
                    )}
                    onChange={(_, values) => setSelectedTypes(values)}
                    sx={referralsStyles.typeFilter}
                />
            </Box>
            <Typography variant="body2" color="textSecondary">
                Referrals that match at least one of the selected types will be displayed.
            </Typography>

            <Box sx={dataGridStyles.dashboardTables}>
                <DataGrid
                    sx={dataGridStyles.datagrid}
                    rowsPerPageOptions={[10, 25, 50]}
                    rows={filteredReferrals}
                    loading={isLoading || clientsLoading}
                    columns={getColumns()}
                    density={GridDensityTypes.Comfortable}
                    onRowClick={handleReferralRowClick}
                    initialState={{ pagination: { pageSize: 10 } }}
                />
            </Box>
        </>
    );
};

export default Referrals;
