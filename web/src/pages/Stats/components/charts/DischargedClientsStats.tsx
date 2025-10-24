import React, { useMemo } from "react";
import { Typography, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    CartesianGrid,
} from "recharts";
import { useZones } from "@cbr/common/util/hooks/zones";

type FlatPoint = { name: string; value: number };
type Categorized = { name: string; data: FlatPoint[] };
type GroupDim = "zone" | "gender" | "host_status" | "age_band";

interface IProps {
    stats?: { discharged_clients?: any };
    age?: any; // legacy props for consistency
    gender?: any;
    categorizeBy?: GroupDim | null;
    groupBy?: Set<GroupDim>;
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
    "#1976d2", // blue
    "#9c27b0", // purple
    "#2e7d32", // green
    "#ed6c02", // orange
    "#d32f2f", // red
    "#00838f", // teal
    "#5d4037", // brown
    "#455a64", // blue grey
    "#7cb342", // light green
    "#6d1b7b", // deep purple
    "#c0ca33", // lime
    "#0288d1", // light blue
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
                {seriesKeys.map((k: number) => (
                    <div key={k} style={{ display: "flex", gap: 8, fontSize: 12 }}>
                        <span style={{ minWidth: 190 }}>{k}</span>
                        <span>{row[k] ?? 0}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

const DischargedClientsStats: React.FC<IProps> = ({ stats, categorizeBy, groupBy }) => {
    const { t } = useTranslation();
    const zonesMap = useZones();
    const zoneNames = useMemo(() => Array.from(zonesMap.values()), [zonesMap]);
    const discharged = useMemo(() => stats?.discharged_clients || [], [stats]);

    // Detect if we are in a zone + host/refugee grouping
    const isZoneHostGrouping = useMemo(() => {
        const set = groupBy ?? new Set<GroupDim>();
        return set.size === 2 && set.has("zone") && set.has("host_status");
    }, [groupBy]);

    const inferredZoneHostGrouping = useMemo(() => {
        if (isZoneHostGrouping) return true;
        const list = Array.isArray(discharged) ? (discharged as any[]) : [];
        if (!isCategorized(list as any)) return false;
        const keys = new Set<string>(
            list.flatMap((c: any) => (c?.data ?? []).map((d: any) => String(d?.name ?? "")))
        );
        const hasHostRefugee = Array.from(keys).some((k) => /\b(host|refugee)\b/i.test(k));
        if (!hasHostRefugee) return false;
        const hasAnyZone = zoneNames.some((zn) =>
            Array.from(keys).some((k) => k.startsWith(String(zn)))
        );
        return hasAnyZone;
    }, [isZoneHostGrouping, discharged, zoneNames]);

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
        const header = "Discharged Clients";

        const groupList = Array.from(groupBy ?? new Set<GroupDim>());
        const sublineParts: string[] = [];
        if (categorizeBy) sublineParts.push(`Categorized by ${DIM_LABEL[categorizeBy]}`);
        if (groupList.length > 0)
            sublineParts.push(`Grouped by ${groupList.map((g) => DIM_LABEL[g]).join(" + ")}`);
        const subline = sublineParts.join(" · ");

        if (isCategorized(discharged)) {
            let keys: string[];
            if (exactSeriesKeys.length) {
                keys = exactSeriesKeys;
            } else {
                keys = Array.from(
                    new Set(
                        discharged.flatMap((c: Categorized) => (c.data || []).map((d) => d.name))
                    )
                );
            }

            const rows = discharged.map((cat: Categorized) => {
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

        // Fallback simple flat array
        const rows: Array<{ name: string; value: number }> = Array.isArray(discharged)
            ? discharged.map((d: any) => ({
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
    }, [discharged, categorizeBy, groupBy, t, exactSeriesKeys]);

    const xMax = React.useMemo(() => {
        if (!chartData || chartData.length === 0) return 0;
        if (seriesKeys.length === 1 && seriesKeys[0] === "value") {
            return Math.max(0, ...chartData.map((r: any) => Number(r.value) || 0));
        }
        return Math.max(
            0,
            ...chartData.map((r: any) => Math.max(0, ...seriesKeys.map((k) => Number(r[k]) || 0)))
        );
    }, [chartData, seriesKeys]);

    const xTicks = React.useMemo(() => {
        const m = Math.ceil(xMax);
        const limit = Math.max(1, m);
        return Array.from({ length: limit + 1 }, (_, i) => i);
    }, [xMax]);

    const yAxisWidth = useMemo(() => {
        if (!chartData || chartData.length === 0) return 80;
        const maxLabelLen = Math.max(...chartData.map((r: any) => String(r[yKey] ?? "").length));
        return Math.min(220, Math.max(60, maxLabelLen * 8 + 12));
    }, [chartData, yKey]);

    if (!discharged || discharged.length === 0) {
        return (
            <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
                <Box sx={{ width: "100%", maxWidth: 1100 }}>
                    <Typography variant="h3" align="center">
                        {"Discharged Clients"}
                    </Typography>
                    <Typography variant="body2" align="center">
                        {"No discharged clients found."}
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

                                // ✅ Robust case-insensitive matching for zone names
                                const zoneIndex = zoneNames.findIndex(
                                    (z) => z.toLowerCase().trim() === zoneLabel.toLowerCase().trim()
                                );

                                // ✅ Use idx as fallback so all bars still get unique colors
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

export default DischargedClientsStats;
