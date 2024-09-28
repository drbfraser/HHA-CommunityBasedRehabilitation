import React, { useEffect, useState } from "react";
import { SafeAreaView, View, ScrollView, Alert } from "react-native";
import { Chip, Text, Card, List, Button } from "react-native-paper";
import useStyles from "./AlertInbox.styles";
import { APILoadError, getCurrentUser, IUser } from "@cbr/common";
import { useDatabase } from "@nozbe/watermelondb/hooks";
import { themeColors } from "@cbr/common";
import { modelName } from "../../models/constant";
import { priorities, priorityLevels } from "@cbr/common/src/util/alerts";
import Icon from "react-native-vector-icons/FontAwesome";
import { useTranslation } from "react-i18next";

const AlertInbox = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [alerts, setAlerts] = useState<any>();
    const styles = useStyles();
    const database = useDatabase();
    const [userId, setUserId] = useState<string>("unknown");
    const { t } = useTranslation();

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
            t("alert.deleteAlertWithSubject", { subject: alert.subject }),
            t("alert.actionConfirmationNotice", {
                action: t("general.delete"),
                object: t("general.alert"),
            }),
            [
                {
                    text: t("general.cancel"),
                    style: "cancel",
                },
                { text: t("general.ok"), onPress: () => deleteAlert(alert.id) },
            ]
        );

    useEffect(() => {
        if (loading) {
            getAlerts();
            getUserProfile();
        }
    }, [loading]);

    const generateAlertList = () => {
        return alerts.length > 0 ? (
            sortAlert(alerts).map((alert) => generateAccordion(alert))
        ) : (
            <View style={styles.emptyInboxContainer}>
                <Icon name="inbox" style={styles.emptyInboxIcon} />
                <Text style={styles.emptyInboxText}>{t("general.emptyInbox")}</Text>
            </View>
        );
    };

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
                        <Icon key={alert.id} name="chevron-down" style={styles.dropdownIcon} />
                    )}
                    right={() => (
                        <Chip
                            key={alert.id}
                            mode="flat"
                            style={{ backgroundColor: priorityLevels[alert.priority].color }}
                        >
                            <Text key={alert.id} style={{ color: themeColors.white }}>
                                {priorities[alert.priority]}
                            </Text>
                        </Chip>
                    )}
                    theme={{ colors: { background: themeColors.blueBgLight } }}
                >
                    <View key={alert.id} style={styles.alertMessageContainer}>
                        <Text key={alert.id}>{alert.alert_message}</Text>
                        <Button
                            color={themeColors.riskRed}
                            style={styles.deleteButton}
                            mode="outlined"
                            onPress={() => openDeleteConfirmationAlert(alert)}
                        >
                            {t("general.delete")}
                        </Button>
                    </View>
                </List.Accordion>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.groupContainer}>
                <Text style={styles.cardSectionTitle}>{t("general.alerts")}</Text>
                <Card style={styles.CardStyle}>{!loading ? generateAlertList() : <></>}</Card>
            </ScrollView>
        </SafeAreaView>
    );
};

export default AlertInbox;
