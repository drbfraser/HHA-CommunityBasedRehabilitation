import React, { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";
import { useZones } from "@cbr/common/util/hooks/zones";

type FlatPoint = { name: string; value: number };
type Categorized = { name: string; data: FlatPoint[] };
type GroupDim = "zone" | "gender" | "host_status" | "age_band";

interface IProps {
    stats?: { follow_up_visits?: any };
    categorizeBy?: GroupDim | null;
    groupBy?: Set<GroupDim>;
    age?: any;
    gender?: any;
}

const DIM_LABEL: Record<GroupDim, string> = {
    zone: "Zone",
    gender: "Gender",
    host_status: "Host/Refugee",
    age_band: "Age range",
};

function isCategorized(arr: any[]): arr is Categorized[] {
    return Array.isArray(arr) && arr.length > 0 && Array.isArray(arr[0]?.data);
}

const palette = [
    "#1976d2",
    "#9c27b0",
    "#2e7d32",
    "#ed6c02",
    "#d32f2f",
    "#00838f",
    "#5d4037",
    "#455a64",
    "#7cb342",
    "#6d1b7b",
    "#c0ca33",
    "#0288d1",
];

function AllBarsTooltip({ active, payload, label, seriesKeys }: any & { seriesKeys: string[] }) {
    if (!active || !payload || payload.length === 0) return null;
    const row = payload[0].payload || {};
    return (
        <div
            className="recharts-default-tooltip"
            style={{ background: "#fff", padding: 8, border: "1px solid #ccc" }}
        >
            <div style={{ fontWeight: 600, marginBottom: 6 }}>{label}</div>
            <div>
                {seriesKeys.map((k: string) => (
                    <div key={k} style={{ display: "flex", gap: 8, fontSize: 12 }}>
                        <span style={{ minWidth: 190 }}>{k}</span>
                        <span>{row[k] ?? 0}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

const FollowUpVisitsStats: React.FC<IProps> = ({ stats, categorizeBy, groupBy }) => {
    const { t } = useTranslation();
    const zonesMap = useZones();
    const zoneNames = useMemo(() => Array.from(zonesMap.values()), [zonesMap]);
    const visits = useMemo(() => stats?.follow_up_visits || [], [stats]);

    const isZoneHostGrouping = useMemo(() => {
        const set = groupBy ?? new Set<GroupDim>();
        return set.size === 2 && set.has("zone") && set.has("host_status");
    }, [groupBy]);

    const inferredZoneHostGrouping = useMemo(() => {
        if (isZoneHostGrouping) return true;
        const list = Array.isArray(visits) ? visits : [];
        if (!isCategorized(list)) return false;
        const keys = new Set<string>(
            list.flatMap((c: any) => (c?.data ?? []).map((d: any) => String(d?.name ?? "")))
        );
        const hasHostRefugee = Array.from(keys).some((k) => /\b(host|refugee)\b/i.test(k));
        if (!hasHostRefugee) return false;
        const hasAnyZone = zoneNames.some((zn) =>
            Array.from(keys).some((k) => k.startsWith(String(zn)))
        );
        return hasAnyZone;
    }, [isZoneHostGrouping, visits, zoneNames]);

    const wantZoneHostDomain = isZoneHostGrouping || inferredZoneHostGrouping;

    const exactSeriesKeys = useMemo(() => {
        if (!wantZoneHostDomain) return [] as string[];
        const keys: string[] = [];
        for (const zn of zoneNames) {
            keys.push(`${zn} host`);
            keys.push(`${zn} refugee`);
        }
        return keys;
    }, [wantZoneHostDomain, zoneNames]);

    const { chartData, seriesKeys, tooltipKeys, yKey, header, subline } = useMemo(() => {
        const header = t("statistics.followUpVisits") || "Follow-up Visits";
        const groupList = Array.from(groupBy ?? new Set<GroupDim>());
        const sublineParts: string[] = [];

        if (categorizeBy) sublineParts.push(`Categorized by ${DIM_LABEL[categorizeBy]}`);
        if (groupList.length > 0)
            sublineParts.push(`Grouped by ${groupList.map((g) => DIM_LABEL[g]).join(" + ")}`);

        const subline = sublineParts.join(" · ");

        if (isCategorized(visits)) {
            let keys: string[];
            if (exactSeriesKeys.length) {
                keys = exactSeriesKeys;
            } else {
                keys = Array.from(
                    new Set(visits.flatMap((c: Categorized) => (c.data || []).map((d) => d.name)))
                );
            }

            const rows = visits.map((cat: Categorized) => {
                const row: Record<string, any> = { category: String(cat.name) };
                const lookup = new Map<string, number>(
                    (cat.data || []).map((d) => [d.name, d.value])
                );
                keys.forEach((k) => {
                    row[k] = lookup.get(k) ?? 0;
                });
                return row;
            });

            const keysWithData = keys.filter((k) => rows.some((r) => Number(r[k]) > 0));

            return {
                chartData: rows,
                seriesKeys: keysWithData,
                tooltipKeys: keys,
                yKey: "category",
                header,
                subline,
            };
        }

        const rows: Array<{ name: string; value: number }> = Array.isArray(visits)
            ? visits.map((d: any) => ({
                  name: String(d?.name ?? ""),
                  value: Number(d?.value ?? 0),
              }))
            : [];

        return {
            chartData: rows,
            seriesKeys: ["value"],
            tooltipKeys: ["value"],
            yKey: "name",
            header,
            subline,
        };
    }, [visits, categorizeBy, groupBy, t, exactSeriesKeys]);

    const xMax = useMemo(() => {
        if (!chartData || chartData.length === 0) return 0;
        if (seriesKeys.length === 1 && seriesKeys[0] === "value") {
            return Math.max(0, ...chartData.map((r: any) => Number(r.value) || 0));
        }
        return Math.max(
            0,
            ...chartData.map((r: any) => Math.max(0, ...seriesKeys.map((k) => Number(r[k]) || 0)))
        );
    }, [chartData, seriesKeys]);

    const xTicks = useMemo(() => {
        const m = Math.ceil(xMax);
        const limit = Math.max(1, m);
        return Array.from({ length: limit + 1 }, (_, i) => i);
    }, [xMax]);

    const yAxisWidth = useMemo(() => {
        if (!chartData || chartData.length === 0) return 80;
        const maxLabelLen = Math.max(...chartData.map((r: any) => String(r[yKey] ?? "").length));
        return Math.min(220, Math.max(60, maxLabelLen * 8 + 12));
    }, [chartData, yKey]);

    if (!visits || visits.length === 0) {
        return (
            <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
                <Box sx={{ width: "100%", maxWidth: 1100 }}>
                    <Typography variant="h3" align="center">
                        {t("statistics.followUpVisits") || "Follow-up Visits"}
                    </Typography>
                    <Typography variant="body2" align="center">
                        {t("statistics.noVisitsFound") || "No data found."}
                    </Typography>
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
            <Box sx={{ width: "100%", maxWidth: 1100 }}>
                <Typography variant="h3" align="center" gutterBottom>
                    {header}
                </Typography>
                {subline && (
                    <Typography variant="body2" sx={{ mb: 1, textAlign: "center" }}>
                        {subline}
                    </Typography>
                )}

                <Box sx={{ width: "100%", height: 460 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            layout="vertical"
                            margin={{ top: 8, right: 16, bottom: 8, left: 0 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                type="number"
                                domain={[0, Math.ceil(xMax)]}
                                ticks={xTicks}
                                allowDecimals={false}
                            />
                            <YAxis
                                type="category"
                                dataKey={yKey}
                                width={yAxisWidth}
                                tick={{ fontSize: 12, textAnchor: "end" }}
                            />
                            <Tooltip
                                content={(p) => <AllBarsTooltip {...p} seriesKeys={tooltipKeys} />}
                            />
                            {seriesKeys.length > 1 && <Legend />}

                            {seriesKeys.map((key, idx) => {
                                const m = String(key).match(/^(.*)\s+(host|refugee)$/i);
                                const zoneLabel = m ? m[1] : String(key);
                                const status = (m ? m[2] : "host").toLowerCase();

                                // ✅ Case-insensitive, trimmed matching for zone names
                                const zoneIndex = zoneNames.findIndex(
                                    (z) => z.toLowerCase().trim() === zoneLabel.toLowerCase().trim()
                                );

                                // ✅ Fallback to idx for unique color assignment if no match found
                                const color =
                                    palette[(zoneIndex >= 0 ? zoneIndex : idx) % palette.length];
                                const opacity = status === "refugee" ? 0.55 : 1;

                                return (
                                    <Bar
                                        key={key}
                                        dataKey={key}
                                        name={key}
                                        fill={color}
                                        fillOpacity={opacity}
                                    />
                                );
                            })}
                        </BarChart>
                    </ResponsiveContainer>
                </Box>
            </Box>
        </Box>
    );
};

export default FollowUpVisitsStats;
