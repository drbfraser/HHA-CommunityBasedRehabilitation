import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { Button, Card, TextInput, Checkbox, Menu } from "react-native-paper";
import clientStyle from "./clientStyles";
import { Text, View } from "react-native";
import { Item } from "react-native-paper/lib/typescript/components/List/List";

interface clientProps {
    clientName: String;
}
const styles = clientStyle();

const IndividualClientView = (props: clientProps) => {
    const [showDisabilityMenu, setShowDiosabilityMenu] = useState(false);
    const [disability, setdisability] = useState("Amputee"); //Set to amputee for now but get from database
    const disabilityList = [
        { label: "Amputee", value: "Amputee" },
        { label: "Polio", value: "Polio" },
        { label: "Other", value: "Other" },
    ];
    const [visible, setVisible] = React.useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);
    const [checked, setChecked] = React.useState(false);
    const [editMode, setEditMode] = React.useState(true);
    const [cancelButtonType, setCancelButtonType] = React.useState("outlined");
    const enableButtons = () => {
        if (editMode == true) {
            setEditMode(false);
            setCancelButtonType("contained");
        } else {
            //Make the PUT Api Call to edit client here since this is the save click
            setEditMode(true);
            setCancelButtonType("outlined");
        }
    };
    const cancelEdit = () => {
        //Discard any changes and reset the text fields to show what they originially did
        setEditMode(true);
        setCancelButtonType("outlined");
    };

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
                    disabled={editMode}
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
                <View>
                    <Text> Disability </Text>
                    <Text style={styles.clientDetailsCheckboxText}> {disability} </Text>
                    <Menu
                        visible={visible}
                        onDismiss={closeMenu}
                        anchor={
                            <Button
                                mode="contained"
                                style={styles.disabilityButton}
                                disabled={editMode}
                                onPress={openMenu}
                            >
                                Edit Disability
                            </Button>
                        }
                    >
                        {disabilityList.map((item) => {
                            return (
                                <Menu.Item
                                    key={item.label}
                                    title={item.label}
                                    onPress={() => {
                                        setdisability(item.value);
                                        closeMenu();
                                    }}
                                />
                            );
                        })}
                    </Menu>
                </View>
                <View style={styles.clientDetailsView}>
                    <Text style={styles.clientDetailsCheckboxText}>Caregiver Present</Text>
                    <Checkbox
                        status={checked ? "checked" : "unchecked"}
                        onPress={() => {
                            setChecked(!checked);
                        }}
                        disabled={editMode}
                    />
                </View>
                <View style={styles.clientDetailsFinalView}>
                    <Button
                        mode="contained"
                        style={styles.clientDetailsFinalButtons}
                        disabled={false}
                        onPress={enableButtons}
                    >
                        {editMode ? "Edit" : "Save"}
                    </Button>
                    <Button
                        mode={cancelButtonType}
                        style={styles.clientDetailsFinalButtons}
                        disabled={editMode}
                        onPress={cancelEdit}
                    >
                        Cancel
                    </Button>
                </View>
            </Card>
        </ScrollView>
    );
};

export default IndividualClientView;
