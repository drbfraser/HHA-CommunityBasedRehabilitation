import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from "@mui/material";
import React, { useMemo } from "react";
import { CSVLink } from "react-csv";
import { Trans, useTranslation } from "react-i18next";

import { useDisabilities } from "@cbr/common/util/hooks/disabilities";
import { useZones } from "@cbr/common/util/hooks/zones";
import { IStats, IStatsFollowUpVisits, IStatsNewClients } from "@cbr/common/util/stats";

interface IProps {
    open: boolean;
    onClose: () => void;
    stats?: IStats;
}

const ExportStats = ({ open, onClose, stats }: IProps) => {
    const zones = useZones();
    const { t } = useTranslation();
    const disabilities = useDisabilities(t);

    const data = useMemo(() => {
        if (!open || !stats || !zones.size || !disabilities.size) {
            return "Data not ready";
        }

        const rows = [];

        rows.push(["***VISITS***"]);
        rows.push(["ZONE", "TOTAL VISITS", "HEALTH", "EDUCATION", "SOCIAL", "NUTRITION"]);
        stats.visits.forEach((v) => {
            rows.push([
                zones.get(v.zone_id),
                v.total,
                v.health_count,
                v.educat_count,
                v.social_count,
                v.nutrit_count,
            ]);
        });
        rows.push([""]);

        const unres = stats.referrals_unresolved;
        const res = stats.referrals_resolved;

        rows.push(["***REFERRALS***"]);
        rows.push(["REASON", "UNRESOLVED COUNT", "RESOLVED COUNT"]);
        rows.push(["TOTAL", unres.total, res.total]);
        rows.push(["Wheelchair", unres.wheelchair_count, res.wheelchair_count]);
        rows.push(["Physiotherapy", unres.physiotherapy_count, res.physiotherapy_count]);
        rows.push(["Prosthetic", unres.prosthetic_count, res.prosthetic_count]);
        rows.push(["Orthotic", unres.orthotic_count, res.orthotic_count]);
        rows.push(["Other", unres.other_count, res.other_count]);
        rows.push([""]);

        rows.push(["***DISABILITIES***"]);
        rows.push(["Clients with Disabilities", stats.clients_with_disabilities]);
        rows.push(["DISABILITY", "COUNT"]);
        stats.disabilities.forEach((d) => {
            rows.push([disabilities.get(d.disability_id), d.total]);
        });

        rows.push([""]);

        const categories = [
            { label: "New Clients", key: "new_clients" },
            { label: "Follow Up Visits", key: "follow_up_visits" },
        ];

        const groups = [
            { label: "HC", key: "HC" },
            { label: "R", key: "R" },
            { label: "NA", key: "NA" },
        ];

        const calculateTotal = (
            statsData: any,
            category: string,
            zoneId: number,
            groupKey: string
        ) => {
            const data =
                statsData?.[category]?.find(
                    (item: IStatsFollowUpVisits | IStatsNewClients) =>
                        item.zone_id === zoneId && item.hcr_type === groupKey
                ) || {};

            return {
                maleAdult: data.male_adult_total ?? 0,
                femaleAdult: data.female_adult_total ?? 0,
                maleChild: data.male_child_total ?? 0,
                femaleChild: data.female_child_total ?? 0,
            };
        };

        zones.forEach((k, v) => {
            rows.push([
                `${k}`,
                "ADULT MALE",
                "ADULT FEMALE",
                "CHILD MALE",
                "CHILD FEMALE",
                "TOTALS",
            ]);
            let runningTotal = 0;
            const totals: Record<string, number> = {};

            groups.forEach(({ label: groupLabel, key: groupKey }) => {
                categories.forEach(({ label, key: categoryKey }) => {
                    const data = calculateTotal(stats, categoryKey, v, groupKey);
                    const total =
                        data.maleAdult + data.femaleAdult + data.maleChild + data.femaleChild;
                    runningTotal += total;

                    const demographics = [
                        { key: "adult_male", value: data.maleAdult },
                        { key: "adult_female", value: data.femaleAdult },
                        { key: "child_male", value: data.maleChild },
                        { key: "child_female", value: data.femaleChild },
                    ];

                    demographics.forEach(({ key, value }) => {
                        const totalKey = `${key}_${v}`;
                        totals[totalKey] = (totals[totalKey] || 0) + value;
                    });

                    rows.push([
                        `${label} (${groupLabel})`,
                        data.maleAdult,
                        data.femaleAdult,
                        data.maleChild,
                        data.femaleChild,
                        total,
                    ]);
                });
            });

            rows.push([
                "Total",
                totals[`adult_male_${v}`],
                totals[`adult_female_${v}`],
                totals[`child_male_${v}`],
                totals[`child_female_${v}`],
                runningTotal,
            ]);

            rows.push([""]);
        });
        return rows;
    }, [open, stats, zones, disabilities]);

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
