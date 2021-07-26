import { Formik } from "formik";
import * as React from "react";
import { useEffect, useState } from "react";
import { useZones } from "@cbr/common/src/util/hooks/zones";
import { useDisabilities, getOtherDisabilityId } from "@cbr/common/src/util/hooks/disabilities";
import { View, Platform, ScrollView, Alert } from "react-native";
import { Button, Checkbox, Portal, TextInput, Modal, Text } from "react-native-paper";
import useStyles from "../../screens/ClientDetails/ClientDetails.styles";
import DateTimePicker from "@react-native-community/datetimepicker";
import CustomMultiPicker from "react-native-multiple-select-list";
import { ClientFormFieldLabels, ClientFormFields, IFormProps } from "./ClientFormFields";
import { Gender, genders, IClient, themeColors } from "@cbr/common";
import { handleSubmit } from "./ClientSubmitHandler";

export const objectFromMap = <K extends string | number | symbol, V>(
    map: Map<K, V> | ReadonlyMap<K, V>
): Record<K, V> => {
    const obj: Partial<Record<K, V>> = {};
    for (const entry of map) {
        const [key, value] = entry;
        obj[key] = value;
    }
    return obj as Record<K, V>;
};

export const ClientForm = (props: IFormProps) => {
    const styles = useStyles();
    const otherDisabilityId = getOtherDisabilityId(useDisabilities());
    const disabilityMap = useDisabilities();
    const disabilityObj = objectFromMap(disabilityMap);
    const zoneObj = objectFromMap(useZones());

    let initialDisabilityArray: string[] = props.formikProps?.values.initialDisabilityArray
        ? props.formikProps?.values.initialDisabilityArray
        : [];
    let initialZone: number = props.formikProps?.values.zone ? props.formikProps.values.zone : 0;

    //Client Details Usestates
    const [date, setDate] = useState(props.formikProps?.values.date);
    const [caregiverPresent, setCaregiverPresent] = useState(
        props.formikProps?.values.caregiverPresent
    );
    const [clientGender, setClientGender] = useState(props.formikProps?.values.gender);
    const [selectedZone, setSelectedZone] = useState<Number>(initialZone);
    const [otherDisability, showOtherDisability] = useState(false);
    const [fieldsDisabled, setFieldsDisabled] = useState(!props.isNewClient);
    const [cancelButtonType, setCancelButtonType] = useState<"outlined" | "contained">("outlined");
    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const [disabilityPickerVisible, setDisabilityPickerVisible] = useState(false);
    const [zonesPickerVisible, setZonesPickerVisible] = useState(false);
    const [genderPickerVisible, setGenderPickerVisible] = useState(false);
    const [selectedDisabilityList, setSelectedDisabilityList] =
        useState<string[]>(initialDisabilityArray);
    const [presentZone, setPresentZone] = useState<String>(String(zoneObj[initialZone]));

    const openDisabilityMenu = () => setDisabilityPickerVisible(true);
    const closeDisabilityMenu = () => setDisabilityPickerVisible(false);
    const openZonesMenu = () => setZonesPickerVisible(true);
    const closeZonesMenu = () => setZonesPickerVisible(false);
    const openGenderMenu = () => setGenderPickerVisible(true);
    const closeGenderMenu = () => setGenderPickerVisible(false);

    const updateDisabilityList = (values: number[] | undefined) => {
        let newList: string[] = [];
        if (!values) return newList;
        else {
            for (let index of values) {
                if (index === otherDisabilityId) {
                    showOtherDisability(true);
                    newList.push("Other");
                } else {
                    newList.push(disabilityObj[index]);
                }
            }
        }
        setSelectedDisabilityList(newList);
    };

    //Menu functions
    const toggleButtons = (toggleTo: boolean) => {
        if (toggleTo) {
            setFieldsDisabled(false);
            setCancelButtonType("contained");
        } else {
            setFieldsDisabled(true);
            setCancelButtonType("outlined");
        }
    };

    const cancelEdit = () => {
        setFieldsDisabled(true);
    };

    //Date Picker
    const showDatepicker = () => {
        setDatePickerVisible(true);
    };

    const resetFormState = () => {
        if (props.formikProps) {
            setDate(props.formikProps.values.date);
            setPresentZone(String(zoneObj[initialZone]));
            setSelectedZone(initialZone);
            if (props.formikProps.values.caregiverPresent)
                setCaregiverPresent(props.formikProps.values.caregiverPresent);
            else setCaregiverPresent(false);
        } else {
            setDate(new Date());
            setPresentZone(String(zoneObj[initialZone]));
            setSelectedZone(initialZone);
            setCaregiverPresent(false);
        }
    };

    return (
        <View>
            <View>
                <TextInput
                    style={styles.clientTextStyle}
                    label={ClientFormFieldLabels[ClientFormFields.first_name]}
                    placeholder={ClientFormFieldLabels[ClientFormFields.first_name]}
                    onChangeText={props.formikProps?.handleChange(ClientFormFields.first_name)}
                    value={props.formikProps?.values.firstName}
                    disabled={fieldsDisabled}
                />
                <Text style={styles.errorText}>{props.formikProps?.errors.firstName}</Text>

                <TextInput
                    style={styles.clientTextStyle}
                    label={ClientFormFieldLabels[ClientFormFields.last_name]}
                    placeholder={ClientFormFieldLabels[ClientFormFields.last_name]}
                    onChangeText={props.formikProps?.handleChange(ClientFormFields.last_name)}
                    value={props.formikProps?.values.lastName}
                    disabled={fieldsDisabled}
                />
                <Text style={styles.errorText}>{props.formikProps?.errors.lastName}</Text>

                <Text>{ClientFormFieldLabels[ClientFormFields.date]}</Text>
                <View style={styles.clientBirthdayView}>
                    <Text style={styles.valueText}>{date.toDateString()}</Text>
                    <View style={styles.clientBirthdayButtons}>
                        <View>
                            <Button
                                disabled={fieldsDisabled}
                                mode="contained"
                                onPress={showDatepicker}
                            >
                                Edit
                            </Button>
                        </View>
                        {datePickerVisible && (
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={props.formikProps?.values.date ?? new Date()}
                                mode="date"
                                display="default"
                                onChange={(event, date) => {
                                    setDatePickerVisible(Platform.OS === "ios");
                                    if (date) {
                                        props.formikProps?.setFieldValue(
                                            ClientFormFields.date,
                                            date
                                        );
                                        setDate(date);
                                    }
                                    setDatePickerVisible(false);
                                }}
                            />
                        )}
                    </View>
                </View>
                <Text style={styles.errorText}>{props.formikProps?.errors.date}</Text>

                <View>
                    <Portal>
                        <Modal
                            visible={genderPickerVisible}
                            onDismiss={closeGenderMenu}
                            style={styles.genderChecklist}
                        >
                            <View style={styles.nestedGenderScrollView}>
                                <View style={styles.disabilityListHeaderContainerStyle}>
                                    <Text style={styles.disabilityListHeaderStyle}>Gender</Text>
                                </View>
                                <ScrollView
                                    style={styles.nestedScrollStyle}
                                    nestedScrollEnabled={true}
                                >
                                    <CustomMultiPicker
                                        options={genders}
                                        placeholder={ClientFormFieldLabels[ClientFormFields.gender]}
                                        placeholderTextColor={themeColors.blueBgLight}
                                        returnValue={"Gender"}
                                        callback={(values) => {
                                            props.formikProps?.setFieldValue(
                                                ClientFormFields.gender,
                                                values[0]
                                            );
                                            setClientGender(values[0]);
                                        }}
                                        rowBackgroundColor={themeColors.blueBgLight}
                                        iconSize={30}
                                        selectedIconName={"checkmark-circle"}
                                        unselectedIconName={"radio-button-off"}
                                        selected={clientGender}
                                    />
                                </ScrollView>
                            </View>
                            <Button
                                mode="contained"
                                style={styles.modalSelectorButton}
                                disabled={fieldsDisabled}
                                onPress={closeGenderMenu}
                            >
                                Save
                            </Button>
                        </Modal>
                    </Portal>
                    <Text>Gender</Text>
                    <View style={styles.buttonZoneStyles}>
                        {clientGender === Gender.MALE ? (
                            <Text style={styles.valueText}>{genders.M}</Text>
                        ) : (
                            <Text style={styles.valueText}>{genders.F}</Text>
                        )}
                        {!fieldsDisabled ? (
                            <Button
                                mode="contained"
                                style={styles.disabilityButton}
                                disabled={fieldsDisabled}
                                onPress={openGenderMenu}
                            >
                                Edit Gender
                            </Button>
                        ) : (
                            <></>
                        )}
                    </View>
                </View>
                <Text style={styles.errorText}>{props.formikProps?.errors.gender}</Text>

                <TextInput
                    style={styles.clientTextStyle}
                    label={ClientFormFieldLabels[ClientFormFields.village]}
                    placeholder={ClientFormFieldLabels[ClientFormFields.village]}
                    onChangeText={props.formikProps?.handleChange(ClientFormFields.village)}
                    value={props.formikProps?.values.village}
                    disabled={fieldsDisabled}
                />
                <Text style={styles.errorText}>{props.formikProps?.errors.village}</Text>

                <View>
                    <Portal>
                        <Modal
                            visible={zonesPickerVisible}
                            onDismiss={closeZonesMenu}
                            style={styles.zoneChecklist}
                        >
                            <View style={styles.nestedScrollView}>
                                <View style={styles.disabilityListHeaderContainerStyle}>
                                    <Text style={styles.disabilityListHeaderStyle}>Zones List</Text>
                                </View>
                                <ScrollView
                                    style={styles.nestedScrollStyle}
                                    nestedScrollEnabled={true}
                                >
                                    <CustomMultiPicker
                                        options={zoneObj}
                                        placeholder={"Zones"}
                                        placeholderTextColor={themeColors.blueBgLight}
                                        returnValue={"zone_name"}
                                        callback={(values) => {
                                            props.formikProps?.setFieldValue(
                                                "zone",
                                                values.map(Number)
                                            );
                                            setPresentZone(zoneObj[values.map(Number)]);
                                            setSelectedZone(values);
                                        }}
                                        rowBackgroundColor={themeColors.blueBgLight}
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
                                disabled={fieldsDisabled}
                                onPress={closeZonesMenu}
                            >
                                Save
                            </Button>
                        </Modal>
                    </Portal>
                    <Text>Zone</Text>
                    <View style={styles.buttonZoneStyles}>
                        <Text style={styles.valueText}>{presentZone}</Text>
                        {!fieldsDisabled ? (
                            <Button
                                mode="contained"
                                style={styles.disabilityButton}
                                disabled={fieldsDisabled}
                                onPress={openZonesMenu}
                            >
                                Edit Zone
                            </Button>
                        ) : (
                            <></>
                        )}
                    </View>
                </View>
                <Text style={styles.errorText}>{props.formikProps?.errors.zone}</Text>

                <TextInput
                    style={styles.clientTextStyle}
                    label={ClientFormFieldLabels[ClientFormFields.phone]}
                    placeholder={ClientFormFieldLabels[ClientFormFields.phone]}
                    onChangeText={props.formikProps?.handleChange(ClientFormFields.phone)}
                    value={props.formikProps?.values.phone}
                    disabled={fieldsDisabled}
                />
                <Text style={styles.errorText}>{props.formikProps?.errors.phone}</Text>

                <View>
                    <Portal>
                        <Modal
                            visible={disabilityPickerVisible}
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
                                        options={disabilityObj}
                                        multiple={true}
                                        placeholder={"Disability"}
                                        placeholderTextColor={themeColors.blueBgLight}
                                        returnValue={"disability_type"}
                                        callback={(values) => {
                                            props.formikProps?.setFieldValue(
                                                "clientDisability",
                                                values.map(Number)
                                            );
                                            updateDisabilityList(values.map(Number));
                                        }}
                                        rowBackgroundColor={themeColors.blueBgLight}
                                        iconSize={30}
                                        selectedIconName={"checkmark-circle"}
                                        unselectedIconName={"radio-button-off"}
                                        selected={props.formikProps?.values.clientDisability?.map(
                                            String
                                        )}
                                    />
                                    {otherDisability ? (
                                        <View>
                                            <TextInput
                                                style={styles.otherDisabilityStyle}
                                                label="Other Disability "
                                                placeholder="Other Disability"
                                                onChangeText={props.formikProps?.handleChange(
                                                    "otherDisability"
                                                )}
                                                value={props.formikProps?.values.otherDisability}
                                            />
                                            <Text style={styles.errorText}>
                                                {props.formikProps?.errors.otherDisability}
                                            </Text>
                                        </View>
                                    ) : (
                                        <></>
                                    )}
                                </ScrollView>
                                <Button
                                    mode="contained"
                                    style={styles.modalSelectorButton}
                                    disabled={fieldsDisabled}
                                    onPress={closeDisabilityMenu}
                                >
                                    Save
                                </Button>
                            </View>
                        </Modal>
                    </Portal>
                    <Text>Disability</Text>
                    {props.formikProps?.values.clientDisability?.map((item) => {
                        return (
                            <Text key={item} style={styles.valueText}>
                                {disabilityMap.get(item)}
                            </Text>
                        );
                    })}
                    {!fieldsDisabled ? (
                        <Button
                            mode="contained"
                            style={styles.disabilityButton}
                            disabled={fieldsDisabled}
                            onPress={openDisabilityMenu}
                        >
                            Edit Disabilities
                        </Button>
                    ) : (
                        <></>
                    )}
                </View>
                <Text style={styles.errorText}>{props.formikProps?.errors.clientDisability}</Text>

                <View style={styles.carePresentView}>
                    <Text style={styles.carePresentCheckBox}>Caregiver Present</Text>
                    <Checkbox
                        status={caregiverPresent ? "checked" : "unchecked"}
                        onPress={() => {
                            setCaregiverPresent(!caregiverPresent);
                            props.formikProps?.setFieldValue("caregiverPresent", caregiverPresent);
                        }}
                        disabled={fieldsDisabled}
                    />
                </View>

                {caregiverPresent ? (
                    <View>
                        <TextInput
                            style={styles.clientTextStyle}
                            label="Caregiver Name "
                            placeholder="Caregiver Name"
                            onChangeText={props.formikProps?.handleChange("caregiverName")}
                            value={props.formikProps?.values.caregiverName}
                            disabled={fieldsDisabled}
                        />
                        <Text style={styles.errorText}>
                            {props.formikProps?.errors.caregiverName}
                        </Text>
                        <TextInput
                            style={styles.clientTextStyle}
                            label="Caregiver Phone"
                            placeholder="Caregiver Phone"
                            onChangeText={props.formikProps?.handleChange("caregiverPhone")}
                            value={props.formikProps?.values.caregiverPhone}
                            disabled={fieldsDisabled}
                        />
                        <Text style={styles.errorText}>
                            {props.formikProps?.errors.caregiverPhone}
                        </Text>
                        <TextInput
                            style={styles.clientTextStyle}
                            label="Caregiver Email "
                            placeholder="Caregiver Email"
                            onChangeText={props.formikProps?.handleChange("caregiverEmail")}
                            value={props.formikProps?.values.caregiverEmail}
                            disabled={fieldsDisabled}
                        />
                        <Text style={styles.errorText}>
                            {props.formikProps?.errors.caregiverEmail}
                        </Text>
                    </View>
                ) : (
                    <></>
                )}
                {props.isNewClient ? (
                    <Button
                        mode="contained"
                        style={styles.clientDetailsFinalButtons}
                        onPress={() => {
                            props.formikProps?.handleSubmit();
                        }}
                    >
                        Save
                    </Button>
                ) : (
                    <View style={styles.clientDetailsFinalView}>
                        <Button
                            mode="contained"
                            style={styles.clientDetailsFinalButtons}
                            onPress={() => {
                                if (fieldsDisabled) toggleButtons(true);
                                else {
                                    props.formikProps?.handleSubmit();
                                }
                            }}
                        >
                            {fieldsDisabled ? "Edit" : "Save"}
                        </Button>
                        {fieldsDisabled ? (
                            <></>
                        ) : (
                            <Button
                                mode={cancelButtonType}
                                style={styles.clientDetailsFinalButtons}
                                disabled={fieldsDisabled}
                                onPress={() => {
                                    const cancelAlert = () =>
                                        Alert.alert(
                                            "Alert",
                                            "You'll lose all your unsaved changes. Cancel anyway?",
                                            [
                                                {
                                                    text: "Don't cancel",
                                                    style: "cancel",
                                                },
                                                {
                                                    text: "Cancel",
                                                    onPress: () => {
                                                        cancelEdit();
                                                        props.formikProps?.resetForm();
                                                        resetFormState();
                                                    },
                                                },
                                            ]
                                        );
                                    cancelAlert();
                                }}
                            >
                                Cancel
                            </Button>
                        )}
                    </View>
                )}
            </View>
        </View>
    );
};
