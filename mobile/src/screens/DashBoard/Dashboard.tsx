import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { Card, DataTable } from "react-native-paper";
import useStyles from "./Dashboard.styles";
import { fetchAllClientsFromApi, fetchReferrals } from "./DashboardRequest";
import { riskTypes } from "../../util/riskIcon";
import { useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { IClientSummary, timestampToDate } from "@cbr/common";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

const styles = useStyles();

const returnText = (item) => {
    return (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ flexShrink: 1, fontSize: 12 }}>{item}</Text>
        </View>
    );
};

const Dashboard = () => {
    const [clientList, setClientList] = useState<IClientSummary[]>([]);
    const [referralList, setreferralList] = useState<any[]>([]);
    const navigation = useNavigation();
    const newClientGet = async () => {
        var fetchedClientList = await fetchAllClientsFromApi();
        setClientList(fetchedClientList);
    };

    const referealsGet = async () => {
        var fetchedReferrals = await fetchReferrals();
        setreferralList(fetchedReferrals);
    };
    useEffect(() => {
        newClientGet();
        referealsGet();
        //TODO alert part.
    }, []);
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.row}>
                    <Text style={styles.title}>Dashboard</Text>
                </View>
                <View style={styles.card}>
                    <Card>
                        <Card.Title title="Priority Clients"></Card.Title>
                        <ScrollView>
                            <DataTable>
                                <DataTable.Header style={styles.item}>
                                    <DataTable.Title style={styles.column_client_name}>
                                        Name
                                    </DataTable.Title>
                                    <DataTable.Title style={styles.column_client_zone}>
                                        Zone
                                    </DataTable.Title>
                                    <DataTable.Title style={styles.column_client_icon}>
                                        {riskTypes.HEALTH.Icon("#000000")}
                                    </DataTable.Title>
                                    <DataTable.Title style={styles.column_client_icon}>
                                        {riskTypes.EDUCAT.Icon("#000000")}
                                    </DataTable.Title>
                                    <DataTable.Title style={styles.column_client_icon}>
                                        {riskTypes.SOCIAL.Icon("#000000")}
                                    </DataTable.Title>
                                    <DataTable.Title style={styles.column_client_Last_visit_date}>
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
                                    <DataTable.Title style={styles.column_referral_name}>
                                        Name
                                    </DataTable.Title>
                                    <DataTable.Title style={styles.column_referral_type}>
                                        Type
                                    </DataTable.Title>
                                    <DataTable.Title style={styles.column_referral_date}>
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
