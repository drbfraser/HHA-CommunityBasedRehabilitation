import React, { useEffect, useState } from "react";
import { Text, View, NativeModules } from "react-native";
import * as Localization from "expo-localization";
import { Card, DataTable } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import { useDatabase } from "@nozbe/watermelondb/hooks";
import { useNavigation } from "@react-navigation/native";
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

const Referrals = () => {
    const styles = useStyles();
    const database = useDatabase();
    const navigation = useNavigation();
    const { t } = useTranslation();

    const [referralList, setReferralList] = useState<BriefReferral[]>([]);
    const [sortOption, setSortOption] = useState<string>(SortOptions.DATE);
    const [sortDirection, setSortDirection] = useState<TSortDirection>("None");

    const getReferrals = async () => {
        let fetchedReferrals = await fetchReferrals(database);
        if (sortDirection !== "None") {
            fetchedReferrals = fetchedReferrals.sort((a, b) =>
                referralComparator(a, b, sortOption, sortDirection)
            );
        }
        setReferralList(fetchedReferrals);
    };

    const handleSortBy = async (option: string) => {
        sortBy(option, sortOption, sortDirection, setSortOption, setSortDirection);
    };

    const getArrowDirection = (column: string) => {
        return arrowDirectionController(column, sortOption, sortDirection);
    };

    useEffect(() => {
        getReferrals();
    }, [sortOption, sortDirection]);

    const locale = NativeModules.I18nManager.localeIdentifier;
    const timezone = Localization.timezone; // todo: resolve deprecated

    return (
        <ScrollView style={styles.container}>
            <Card>
                <Card.Title title={t("statistics.referrals")} />
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

                    {referralList.map((item) => (
                        <DataTable.Row
                            key={item.id}
                            style={styles.item}
                            onPress={() =>
                                navigation.navigate("ClientDetails", {
                                    clientID: item.client_id,
                                })
                            }
                        >
                            <View style={styles.column_referral_status}>
                                <Text>
                                    <Icon
                                        name={item.resolved ? "check-circle" : "clock-o"}
                                        size={15}
                                        color={
                                            item.resolved
                                                ? themeColors.riskGreen
                                                : themeColors.riskRed
                                        }
                                    />
                                </Text>
                            </View>
                            <View style={styles.column_referral_name}>
                                <Text>{item.full_name}</Text>
                            </View>
                            <View style={styles.column_referral_type}>
                                <Text>{item.type}</Text>
                            </View>
                            <DataTable.Cell style={styles.column_referral_date}>
                                <Text>
                                    {timestampToDate(Number(item.date_referred), locale, timezone)}
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
