import { Formik, Form as MyInput } from "formik";
import * as React from "react";
import { useCallback, useEffect } from "react";
import { Component, useState } from "react";
import { useZones } from "@cbr/common/src/util/hooks/zones";
import { useDisabilities } from "../../../node_modules/@cbr/common/src/util/hooks/disabilities";
import { View, Text, Platform, ScrollView } from "react-native";
import {
    Button,
    Checkbox,
    List,
    Menu,
    Portal,
    Provider,
    TextInput,
    Modal,
} from "react-native-paper";
import clientStyle from "./Client.styles";
import DateTimePicker from "@react-native-community/datetimepicker";
import CustomMultiPicker from "react-native-multiple-select-list";
import MultiSelect from "react-native-multiple-select";
import Icon from "react-native-vector-icons/FontAwesome";

interface FormProps {
    firstName: string;
    lastName: string;
    date: Date;
    gender: string;
    village: string;
    zone: string;
    phone: string;
    caregiverPresent?: boolean;
    caregiverName?: string;
    caregiverEmail?: string;
    caregiverPhone?: string;
    clientDisability?: number[];
}
interface FormValues {
    //isNewClient?: boolean;
    firstName?: string;
    lastName?: string;
    date?: Date;
    gender?: string;
    village?: string;
    zone?: string;
    phone?: string;
    caregiverPresent?: boolean;
    caregiverName?: string;
    caregiverEmail?: string;
    caregiverPhone?: string;
    clientDisability?: number[];
}

