import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import {
    Typography,
    Box,
    Alert,
    TextField,
    MenuItem,
    IconButton,
    Popover,
    Switch,
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
import {
    CompleteIcon,
    PendingIcon,
    RenderTextTypography,
    referralsStyles,
} from "./Referrals.styles";
import Tooltip from "@mui/material/Tooltip";
import InfoIcon from "@mui/icons-material/Info";
import { hideColumnsStyles } from "styles/HideColumns.styles";
import { MoreVert } from "@mui/icons-material";

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

    // States for hiding columns
    const [optionsAnchorEl, setOptionsAnchorEl] = useState<Element | null>(null);
    const isOptionsOpen = Boolean(optionsAnchorEl);

    const [isStatusHidden, setStatusHidden] = useState<boolean>(false);
    const [isNameHidden, setNameHidden] = useState<boolean>(false);
    const [isTypeHidden, setTypeHidden] = useState<boolean>(false);
    const [isZoneHidden, setZoneHidden] = useState<boolean>(false);
    const [isDateHidden, setDateHidden] = useState<boolean>(false);
    const [isDetailsHidden, setDetailsHidden] = useState<boolean>(false);

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
                    details: generateDetails(row),
                }));

                setReferrals(formattedReferrals);
                setFilteredReferrals(formattedReferrals.filter((r) => !r.resolved));
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

        const generateDetails = (row: IReferral) => {
            const details = [];
            if (row.wheelchair) {
                details.push(`${t("referral.experience")}: ${row.wheelchair_experience}`);
                details.push(`${t("referral.hipWidth")}: ${row.hip_width} ${t("referral.inches")}`);
                details.push(
                    `${t("referral.wheelchairOwned")}: ${row.wheelchair_owned ? "✅" : "❌"}`
                );
                details.push(
                    `${t("referral.wheelchairRepairable")}: ${
                        row.wheelchair_repairable ? "✅" : "❌"
                    }`
                );
            }
            if (row.physiotherapy) {
                details.push(`${t("referral.condition")}: ${row.condition}`);
            }
            if (row.prosthetic) {
                details.push(
                    `${t("referral.prostheticInjuryLocation")}: ${row.prosthetic_injury_location}`
                );
            }
            if (row.orthotic) {
                details.push(
                    `${t("referral.orthoticInjuryLocation")}: ${row.orthotic_injury_location}`
                );
            }
            if (row.hha_nutrition_and_agriculture_project) {
                details.push(
                    `${t("referral.emergencyFoodAidRequired")}: ${
                        row.emergency_food_aid ? "✅" : "❌"
                    }`
                );
                details.push(
                    `${t("referral.agricultureLivelihoodProgramEnrollment")}: ${
                        row.agriculture_livelihood_program_enrollment ? "✅" : "❌"
                    }`
                );
            }
            if (row.mental_health) {
                details.push(
                    `${t("referral.mentalHealthCondition")}: ${row.mental_health_condition}`
                );
            }
            if (row.services_other) {
                details.push(`${t("referral.servicesOther")}: ${row.services_other}`);
            }
            return details.join("\n");
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

    const onOptionsClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
        setOptionsAnchorEl(event.currentTarget);
    const onOptionsClose = () => setOptionsAnchorEl(null);

    const RenderText = (params: GridRenderCellParams) => {
        const text = String(params.value);
        const lineCount = (text.match(/\n/g) || []).length + 1; // Count newlines to calculate lines

        return (
            <Tooltip title={<Box sx={referralsStyles.tooltipText}>{text}</Box>} arrow>
                <RenderTextTypography
                    variant="body2"
                    sx={{
                        maxHeight: lineCount > 3 ? "5em" : "auto",
                    }}
                >
                    {text}
                </RenderTextTypography>
            </Tooltip>
        );
    };

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

    const referralColumns = [
        {
            field: "resolved",
            headerName: t("general.status"),
            flex: 0.3,
            renderCell: RenderStatus,
            hide: isStatusHidden,
            hideFunction: setStatusHidden,
        },
        {
            field: "full_name",
            headerName: t("general.name"),
            flex: 0.5,
            renderCell: RenderText,
            hide: isNameHidden,
            hideFunction: setNameHidden,
        },
        {
            field: "type",
            headerName: t("general.type"),
            flex: 1,
            renderCell: RenderText,
            hide: isTypeHidden,
            hideFunction: setTypeHidden,
        },
        {
            field: "zone",
            headerName: t("general.zone"),
            flex: 0.65,
            renderCell: RenderZone,
            hide: isZoneHidden,
            hideFunction: setZoneHidden,
        },
        {
            field: "date_referred",
            headerName: t("referralAttr.dateReferred"),
            flex: 0.45,
            renderCell: RenderDate,
            hide: isDateHidden,
            hideFunction: setDateHidden,
        },
        {
            field: "details",
            headerName: t("general.details"),
            flex: 0.9,
            renderCell: RenderText,
            hide: isDetailsHidden,
            hideFunction: setDetailsHidden,
        },
    ];

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
                <TextField
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    select
                    label={t("referral.filterByStatus")}
                    sx={referralsStyles.statusFilter}
                >
                    <MenuItem value={STATUS.PENDING}>{t("general.pending")}</MenuItem>
                    <MenuItem value={STATUS.RESOLVED}>{t("general.resolved")}</MenuItem>
                    <MenuItem value={STATUS.ALL}>{t("general.all")}</MenuItem>
                </TextField>

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

                <IconButton
                    sx={hideColumnsStyles.optionsButton}
                    onClick={onOptionsClick}
                    size="large"
                >
                    <MoreVert />
                </IconButton>
                <Popover
                    open={isOptionsOpen}
                    anchorEl={optionsAnchorEl}
                    onClose={onOptionsClose}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "center",
                    }}
                >
                    <Box sx={hideColumnsStyles.optionsContainer}>
                        {referralColumns.map((column: any): JSX.Element => {
                            return (
                                <Box key={column.field} sx={hideColumnsStyles.optionsRow}>
                                    <Typography component={"span"} variant={"body2"}>
                                        {column.headerName}
                                    </Typography>
                                    <Switch
                                        color="secondary"
                                        checked={!column.hide}
                                        onClick={() => column.hideFunction(!column.hide)}
                                    />
                                </Box>
                            );
                        })}
                    </Box>
                </Popover>
            </Box>
            <Typography variant="body2" color="textSecondary">
                {t("referral.filterByTypeDescription")}
            </Typography>

            <Box sx={dataGridStyles.dashboardTables}>
                <DataGrid
                    sx={dataGridStyles.datagrid}
                    rowsPerPageOptions={[10, 25, 50]}
                    rows={filteredReferrals}
                    loading={isLoading || clientsLoading}
                    columns={referralColumns}
                    density={GridDensityTypes.Comfortable}
                    onRowClick={handleReferralRowClick}
                    initialState={{ pagination: { pageSize: 10 } }}
                />
            </Box>

            <Box sx={referralsStyles.hoverDetails}>
                <InfoIcon />
                <Typography variant="body2">{t("referral.hoverDetails")}</Typography>
            </Box>
        </>
    );
};

export default Referrals;
