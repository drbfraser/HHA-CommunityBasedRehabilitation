import React from "react";
import { Avatar, Button, Card, Title, Paragraph } from "react-native-paper";

interface clientProps {
    clientName: String;
}

const IndividualClientView = (props: clientProps) => {
    return (
        <Card>
            <Card.Title title={props.clientName} subtitle="Card Subtitle" />
            <Card.Content>
                <Title>Card title</Title>
                <Paragraph>Card content</Paragraph>
            </Card.Content>
            <Card.Cover source={{ uri: "https://picsum.photos/700" }} />
            <Card.Actions>
                <Button>Cancel</Button>
                <Button>Ok</Button>
            </Card.Actions>
        </Card>
    );
};

export default IndividualClientView;
