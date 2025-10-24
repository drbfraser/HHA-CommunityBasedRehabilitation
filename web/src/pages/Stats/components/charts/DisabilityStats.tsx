import React, { useMemo } from "react";
import { Typography, Box, Skeleton } from "@mui/material";
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
import { useDisabilities } from "@cbr/common/util/hooks/disabilities";
import { IAge, IGender } from "../filterbar/StatsDemographicFilter";
import { IUser } from "@cbr/common/util/users";
import { IDateRange } from "../filterbar/StatsDateFilter";
import FilterHeaders from "./FilterHeaders";

type FlatPoint = { name: string; value: number };
type Categorized = { name: string; data: FlatPoint[] };
type GroupDim = "zone" | "gender" | "host_status" | "age_band";

interface IProps {
    stats?: { disabilities?: any };
    categorizeBy?: GroupDim | null;
    groupBy?: Set<GroupDim>;
    age?: IAge; // legacy props for consistency
    gender?: IGender;
    user?: IUser | null; // legacy props for consistency
    dateRange?: IDateRange;
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

const DisabilityStats: React.FC<IProps> = ({
    stats,
    categorizeBy,
    groupBy,
    user,
    age,
    gender,
    dateRange,
}) => {
    const { t } = useTranslation();
    const disabilities = useDisabilities(t);
    const disabilityNames = useMemo(() => Array.from(disabilities.values()), [disabilities]);
    const disabilitiesData = useMemo(() => stats?.disabilities || [], [stats]);

    const isZoneHostGrouping = useMemo(() => {
        const set = groupBy ?? new Set<GroupDim>();
        return set.size === 2 && set.has("zone") && set.has("host_status");
    }, [groupBy]);

    const inferredZoneHostGrouping = useMemo(() => {
        if (isZoneHostGrouping) return true;
        const list = Array.isArray(disabilitiesData) ? (disabilitiesData as any[]) : [];
        if (!isCategorized(list)) return false;
        const keys = new Set<string>(
            list.flatMap((c: any) => (c?.data ?? []).map((d: any) => String(d?.name ?? "")))
        );
        const hasHostRefugee = Array.from(keys).some((k) => /\b(host|refugee)\b/i.test(k));
        const hasAnyDisability = disabilityNames.some((d) =>
            Array.from(keys).some((k) => k.startsWith(String(d)))
        );
        return hasHostRefugee && hasAnyDisability;
    }, [isZoneHostGrouping, disabilitiesData, disabilityNames]);

    const wantZoneHostDomain = isZoneHostGrouping || inferredZoneHostGrouping;

    const exactSeriesKeys = useMemo(() => {
        if (!wantZoneHostDomain) return [] as string[];
        const keys: string[] = [];
        for (const d of disabilityNames) {
            keys.push(`${d} host`);
            keys.push(`${d} refugee`);
        }
        return keys;
    }, [wantZoneHostDomain, disabilityNames]);

    const { chartData, seriesKeys, tooltipKeys, yKey, header, subline } = useMemo(() => {
        const header = t("statistics.disabilities") || "Disabilities";

        const groupList = Array.from(groupBy ?? new Set<GroupDim>());
        const sublineParts: string[] = [];
        if (categorizeBy) sublineParts.push(`Categorized by ${DIM_LABEL[categorizeBy]}`);
        if (groupList.length > 0)
            sublineParts.push(`Grouped by ${groupList.map((g) => DIM_LABEL[g]).join(" + ")}`);
        const subline = sublineParts.join(" · ");

        if (isCategorized(disabilitiesData)) {
            let keys: string[];
            if (exactSeriesKeys.length) {
                keys = exactSeriesKeys;
            } else {
                keys = Array.from(
                    new Set(
                        disabilitiesData.flatMap((c: Categorized) =>
                            (c.data || []).map((d) => d.name)
                        )
                    )
                );
            }

            const rows = disabilitiesData.map((cat: Categorized) => {
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

        const rows: Array<{ name: string; value: number }> = Array.isArray(disabilitiesData)
            ? disabilitiesData.map((d: any) => ({
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
    }, [disabilitiesData, categorizeBy, groupBy, t, exactSeriesKeys]);

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

    if (!disabilitiesData || disabilitiesData.length === 0) {
        return (
            <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
                <Box sx={{ width: "100%", maxWidth: 1100 }}>
                    <Typography variant="h3" align="center">
                        {t("statistics.disabilities") || "Disabilities"}
                    </Typography>
                    <FilterHeaders user={user} gender={gender} age={age} dateRange={dateRange} />

                    <Typography variant="body2" align="center">
                        {"No disability data found."}
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
                <FilterHeaders user={user} gender={gender} age={age} dateRange={dateRange} />

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
                                const label = m ? m[1] : String(key);
                                const status = (m ? m[2] : "host").toLowerCase();

                                const idxLabel = disabilityNames.findIndex(
                                    (d) => d.toLowerCase().trim() === label.toLowerCase().trim()
                                );

                                const color =
                                    palette[(idxLabel >= 0 ? idxLabel : idx) % palette.length];
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

export default DisabilityStats;
