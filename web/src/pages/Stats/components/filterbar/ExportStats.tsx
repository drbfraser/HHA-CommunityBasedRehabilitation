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
import {
    IStats,
    IStatsDisability,
    IStatsFollowUpVisits,
    IStatsNewClients,
    IStatsReferral,
    IStatsVisit,
    StatsReferralCategory,
    StatsVisitCategory,
} from "@cbr/common/util/stats";
import { IDemographicTotals } from "../charts/HorizontalBarGraphStats";
import { IDateRange } from "./StatsDateFilter";
import { IAge, IGender } from "./StatsDemographicFilter";

interface IProps {
    open: boolean;
    onClose: () => void;
    stats?: IStats;
    age: IAge;
    gender: IGender;
    date: IDateRange;
}

type StatsCategories =
    | IStatsFollowUpVisits
    | IStatsNewClients
    | IStatsDisability
    | IStatsReferral
    | IStatsVisit;

interface CategoryObject {
    category: string;
    demographicData: DemographicData;
}

interface DemographicData {
    female_adult_total: number;
    male_adult_total: number;
    female_child_total: number;
    male_child_total: number;
    total?: number;
}

type VisitCategoryMapping = Record<string, string>;
const visitCategoryMappings: VisitCategoryMapping = {
    health: "Health",
    educat: "Education",
    mental: "Mental",
    nutrit: "Nutrition",
    social: "Social",
};

const dataCategories: StatsReferralCategory[] = [
    "wheelchair",
    "physiotherapy",
    "prosthetic",
    "orthotic",
    "nutrition_agriculture",
    "mental_health",
    "other",
];

const categoryTitles: string[] = [
    "Wheelchair",
    "Physiotherapy",
    "Prosthetic",
    "Orthotic",
    "Nutrition",
    "Mental Health",
    "Other",
];

const visitCategories: StatsVisitCategory[] = ["health", "educat", "social", "nutrit", "mental"];

interface ILabelledDemographicTotals extends IDemographicTotals {
    category: string;
    total: number;
}

