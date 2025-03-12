import React, { useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import { CSVLink } from "react-csv";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from "@mui/material";

import { IStats } from "@cbr/common/util/stats";
import { useZones } from "@cbr/common/util/hooks/zones";
import { useDisabilities } from "@cbr/common/util/hooks/disabilities";

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

        zones.forEach((k, v) => {
            rows.push([
                `${k}`,
                "Adult Male",
                "Adult Female",
                "Child Male",
                "Child Female",
                "Totals",
            ]);
            const femaleAdultTotalFollowUpVisits =
                stats?.follow_up_visits.find((item) => item.zone_id === v)?.female_adult_total ?? 0;
            const maleAdultTotalFollowUpVisits =
                stats?.follow_up_visits.find((item) => item.zone_id === v)?.male_adult_total ?? 0;
            const femaleChildTotalFollowUpVisits =
                stats?.follow_up_visits.find((item) => item.zone_id === v)?.female_child_total ?? 0;
            const maleChildTotalFollowUpVisits =
                stats?.follow_up_visits.find((item) => item.zone_id === v)?.male_child_total ?? 0;

            const totalFollowUpStats =
                femaleAdultTotalFollowUpVisits +
                maleAdultTotalFollowUpVisits +
                femaleChildTotalFollowUpVisits +
                maleChildTotalFollowUpVisits;

            const femaleAdultTotalNewClients =
                stats?.new_clients.find((item) => item.zone_id === v)?.female_adult_total ?? 0;
            const maleAdultTotalNewClients =
                stats?.new_clients.find((item) => item.zone_id === v)?.male_adult_total ?? 0;
            const femaleChildTotalNewClients =
                stats?.new_clients.find((item) => item.zone_id === v)?.female_child_total ?? 0;
            const maleChildTotalNewClients =
                stats?.new_clients.find((item) => item.zone_id === v)?.male_child_total ?? 0;

            const totalNewClientStats =
                femaleAdultTotalNewClients +
                maleAdultTotalNewClients +
                femaleChildTotalNewClients +
                maleChildTotalNewClients;

            rows.push([
                "New Clients",
                maleAdultTotalNewClients,
                femaleAdultTotalNewClients,
                maleChildTotalNewClients,
                femaleChildTotalNewClients,
                totalNewClientStats,
            ]);

            rows.push([
                "Follow Up Vists",
                maleAdultTotalFollowUpVisits,
                femaleAdultTotalFollowUpVisits,
                maleChildTotalFollowUpVisits,
                femaleChildTotalFollowUpVisits,
                totalFollowUpStats,
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
