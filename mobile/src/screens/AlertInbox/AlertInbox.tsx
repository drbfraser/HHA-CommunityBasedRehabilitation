import React, { useEffect, useState } from "react";
import { SafeAreaView, View, ScrollView, Alert } from "react-native";
import { Chip, Text, Card, List, Button } from "react-native-paper";
import useStyles from "./AlertInbox.styles";
import { APILoadError, getCurrentUser, IUser } from "@cbr/common";
import { useDatabase } from "@nozbe/watermelondb/hooks";
import { themeColors } from "@cbr/common";
import { modelName } from "../../models/constant";
import { priorities } from "@cbr/common/src/util/alerts";
import { riskLevels } from "@cbr/common";
import Icon from "react-native-vector-icons/FontAwesome";

const AlertInbox = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [alerts, setAlerts] = useState<any>();
    const styles = useStyles();
    const database = useDatabase();
    const [userId, setUserId] = useState<string>("unknown");

    const getUserProfile = async () => {
        let user: IUser | typeof APILoadError = await getCurrentUser();
        if (user !== APILoadError) {
            setUserId(user.id);
        }
    };

    const sortAlert = (alertData) => {
        const tempAlerts = alertData.sort(function (a, b) {
            return b.created_date - a.created_date;
        });
        return tempAlerts;
    };

    const getAlerts = async () => {
        try {
            const fetchedAlerts: any = await database.get(modelName.alert).query().fetch();
            setAlerts(fetchedAlerts);
            setLoading(false);
        } catch (e) {
            console.log(e);
        }
    };

    const markAsRead = async (alert) => {
        await database
            .write(async () => {
                await alert.update(() => {
                    alert.unread_by_users = alert.unread_by_users.filter(
                        (unread_user) => unread_user !== userId
                    );
                });
            })
            .then(() => {
                getAlerts();
            });
    };

    const deleteAlert = async (alertId) => {
        await database
            .write(async () => {
                await (await database.get(modelName.alert).find(alertId)).markAsDeleted();
            })
            .then(() => {
                console.log("Alert with id: " + alertId + " deleted from the local database!");
                getAlerts();
            });
    };

    const openDeleteConfirmationAlert = (alert) =>
        Alert.alert(
            "Delete Alert with Subject: " + alert.subject,
            "Are you sure you want to delete this alert?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                { text: "OK", onPress: () => deleteAlert(alert.id) },
            ]
        );

    useEffect(() => {
        if (loading) {
            getAlerts();
            getUserProfile();
        }
    }, [loading]);

    const generateAccordion = (alert) => {
        return (
            <View
                key={alert.id}
                style={{
                    marginBottom: 10,
                }}
            >
                <List.Accordion
                    onPress={
                        alert.unread_by_users.includes(userId) ? () => markAsRead(alert) : () => {}
                    }
                    title={alert.subject}
                    key={alert.id}
                    titleStyle={{
                        fontWeight:
                            alert.unread_by_users && alert.unread_by_users.includes(userId)
                                ? "bold"
                                : "normal",
                    }}
                    left={() => (
                        <Icon key={alert.id} name="chevron-down" style={{ fontWeight: "normal" }} />
                    )}
                    right={() => (
                        <Chip
                            key={alert.id}
                            mode="flat"
                            style={{ backgroundColor: riskLevels[alert.priority].color }}
                        >
                            <Text key={alert.id} style={{ color: themeColors.white }}>
                                {priorities[alert.priority]}
                            </Text>
                        </Chip>
                    )}
                    theme={{ colors: { background: themeColors.blueBgLight } }}
                >
                    <View
                        key={alert.id}
                        style={{
                            borderWidth: 0.5,
                            padding: 10,
                            backgroundColor: "#EDEDED",
                            borderColor: "#EDEDED",
                        }}
                    >
                        <Text key={alert.id}>{alert.alert_message}</Text>
                        <Button
                            color={themeColors.riskRed}
                            style={{
                                width: 100,
                                margin: 10,
                                alignSelf: "flex-end",
                                backgroundColor: "white",
                                borderColor: themeColors.riskRed,
                                borderWidth: 1,
                            }}
                            mode="outlined"
                            onPress={() => openDeleteConfirmationAlert(alert)}
                        >
                            DELETE
                        </Button>
                    </View>
                </List.Accordion>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.groupContainer}>
                <Text style={styles.cardSectionTitle}>Alerts</Text>
                <Card style={styles.CardStyle}>
                    {!loading ? sortAlert(alerts).map((alert) => generateAccordion(alert)) : <></>}
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
};

export default AlertInbox;
