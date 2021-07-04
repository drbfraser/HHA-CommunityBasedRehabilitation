import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { Button, Card, TextInput, Checkbox, Menu, Divider } from "react-native-paper";
import { ClientDTO } from "./ClientRequests";
import clientStyle from "./Client.styles";
import { Platform, Text, View } from "react-native";
import { Item } from "react-native-paper/lib/typescript/components/List/List";
import { fetchClientDetailsFromApi } from "./ClientRequests";
import { timestampToDate, timestampToDateObj } from "../../../node_modules/@cbr/common";
import {
    getDisabilities,
    TDisabilityMap,
} from "../../../node_modules/@cbr/common/src/util/hooks/disabilities";
import { riskTypes } from "../../util/riskIcon";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useCallback } from "react";
/*
    Use client image instead of randomly generated
    Get disabilities details from making the disability API call and map them (done but haven't implemented correctly)
    Change the dropdown menu to a picker like in the baseline survey
    Change risk card edit button to popup instead of text box (or can be either)
    Create component that displays surveys being done
*/
interface ClientProps {
    clientID: number;
}

const Client = (props: ClientProps) => {
    const styles = clientStyle();
    //Client fetch and API call variables
    const [presentClient, setPresentClient] = useState<ClientDTO>();
    const [date, setDate] = useState(new Date());
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [village, setVillage] = useState("");
    const [zone, setZone] = useState(0);
    const [phoneNumber, setPhoneNumber] = useState("");

    useEffect(() => {
        const getClientDetails = async () => {
            const presentClient = await fetchClientDetailsFromApi(props.clientID);
            setDate(timestampToDateObj(Number(presentClient?.birthdate)));
            setFirstName(presentClient.first_name);
            setLastName(presentClient.last_name);
            setVillage(presentClient.village);
            setZone(presentClient.zone);
            setPhoneNumber(presentClient.phoneNumber);
            setPresentClient(presentClient);
        };
        getClientDetails();
    }, []);

    //Disability and Menu Variables
    const [showDisabilityMenu, setShowDisabilityMenu] = useState(false);
    const [disability, setdisability] = useState("Amputee"); //Set to amputee for now but get from database
    const disabilityList = [
        { label: "Amputee", value: "Amputee" },
        { label: "Polio", value: "Polio" },
        { label: "Other", value: "Other" },
    ];

    //const [disabilityList, setDisabilityList] = useState<TDisabilityMap>();
    // const getDisabilityList = async () => {
    //     const tempDisabilityList = await getDisabilities();
    //     setDisabilityList(tempDisabilityList);
    // };
    //const [clientDisability, setDisability] = useState<String>("N/A");
    // getDisabilityList();
    // console.log(disabilityList);
    // const assignDisability = () => {
    //     disabilityList.forEach((value: string, key: number) => {
    //         if (key === presentClient?.disabilities.indexOf(0)) {
    //              setDisability(value);
    //          }
    //         console.log(key, value);
    //     });
    // };
    // assignDisability();

    //DatePicker variables

    const [show, setShow] = useState(false);

    const onDateChange = useCallback(
        (event, newDate) => {
            setShow(Platform.OS === "ios");
            if (newDate) setDate(newDate);
            console.log(newDate);
            setShow(false);
        },
        [show, date]
    );

    const showDatepicker = () => {
        setShow(true);
    };

    const datePicker = () => {
        return (
            <View style={styles.clientBirthdayButtons}>
                <View>
                    <Button onPress={showDatepicker}>Edit</Button>
                </View>
                {show && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode="date"
                        display="default"
                        onChange={onDateChange}
                    />
                )}
            </View>
        );
    };

    //Menu editable toggle variables
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
            <Divider></Divider>
            <Text style={styles.cardSectionTitle}>Client Details</Text>
            <Divider></Divider>
            <Card style={styles.clientDetailsContainerStyles}>
                <TextInput
                    style={styles.clientTextStyle}
                    label="First Name: "
                    value={firstName}
                    disabled={editMode}
                    editable={true}
                />
                <TextInput
                    style={styles.clientTextStyle}
                    label="Last Name: "
                    value={lastName}
                    disabled={editMode}
                    editable={true}
                />
                <Text> Birthdate: </Text>
                <View style={styles.clientBirthdayView}>
                    <Text style={styles.carePresentCheckBox}>{date.toDateString()}</Text>
                    <View>{datePicker()}</View>
                </View>
                <TextInput
                    style={styles.clientTextStyle}
                    label="Village # "
                    value={village}
                    disabled={editMode}
                    editable={true}
                />
                <TextInput
                    style={styles.clientTextStyle}
                    label="Zone "
                    value={String(zone)}
                    disabled={editMode}
                    editable={true}
                />
                <TextInput
                    style={styles.clientTextStyle}
                    label="Phone Number "
                    value={phoneNumber}
                    disabled={editMode}
                    editable={true}
                />
                <TextInput
                    style={styles.clientTextStyle}
                    label="Disability "
                    value="TODO"
                    disabled={editMode}
                    editable={true}
                />
                <View>
                    <Text> Disability </Text>
                    <Text style={styles.carePresentCheckBox}> {disability} </Text>
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
                <View style={styles.carePresentView}>
                    <Text style={styles.carePresentCheckBox}>Caregiver Present</Text>
                    <Checkbox
                        status={checked ? "checked" : "unchecked"}
                        onPress={() => {
                            setChecked(!checked);
                        }}
                        disabled={editMode}
                    />
                    {checked ? <Text>This will show up when checked</Text> : <></>}
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
                    {editMode ? (
                        <></>
                    ) : (
                        <Button
                            mode={cancelButtonType}
                            style={styles.clientDetailsFinalButtons}
                            disabled={editMode}
                            onPress={cancelEdit}
                        >
                            Cancel
                        </Button>
                    )}
                </View>
            </Card>
            <Divider></Divider>
            <Text style={styles.cardSectionTitle}>Client Risks</Text>
            <Divider></Divider>
            <Card style={styles.riskCardStyle}>
                <View style={styles.riskCardContentStyle}>
                    <Text style={styles.riskTitleStyle}>Health</Text>
                    <Text style={styles.riskSubtitleStyle}>CRITICAL</Text>
                </View>
                <View>
                    <Text style={styles.riskHeaderStyle}>Requirements: </Text>
                    <Text style={styles.riskRequirementStyle}>Requrements go here</Text>
                </View>
                <View>
                    <Text style={styles.riskHeaderStyle}>Goals: </Text>
                    <Text style={styles.riskRequirementStyle}>Goals go here</Text>
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
                </View>
            </Card>
            <Divider></Divider>
            <Card style={styles.riskCardStyle}>
                <View style={styles.riskCardContentStyle}>
                    <Text style={styles.riskTitleStyle}>Education</Text>
                    <Text style={styles.riskSubtitleStyle}>CRITICAL</Text>
                </View>
                <View>
                    <Text style={styles.riskHeaderStyle}>Requirements: </Text>
                    <Text style={styles.riskRequirementStyle}>Requrements go here</Text>
                </View>
                <View>
                    <Text style={styles.riskHeaderStyle}>Goals: </Text>
                    <Text style={styles.riskRequirementStyle}>Goals go here</Text>
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
                </View>
            </Card>
            <Divider></Divider>
            <Card style={styles.riskCardStyle}>
                <View style={styles.riskCardContentStyle}>
                    <Text style={styles.riskTitleStyle}>Social</Text>
                    <Text style={styles.riskSubtitleStyle}>CRITICAL</Text>
                </View>
                <View>
                    <Text style={styles.riskHeaderStyle}>Requirements: </Text>
                    <Text style={styles.riskRequirementStyle}>Requrements go here</Text>
                </View>
                <View>
                    <Text style={styles.riskHeaderStyle}>Goals: </Text>
                    <Text style={styles.riskRequirementStyle}>Goals go here</Text>
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
                </View>
            </Card>
        </ScrollView>
    );
};

export default Client;
