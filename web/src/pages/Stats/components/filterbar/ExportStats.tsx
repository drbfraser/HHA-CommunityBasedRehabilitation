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

        const DIM_ORDER: Array<NonNullable<IProps["categorizeBy"]>> = [
            "gender",
            "host_status",
            "age_band",
            "zone",
        ];
        const DIM_LABEL_MAP: Record<string, string> = {
            gender: "Gender",
            host_status: "Host/Refugee",
            age_band: "Age range",
            zone: "Zone",
        };
        const AGE_BANDS = ["0-5", "6-10", "11-17", "18-25", "26-30", "31-45", "46+"];
        const ORDER: Record<string, string[]> = {
            gender: ["Male", "Female", "not set"],
            host_status: ["host", "refugee", "not set"],
            age_band: AGE_BANDS,
        };

        const parseName = (name: string) => {
            const out: any = {};
            if (/\bMale\b/i.test(name)) out.gender = "Male";
            else if (/\bFemale\b/i.test(name)) out.gender = "Female";
            if (/\bhost\b/i.test(name)) out.host_status = "host";
            else if (/\brefugee\b/i.test(name)) out.host_status = "refugee";
            const m = name.match(/Age\s+([0-9]+-[0-9]+|46\+)/i);
            if (m) out.age_band = m[1];
            return out;
        };

        const orderedGroups = Array.from(groupBy ?? new Set())
            .filter((d): d is NonNullable<IProps["categorizeBy"]> => !!d)
            .sort((a, b) => DIM_ORDER.indexOf(a) - DIM_ORDER.indexOf(b));

        const buildHeader = (base: string) => {
            const DIM_LABEL_MAP: Record<string, string> = {
                gender: "Gender",
                host_status: "Host/Refugee",
                age_band: "Age range",
                zone: "Zone",
            };

            // Primary dimension = categorizeBy if set; otherwise first group_by
            const primaryDim = categorizeBy ?? (orderedGroups.length ? orderedGroups[0] : null);
            if (primaryDim) return `***${base} (Grouped by ${DIM_LABEL_MAP[primaryDim]})***`;
            return `***${base}***`;
        };

        const pushSeriesSection = (title: string, series: any) => {
            if (!Array.isArray(series) || series.length === 0) return;
            const categorized = series.length > 0 && series[0] && Array.isArray(series[0].data);
            rows.push([buildHeader(title)]);
            if (categorized) {
                // Zero-fill by zone if needed (keep your existing logic)
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

                // Optional stable ordering for some dims
                const ORDER: Record<string, string[]> = {
                    gender: ["Male", "Female", "not set"],
                    host_status: ["host", "refugee", "not set"],
                    age_band: ["0-5", "6-10", "11-17", "18-25", "26-30", "31-45", "46+"],
                };
                if (categorizeBy && ORDER[categorizeBy]) {
                    const order = ORDER[categorizeBy];
                    catSeries = [...catSeries].sort(
                        (a, b) => order.indexOf(String(a.name)) - order.indexOf(String(b.name))
                    );
                }

                // Header row shows the dimension label, NOT the category value
                rows.push([DIM_LABEL_MAP[categorizeBy!], "Name", "Value"]);

                // For each category: print one row with just the category, then its grouped rows
                catSeries.forEach((cat: any) => {
                    rows.push([String(cat.name)]);

                    const bars: Array<{ name: string; value: number }> = Array.isArray(cat.data)
                        ? [...cat.data]
                        : [];

                    // If exactly one group dimension is selected, zero-fill the full domain
                    if (orderedGroups.length === 1) {
                        const dim = orderedGroups[0];
                        if (dim === "age_band") {
                            const byAge = new Map<string, number>();
                            bars.forEach((d) => {
                                const m = (d.name || "").match(/Age\s+([0-9]+-[0-9]+|46\+)/i);
                                const band = m ? m[1] : undefined;
                                if (band) byAge.set(band, Number(d.value) || 0);
                            });
                            ["0-5", "6-10", "11-17", "18-25", "26-30", "31-45", "46+"].forEach(
                                (band) => {
                                    const v = byAge.has(band) ? byAge.get(band)! : 0;
                                    rows.push(["", `Age ${band}`, String(v)]);
                                }
                            );
                        } else if (dim === "gender") {
                            const byG = new Map<string, number>();
                            bars.forEach((d) => {
                                if (/^Male\b/i.test(d.name)) byG.set("Male", Number(d.value) || 0);
                                if (/^Female\b/i.test(d.name)) byG.set("Female", Number(d.value) || 0);
                            });
                            ["Male", "Female"].forEach((g) => {
                                const v = byG.has(g) ? byG.get(g)! : 0;
                                rows.push(["", g, String(v)]);
                            });
                        } else if (dim === "host_status") {
                            const byH = new Map<string, number>();
                            bars.forEach((d) => {
                                if (/^host\b/i.test(d.name)) byH.set("host", Number(d.value) || 0);
                                if (/^refugee\b/i.test(d.name)) byH.set("refugee", Number(d.value) || 0);
                            });
                            ["host", "refugee"].forEach((h) => {
                                const v = byH.has(h) ? byH.get(h)! : 0;
                                rows.push(["", h, String(v)]);
                            });
                        } else if (dim === "zone") {
                            // Not typical: if bars are zones, list all from zones hook
                            const zoneNames = Array.from(zones.values());
                            const byZ = new Map<string, number>();
                            bars.forEach((d) => byZ.set(String(d.name), Number(d.value) || 0));
                            zoneNames.forEach((zn) => {
                                const v = byZ.has(String(zn)) ? byZ.get(String(zn))! : 0;
                                rows.push(["", String(zn), String(v)]);
                            });
                        } else {
                            // Fallback: print as-is
                            bars.forEach((d) => rows.push(["", d.name, String(d.value)]));
                        }
                    } else {
                        // Multi-dimension bars: keep deterministic order, print as-is
                        const AGE_BANDS_ORDER = [
                            "0-5",
                            "6-10",
                            "11-17",
                            "18-25",
                            "26-30",
                            "31-45",
                            "46+",
                        ];
                        const orderIndex = (name: string): number => {
                            if (/^Male\b/i.test(name)) return 0;
                            if (/^Female\b/i.test(name)) return 1;
                            if (/^host\b/i.test(name)) return 0;
                            if (/^refugee\b/i.test(name)) return 1;
                            const m = name.match(/Age\s+([0-9]+-[0-9]+|46\+)/i);
                            if (m) return AGE_BANDS_ORDER.indexOf(m[1]);
                            return 99;
                        };
                        bars.sort((a, b) => orderIndex(a.name) - orderIndex(b.name));
                        bars.forEach((d) => rows.push(["", d.name, String(d.value)]));
                    }
                });

                // One blank line after the whole section
                rows.push([""]);
                return;
            } else {
                if (orderedGroups.length === 0) {
                    rows.push(["Name", "Value"]);
                    series.forEach((d: any) => rows.push([d.name, String(d.value)]));
                    rows.push([""]);
                    return;
                }

                // Build hierarchical output: primary group on its own line, then secondary rows
                const primary = orderedGroups[0];
                const secondary = orderedGroups.length > 1 ? orderedGroups[1] : null;

                // Map primary -> (secondary -> value)
                const byPrimary = new Map<string, Map<string, number>>();
                series.forEach((d: any) => {
                    const parts = parseName(d.name || "");
                    const pval = parts[primary] ?? "not set";
                    const sval = secondary
                        ? parts[secondary] ?? (secondary === "age_band" ? AGE_BANDS[0] : "not set")
                        : "Total";
                    if (!byPrimary.has(pval)) byPrimary.set(pval, new Map());
                    byPrimary.get(pval)!.set(sval, Number(d.value) || 0);
                });

                rows.push([DIM_LABEL_MAP[primary], "Name", "Value"]);
                const pOrder = ORDER[primary] || Array.from(byPrimary.keys()).sort();
                const sOrder = secondary
                    ? ORDER[secondary] ||
                      Array.from(
                          new Set(
                              Array.from(byPrimary.values()).flatMap((m) => Array.from(m.keys()))
                          )
                      ).sort()
                    : ["Total"];

                pOrder.forEach((p) => {
                    rows.push([p]);
                    const inner = byPrimary.get(p) || new Map();
                    sOrder.forEach((s) => {
                        const val = inner.has(s) ? inner.get(s)! : 0;
                        rows.push(["", s, String(val)]);
                    });
                });
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
    }, [open, groupedStats, date.from, date.to, groupBy, categorizeBy, zones]);

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
