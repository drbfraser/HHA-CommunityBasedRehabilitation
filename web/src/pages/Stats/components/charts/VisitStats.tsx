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
    stats?: { visits?: any };
    age?: any; // legacy, unused here
    gender?: any; // legacy, unused here
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

const VisitStats: React.FC<IProps> = ({ stats, categorizeBy, groupBy }) => {
    const { t } = useTranslation();
    const zonesMap = useZones(); // Map<number, string>
    const zoneNames = useMemo(() => Array.from(zonesMap.values()), [zonesMap]);
    const visits = useMemo(() => stats?.visits || [], [stats]);

    // Are we in the specific case: groupBy == {zone, host_status}?
    const isZoneHostGrouping = useMemo(() => {
        const set = groupBy ?? new Set<GroupDim>();
        return set.size === 2 && set.has("zone") && set.has("host_status");
    }, [groupBy]);

    // Build the EXACT series keys we want: "<Zone> host" and "<Zone> refugee" for every zone
    const exactSeriesKeys = useMemo(() => {
        if (!isZoneHostGrouping) return [] as string[];
        const keys: string[] = [];
        for (const zn of zoneNames) {
            keys.push(`${zn} host`);
            keys.push(`${zn} refugee`);
        }
        return keys;
    }, [isZoneHostGrouping, zoneNames]);

    const { chartData, seriesKeys, yKey, header, subline } = useMemo(() => {
        const header = t("statistics.visits") || "Visits";

        const groupList = Array.from(groupBy ?? new Set<GroupDim>());
        const sublineParts: string[] = [];
        if (categorizeBy) sublineParts.push(`Categorized by ${DIM_LABEL[categorizeBy]}`);
        if (groupList.length > 0)
            sublineParts.push(`Grouped by ${groupList.map((g) => DIM_LABEL[g]).join(" + ")}`);
        const subline = sublineParts.join(" · ");

        // If backend returns categorized shape:
        if (isCategorized(visits)) {
            // Decide which series to use.
            // If zone×host grouping: use the exact 2×zones list (guarantees presence)
            // Else: fall back to detected keys from payload.
            let keys: string[];
            if (isZoneHostGrouping && exactSeriesKeys.length) {
                keys = exactSeriesKeys;
            } else {
                // fallback: use what appears in the data
                keys = Array.from(
                    new Set(visits.flatMap((c: Categorized) => (c.data || []).map((d) => d.name)))
                );
            }

            // Build rows and zero-fill for any missing key
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

            return {
                chartData: rows,
                seriesKeys: keys,
                yKey: "category",
                header,
                subline,
            };
        }

        // Flat array -> simple bar
        const rows: Array<{ name: string; value: number }> = Array.isArray(visits)
            ? visits.map((d: any) => ({
                  name: String(d?.name ?? ""),
                  value: Number(d?.value ?? 0),
              }))
            : [];
        return {
            chartData: rows,
            seriesKeys: ["value"],
            yKey: "name",
            header,
            subline,
        };
    }, [visits, categorizeBy, groupBy, t, isZoneHostGrouping, exactSeriesKeys]);

    if (!visits || visits.length === 0) {
        return (
            <Box>
                <Typography variant="h3">{t("statistics.visits") || "Visits"}</Typography>
                <Typography variant="body2">
                    {t("statistics.noVisitsFound") || "No visits found."}
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h3" gutterBottom>
                {header}
            </Typography>
            {subline && (
                <Typography variant="body2" sx={{ mb: 1 }}>
                    {subline}
                </Typography>
            )}

            <Box sx={{ width: "100%", height: 460 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{ top: 8, right: 16, bottom: 8, left: 16 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey={yKey} width={180} tick={{ fontSize: 12 }} />
                        <Tooltip
                            content={(p) => <AllBarsTooltip {...p} seriesKeys={seriesKeys} />}
                        />
                        {seriesKeys.length > 1 && <Legend />}

                        {seriesKeys.map((key, idx) => (
                            <Bar
                                key={key}
                                dataKey={key}
                                name={key}
                                // stackId="1"  // uncomment if you prefer stacked bars
                                fill={palette[idx % palette.length]}
                            />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </Box>
        </Box>
    );
};

export default VisitStats;
