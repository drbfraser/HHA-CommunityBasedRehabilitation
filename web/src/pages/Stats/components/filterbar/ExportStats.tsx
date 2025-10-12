import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { CSVLink } from "react-csv";
import { Trans, useTranslation } from "react-i18next";

import { apiFetch, Endpoint } from "@cbr/common/util/endpoints";
import { timestampFromFormDate } from "@cbr/common/util/dates";
import type { IStats } from "@cbr/common/util/stats";
import { useZones } from "@cbr/common/util/hooks/zones";
import type { IUser } from "@cbr/common/util/users";
import { IDateRange } from "./StatsDateFilter";
import { IAge, IGender } from "./StatsDemographicFilter";

interface IProps {
    open: boolean;
    onClose: () => void;
    stats?: IStats; // retained for compatibility; grouped fetch is used instead
    age: IAge;
    gender: IGender; // currently unused in backend request; grouping defaults to gender
    date: IDateRange;
    user?: IUser | null;
    archiveMode: boolean;
    categorizeBy?: "zone" | "gender" | "host_status" | "age_band" | null;
    groupBy?: Set<"zone" | "gender" | "host_status" | "age_band">;
}

const ExportStats = ({
    open,
    onClose,
    age,
    date,
    user,
    archiveMode,
    categorizeBy,
    groupBy,
}: IProps) => {
    const { t } = useTranslation();
    const [groupedStats, setGroupedStats] = useState<any | null>(null);
    const zones = useZones();

    useEffect(() => {
        if (!open) return;

        const params = new URLSearchParams();
        params.append("is_active", String(archiveMode));

        const msPerDay = 86400000;
        if (date.from) params.append("from", String(timestampFromFormDate(date.from)));
        if (date.to) params.append("to", String(timestampFromFormDate(date.to) + msPerDay));

        if (user?.id) params.append("user_id", String(user.id));

        // Apply grouping from UI: use provided groupBy set; if empty/undefined, no grouping.
        const groupDims = Array.from(groupBy ?? new Set());
        if (groupDims.length > 0) params.append("group_by", groupDims.join(","));

        // Apply categorization from UI
        if (categorizeBy) params.append("categorize_by", categorizeBy);

        // Apply age filters (filter-only on backend unless grouped by age_band)
        if (age.bands && age.bands.length > 0) params.append("age_bands", age.bands.join(","));
        else if (age.demographic) params.append("demographics", age.demographic);

        apiFetch(Endpoint.STATS, `?${params.toString()}`)
            .then((resp) => resp.json())
            .then((data) => setGroupedStats(data))
            .catch(() => setGroupedStats(null));
    }, [
        open,
        archiveMode,
        date.from,
        date.to,
        user?.id,
        age.demographic,
        age.bands,
        categorizeBy,
        groupBy,
    ]);

    const data = useMemo(() => {
        if (!open || !groupedStats) return "Data not ready";

        const rows: any[] = [];
        // DATE range header
        if (!date.from && !date.to) rows.push(["DATE RANGE: All Time"]);
        else rows.push(["DATE RANGE: ", date.from, date.to]);
        rows.push([""]);

        const pushSeriesSection = (title: string, series: any) => {
            if (!Array.isArray(series) || series.length === 0) return;
            const categorized = series.length > 0 && series[0] && Array.isArray(series[0].data);
            rows.push([`***${title} (Grouped)***`]);
            if (categorized) {
                // Zero-fill by zone: include all zones even if missing in data
                let catSeries = series;
                if (categorizeBy === "zone" && zones.size) {
                    const zoneNames = Array.from(zones.values());
                    const byName = new Map<string, any>(
                        series.map((c: any) => [String(c.name), c])
                    );
                    catSeries = zoneNames.map(
                        (zn) =>
                            byName.get(String(zn)) || {
                                name: String(zn),
                                data: [{ name: "Total", value: 0 }],
                            }
                    );
                }

                catSeries.forEach((cat: any) => {
                    rows.push([cat.name, "Name", "Value"]);
                    (cat.data || []).forEach((d: any) => rows.push(["", d.name, String(d.value)]));
                    rows.push([""]);
                });
            } else {
                rows.push(["Name", "Value"]);
                series.forEach((d: any) => rows.push([d.name, String(d.value)]));
                rows.push([""]);
            }
        };

        pushSeriesSection("VISITS", groupedStats?.visits);
        pushSeriesSection("REFERRALS RESOLVED", groupedStats?.referrals_resolved);
        pushSeriesSection("REFERRALS UNRESOLVED", groupedStats?.referrals_unresolved);
        pushSeriesSection("NEW CLIENTS", groupedStats?.new_clients);
        pushSeriesSection("FOLLOW UP VISITS", groupedStats?.follow_up_visits);
        pushSeriesSection("DISCHARGED CLIENTS", groupedStats?.discharged_clients);
        pushSeriesSection("DISABILITIES", groupedStats?.disabilities);

        return rows;
    }, [open, groupedStats, date.from, date.to, categorizeBy, zones]);

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{t("statistics.export")}</DialogTitle>

            <DialogContent>
                <Typography sx={{ marginBottom: "1em" }} variant="body1">
                    {t("statistics.filtersApplyToExports")}
                </Typography>

                <Typography variant="body1">
                    <Trans i18nKey="statistics.downloadAsCSV">
                        {"-"}
                        <CSVLink filename="CBRStats.csv" data={data}>
                            Download statistics
                        </CSVLink>{" "}
                        as a CSV file.
                    </Trans>
                </Typography>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>{t("general.close")}</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ExportStats;