export const ClientDetails = (props: FormProps) => {
    const styles = clientStyle();
    var zoneList = useZones();
    var disabilityList = useDisabilities();

    //Client Details Usestates
    const [clientFirstName, setClientFirstName] = useState<string>("");
    const [clientLastName, setClientLastName] = useState<string>("");
    const [date, setDate] = useState(new Date());
    const [gender, setGender] = useState("");
    const [village, setVillage] = useState("");
    const [zone, setZone] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [caregiverPresent, setCaregiverPresent] = React.useState(false);
    const [caregiverName, setCaregiverName] = React.useState("");
    const [caregiverEmail, setCaregiverEmail] = React.useState("");
    const [caregiverPhone, setCaregiverPhone] = React.useState("");
    const [clientDisability, setDisability] = useState<number[]>([]);

    const initialValues: FormValues = {
        firstName: props.firstName,
        lastName: props.lastName,
        date: props.date,
        gender: props.gender, //TODO: Get this from client
        village: props.village,
        zone: props.zone,
        phone: props.phone,
        caregiverPresent: props.caregiverPresent,
        caregiverName: props.caregiverName,
        caregiverEmail: props.caregiverEmail,
        caregiverPhone: props.caregiverPhone,
        clientDisability: props.clientDisability,
    };

    //Menu Consts and functions
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
    };

    //Date Picker
    const [show, setShow] = useState(false);

    const onDateChange = useCallback(
        (event, newDate) => {
            setShow(Platform.OS === "ios");
            if (newDate) setDate(newDate);
            setShow(false);
        },
        [show, date]
    );

    const showDatepicker = () => {
        setShow(true);
    };

    //Disability Menu editable toggle variables
    const [disabilityVisible, setDisabilityVisible] = React.useState(false);
    const openDisabilityMenu = () => setDisabilityVisible(true);
    const closeDisabilityMenu = () => setDisabilityVisible(false);
    const disabilityComponent = () => {
        {
            clientDisability.map((disability) => {
                return <Text style={styles.carePresentCheckBox}> {disability} </Text>;
            });
        }
    };

    const DisabilityChecklist = () => {
        return (
            <List.Section>
                <List.Accordion title="Disability">
                    {Array.from(disabilityList.entries()).map(([key, value]) => {
                        return (
                            <View key={key} style={styles.disabilityChecking}>
                                <Text>{value}</Text>
                                <Checkbox
                                    status="unchecked"
                                    onPress={() => {
                                        console.log(value);
                                    }}
                                />
                            </View>
                        );
                    })}
                </List.Accordion>
            </List.Section>
        );
    };

    //Zone Menu editable toggle variables
    const [zonesVisible, setZonesVisible] = React.useState(false);
    const openZonesMenu = () => setZonesVisible(true);
    const closeZonesMenu = () => setZonesVisible(false);

    return (
        <View>
            <Formik
                initialValues={initialValues}
                onSubmit={(values) => {
                    console.log(values);
                }}
            >
                {(formikProps) => (
                    <View>
                        <TextInput
                            style={styles.clientTextStyle}
                            label="First Name "
                            placeholder="First Name"
                            onChangeText={formikProps.handleChange("firstName")}
                            value={formikProps.values.firstName}
                            disabled={editMode}
                        ></TextInput>

                        <TextInput
                            style={styles.clientTextStyle}
                            label="Last Name "
                            placeholder="Last Name"
                            onChangeText={formikProps.handleChange("lastName")}
                            value={formikProps.values.lastName}
                            disabled={editMode}
                        ></TextInput>

                        <Text> Birthdate </Text>
                        <View style={styles.clientBirthdayView}>
                            <Text style={styles.carePresentCheckBox}>
                                {props.date.toDateString()}
                            </Text>
                            <View style={styles.clientBirthdayButtons}>
                                <View>
                                    <Button
                                        disabled={editMode}
                                        mode="contained"
                                        onPress={showDatepicker}
                                    >
                                        Edit
                                    </Button>
                                </View>
                                {show && (
                                    <DateTimePicker
                                        testID="dateTimePicker"
                                        value={props.date}
                                        mode="date"
                                        display="default"
                                        //onChange={onDateChange}
                                        onChange={formikProps.handleChange("date")}
                                    />
                                )}
                            </View>
                        </View>

                        <TextInput
                            style={styles.clientTextStyle}
                            label="Gender "
                            placeholder="Gender"
                            onChangeText={formikProps.handleChange("gender")}
                            value={formikProps.values.gender}
                            disabled={editMode}
                        />

                        <TextInput
                            style={styles.clientTextStyle}
                            label="Village # "
                            placeholder="Village"
                            onChangeText={formikProps.handleChange("village")}
                            value={formikProps.values.village}
                            disabled={editMode}
                        />

                        <View>
                            <Text> Zone</Text>
                            <Text style={styles.carePresentCheckBox}> {props.zone} </Text>
                            <Menu
                                visible={zonesVisible}
                                onDismiss={closeZonesMenu}
                                anchor={
                                    <Button
                                        mode="contained"
                                        style={styles.disabilityButton}
                                        disabled={editMode}
                                        onPress={openZonesMenu}
                                    >
                                        Edit Zones
                                    </Button>
                                }
                            >
                                {Array.from(zoneList.entries()).map(([key, value]) => {
                                    return (
                                        <Menu.Item
                                            key={key}
                                            title={value}
                                            onPress={() => {
                                                formikProps.handleChange("zone");
                                                closeZonesMenu();
                                            }}
                                        />
                                    );
                                })}
                            </Menu>
                        </View>

                        <TextInput
                            style={styles.clientTextStyle}
                            label="Phone Number "
                            placeholder="Phone Number"
                            onChangeText={formikProps.handleChange("phone")}
                            value={formikProps.values.phone}
                            disabled={editMode}
                        />

                        <View>
                            <Portal>
                                <Modal
                                    visible={disabilityVisible}
                                    onDismiss={closeDisabilityMenu}
                                    style={styles.disabilityChecklist}
                                >
                                    <View style={styles.nestedScrollView}>
                                        <View style={styles.disabilityListHeaderContainerStyle}>
                                            <Text style={styles.disabilityListHeaderStyle}>
                                                Disability List
                                            </Text>
                                        </View>
                                        <ScrollView nestedScrollEnabled={true}>
                                            <CustomMultiPicker
                                                options={Array.from(disabilityList.entries())}
                                                multiple={true}
                                                placeholder={"Disability"}
                                                placeholderTextColor={"#757575"}
                                                returnValue={"disability_type"}
                                                callback={(res) => {
                                                    console.log(res);
                                                }}
                                                rowBackgroundColor={"#eee"}
                                                iconSize={30}
                                                selectedIconName={"checkmark-circle"}
                                                unselectedIconName={"radio-button-off"}
                                                selected={props.clientDisability?.map(String)}
                                            />
                                        </ScrollView>
                                    </View>
                                </Modal>
                            </Portal>
                            <Text> Disability</Text>
                            <Button
                                mode="contained"
                                style={styles.disabilityButton}
                                disabled={editMode}
                                onPress={openDisabilityMenu}
                            >
                                Edit Disabilities
                            </Button>
                        </View>

                        <View style={styles.carePresentView}>
                            <Text style={styles.carePresentCheckBox}>Caregiver Present</Text>
                            <Checkbox
                                status={caregiverPresent ? "checked" : "unchecked"}
                                onPress={() => {
                                    setCaregiverPresent(!caregiverPresent);
                                    formikProps.handleChange("caregiverPresent");
                                }}
                                disabled={editMode}
                            />
                        </View>

                        {caregiverPresent ? (
                            <View>
                                <TextInput
                                    style={styles.clientTextStyle}
                                    label="Caregiver Name "
                                    placeholder="Caregiver Name"
                                    onChangeText={formikProps.handleChange("caregiverName")}
                                    value={formikProps.values.caregiverName}
                                    disabled={editMode}
                                />
                                <TextInput
                                    style={styles.clientTextStyle}
                                    label="Caregiver Phone"
                                    placeholder="Caregiver Phone"
                                    onChangeText={formikProps.handleChange("caregiverPhone")}
                                    value={formikProps.values.caregiverPhone}
                                    disabled={editMode}
                                />
                                <TextInput
                                    style={styles.clientTextStyle}
                                    label="Caregiver Email "
                                    placeholder="Caregiver Email"
                                    onChangeText={formikProps.handleChange("caregiverEmail")}
                                    value={formikProps.values.caregiverEmail}
                                    disabled={editMode}
                                />
                            </View>
                        ) : (
                            <></>
                        )}
                        <View style={styles.clientDetailsFinalView}>
                            <Button
                                mode="contained"
                                style={styles.clientDetailsFinalButtons}
                                disabled={false}
                                onPress={() => {
                                    enableButtons();
                                    if (!editMode) {
                                        formikProps.handleSubmit();
                                    }
                                }}
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
                    </View>
                )}
            </Formik>
        </View>
    );
};
function getSelectedItemsExt(selectedItems: any): React.ReactNode {
    throw new Error("Function not implemented.");
}
