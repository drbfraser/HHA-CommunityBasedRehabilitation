import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { Card, DataTable } from "react-native-paper";
import useStyles from "./Dashboard.styles";
import { BriefReferral, fetchAllClientsFromApi, fetchReferrals } from "./DashboardRequest";
import { riskTypes } from "../../util/riskIcon";
import { useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { timestampToDate } from "@cbr/common";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { ClientListRow } from "../ClientList/ClientListRequest";
import {
    arrowDirectionController,
    sortBy,
    SortOptions,
    clientComparator,
    referralComparator,
} from "../../util/listFunctions";
import { WrappedText } from "../../components/WrappedText/WrappedText";

const Dashboard = () => {
    const styles = useStyles();
    const [clientSortOption, setClientSortOption] = useState("");
    const [clientSortDirection, setClientIsSortDirection] = useState<
        "ascending" | "descending" | "None"
    >("None");
    const [currentClientDirection, setClientCurrentDirection] = useState(0);

    const [referralSortOption, setReferralSortOption] = useState("");
    const [referralSortDirection, setReferralIsSortDirection] = useState<
        "ascending" | "descending" | "None"
    >("None");
    const [currentReferralDirection, setReferralCurrentDirection] = useState(0);

    const dashBoardClientComparator = (a: ClientListRow, b: ClientListRow): number => {
        return clientComparator(a, b, clientSortOption, clientSortDirection);
    };
    const clientSortBy = async (option: string) => {
        sortBy(
            option,
            clientSortOption,
            clientSortDirection,
            setClientSortOption,
            setClientIsSortDirection
        );
    };
    const clientArrowDirectionController = (column_name: string) => {
        return arrowDirectionController(column_name, clientSortOption, clientSortDirection);
    };

    const dashBoardReferralComparator = (a: BriefReferral, b: BriefReferral): number => {
        return referralComparator(a, b, referralSortOption, referralSortDirection);
    };

    const referralSortBy = async (option: string) => {
        sortBy(
            option,
            referralSortOption,
            referralSortDirection,
            setReferralSortOption,
            setReferralIsSortDirection
        );
    };
    const referralArrowDirectionController = (column_name: string) => {
        return arrowDirectionController(column_name, referralSortOption, referralSortDirection);
    };

    const [clientList, setClientList] = useState<ClientListRow[]>([]);
    const [referralList, setreferralList] = useState<BriefReferral[]>([]);
    const navigation = useNavigation();
    const getNewClient = async () => {
        var fetchedClientList = await fetchAllClientsFromApi();
        if (clientSortDirection !== "None") {
            fetchedClientList = fetchedClientList.sort(dashBoardClientComparator);
        }
        setClientList(fetchedClientList);
    };

    const getRefereals = async () => {
        var fetchedReferrals = await fetchReferrals();
        if (referralSortDirection !== "None") {
            fetchedReferrals = fetchedReferrals.sort(dashBoardReferralComparator);
        }
        setreferralList(fetchedReferrals);
    };

    useEffect(() => {
        getNewClient();
        getRefereals();
        //TODO alert part.
    }, [clientSortOption, currentClientDirection, referralSortOption, currentReferralDirection]);
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.row}>
                    <Text style={styles.title}>Dashboard</Text>
                </View>
                <View>
                    <Card>
                        <Card.Title title="Priority Clients"></Card.Title>
                        <ScrollView>
                            <DataTable>
                                <DataTable.Header style={styles.item}>
                                    <DataTable.Title
                                        style={styles.column_client_name}
                                        onPress={() => clientSortBy("name")}
                                        sortDirection={clientArrowDirectionController("name")}
                                    >
                                        Name
                                    </DataTable.Title>
                                    <DataTable.Title
                                        style={styles.column_client_zone}
                                        onPress={() => clientSortBy("zone")}
                                        sortDirection={clientArrowDirectionController("zone")}
                                    >
                                        Zone
                                    </DataTable.Title>
                                    <DataTable.Title
                                        style={styles.column_client_icon}
                                        onPress={() => clientSortBy("health")}
                                        sortDirection={clientArrowDirectionController("health")}
                                    >
                                        {riskTypes.HEALTH.Icon("#000000")}
                                    </DataTable.Title>
                                    <DataTable.Title
                                        style={styles.column_client_icon}
                                        onPress={() => clientSortBy("education")}
                                        sortDirection={clientArrowDirectionController("education")}
                                    >
                                        {riskTypes.EDUCAT.Icon("#000000")}
                                    </DataTable.Title>
                                    <DataTable.Title
                                        style={styles.column_client_icon}
                                        onPress={() => clientSortBy("social")}
                                        sortDirection={clientArrowDirectionController("social")}
                                    >
                                        {riskTypes.SOCIAL.Icon("#000000")}
                                    </DataTable.Title>
                                    <DataTable.Title
                                        style={styles.column_client_Last_visit_date}
                                        onPress={() => clientSortBy("date")}
                                        sortDirection={clientArrowDirectionController("date")}
                                    >
                                        Last visit date
                                    </DataTable.Title>
                                </DataTable.Header>
                                {clientList.map((item) => {
                                    return (
                                        <DataTable.Row
                                            style={styles.item}
                                            key={item.id}
                                            onPress={() => {
                                                navigation.navigate("ClientDetails", {
                                                    clientID: item.id,
                                                });
                                            }}
                                        >
                                            <View style={styles.column_client_name}>
                                                <WrappedText
                                                    text={item.full_name}
                                                    viewStyle={styles.textContainer}
                                                    textStyle={styles.text}
                                                />
                                            </View>
                                            <View style={styles.column_client_zone}>
                                                <WrappedText
                                                    text={item.zone}
                                                    viewStyle={styles.textContainer}
                                                    textStyle={styles.text}
                                                />
                                            </View>
                                            <DataTable.Cell style={styles.column_client_icon}>
                                                {riskTypes.CIRCLE.Icon(item.HealthLevel)}
                                            </DataTable.Cell>
                                            <DataTable.Cell style={styles.column_client_icon}>
                                                {riskTypes.CIRCLE.Icon(item.EducationLevel)}
                                            </DataTable.Cell>
                                            <DataTable.Cell style={styles.column_client_icon}>
                                                {riskTypes.CIRCLE.Icon(item.SocialLevel)}
                                            </DataTable.Cell>
                                            <DataTable.Cell
                                                style={styles.column_client_Last_visit_date}
                                            >
                                                <Text style={styles.fontSize}>
                                                    {timestampToDate(Number(item.last_visit_date))}
                                                </Text>
                                            </DataTable.Cell>
                                        </DataTable.Row>
                                    );
                                })}
                            </DataTable>
                        </ScrollView>
                    </Card>
                </View>
                <View>
                    <Card>
                        <Card.Title title="Outstanding Referrals"></Card.Title>
                        <ScrollView>
                            <DataTable>
                                <DataTable.Header style={styles.item}>
                                    <DataTable.Title
                                        style={styles.column_referral_name}
                                        onPress={() => referralSortBy(SortOptions.NAME)}
                                        sortDirection={referralArrowDirectionController(
                                            SortOptions.NAME
                                        )}
                                    >
                                        Name
                                    </DataTable.Title>
                                    <DataTable.Title
                                        style={styles.column_referral_type}
                                        onPress={() => referralSortBy(SortOptions.TYPE)}
                                        sortDirection={referralArrowDirectionController(
                                            SortOptions.TYPE
                                        )}
                                    >
                                        Type
                                    </DataTable.Title>
                                    <DataTable.Title
                                        style={styles.column_referral_date}
                                        onPress={() => referralSortBy(SortOptions.DATE)}
                                        sortDirection={referralArrowDirectionController(
                                            SortOptions.DATE
                                        )}
                                    >
                                        Date Referred
                                    </DataTable.Title>
                                </DataTable.Header>
                                {referralList.map((item) => {
                                    return (
                                        <DataTable.Row
                                            style={styles.item}
                                            key={item.id}
                                            onPress={() => {
                                                navigation.navigate("ClientDetails", {
                                                    clientID: item.client_id,
                                                });
                                            }}
                                        >
                                            <View style={styles.column_referral_name}>
                                                <WrappedText
                                                    text={item.full_name}
                                                    viewStyle={styles.textContainer}
                                                    textStyle={styles.text}
                                                />
                                            </View>
                                            <View style={styles.column_referral_type}>
                                                <WrappedText
                                                    text={item.type}
                                                    viewStyle={styles.textContainer}
                                                    textStyle={styles.text}
                                                />
                                            </View>
                                            <DataTable.Cell style={styles.column_referral_date}>
                                                <Text style={styles.fontSize}>
                                                    {timestampToDate(Number(item.date_referred))}
                                                </Text>
                                            </DataTable.Cell>
                                        </DataTable.Row>
                                    );
                                })}
                            </DataTable>
                        </ScrollView>
                    </Card>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};
export default Dashboard;
