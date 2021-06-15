import React from "react";
import { View } from "react-native";
import { Text, DataTable } from "react-native-paper";
import { FlatList} from 'react-native';
import useStyles from "./ClientList.styles";

function ClientList(){
  const styles = useStyles();
  const clientName = [{
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
  },];
  const exampleList = [
    {
      Name: 'ascas',
      Email: 'Save@sac.com',
      Age: '14',
    },
    {
      Name: 'ascas',
      Email: 'Vie@sac.com',
      Age: '14',
    },
  ];


  return (
    <View style={styles.container}>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Account</DataTable.Title>
          <DataTable.Title>Code</DataTable.Title>
          <DataTable.Title>
            Balance Available
          </DataTable.Title>
        </DataTable.Header>
        {
          exampleList.map(item => {
          return (
            <DataTable.Row
              key={item.Email} // you need a unique key per item
              onPress={() => {
                // added to illustrate how you can make the row take the onPress event and do something
                console.log(`selected account ${item.Email}`)
              }}
            >
              <DataTable.Cell>
                {item.Name}
              </DataTable.Cell>
              <DataTable.Cell style={styles.item}>
                {item.Email}
              </DataTable.Cell>
              <DataTable.Cell numeric>
                {item.Age}
              </DataTable.Cell>
            </DataTable.Row>
        )})}
      </DataTable>
    </View>
  );
};

export default ClientList;
