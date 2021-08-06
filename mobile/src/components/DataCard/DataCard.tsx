import React from "react";
import { View } from "react-native";
import { Card, Title, Text, Paragraph } from "react-native-paper";
import useStyles from "./DataCard.style";

interface IDataCardProps {
    data: {
        title: string;
        desc: string;
    }[];
}

const DataCard = ({ data }: IDataCardProps) => {
    const styles = useStyles();

    return (
        <View>
            <Card style={styles.container}>
                <Card.Content>
                    {data.map((d, i) => (
                        <Text key={i}>
                            <Text style={styles.title}>{d.title}:</Text> {d.desc}
                            {"\n"}
                        </Text>
                    ))}
                </Card.Content>
            </Card>
        </View>
    );
};

export default DataCard;