const ExportStats = ({ open, onClose, stats, age, gender, date }: IProps) => {
    const zones = useZones();
    const { t } = useTranslation();
    const disabilities = useDisabilities(t);

    const data = useMemo(() => {
        if (!open || !stats || !zones.size || !disabilities.size) {
            return "Data not ready";
        }

        const demographicRows = (title?: string) => {
            const row = [title];
            if (age.adult && gender.male) row.push("ADULT MALE");
            if (age.adult && gender.female) row.push("ADULT FEMALE");
            if (age.child && gender.male) row.push("CHILD MALE");
            if (age.child && gender.female) row.push("CHILD FEMALE");
            row.push("Total");
            return row;
        };

        const rows = [];

        // DATE range
        if (date.from === "" && date.to === "") {
            rows.push(["DATE RANGE: All Time"]);
        } else {
            rows.push(["DATE RANGE: ", date.from, date.to]);
        }

        rows.push([""]);

        // VISTS Stats
        const visitDataArray: Array<{
            zone: string;
            categories: CategoryObject[];
            total: number;
            totals: DemographicData;
        }> = [];

        const visitDemographicTotals: DemographicData = {
            female_adult_total: 0,
            male_adult_total: 0,
            female_child_total: 0,
            male_child_total: 0,
        };

        visitDemographicTotals.total = 0;

        stats.visits.forEach((v) => {
            const zone = zones.get(v.zone_id);
            if (!zone) return;

            const categoriesArray: CategoryObject[] = [];
            visitDemographicTotals.female_adult_total = 0;
            visitDemographicTotals.male_adult_total = 0;
            visitDemographicTotals.female_child_total = 0;
            visitDemographicTotals.male_child_total = 0;

            const zoneTotal: DemographicData = {
                female_adult_total: 0,
                male_adult_total: 0,
                female_child_total: 0,
                male_child_total: 0,
                total: 0,
            };

            let totalCount = 0;
            visitCategories.forEach((cat) => {
                const demoData: DemographicData = {
                    female_adult_total: v[`${cat}_female_adult_total`] ?? 0,
                    male_adult_total: v[`${cat}_male_child_total`] ?? 0,
                    female_child_total: v[`${cat}_female_child_total`] ?? 0,
                    male_child_total: v[`${cat}_male_child_total`] ?? 0,
                };

                demoData.total =
                    demoData.female_adult_total +
                    demoData.male_adult_total +
                    demoData.female_child_total +
                    demoData.male_child_total;

                const catData: CategoryObject = {
                    category: cat,
                    demographicData: demoData,
                };

                categoriesArray.push(catData);

                visitDemographicTotals.female_adult_total += demoData.female_adult_total;
                visitDemographicTotals.male_adult_total += demoData.male_adult_total;
                visitDemographicTotals.female_child_total += demoData.female_child_total;
                visitDemographicTotals.male_child_total += demoData.male_child_total;
                totalCount += demoData.total;
            });

            zoneTotal.female_adult_total = visitDemographicTotals.female_adult_total;
            zoneTotal.male_adult_total = visitDemographicTotals.male_adult_total;
            zoneTotal.female_child_total = visitDemographicTotals.female_child_total;
            zoneTotal.male_child_total = visitDemographicTotals.male_child_total;

            visitDataArray.push({
                zone,
                categories: categoriesArray,
                totals: zoneTotal,
                total: totalCount,
            });
        });

        rows.push(["***VISITS***"]);
        visitDataArray.forEach((v) => {
            const row = demographicRows(v.zone);
            rows.push(row);

            v.categories.forEach((c) => {
                const dData = c.demographicData;

                const dataRow = [visitCategoryMappings[c.category]];
                if (age.adult && gender.male) dataRow.push(dData.male_adult_total.toString());
                if (age.adult && gender.female) dataRow.push(dData.female_adult_total.toString());
                if (age.child && gender.male) dataRow.push(dData.male_child_total.toString());
                if (age.child && gender.female) dataRow.push(dData.female_child_total.toString());

                dataRow.push(dData.total!.toString());
                rows.push(dataRow);
            });

            const totalRow = ["Total"];

            if (age.adult && gender.male) totalRow.push(v.totals.male_adult_total.toString());
            if (age.adult && gender.female) totalRow.push(v.totals.female_adult_total.toString());
            if (age.child && gender.male) totalRow.push(v.totals.male_child_total.toString());
            if (age.child && gender.female) totalRow.push(v.totals.female_child_total.toString());

            totalRow.push(v.total.toString());
            rows.push(totalRow);

            rows.push([""]);
        });

        rows.push(["***REFERRALS***"]);
        let rFAdult = 0;
        let rMAdult = 0;
        let rFChild = 0;
        let rMChild = 0;
        let rTotal = 0;

        let unFAdult = 0;
        let unMAdult = 0;
        let unFChild = 0;
        let unMChild = 0;
        let unTotal = 0;

        const resolvedStats: ILabelledDemographicTotals[] = [];
        const unresolvedStats: ILabelledDemographicTotals[] = [];

        let i = 0;
        dataCategories.forEach((category) => {
            const resolvedCategoryStats = {
                female_adult: stats.referrals_resolved[`${category}_female_adult_total`] as number,
                male_adult: stats.referrals_resolved[`${category}_male_adult_total`] as number,
                female_child: stats.referrals_resolved[`${category}_female_child_total`] as number,
                male_child: stats.referrals_resolved[`${category}_male_child_total`] as number,
                category: categoryTitles[i],
                total: 0,
            };
            resolvedCategoryStats.total =
                resolvedCategoryStats.female_adult +
                resolvedCategoryStats.female_child +
                resolvedCategoryStats.male_adult +
                resolvedCategoryStats.male_child;

            unTotal += resolvedCategoryStats.total;

            const unresolvedCategoryStats = {
                female_adult: stats.referrals_resolved[`${category}_female_adult_total`] as number,
                male_adult: stats.referrals_resolved[`${category}_male_adult_total`] as number,
                female_child: stats.referrals_resolved[`${category}_female_child_total`] as number,
                male_child: stats.referrals_resolved[`${category}_male_child_total`] as number,
                category: categoryTitles[i],
                total: 0,
            };

            unresolvedCategoryStats.total =
                unresolvedCategoryStats.female_adult +
                unresolvedCategoryStats.female_child +
                unresolvedCategoryStats.male_adult +
                unresolvedCategoryStats.male_child;

            rTotal += unresolvedCategoryStats.total;

            resolvedStats.push(resolvedCategoryStats);
            unresolvedStats.push(unresolvedCategoryStats);

            rFAdult += resolvedCategoryStats.female_adult;
            rMAdult += resolvedCategoryStats.male_adult;
            rFChild += resolvedCategoryStats.female_child;
            rMChild += resolvedCategoryStats.male_child;

            unFAdult += unresolvedCategoryStats.female_adult;
            unMAdult += unresolvedCategoryStats.male_adult;
            unFChild += unresolvedCategoryStats.female_child;
            unMChild += unresolvedCategoryStats.male_child;
            i += 1;
        });

        const resRows = demographicRows("RESOLVED");
        rows.push(resRows);

        resolvedStats.forEach((stat) => {
            const dataRow = [stat.category];
            if (age.adult && gender.male) dataRow.push(stat.male_adult.toString());
            if (age.adult && gender.female) dataRow.push(stat.female_adult.toString());
            if (age.child && gender.male) dataRow.push(stat.male_child.toString());
            if (age.child && gender.female) dataRow.push(stat.female_child.toString());
            dataRow.push(stat.total.toString());
            rows.push(dataRow);
        });

        const resolvedTotals = ["Total"];
        if (age.adult && gender.male) resolvedTotals.push(rMAdult.toString());
        if (age.adult && gender.female) resolvedTotals.push(rFAdult.toString());
        if (age.child && gender.male) resolvedTotals.push(rMChild.toString());
        if (age.child && gender.female) resolvedTotals.push(rFChild.toString());
        resolvedTotals.push(rTotal.toString());
        rows.push(resolvedTotals);

        rows.push([""]);
        const unRes = demographicRows("UNRESOLVED");
        rows.push(unRes);

        unresolvedStats.forEach((stat) => {
            const dataRow = [stat.category];
            if (age.adult && gender.male) dataRow.push(stat.male_adult.toString());
            if (age.adult && gender.female) dataRow.push(stat.female_adult.toString());
            if (age.child && gender.male) dataRow.push(stat.male_child.toString());
            if (age.child && gender.female) dataRow.push(stat.female_child.toString());
            dataRow.push(stat.total.toString());
            rows.push(dataRow);
        });

        const unresolvedTotals = ["Total"];
        if (age.adult && gender.male) unresolvedTotals.push(unMAdult.toString());
        if (age.adult && gender.female) unresolvedTotals.push(unFAdult.toString());
        if (age.child && gender.male) unresolvedTotals.push(unMChild.toString());
        if (age.child && gender.female) unresolvedTotals.push(unFChild.toString());
        unresolvedTotals.push(unTotal.toString());
        rows.push(unresolvedTotals);

        rows.push([""]);

        // DISABILITIES
        rows.push(["**DISABILITIES**"]);
        const disabilityTitle = demographicRows("Type");
        rows.push(disabilityTitle);

        let fATotal = 0;
        let mATotal = 0;
        let fCTotal = 0;
        let mCTotal = 0;
        let totals = 0;

        disabilities.forEach((k, v) => {
            const data = [k];
            const femaleAdultTotal =
                stats?.disabilities.find((item) => item.disability_id === v)?.female_adult_total ??
                0;
            const maleAdultTotal =
                stats?.disabilities.find((item) => item.disability_id === v)?.male_adult_total ?? 0;
            const femaleChildTotal =
                stats?.disabilities.find((item) => item.disability_id === v)?.female_child_total ??
                0;
            const maleChildTotal =
                stats?.disabilities.find((item) => item.disability_id === v)?.male_child_total ?? 0;

            if (age.adult && gender.male) data.push(maleAdultTotal);
            if (age.adult && gender.female) data.push(femaleAdultTotal);
            if (age.child && gender.male) data.push(maleChildTotal);
            if (age.child && gender.female) data.push(femaleChildTotal);

            fATotal += femaleAdultTotal;
            mATotal += maleAdultTotal;
            fCTotal += femaleChildTotal;
            mCTotal += maleChildTotal;

            const tempTotals =
                femaleAdultTotal + maleAdultTotal + femaleChildTotal + maleChildTotal;
            totals += femaleAdultTotal + maleAdultTotal + femaleChildTotal + maleChildTotal;

            data.push(tempTotals);
            rows.push(data);
        });

        const totalDisabilityRow = ["Total"];
        if (age.adult && gender.male) totalDisabilityRow.push(mATotal.toString());
        if (age.adult && gender.female) totalDisabilityRow.push(fATotal.toString());
        if (age.child && gender.male) totalDisabilityRow.push(mCTotal.toString());
        if (age.child && gender.female) totalDisabilityRow.push(fCTotal.toString());
        totalDisabilityRow.push(totals.toString());
        rows.push([""]);

        // FOLLOW UP VISITS AND CLIENTS
        rows.push(["**FOLLOW UP VISITS AND NEW CLIENTS**"]);
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
                    (item: StatsCategories) => item.zone_id === zoneId && item.hcr_type === groupKey
                ) || {};
            return {
                maleAdult: data.male_adult_total ?? 0,
                femaleAdult: data.female_adult_total ?? 0,
                maleChild: data.male_child_total ?? 0,
                femaleChild: data.female_child_total ?? 0,
            };
        };

        zones.forEach((k, v) => {
            const res = demographicRows("");

            rows.push([k, ...res.slice(1)]);

            let runningTotal = 0;
            const totals: Record<string, number> = {
                adult_male_total: 0,
                adult_female_total: 0,
                child_male_total: 0,
                child_female_total: 0,
            };

            groups.forEach(({ label: groupLabel, key: groupKey }) => {
                categories.forEach(({ label, key: categoryKey }) => {
                    const data = calculateTotal(stats, categoryKey, v, groupKey);

                    const rowData = [`${label} (${groupLabel})`];

                    if (age.adult && gender.male) {
                        rowData.push(data.maleAdult);
                        totals.adult_male_total += data.maleAdult;
                    }
                    if (age.adult && gender.female) {
                        rowData.push(data.femaleAdult);
                        totals.adult_female_total += data.femaleAdult;
                    }
                    if (age.child && gender.male) {
                        rowData.push(data.maleChild);
                        totals.child_male_total += data.maleChild;
                    }
                    if (age.child && gender.female) {
                        rowData.push(data.femaleChild);
                        totals.child_female_total += data.femaleChild;
                    }

                    const filteredTotal =
                        (age.adult && gender.male ? data.maleAdult : 0) +
                        (age.adult && gender.female ? data.femaleAdult : 0) +
                        (age.child && gender.male ? data.maleChild : 0) +
                        (age.child && gender.female ? data.femaleChild : 0);

                    rowData.push(filteredTotal);
                    runningTotal += filteredTotal;

                    rows.push(rowData);
                });
            });

            const totalRow = ["Total"];
            if (age.adult && gender.male) totalRow.push(totals.adult_male_total.toString());
            if (age.adult && gender.female) totalRow.push(totals.adult_female_total.toString());
            if (age.child && gender.male) totalRow.push(totals.child_male_total.toString());
            if (age.child && gender.female) totalRow.push(totals.child_female_total.toString());
            totalRow.push(runningTotal.toString());

            rows.push(totalRow);
            rows.push([""]);
        });
        return rows;
    }, [open, stats, zones, disabilities, age, gender, date]);

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
