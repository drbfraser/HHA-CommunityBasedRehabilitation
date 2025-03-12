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

import { IStats, IStatsNewClients, IStatsFollowUpVisits } from "@cbr/common/util/stats";
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
                "ADULT MALE",
                "ADULT FEMALE",
                "CHILD MALE",
                "CHILD FEMALE",
                "TOTALS",
            ]);

            const getTotalByCategory = (category: string) => {
                let categoryDataHC: IStatsFollowUpVisits | IStatsNewClients = {} as
                    | IStatsFollowUpVisits
                    | IStatsNewClients;
                let categoryDataR: IStatsFollowUpVisits | IStatsNewClients = {} as
                    | IStatsFollowUpVisits
                    | IStatsNewClients;
                let categoryDataNA: IStatsFollowUpVisits | IStatsNewClients = {} as
                    | IStatsFollowUpVisits
                    | IStatsNewClients;

                // For simplicity sake this takes in a string as input
                // For future implementation, this could be changed to use an ENUM or constant instead
                if (category === "follow_up_visits") {
                    categoryDataHC =
                        stats?.[category]?.find(
                            (item: IStatsFollowUpVisits) =>
                                item.zone_id === v && item.hcr_type === "HC"
                        ) || ({} as IStatsFollowUpVisits);
                    categoryDataR =
                        stats?.[category]?.find(
                            (item: IStatsFollowUpVisits) =>
                                item.zone_id === v && item.hcr_type === "R"
                        ) || ({} as IStatsFollowUpVisits);
                    categoryDataNA =
                        stats?.[category]?.find(
                            (item: IStatsFollowUpVisits) =>
                                item.zone_id === v && item.hcr_type === "NA"
                        ) || ({} as IStatsFollowUpVisits);
                } else {
                    categoryDataHC =
                        stats?.new_clients.find(
                            (item: IStatsNewClients) => item.zone_id === v && item.hcr_type === "HC"
                        ) || ({} as IStatsNewClients);
                    categoryDataR =
                        stats?.new_clients.find(
                            (item: IStatsNewClients) => item.zone_id === v && item.hcr_type === "R"
                        ) || ({} as IStatsNewClients);
                    categoryDataNA =
                        stats?.new_clients.find(
                            (item: IStatsNewClients) => item.zone_id === v && item.hcr_type === "NA"
                        ) || ({} as IStatsNewClients);
                }

                return {
                    femaleAdultHC: categoryDataHC.female_adult_total ?? 0,
                    maleAdultHC: categoryDataHC.male_adult_total ?? 0,
                    femaleChildHC: categoryDataHC.female_child_total ?? 0,
                    maleChildHC: categoryDataHC.male_child_total ?? 0,
                    femaleAdultR: categoryDataR.female_adult_total ?? 0,
                    maleAdultR: categoryDataR.male_adult_total ?? 0,
                    femaleChildR: categoryDataR.female_child_total ?? 0,
                    maleChildR: categoryDataR.male_child_total ?? 0,
                    femaleAdultNA: categoryDataNA.female_adult_total ?? 0,
                    maleAdultNA: categoryDataNA.male_adult_total ?? 0,
                    femaleChildNA: categoryDataNA.female_child_total ?? 0,
                    maleChildNA: categoryDataNA.male_child_total ?? 0,
                };
            };

            const totalFollowUpStats = getTotalByCategory("follow_up_visits");
            const totalNewClientStats = getTotalByCategory("new_clients");

            // Stats for Host Communities
            const totalFollowUpHC =
                totalFollowUpStats.femaleAdultHC +
                totalFollowUpStats.maleAdultHC +
                totalFollowUpStats.femaleChildHC +
                totalFollowUpStats.maleChildHC;

            const totalNewClientsHC =
                totalNewClientStats.femaleAdultHC +
                totalNewClientStats.maleAdultHC +
                totalNewClientStats.femaleChildHC +
                totalNewClientStats.maleChildHC;

            const totalHC = totalNewClientsHC + totalFollowUpHC;

            rows.push([
                "New Clients (HC)",
                totalNewClientStats.maleAdultHC,
                totalNewClientStats.femaleAdultHC,
                totalNewClientStats.maleChildHC,
                totalNewClientStats.femaleChildHC,
                totalNewClientsHC ?? 0,
            ]);

            rows.push([
                "Follow Up Visits (HC)",
                totalFollowUpStats.maleAdultHC,
                totalFollowUpStats.femaleAdultHC,
                totalFollowUpStats.maleChildHC,
                totalFollowUpStats.femaleChildHC,
                totalFollowUpHC ?? 0,
            ]);

            // Stats for Refugees
            const totalFollowUpR =
                totalFollowUpStats.femaleAdultR +
                totalFollowUpStats.maleAdultR +
                totalFollowUpStats.femaleChildR +
                totalFollowUpStats.maleChildR;

            const totalNewClientsR =
                totalNewClientStats.femaleAdultR +
                totalNewClientStats.maleAdultR +
                totalNewClientStats.femaleChildR +
                totalNewClientStats.maleChildR;

            const totalR = totalNewClientsR + totalFollowUpR;

            rows.push([
                "New Clients (R)",
                totalNewClientStats.maleAdultR,
                totalNewClientStats.femaleAdultR,
                totalNewClientStats.maleChildR,
                totalNewClientStats.femaleChildR,
                totalNewClientsR ?? 0,
            ]);

            rows.push([
                "Follow Up Visits (R)",
                totalFollowUpStats.maleAdultR,
                totalFollowUpStats.femaleAdultR,
                totalFollowUpStats.maleChildR,
                totalFollowUpStats.femaleChildR,
                totalFollowUpR ?? 0,
            ]);

            // Stats for Not Set
            const totalFollowUpNA =
                totalFollowUpStats.femaleAdultNA +
                totalFollowUpStats.maleAdultNA +
                totalFollowUpStats.femaleChildNA +
                totalFollowUpStats.maleChildNA;

            const totalNewClientsNA =
                totalNewClientStats.femaleAdultNA +
                totalNewClientStats.maleAdultNA +
                totalNewClientStats.femaleChildNA +
                totalNewClientStats.maleChildNA;

            const totalNA = totalNewClientsNA + totalFollowUpNA;

            rows.push([
                "New Clients (NA)",
                totalNewClientStats.maleAdultNA,
                totalNewClientStats.femaleAdultNA,
                totalNewClientStats.maleChildNA,
                totalNewClientStats.femaleChildNA,
                totalNewClientsNA ?? 0,
            ]);

            rows.push([
                "Follow Up Visits (NA)",
                totalFollowUpStats.maleAdultNA,
                totalFollowUpStats.femaleAdultNA,
                totalFollowUpStats.maleChildNA,
                totalFollowUpStats.femaleChildNA,
                totalFollowUpNA ?? 0,
            ]);

            const total = totalHC + totalR + totalNA;
            rows.push([
                "Total",
                totalFollowUpStats.maleAdultHC +
                    totalNewClientStats.maleAdultHC +
                    totalFollowUpStats.maleAdultR +
                    totalNewClientStats.maleAdultR +
                    totalFollowUpStats.maleAdultNA +
                    totalNewClientStats.maleAdultNA,
                totalFollowUpStats.femaleAdultHC +
                    totalNewClientStats.femaleAdultHC +
                    totalFollowUpStats.femaleAdultR +
                    totalNewClientStats.femaleAdultR +
                    totalFollowUpStats.femaleAdultNA +
                    totalNewClientStats.femaleAdultNA,
                totalFollowUpStats.maleChildHC +
                    totalNewClientStats.maleChildHC +
                    totalFollowUpStats.maleChildR +
                    totalNewClientStats.maleChildR +
                    totalFollowUpStats.maleChildNA +
                    totalNewClientStats.maleChildNA,
                totalFollowUpStats.femaleChildHC +
                    totalNewClientStats.femaleChildHC +
                    totalFollowUpStats.femaleChildR +
                    totalNewClientStats.femaleChildR +
                    totalFollowUpStats.femaleChildNA +
                    totalNewClientStats.femaleChildNA,
                total ?? 0,
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
