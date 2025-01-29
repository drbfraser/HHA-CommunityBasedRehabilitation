import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Typography, Box, Alert } from "@mui/material";
import {
    DataGrid,
    GridDensityTypes,
    GridRowsProp,
    GridRenderCellParams,
    GridRowParams,
} from "@mui/x-data-grid";
import { Endpoint, apiFetch } from "@cbr/common/util/endpoints";
import { IOutstandingReferral, otherServices } from "@cbr/common/util/referrals";
import { dataGridStyles } from "styles/DataGrid.styles";
import { timestampToDate } from "@cbr/common/util/dates";

const Referrals = () => {
    const history = useHistory();
    const { t } = useTranslation();

    const [pendingReferrals, setPendingReferrals] = useState<GridRowsProp>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [referralError, setReferralError] = useState<string>();

    useEffect(() => {
        const fetchReferrals = async () => {
            setReferralError(undefined);
            try {
                const tempReferrals: IOutstandingReferral[] = await (
                    await apiFetch(Endpoint.REFERRALS_OUTSTANDING)
                ).json();

                const referrals: GridRowsProp = tempReferrals
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
                setPendingReferrals(referrals);
            } catch (e) {
                setReferralError(e instanceof Error ? e.message : `${e}`);
            } finally {
                setIsLoading(false);
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

        fetchReferrals();
    }, [t]);

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

    const handleReferralRowClick = (rowParams: GridRowParams) =>
        history.push(`/client/${rowParams.row.client_id}`);

    const pendingReferralsColumns = [
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
            {referralError && (
                <>
                    <Alert severity="error">
                        <Typography variant="body1">
                            {t("alert.loadingReferralsError")}: {referralError}
                        </Typography>
                    </Alert>
                </>
            )}
            <br />

            <Box sx={dataGridStyles.dashboardTables}>
                <DataGrid
                    sx={dataGridStyles.datagrid}
                    rowsPerPageOptions={[5, 25, 50]}
                    rows={pendingReferrals}
                    loading={isLoading}
                    columns={pendingReferralsColumns}
                    pageSize={5}
                    density={GridDensityTypes.Comfortable}
                    onRowClick={handleReferralRowClick}
                />
            </Box>
        </>
    );
};

export default Referrals;
