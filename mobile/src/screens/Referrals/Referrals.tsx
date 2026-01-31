import React, { useCallback, useEffect, useState } from "react";
import { Text, View, NativeModules } from "react-native";
import * as Localization from "expo-localization";
import { Card, DataTable, Chip } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import { useDatabase } from "@nozbe/watermelondb/hooks";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import {
    SortOptions,
    referralComparator,
    sortBy,
    arrowDirectionController,
    TSortDirection,
} from "../../util/listFunctions";
import { themeColors, timestampToDate } from "@cbr/common";
import useStyles from "./Referrals.styles";
import { BriefReferral, fetchReferrals } from "./ReferralsRequest";
import Icon from "react-native-vector-icons/FontAwesome";

const STATUS = {
    PENDING: "pending",
    RESOLVED: "resolved",
    ALL: "all",
};

const Referrals = () => {
    const styles = useStyles();
    const database = useDatabase();
    const navigation = useNavigation();
    const { t } = useTranslation();

    const [referrals, setReferrals] = useState<BriefReferral[]>([]);
    const [filteredReferrals, setFilteredReferrals] = useState<BriefReferral[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [filterStatus, setFilterStatus] = useState<string>(STATUS.PENDING);

    const REFERRAL_TYPES = [
        { key: "wheelchair", label: t("referral.wheelchair") },
        { key: "physiotherapy", label: t("referral.physiotherapy") },
        {
            key: "hha_nutrition_and_agriculture_project",
            label: t("referral.hhaNutritionAndAgricultureProjectAbbr"),
        },
        { key: "orthotic", label: t("referral.orthotic") },
        { key: "prosthetic", label: t("referral.prosthetic") },
        { key: "mental_health", label: t("referral.mentalHealth") },
    ];

    const [sortOption, setSortOption] = useState<string>(SortOptions.DATE);
    const [sortDirection, setSortDirection] = useState<TSortDirection>("None");

    const getReferrals = async () => {
        let fetchedReferrals = await fetchReferrals(database);
        if (sortDirection !== "None") {
            fetchedReferrals = fetchedReferrals.sort((a, b) =>
                referralComparator(a, b, sortOption, sortDirection),
            );
        }
        setReferrals(fetchedReferrals);
    };

    const handleSortBy = (option: string) => {
        sortBy(option, sortOption, sortDirection, setSortOption, setSortDirection);
    };

    const getArrowDirection = (column: string) => {
        return arrowDirectionController(column, sortOption, sortDirection);
    };

    useEffect(() => {
        let filtered = referrals;

        if (filterStatus !== STATUS.ALL) {
            const resolved = filterStatus === STATUS.RESOLVED;
            filtered = filtered.filter((r) => r.resolved === resolved);
        }

        if (selectedTypes.length > 0) {
            filtered = filtered.filter((r) =>
                r.type_keys.some((key) => selectedTypes.includes(key)),
            );
        }

        setFilteredReferrals(filtered);
    }, [referrals, filterStatus, selectedTypes]);

    useFocusEffect(
        useCallback(() => {
            getReferrals();
        }, [sortOption, sortDirection]),
    );

    const toggleType = (type: string) => {
        setSelectedTypes((prev) =>
            prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
        );
    };

    const locale = Localization.locale;
    const timezone = Localization.timezone;

    return (
        <ScrollView style={styles.container}>
            <Card>
                <Card.Title title={t("statistics.referrals")} />

                <View style={styles.filterView}>
                    <Text style={styles.filterLabel}>{t("referral.filterByStatus")}:</Text>
                    <View style={styles.filterContainer}>
                        {Object.values(STATUS).map((status) => (
                            <Chip
                                key={status}
                                selected={filterStatus === status}
                                onPress={() => setFilterStatus(status)}
                                style={styles.chip}
                            >
                                {status === STATUS.ALL && t("general.all")}
                                {status === STATUS.PENDING && t("general.pending")}
                                {status === STATUS.RESOLVED && t("general.resolved")}
                            </Chip>
                        ))}
                    </View>

                    <Text style={styles.filterLabel}>{t("referral.filterByType")}:</Text>
                    <View style={styles.filterContainer}>
                        {REFERRAL_TYPES.map(({ key, label }) => (
                            <Chip
                                key={key}
                                selected={selectedTypes.includes(key)}
                                onPress={() => toggleType(key)}
                                style={styles.chip}
                            >
                                {label}
                            </Chip>
                        ))}
                    </View>
                </View>

                <DataTable>
                    <DataTable.Header style={styles.item}>
                        <DataTable.Title
                            style={styles.column_referral_status}
                            onPress={() => handleSortBy(SortOptions.STATUS)}
                            sortDirection={getArrowDirection(SortOptions.STATUS)}
                        >
                            {t("general.status")}
                        </DataTable.Title>
                        <DataTable.Title
                            style={styles.column_referral_name}
                            onPress={() => handleSortBy(SortOptions.NAME)}
                            sortDirection={getArrowDirection(SortOptions.NAME)}
                        >
                            {t("general.name")}
                        </DataTable.Title>
                        <DataTable.Title
                            style={styles.column_referral_type}
                            onPress={() => handleSortBy(SortOptions.TYPE)}
                            sortDirection={getArrowDirection(SortOptions.TYPE)}
                        >
                            {t("general.type")}
                        </DataTable.Title>
                        <DataTable.Title
                            style={styles.column_referral_date}
                            onPress={() => handleSortBy(SortOptions.DATE)}
                            sortDirection={getArrowDirection(SortOptions.DATE)}
                        >
                            {t("referralAttr.dateReferred")}
                        </DataTable.Title>
                    </DataTable.Header>

                    {filteredReferrals.map((r) => (
                        <DataTable.Row
                            key={r.id}
                            style={styles.item}
                            onPress={() =>
                                navigation.navigate("ClientDetails", {
                                    clientID: r.client_id,
                                })
                            }
                        >
                            <View style={styles.column_referral_status}>
                                <Text>
                                    <Icon
                                        name={r.resolved ? "check-circle" : "clock-o"}
                                        size={15}
                                        color={
                                            r.resolved ? themeColors.riskGreen : themeColors.riskRed
                                        }
                                    />
                                </Text>
                            </View>
                            <View style={styles.column_referral_name}>
                                <Text>{r.full_name}</Text>
                            </View>
                            <View style={styles.column_referral_type}>
                                <Text>{r.type}</Text>
                            </View>
                            <DataTable.Cell style={styles.column_referral_date}>
                                <Text>
                                    {timestampToDate(Number(r.date_referred), locale, timezone)}
                                </Text>
                            </DataTable.Cell>
                        </DataTable.Row>
                    ))}
                </DataTable>
            </Card>
        </ScrollView>
    );
};

export default Referrals;
