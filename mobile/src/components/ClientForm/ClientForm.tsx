import { Formik } from "formik";
import * as React from "react";
import { Component, useEffect, useState } from "react";
import { useZones } from "@cbr/common/src/util/hooks/zones";
import {
    TDisabilityMap,
    getDisabilities,
    useDisabilities,
} from "@cbr/common/src/util/hooks/disabilities";
import { View, Platform, ScrollView } from "react-native";
import { Button, Checkbox, Portal, TextInput, Modal, Text } from "react-native-paper";
import clientStyle from "../../screens/ClientDetails/ClientDetails.styles";
import DateTimePicker from "@react-native-community/datetimepicker";
import CustomMultiPicker from "react-native-multiple-select-list";
import { FormValues, FormProps, validationSchema } from "./ClientFormFields";
import * as Yup from "yup";
import { IClient } from "@cbr/common";
import { handleSubmit } from "./ClientSubmitHandler";
import { themeColors } from "@cbr/common";

export const ClientForm = (props: FormProps) => {
    const styles = clientStyle();
    var disabilityList = useDisabilities();
    var zoneList = useZones();

    var correctedClientDisability: number[] = [];
    var newSelectedDisabilityList: string[] = [];
    var initialDisabilityArray: string[] = props.initialDisabilityArray
        ? props.initialDisabilityArray
        : [];
    var initialZone: number = props.zone ? props.zone - 1 : 0;

    //Client Details Usestates
    const [date, setDate] = useState(new Date(props.date));
    const [caregiverPresent, setCaregiverPresent] = useState(false);
    const [selectedZone, setSelectedZone] = useState<Number>(initialZone);
    const [otherDisability, showOtherDisability] = useState(false);
    const [editMode, setEditMode] = useState(!props.isNewClient);
    const [cancelButtonType, setCancelButtonType] = useState("outlined");
    const [show, setShow] = useState(false);
    const [disabilityVisible, setDisabilityVisible] = useState(false);
    const [zonesVisible, setZonesVisible] = useState(false);
    const [selectedDisabilityList, setSelectedDisabilityList] =
        useState<string[]>(initialDisabilityArray);
    const [presentZone, setPresentZone] = useState<String>(
        Array.from(zoneList.values())[initialZone]
    );

    const openDisabilityMenu = () => setDisabilityVisible(true);
    const closeDisabilityMenu = () => setDisabilityVisible(false);
    const openZonesMenu = () => setZonesVisible(true);
    const closeZonesMenu = () => setZonesVisible(false);

    const initialValues: FormValues = {
        id: props.id,
        firstName: props.firstName,
        lastName: props.lastName,
        date: props.date,
        gender: props.gender,
        village: props.village,
        zone: props.zone,
        phone: props.phone,
        caregiverPresent: props.caregiverPresent,
        caregiverName: props.caregiverName,
        caregiverEmail: props.caregiverEmail,
        caregiverPhone: props.caregiverPhone,
        clientDisability: props.clientDisability,
        otherDisability: props.otherDisability,
    };

    const updateSelectedDisabilityList = (disabilityArray: number[]) => {
        for (let index of disabilityArray) {
            var tempIndex = index - 1;
            correctedClientDisability.push(tempIndex);
        }
        for (let popIndex = 0; popIndex <= newSelectedDisabilityList.length; popIndex++) {
            newSelectedDisabilityList.pop();
        }
        for (let index of disabilityArray) {
            if (disabilityList.has(index)) {
                newSelectedDisabilityList.push(disabilityList.get(index)!);
            }
        }
        newSelectedDisabilityList = newSelectedDisabilityList.filter(
            (v, i, a) => a.indexOf(v) === i
        );
        correctedClientDisability = correctedClientDisability.filter(
            (v, i, a) => a.indexOf(v) === i
        );
    };
    if (props.clientDisability) updateSelectedDisabilityList(props.clientDisability);
    const [modalSelections, setModalSelections] = useState<number[]>(correctedClientDisability);

    //Menu functions
    const toggleButtons = () => {
        if (editMode == true) {
            setEditMode(false);
            setCancelButtonType("contained");
        } else {
            setEditMode(true);
            setCancelButtonType("outlined");
        }
    };
    const cancelEdit = () => {
        setEditMode(true);
    };

    //Date Picker
    const showDatepicker = () => {
        setShow(true);
    };

    return (
        <View>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    //TODO: remake the object to pass in request in issue 44
                    //handleSubmit(updatedClientDTO); TODO: Work on this next issue - Placeholder code
                    toggleButtons();
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
                        <Text style={styles.errorText}>{formikProps.errors.firstName}</Text>

                        <TextInput
                            style={styles.clientTextStyle}
                            label="Last Name "
                            placeholder="Last Name"
                            onChangeText={formikProps.handleChange("lastName")}
                            value={formikProps.values.lastName}
                            disabled={editMode}
                        ></TextInput>
                        <Text style={styles.errorText}>{formikProps.errors.lastName}</Text>

                        <Text> Birthdate </Text>
                        <View style={styles.clientBirthdayView}>
                            <Text style={styles.carePresentCheckBox}>{date.toDateString()}</Text>
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
                                        value={formikProps.values.date!}
                                        mode="date"
                                        display="default"
                                        onChange={(event, date) => {
                                            setShow(Platform.OS === "ios");
                                            if (date) {
                                                formikProps.setFieldValue("date", date);
                                                setDate(date);
                                            }
                                            setShow(false);
                                        }}
                                    />
                                )}
                            </View>
                        </View>
                        <Text style={styles.errorText}>{formikProps.errors.date}</Text>

                        <TextInput
                            style={styles.clientTextStyle}
                            label="Gender "
                            placeholder="Gender"
                            onChangeText={formikProps.handleChange("gender")}
                            value={formikProps.values.gender}
                            disabled={editMode}
                        />
                        <Text style={styles.errorText}>{formikProps.errors.gender}</Text>

                        <TextInput
                            style={styles.clientTextStyle}
                            label="Village # "
                            placeholder="Village"
                            onChangeText={formikProps.handleChange("village")}
                            value={formikProps.values.village}
                            disabled={editMode}
                        />
                        <Text style={styles.errorText}>{formikProps.errors.village}</Text>

                        <View>
                            <Portal>
                                <Modal
                                    visible={zonesVisible}
                                    onDismiss={closeZonesMenu}
                                    style={styles.zoneChecklist}
                                >
                                    <View style={styles.nestedScrollView}>
                                        <View style={styles.disabilityListHeaderContainerStyle}>
                                            <Text style={styles.disabilityListHeaderStyle}>
                                                Zones List
                                            </Text>
                                        </View>
                                        <ScrollView
                                            style={styles.nestedScrollStyle}
                                            nestedScrollEnabled={true}
                                        >
                                            <CustomMultiPicker
                                                options={Array.from(zoneList.values())}
                                                placeholder={"Zones"}
                                                placeholderTextColor={themeColors.blueBgLight}
                                                returnValue={"zone_name"}
                                                callback={(values) => {
                                                    formikProps.handleChange("zone");
                                                    formikProps.setFieldValue(
                                                        "zone",
                                                        Number(values[0])
                                                    );
                                                    setPresentZone(
                                                        Array.from(zoneList.values())[
                                                            Number(values[0])
                                                        ]
                                                    );
                                                    setSelectedZone(Number(values[0]));
                                                }}
                                                rowBackgroundColor={"#eee"}
                                                iconSize={30}
                                                selectedIconName={"checkmark-circle"}
                                                unselectedIconName={"radio-button-off"}
                                                selected={String(selectedZone)}
                                            />
                                        </ScrollView>
                                    </View>
                                    <Button
                                        mode="contained"
                                        style={styles.modalSelectorButton}
                                        disabled={editMode}
                                        onPress={closeZonesMenu}
                                    >
                                        Save
                                    </Button>
                                </Modal>
                            </Portal>
                            <Text> Zone</Text>
                            <View style={styles.buttonZoneStyles}>
                                {!editMode ? (
                                    <Button
                                        mode="contained"
                                        style={styles.disabilityButton}
                                        disabled={editMode}
                                        onPress={openZonesMenu}
                                    >
                                        Edit Zone
                                    </Button>
                                ) : (
                                    <></>
                                )}

                                <Text style={styles.carePresentCheckBox}>{presentZone}</Text>
                            </View>
                        </View>
                        <Text style={styles.errorText}>{formikProps.errors.zone}</Text>

                        <TextInput
                            style={styles.clientTextStyle}
                            label="Phone Number "
                            placeholder="Phone Number"
                            onChangeText={formikProps.handleChange("phone")}
                            value={formikProps.values.phone}
                            disabled={editMode}
                        />
                        <Text style={styles.errorText}>{formikProps.errors.phone}</Text>

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
                                        <ScrollView
                                            style={styles.nestedScrollStyle}
                                            nestedScrollEnabled={true}
                                        >
                                            <CustomMultiPicker
                                                options={Array.from(disabilityList.values())}
                                                multiple={true}
                                                placeholder={"Disability"}
                                                placeholderTextColor={themeColors.blueBgLight}
                                                returnValue={"disability_type"}
                                                callback={(values: number[]) => {
                                                    var toUpdateDisability: number[] = [];
                                                    var checkBoolean = false;
                                                    for (let checkOther of Array.from(values)) {
                                                        if (checkOther == 9) {
                                                            checkBoolean = true;
                                                            break;
                                                        }
                                                    }

                                                    showOtherDisability(checkBoolean);
                                                    for (
                                                        let popIndex = 0;
                                                        popIndex <= toUpdateDisability.length;
                                                        popIndex++
                                                    ) {
                                                        toUpdateDisability.pop();
                                                    }

                                                    for (let index of Array.from(values)) {
                                                        toUpdateDisability.push(Number(index) + 1);
                                                    }

                                                    formikProps.setFieldValue(
                                                        "clientDisability",
                                                        toUpdateDisability
                                                    );

                                                    updateSelectedDisabilityList(
                                                        toUpdateDisability
                                                    );
                                                    setSelectedDisabilityList(
                                                        newSelectedDisabilityList
                                                    );

                                                    for (
                                                        let popIndex = 0;
                                                        popIndex <= toUpdateDisability.length;
                                                        popIndex++
                                                    ) {
                                                        toUpdateDisability.pop();
                                                    }
                                                    for (let index of Array.from(values)) {
                                                        toUpdateDisability.push(Number(index));
                                                    }
                                                    setModalSelections(toUpdateDisability);
                                                }}
                                                rowBackgroundColor={"#eee"}
                                                iconSize={30}
                                                selectedIconName={"checkmark-circle"}
                                                unselectedIconName={"radio-button-off"}
                                                selected={modalSelections.map(String)}
                                            />
                                            {otherDisability ? (
                                                <View>
                                                    <TextInput
                                                        style={styles.otherDisabilityStyle}
                                                        label="Other Disability "
                                                        placeholder="Other Disability"
                                                        onChangeText={formikProps.handleChange(
                                                            "otherDisability"
                                                        )}
                                                        value={formikProps.values.otherDisability}
                                                    />
                                                    <Text style={styles.errorText}>
                                                        {formikProps.errors.otherDisability}
                                                    </Text>
                                                </View>
                                            ) : (
                                                <></>
                                            )}
                                        </ScrollView>
                                        <Button
                                            mode="contained"
                                            style={styles.modalSelectorButton}
                                            disabled={editMode}
                                            onPress={closeDisabilityMenu}
                                        >
                                            Save
                                        </Button>
                                    </View>
                                </Modal>
                            </Portal>
                            <Text> Disability</Text>

                            {!editMode ? (
                                <Button
                                    mode="contained"
                                    style={styles.disabilityButton}
                                    disabled={editMode}
                                    onPress={openDisabilityMenu}
                                >
                                    Edit Disabilities
                                </Button>
                            ) : (
                                <></>
                            )}

                            {selectedDisabilityList.map((item) => {
                                return (
                                    <Text key={item} style={styles.carePresentCheckBox}>
                                        {item}
                                    </Text>
                                );
                            })}
                        </View>
                        <Text style={styles.errorText}>{formikProps.errors.clientDisability}</Text>

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
                                <Text style={styles.errorText}>
                                    {formikProps.errors.caregiverName}
                                </Text>
                                <TextInput
                                    style={styles.clientTextStyle}
                                    label="Caregiver Phone"
                                    placeholder="Caregiver Phone"
                                    onChangeText={formikProps.handleChange("caregiverPhone")}
                                    value={formikProps.values.caregiverPhone}
                                    disabled={editMode}
                                />
                                <Text style={styles.errorText}>
                                    {formikProps.errors.caregiverPhone}
                                </Text>
                                <TextInput
                                    style={styles.clientTextStyle}
                                    label="Caregiver Email "
                                    placeholder="Caregiver Email"
                                    onChangeText={formikProps.handleChange("caregiverEmail")}
                                    value={formikProps.values.caregiverEmail}
                                    disabled={editMode}
                                />
                                <Text style={styles.errorText}>
                                    {formikProps.errors.caregiverEmail}
                                </Text>
                            </View>
                        ) : (
                            <></>
                        )}
                        {props.isNewClient ? (
                            <Button
                                mode="contained"
                                style={styles.clientDetailsFinalButtons}
                                disabled={false}
                                onPress={() => {
                                    formikProps.handleSubmit();
                                }}
                            >
                                Save
                            </Button>
                        ) : (
                            <View style={styles.clientDetailsFinalView}>
                                <Button
                                    mode="contained"
                                    style={styles.clientDetailsFinalButtons}
                                    disabled={false}
                                    onPress={() => {
                                        if (editMode) toggleButtons();
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
                                        onPress={() => {
                                            cancelEdit();
                                            formikProps.resetForm();
                                            setDate(props.date);
                                            setPresentZone(
                                                Array.from(zoneList.values())[props.zone - 1]
                                            );
                                            setSelectedZone(props.zone - 1);
                                            if (props.caregiverPresent)
                                                setCaregiverPresent(props.caregiverPresent);
                                            else setCaregiverPresent(false);

                                            if (props.clientDisability)
                                                updateSelectedDisabilityList(
                                                    props.clientDisability
                                                );
                                            setSelectedDisabilityList(newSelectedDisabilityList);

                                            if (props.clientDisability)
                                                updateSelectedDisabilityList(
                                                    props.clientDisability
                                                );
                                            setModalSelections(correctedClientDisability);
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                )}
                            </View>
                        )}
                    </View>
                )}
            </Formik>
        </View>
    );
};
function getSelectedItemsExt(selectedItems: any): React.ReactNode {
    throw new Error("Function not implemented.");
}
function FormikHelpers<T>(): import("formik").FormikHelpers<
    import("../../screens/ClientDetails/ClientRequests").IClient
> {
    throw new Error("Function not implemented.");
}
