import React from "react";
import { View } from "react-native";
import { DataTable } from "react-native-paper";
import useStyles from "./ClientList.styles";
import { fetchClientsFromApi as fetchClientsFromApi } from "./ClientListRequest";
import { MaterialIcons } from "@expo/vector-icons";
import { riskTypes, riskLevels } from "../../util/risks";
import { StackNavigationProp } from "@react-navigation/stack";
import { stackParamList, stackScreenName } from "../../util/screens";

interface ClientListControllerProps {
    navigation: StackNavigationProp<stackParamList, stackScreenName.HOME>;
}

const ClientList = (props: ClientListControllerProps) => {
    const styles = useStyles();
    //remove ID and test
    const exampleList = [
        {
            Id: 1,
            Name: "Naruto",
            Zone: 3,
            HealthLevel: riskLevels.LO.color,
            EducationLevel: riskLevels.CR.color,
            SocialLevel: riskLevels.CR.color,
        },
        {
            Id: 2,
            Name: "Sasuke",
            Zone: 5,
            HealthLevel: riskLevels.LO.color,
            EducationLevel: riskLevels.HI.color,
            SocialLevel: riskLevels.CR.color,
        },
    ];

    const newClientGet = async () => {
        const exampleClient = await fetchClientsFromApi();
        exampleList.push(exampleClient);
    };

    return (
        <View style={styles.container}>
            <DataTable>
                <DataTable.Header>
                    <DataTable.Title>ID</DataTable.Title>
                    <DataTable.Title>Name</DataTable.Title>
                    <DataTable.Title>Zone</DataTable.Title>
                    <DataTable.Title>{riskTypes.HEALTH.name}</DataTable.Title>
                    <DataTable.Title>{riskTypes.EDUCAT.name}</DataTable.Title>
                    <DataTable.Title>{riskTypes.SOCIAL.name}</DataTable.Title>
                </DataTable.Header>
                {exampleList.map((item) => {
                    return (
                        <DataTable.Row
                            key={item.Id} // you need a unique key per item
                            onPress={() => {
                                props.navigation.navigate(stackScreenName.CLIENT, {
                                    clientName: item.Name,
                                });
                            }}
                        >
                            <DataTable.Cell>{item.Id}</DataTable.Cell>
                            <DataTable.Cell style={styles.item}>{item.Name}</DataTable.Cell>
                            <DataTable.Cell style={styles.item}>{item.Zone}</DataTable.Cell>
                            <DataTable.Cell>
                                <MaterialIcons
                                    name={riskTypes.HEALTH.Icon}
                                    size={32}
                                    color={item.HealthLevel}
                                />
                            </DataTable.Cell>
                            <DataTable.Cell>
                                <MaterialIcons
                                    name={riskTypes.EDUCAT.Icon}
                                    size={32}
                                    color={item.EducationLevel}
                                />
                            </DataTable.Cell>
                            <DataTable.Cell>
                                <MaterialIcons
                                    name={riskTypes.SOCIAL.Icon}
                                    size={32}
                                    color={item.SocialLevel}
                                />
                            </DataTable.Cell>
                        </DataTable.Row>
                    );
                })}
            </DataTable>
        </View>
    );
};

export default ClientList;
