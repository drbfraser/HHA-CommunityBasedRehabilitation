import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { Button, Card, Title, Paragraph, TextInput, Checkbox, Menu } from "react-native-paper";
import clientStyle from "./clientStyles";
import { Text, View } from "react-native";

interface clientProps {
    clientName: String;
}
const styles = clientStyle();

const IndividualClientView = (props: clientProps) => {
    const [showDisabilityMenu, setShowDiosabilityMenu] = useState(false);
    const [disability, setdisability] = useState();
    const [checked, setChecked] = React.useState(false);
    const [editMode, setEditMode] = React.useState(false);
    const disabilityList = [
        { label: "Amputee", value: "Amputee" },
        { label: "Polio", value: "Polio" },
        { label: "Other", value: "Other" },
    ];
    const [cancelButtonMode, setCancelButtonMode] = React.useState("outlined");

    return (
        <ScrollView style={styles.scrollViewStyles}>
            <Card style={styles.clientCardContainerStyles}>
                <Card.Cover
                    style={styles.clientCardImageStyle}
                    source={{ uri: "https://picsum.photos/700" }}
                />
                <Button mode="contained" style={styles.clientButtons}>
                    New Visit
                </Button>
                <Button mode="contained" style={styles.clientButtons}>
                    New Referral
                </Button>
                <Button mode="contained" style={styles.clientButtons}>
                    Baseline Survey
                </Button>
            </Card>
            <Card style={styles.clientDetailsContainerStyles}>
                <TextInput
                    style={styles.clientTextStyle}
                    label="First Name: "
                    value={props.clientName}
                    disabled={checked}
                    editable={true}
                />
                <TextInput
                    style={styles.clientTextStyle}
                    label="Last Name: "
                    value={props.clientName}
                    disabled={editMode}
                    editable={true}
                />
                <TextInput
                    style={styles.clientTextStyle}
                    label="Birthdate "
                    value={props.clientName}
                    disabled={editMode}
                    editable={true}
                />
                <TextInput
                    style={styles.clientTextStyle}
                    label="Village # "
                    value={props.clientName}
                    disabled={editMode}
                    editable={true}
                />
                <TextInput
                    style={styles.clientTextStyle}
                    label="Zone "
                    value={props.clientName}
                    disabled={editMode}
                    editable={true}
                />
                <TextInput
                    style={styles.clientTextStyle}
                    label="Phone Number "
                    value={props.clientName}
                    disabled={editMode}
                    editable={true}
                />
                <TextInput
                    style={styles.clientTextStyle}
                    label="Disability "
                    value={props.clientName}
                    disabled={editMode}
                    editable={true}
                />
                <Button mode="contained" style={styles.clientDetailsButtons} disabled={true}>
                    Edit Disability
                </Button>
                <View style={styles.clientDetailsView}>
                    <Text style={styles.clientDetailsCheckboxText}>Caregiver Present</Text>
                    <Checkbox
                        status={checked ? "checked" : "unchecked"}
                        onPress={() => {
                            setChecked(!checked);
                        }}
                        disabled={true}
                    />
                </View>
                <View style={styles.clientDetailsFinalView}>
                    <Button
                        mode="contained"
                        style={styles.clientDetailsFinalButtons}
                        disabled={false}
                    >
                        Edit
                    </Button>
                    <Button
                        mode={cancelButtonMode}
                        style={styles.clientDetailsFinalButtons}
                        disabled={true}
                    >
                        Cancel
                    </Button>
                </View>
            </Card>
        </ScrollView>
    );
};

export default IndividualClientView;
