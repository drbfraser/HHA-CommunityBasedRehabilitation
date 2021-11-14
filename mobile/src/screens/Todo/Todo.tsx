import React, { useContext, useEffect, useState } from "react";
import { Alert, View } from "react-native";
import { Button, Text, TextInput, Title } from "react-native-paper";
import useStyles from "./Todo.styles";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import { AppStackNavProp } from "../../util/stackScreens";
import { useIsFocused, useNavigation } from "@react-navigation/core";
import { useDatabase } from "@nozbe/watermelondb/hooks";
import {
    VictoryBar,
    VictoryChart,
    VictoryTheme,
    VictoryZoomContainer,
    VictoryAxis,
} from "victory-native";
import { themeColors, useZones } from "@cbr/common";
import { Q } from "@nozbe/watermelondb";
import { start } from "repl";

export type VisitStat = {
    zonename: string;
    visitcount: number;
};

const Todo = () => {
    const data: VisitStat[] = [];
    const styles = useStyles();
    const authContext = useContext(AuthContext);
    const [loading, setLoading] = useState<boolean>(true);
    const [visitData, setVisitData] = useState(data);
    const database = useDatabase();
    const isFocused = useIsFocused();

    useEffect(() => {
        authContext.requireLoggedIn(true);
    }, []);
    const navigation = useNavigation<AppStackNavProp>();
    const zones = useZones();

    const getStats = async () => {
        for (const zone of zones) {
            const count = await database.get("visits").query(Q.where("zone", zone[0])).fetchCount();
            if (count !== 0) {
                var record: VisitStat = { zonename: zone[1], visitcount: count };
                data.push(record);
                setVisitData(data);
            }
        }
    };

    useEffect(() => {
        if (isFocused) {
            getStats()
                .catch(() => {})
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [isFocused]);

    return (
        <View style={styles.container}>
            <Title>Stats</Title>
            {!loading ? (
                <VictoryChart
                    animate={{
                        duration: 500,
                        onLoad: { duration: 500 },
                    }}
                    domainPadding={10}
                    padding={{ left: 120, right: 50, bottom: 30, top: 30 }}
                    containerComponent={<VictoryZoomContainer />}
                    theme={VictoryTheme.material}
                >
                    <VictoryAxis
                        style={{
                            axisLabel: { fontSize: 12 },
                            tickLabels: {
                                fontSize: 12,
                            },
                            grid: { stroke: "#B3E5FC", strokeWidth: 0.25 },
                        }}
                        dependentAxis
                    />
                    <VictoryAxis
                        style={{
                            axisLabel: { fontSize: 10 },
                            tickLabels: {
                                fontSize: 10,
                            },
                        }}
                    />
                    <VictoryBar
                        horizontal
                        barRatio={0.8}
                        style={{ data: { fill: themeColors.blueAccent } }}
                        alignment="middle"
                        data={visitData}
                        x="zonename"
                        y="visitcount"
                    />
                </VictoryChart>
            ) : (
                <Text>Not data</Text>
            )}
        </View>
    );
};

export default Todo;
