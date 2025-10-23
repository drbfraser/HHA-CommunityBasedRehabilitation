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
    stats?: { referrals_resolved?: any; referrals_unresolved?: any };
    categorizeBy?: GroupDim | null;
    groupBy?: Set<GroupDim>;
    age?: any; // legacy, unused here
    gender?: any; // legacy, unused here
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
        <div style={{ background: "#fff", padding: 8, border: "1px solid #ccc" }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>{label}</div>
            {seriesKeys.map((k: string) => (
                <div key={k} style={{ display: "flex", gap: 8, fontSize: 12 }}>
                    <span style={{ minWidth: 190 }}>{k}</span>
                    <span>{row[k] ?? 0}</span>
                </div>
            ))}
        </div>
    );
}

const ReferralStats: React.FC<IProps> = ({ stats, groupBy }) => {
    const { t } = useTranslation();
    const zonesMap = useZones();
    const zoneNames = useMemo(() => Array.from(zonesMap.values()), [zonesMap]);

    const resolved = useMemo(() => stats?.referrals_resolved || [], [stats]);
    const unresolved = useMemo(() => stats?.referrals_unresolved || [], [stats]);

    const isZoneHostGrouping = useMemo(() => {
        const set = groupBy ?? new Set<GroupDim>();
        return set.size === 2 && set.has("zone") && set.has("host_status");
    }, [groupBy]);

    const inferZoneHostFromList = (list: any[]) => {
        if (isZoneHostGrouping) return true;
        if (!Array.isArray(list) || list.length === 0 || !Array.isArray(list[0]?.data))
            return false;

        const keys = new Set<string>(
            list.flatMap((c: any) => (c?.data ?? []).map((d: any) => String(d?.name ?? "")))
        );
        const hasHostRefugee = Array.from(keys).some((k) => /\b(host|refugee)\b/i.test(k));
        if (!hasHostRefugee) return false;
        return zoneNames.some((zn) => Array.from(keys).some((k) => k.startsWith(String(zn))));
    };

    const resolvedWantZoneHostDomain = useMemo(
        () => inferZoneHostFromList(resolved),
        [resolved, isZoneHostGrouping, zoneNames]
    );
    const unresolvedWantZoneHostDomain = useMemo(
        () => inferZoneHostFromList(unresolved),
        [unresolved, isZoneHostGrouping, zoneNames]
    );

    const makeSeriesKeys = (wantDomain: boolean) => {
        if (!wantDomain) return [] as string[];
        const keys: string[] = [];
        for (const zn of zoneNames) {
            keys.push(`${zn} host`);
            keys.push(`${zn} refugee`);
        }
        return keys;
    };

    const resolvedExactSeriesKeys = useMemo(
        () => makeSeriesKeys(resolvedWantZoneHostDomain),
        [resolvedWantZoneHostDomain, zoneNames]
    );
    const unresolvedExactSeriesKeys = useMemo(
        () => makeSeriesKeys(unresolvedWantZoneHostDomain),
        [unresolvedWantZoneHostDomain, zoneNames]
    );

    const buildPropsFrom = (list: any[], exactSeriesKeys: string[], heading: string) => {
        if (Array.isArray(list) && list.length > 0 && Array.isArray(list[0]?.data)) {
            const keys = exactSeriesKeys.length
                ? exactSeriesKeys
                : Array.from(
                      new Set(list.flatMap((c: Categorized) => (c.data || []).map((d) => d.name)))
                  );
            const rows = list.map((cat: Categorized) => {
                const row: Record<string, any> = { category: String(cat.name) };
                const lookup = new Map<string, number>(
                    (cat.data || []).map((d) => [d.name, d.value])
                );
                keys.forEach((k) => (row[k] = lookup.get(k) ?? 0));
                return row;
            });
            return {
                chartData: rows,
                seriesKeys: keys.filter((k) => rows.some((r) => Number(r[k]) > 0)),
                tooltipKeys: keys,
                yKey: "category" as const,
                header: heading,
            };
        }

        const rows = Array.isArray(list)
            ? list.map((d: any) => ({ name: String(d?.name ?? ""), value: Number(d?.value ?? 0) }))
            : [];
        return {
            chartData: rows,
            seriesKeys: ["value"],
            tooltipKeys: ["value"],
            yKey: "name" as const,
            header: heading,
        };
    };

    const resolvedChart = useMemo(
        () => buildPropsFrom(resolved, resolvedExactSeriesKeys, "Resolved Referrals"),
        [resolved, resolvedExactSeriesKeys]
    );
    const unresolvedChart = useMemo(
        () => buildPropsFrom(unresolved, unresolvedExactSeriesKeys, "Unresolved Referrals"),
        [unresolved, unresolvedExactSeriesKeys]
    );

    const computeXMax = (chartData: any[], seriesKeys: string[]) =>
        seriesKeys.length === 1 && seriesKeys[0] === "value"
            ? Math.max(0, ...chartData.map((r: any) => Number(r.value) || 0))
            : Math.max(
                  0,
                  ...chartData.map((r: any) =>
                      Math.max(0, ...seriesKeys.map((k) => Number(r[k]) || 0))
                  )
              );

    const RenderChartBlock = ({
        chartData,
        seriesKeys,
        tooltipKeys,
        yKey,
    }: {
        chartData: any[];
        seriesKeys: string[];
        tooltipKeys: string[];
        yKey: string;
    }) => {
        const xMax = computeXMax(chartData, seriesKeys);
        const yAxisWidth = Math.min(
            220,
            Math.max(
                60,
                Math.max(...chartData.map((r: any) => String(r[yKey] ?? "").length)) * 8 + 12
            )
        );

        return (
            <Box sx={{ width: "100%", height: 460 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{ top: 8, right: 16, bottom: 8, left: 0 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" domain={[0, Math.ceil(xMax)]} allowDecimals={false} />
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
                        {seriesKeys.map((key) => {
                            const m = String(key).match(/^(.*)\s+(host|refugee)$/i);
                            const zoneLabel = m ? m[1] : String(key);
                            const status = (m ? m[2] : "host").toLowerCase();
                            const zoneIndex = Math.max(0, zoneNames.indexOf(zoneLabel));
                            const color = palette[zoneIndex % palette.length];
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
        );
    };

    if ((!resolved || resolved.length === 0) && (!unresolved || unresolved.length === 0)) {
        return (
            <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
                <Box sx={{ width: "100%", maxWidth: 1100 }}>
                    <Typography variant="h3" align="center">
                        {t("statistics.referrals") || "Referrals"}
                    </Typography>
                    <Typography variant="body2" align="center">
                        {"No referrals found."}
                    </Typography>
                </Box>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 4,
                alignItems: "center",
            }}
        >
            {/* Unresolved Referrals */}
            <Box sx={{ width: "100%", maxWidth: 1100 }}>
                <Typography variant="h3" align="center" gutterBottom>
                    Unresolved Referrals
                </Typography>
                {!unresolvedChart.chartData || unresolvedChart.chartData.length === 0 ? (
                    <Typography variant="body2" align="center">
                        No unresolved referrals found.
                    </Typography>
                ) : (
                    <RenderChartBlock
                        chartData={unresolvedChart.chartData}
                        seriesKeys={unresolvedChart.seriesKeys}
                        tooltipKeys={unresolvedChart.tooltipKeys}
                        yKey={unresolvedChart.yKey}
                    />
                )}
            </Box>

            {/* Resolved Referrals */}
            <Box sx={{ width: "100%", maxWidth: 1100 }}>
                <Typography variant="h3" align="center" gutterBottom>
                    Resolved Referrals
                </Typography>
                {!resolvedChart.chartData || resolvedChart.chartData.length === 0 ? (
                    <Typography variant="body2" align="center">
                        No resolved referrals found.
                    </Typography>
                ) : (
                    <RenderChartBlock
                        chartData={resolvedChart.chartData}
                        seriesKeys={resolvedChart.seriesKeys}
                        tooltipKeys={resolvedChart.tooltipKeys}
                        yKey={resolvedChart.yKey}
                    />
                )}
            </Box>
        </Box>
    );
};

export default ReferralStats;
