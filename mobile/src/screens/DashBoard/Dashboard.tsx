import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { Card, DataTable } from "react-native-paper";
import useStyles from "./Dashboard.styles";
import { BrifeReferral, fetchAllClientsFromApi, fetchReferrals } from "./DashboardRequest";
import { riskTypes } from "../../util/riskIcon";
import { useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { IClientSummary, timestampToDate } from "@cbr/common";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { getLevelByColor } from "../ClientList/ClientList";
import { ClientTest } from "../ClientList/ClientListRequest";
var count = 0;
const Dashboard = () => {
    enum ClientSortOptions {
        ID = "id",
        NAME = "name",
        ZONE = "zone",
        HEALTH = "health",
        EDUCATION = "education",
        SOCIAL = "social",
    }
    enum ReferralOptions {
        NAME = "name",
        TYPE = "type",
        DATE = "date",
    }
    const styles = useStyles();
    const sortDirections = ["asc", "dec", "None"];
    const [clientSortOption, setClientSortOption] = useState("");
    const [clientSortDirection, setClientIsSortDirection] = useState("None");
    const [currentClientDirection, setClientCurrentDirection] = useState(0);

    const [referralSortOption, setReferralSortOption] = useState("");
    const [referralSortDirection, setReferralIsSortDirection] = useState("None");
    const [currentReferralDirection, setReferralCurrentDirection] = useState(0);

    const clientComparator = (a: ClientTest, b: ClientTest): number => {
        let result = 0;
        switch (clientSortOption) {
            case ClientSortOptions.ID: {
                result = a.id - b.id;
                break;
            }

            case ClientSortOptions.NAME: {
                result = a.full_name > b.full_name ? 1 : -1;
                break;
            }
            case ClientSortOptions.ZONE: {
                result = a.zone > b.zone ? 1 : -1;
                break;
            }
            case ClientSortOptions.HEALTH: {
                result = getLevelByColor(a.HealthLevel) > getLevelByColor(b.HealthLevel) ? 1 : -1;
                break;
            }
            case ClientSortOptions.EDUCATION: {
                result =
                    getLevelByColor(a.EducationLevel) > getLevelByColor(b.EducationLevel) ? 1 : -1;
                break;
            }
            case ClientSortOptions.SOCIAL: {
                result = getLevelByColor(a.SocialLevel) > getLevelByColor(b.SocialLevel) ? 1 : -1;
                break;
            }
        }
        return clientSortDirection === "asc" ? result : -1 * result;
    };
    const clientSortBy = async (option: string) => {
        if (option != clientSortOption) {
            setClientSortOption(option);
            setClientCurrentDirection(0);
            setClientIsSortDirection(sortDirections[currentClientDirection]);
        } else {
            setClientCurrentDirection(currentClientDirection + 1);
            if (currentClientDirection == 2) {
                setClientCurrentDirection(0);
            }
            setClientIsSortDirection(sortDirections[currentClientDirection]);
        }
    };
    const clientArrowDirectionController = (column_name: string) => {
        if (column_name == clientSortOption) {
            if (clientSortDirection == "asc") {
                return "ascending";
            } else if (clientSortDirection == "dec") {
                return "descending";
            } else {
                return undefined;
            }
        }
        return undefined;
    };

    const referralComparator = (a: BrifeReferral, b: BrifeReferral): number => {
        let result = 0;
        switch (referralSortOption) {
            case ReferralOptions.NAME: {
                result = a.full_name > b.full_name ? 1 : -1;
                break;
            }
            case ReferralOptions.TYPE: {
                result = a.type > b.type ? 1 : -1;
                break;
            }
            case ReferralOptions.DATE: {
                result = a.date_referred > b.date_referred ? 1 : -1;
                break;
            }
        }
        return referralSortDirection === "asc" ? result : -1 * result;
    };
    const referralSortBy = async (option: string) => {
        if (option != referralSortOption) {
            setReferralSortOption(option);
            setReferralCurrentDirection(0);
            setReferralIsSortDirection(sortDirections[currentReferralDirection]);
        } else {
            setReferralCurrentDirection(currentReferralDirection + 1);
            if (currentClientDirection == 2) {
                setReferralCurrentDirection(0);
            }
            setReferralIsSortDirection(sortDirections[currentReferralDirection]);
        }
    };
    const referralArrowDirectionController = (column_name: string) => {
        if (column_name == referralSortOption) {
            if (referralSortDirection == "asc") {
                return "ascending";
            } else if (referralSortDirection == "dec") {
                return "descending";
            } else {
                return undefined;
            }
        }
        return undefined;
    };

    const returnText = (item) => {
        return (
            <View style={styles.textContainer}>
                <Text style={styles.text}>{item}</Text>
            </View>
        );
    };
    const [clientList, setClientList] = useState<ClientTest[]>([]);
    const [referralList, setreferralList] = useState<BrifeReferral[]>([]);
    const navigation = useNavigation();
    const getNewClient = async () => {
        var fetchedClientList = await fetchAllClientsFromApi();
        if (clientSortDirection !== "None") {
            fetchedClientList = fetchedClientList.sort(clientComparator);
        }
        setClientList(fetchedClientList);
    };

    const getRefereals = async () => {
        var fetchedReferrals = await fetchReferrals();
        if (referralSortDirection !== "None") {
            fetchedReferrals = fetchedReferrals.sort(referralComparator);
        }
        setreferralList(fetchedReferrals);
    };

    useEffect(() => {
        
        count = count + 1;

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
                                                {returnText(item.full_name)}
                                            </View>
                                            <View style={styles.column_client_zone}>
                                                {returnText(item.zone)}
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
                <View style={styles.card}>
                    <Card>
                        <Card.Title title="Outstanding Referrals"></Card.Title>
                        <ScrollView>
                            <DataTable>
                                <DataTable.Header style={styles.item}>
                                    <DataTable.Title
                                        style={styles.column_referral_name}
                                        onPress={() => referralSortBy("name")}
                                        sortDirection={referralArrowDirectionController("name")}
                                    >
                                        Name
                                    </DataTable.Title>
                                    <DataTable.Title
                                        style={styles.column_referral_type}
                                        onPress={() => referralSortBy("type")}
                                        sortDirection={referralArrowDirectionController("type")}
                                    >
                                        Type
                                    </DataTable.Title>
                                    <DataTable.Title
                                        style={styles.column_referral_date}
                                        onPress={() => referralSortBy("date")}
                                        sortDirection={referralArrowDirectionController("date")}
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
                                                {returnText(item.full_name)}
                                            </View>
                                            <View style={styles.column_referral_type}>
                                                {returnText(item.type)}
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
