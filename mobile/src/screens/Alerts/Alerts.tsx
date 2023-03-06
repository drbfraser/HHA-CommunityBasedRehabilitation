import React, { useContext, useEffect, useState } from "react";
import { Alert, SafeAreaView, View, ScrollView } from "react-native";
import { Button, Divider, Text, Card, Switch } from "react-native-paper";
import useStyles from "./Alerts.styles";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackParamList } from "../../util/stackScreens";
import { useDatabase } from "@nozbe/watermelondb/hooks";
import { modelName } from "../../models/constant";


const Alerts = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const database = useDatabase();

    const getAlerts = async () => {
      try {
        console.log(database);
        const alertsCollection = await database.get(modelName.alerts).query().fetch();
        console.log(alertsCollection);

        alertsCollection.map((alert: any) => {
          console.log(alert)
        })

      } catch (e) {
          console.log(e);
      }
  };

  useEffect(() => {
    if (loading) {
        getAlerts()
            .then(() => setLoading(false))
    }
  }, [loading]);

    const styles = useStyles();

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.groupContainer}>
                <Text style={styles.cardSectionTitle}>Alerts</Text>
                <Card style={styles.CardStyle}>{!loading ? <></> : <></>}</Card>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Alerts;
