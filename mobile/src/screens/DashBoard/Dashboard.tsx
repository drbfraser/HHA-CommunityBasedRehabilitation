import React, { useEffect } from "react";
import { Text, View, Switch } from "react-native";
import { Card, DataTable } from "react-native-paper";
// import { Card } from "react-native-elements";
import useStyles from "./Dashboard.styles";
import { fetchAllClientsFromApi, fetchReferrals } from "./DashboardRequest";
import { StackNavigationProp } from "@react-navigation/stack";
import { stackParamList, StackScreenName } from "../../util/screens";
import { riskTypes } from "../../util/riskIcon";
import { useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { IClientSummary, timestampToDate } from "@cbr/common";
import { SafeAreaView } from "react-native-safe-area-context";
const styles = useStyles();
interface ClientListControllerProps {
    navigation: StackNavigationProp<stackParamList, StackScreenName.HOME>;
}

const returnName = (item) => {
    return (
        <View style={{ flexDirection: "row", flex: 3, alignItems: "center" }}>
            <Text style={{ flexShrink: 1 }}>{item.full_name}</Text>
        </View>
    );
};

const returnReferralType = (item) => {
    return (
        <View style={{ flexDirection: "row", flex: 3, alignItems: "center", padding: 10 }}>
            <Text style={{ flexShrink: 1 }}>{item.type}</Text>
        </View>
    );
};

const Dashboard = (props: ClientListControllerProps) => {
    const [clientList, setClientList] = useState<IClientSummary[]>([]);
    const [referealList, setReferealList] = useState<any[]>([]);
    const newClientGet = async () => {
        var fetchedClientList = await fetchAllClientsFromApi();
        setClientList(fetchedClientList);
    };
    newClientGet();

    const referealsGet = async () => {
        var fetchedReferrals = await fetchReferrals();
        setReferealList(fetchedReferrals);
    };
    referealsGet();
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
                                    <DataTable.Title style={{ flex: 0.8 }}>Name</DataTable.Title>
                                    <DataTable.Title style={{ flex: 1.0 }}>Zone</DataTable.Title>
                                    <DataTable.Title style={{ flex: 0.2 }}>
                                        {riskTypes.HEALTH.Icon("#000000")}
                                    </DataTable.Title>
                                    <DataTable.Title style={{ flex: 0.2 }}>
                                        {riskTypes.EDUCAT.Icon("#000000")}
                                    </DataTable.Title>
                                    <DataTable.Title style={{ flex: 0.2 }}>
                                        {riskTypes.SOCIAL.Icon("#000000")}
                                    </DataTable.Title>
                                    <DataTable.Title style={{ flex: 0.8, padding: 3 }}>
                                        Last visit date
                                    </DataTable.Title>
                                </DataTable.Header>
                                {clientList.map((item) => {
                                    return (
                                        <DataTable.Row
                                            style={styles.item}
                                            key={item.id}
                                            onPress={() => {
                                                props.navigation.navigate(StackScreenName.CLIENT, {
                                                    clientID: item.id,
                                                });
                                            }}
                                        >
                                            <View style={{ flex: 0.8 }}>{returnName(item)}</View>
                                            <DataTable.Cell style={{ flex: 1.0, padding: 1 }}>
                                                <Text style={styles.fontSize}>{item.zone}</Text>
                                            </DataTable.Cell>
                                            <DataTable.Cell style={{ flex: 0.2 }}>
                                                {riskTypes.CIRCLE.Icon(item.HealthLevel)}
                                            </DataTable.Cell>
                                            <DataTable.Cell style={{ flex: 0.2 }}>
                                                {riskTypes.CIRCLE.Icon(item.EducationLevel)}
                                            </DataTable.Cell>
                                            <DataTable.Cell style={{ flex: 0.2 }}>
                                                {riskTypes.CIRCLE.Icon(item.SocialLevel)}
                                            </DataTable.Cell>
                                            <DataTable.Cell style={{ flex: 0.8, padding: 3 }}>
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
                        <Card.Title title="OutStanding Referrals"></Card.Title>
                        <ScrollView>
                            <DataTable>
                                <DataTable.Header style={styles.item}>
                                    <DataTable.Title style={{ flex: 1 }}>Name</DataTable.Title>
                                    <DataTable.Title style={{ flex: 3 }}>Type</DataTable.Title>
                                    <DataTable.Title style={{ flex: 1 }}>
                                        Date Reffered
                                    </DataTable.Title>
                                </DataTable.Header>
                                {referealList.map((item) => {
                                    return (
                                        <DataTable.Row
                                            style={styles.item}
                                            key={item.id}
                                            onPress={() => {
                                                props.navigation.navigate(StackScreenName.CLIENT, {
                                                    clientID: item.id,
                                                });
                                            }}
                                        >
                                            <View style={{ flex: 1 }}>{returnName(item)}</View>
                                            {returnReferralType(item)}
                                            <DataTable.Cell style={{ flex: 1, padding: 5 }}>
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
