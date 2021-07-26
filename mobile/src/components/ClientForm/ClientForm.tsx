import { Formik } from "formik";
import * as React from "react";
import { useState } from "react";
import { useZones } from "@cbr/common/src/util/hooks/zones";
import { useDisabilities, getOtherDisabilityId } from "@cbr/common/src/util/hooks/disabilities";
import { View, Platform, ScrollView, Alert } from "react-native";
import { Button, Checkbox, Portal, TextInput, Modal, Text } from "react-native-paper";
import clientStyle from "../../screens/ClientDetails/ClientDetails.styles";
import DateTimePicker from "@react-native-community/datetimepicker";
import CustomMultiPicker from "react-native-multiple-select-list";
import {
    validationSchema,
    ClientFormFieldLabels,
    ClientFormFields,
    setFormInitialValues,
    FormProps,
} from "./ClientFormFields";
import { Gender, genders, IClient, themeColors } from "@cbr/common";
import { handleSubmit } from "./ClientSubmitHandler";

const objectFromMap = <K extends string | number | symbol, V>(
    map: Map<K, V> | ReadonlyMap<K, V>
): Record<K, V> => {
    const obj: Partial<Record<K, V>> = {};
    for (const entry of map) {
        const [key, value] = entry;
        obj[key] = value;
    }
    return obj as Record<K, V>;
};

export const ClientForm = (props: FormProps) => {
    const styles = clientStyle();
    let zoneMap = useZones();
    let disabilityMap = useDisabilities();
    let otherDisabilityId = getOtherDisabilityId(disabilityMap);
    const disabilityObj = objectFromMap(useDisabilities());
    const zoneObj = objectFromMap(useZones());

    let initialDisabilityArray: string[] = props.clientFormProps?.initialDisabilityArray
        ? props.clientFormProps?.initialDisabilityArray
        : [];
    let initialZone: number = props.clientFormProps?.zone ? props.clientFormProps.zone : 0;

    //Client Details Usestates
    const [date, setDate] = useState(props.clientFormProps?.date);
    const [caregiverPresent, setCaregiverPresent] = useState(
        props.clientFormProps?.caregiverPresent
    );
    const [clientGender, setClientGender] = useState(props.clientFormProps?.gender);
    const [selectedZone, setSelectedZone] = useState<Number>(initialZone);
    const [otherDisability, showOtherDisability] = useState(false);
    const [fieldsDisabled, setFieldsDisabled] = useState(!props.isNewClient);
    const [cancelButtonType, setCancelButtonType] = useState("outlined");
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [disabilityVisible, setDisabilityVisible] = useState(false);
    const [zonesVisible, setZonesVisible] = useState(false);
    const [genderVisible, setGenderVisible] = useState(false);
    const [selectedDisabilityList, setSelectedDisabilityList] =
        useState<string[]>(initialDisabilityArray);
    const [presentZone, setPresentZone] = useState<String>(zoneObj[initialZone]);
    const initialFormValues = setFormInitialValues(props.clientFormProps, props.isNewClient);
    const openDisabilityMenu = () => setDisabilityVisible(true);
    const closeDisabilityMenu = () => setDisabilityVisible(false);
    const openZonesMenu = () => setZonesVisible(true);
    const closeZonesMenu = () => setZonesVisible(false);
    const openGenderMenu = () => setGenderVisible(true);
    const closeGenderMenu = () => setGenderVisible(false);

    const updateDisabilityList = (values: number[] | undefined, otherDisability?: string) => {
        let newList: string[] = [];
        if (!values) return newList;
        else {
            for (let index of values) {
                if (index == otherDisabilityId) {
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
        if (toggleTo == true) {
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
        setShowDatePicker(true);
    };

    const resetFormState = () => {
        setDate(props.clientFormProps.date);
        setPresentZone(Array.from(zoneMap.values())[props.clientFormProps.zone - 1]);
        setSelectedZone(props.clientFormProps.zone - 1);
        if (props.clientFormProps.caregiverPresent)
            setCaregiverPresent(props.clientFormProps.caregiverPresent);
        else setCaregiverPresent(false);
    };

    const getGender = (gender: string) => {
        if (gender == "M") {
            return Gender.MALE;
        }
        return Gender.FEMALE;
    };

    const submitForm = async (updatedIClient: IClient) => {
        const isSuccess = await handleSubmit(updatedIClient, props.isNewClient);
        console.log(isSuccess);
        toggleButtons(!isSuccess);
    };

    return (
        <View>
            <Formik
                initialValues={initialFormValues}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    const updatedIClient: IClient = {
                        id: props.clientFormProps?.id!,
                        first_name: values.firstName!,
                        last_name: values.lastName!,
                        birth_date: values.date!.getTime(),
                        gender: getGender(values.gender!),
                        village: values.village!,
                        zone: values.zone!,
                        phone_number: values.phone || "",
                        caregiver_present: caregiverPresent || false,
                        caregiver_name: values.caregiverName || "",
                        caregiver_email: values.caregiverEmail || "",
                        caregiver_phone: values.caregiverPhone || "",
                        disability: values.clientDisability!,
                        other_disability: values.otherDisability || "",
                        picture:
                            "https://cbrs.cradleplatform.com/api/uploads/images/7cm5m2urohgbet8ew1kjggdw2fd9ts.png", //TODO: Don't use this picture
                        created_by_user: props.clientFormProps?.createdByUser!,
                        created_date: props.clientFormProps?.createdDate!,
                        longitude: props.clientFormProps?.longitude || "",
                        latitude: props.clientFormProps?.latitude || "",
                        caregiver_picture: props.clientFormProps?.caregiverPicture,
                        risks: props.clientFormProps?.risks!,
                        visits: props.clientFormProps?.visits!,
                        referrals: props.clientFormProps?.referrals!,
                        baseline_surveys: props.clientFormProps?.surveys!,
                    };
                    submitForm(updatedIClient);
                }}
            >
                {(formikProps) => (
                    <View>
                        <TextInput
                            style={styles.clientTextStyle}
                            label={ClientFormFieldLabels[ClientFormFields.first_name]}
                            placeholder={ClientFormFieldLabels[ClientFormFields.first_name]}
                            onChangeText={formikProps.handleChange(ClientFormFields.first_name)}
                            value={formikProps.values.firstName}
                            disabled={fieldsDisabled}
                        />
                        <Text style={styles.errorText}>{formikProps.errors.firstName}</Text>

                        <TextInput
                            style={styles.clientTextStyle}
                            label={ClientFormFieldLabels[ClientFormFields.last_name]}
                            placeholder={ClientFormFieldLabels[ClientFormFields.last_name]}
                            onChangeText={formikProps.handleChange(ClientFormFields.last_name)}
                            value={formikProps.values.lastName}
                            disabled={fieldsDisabled}
                        />
                        <Text style={styles.errorText}>{formikProps.errors.lastName}</Text>

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
                                {showDatePicker && (
                                    <DateTimePicker
                                        testID="dateTimePicker"
                                        value={formikProps.values.date!}
                                        mode="date"
                                        display="default"
                                        onChange={(event, date) => {
                                            setShowDatePicker(Platform.OS === "ios");
                                            if (date) {
                                                formikProps.setFieldValue(
                                                    ClientFormFields.date,
                                                    date
                                                );
                                                setDate(date);
                                            }
                                            setShowDatePicker(false);
                                        }}
                                    />
                                )}
                            </View>
                        </View>
                        <Text style={styles.errorText}>{formikProps.errors.date}</Text>

                        <View>
                            <Portal>
                                <Modal
                                    visible={genderVisible}
                                    onDismiss={closeGenderMenu}
                                    style={styles.genderChecklist}
                                >
                                    <View style={styles.nestedGenderScrollView}>
                                        <View style={styles.disabilityListHeaderContainerStyle}>
                                            <Text style={styles.disabilityListHeaderStyle}>
                                                Gender
                                            </Text>
                                        </View>
                                        <ScrollView
                                            style={styles.nestedScrollStyle}
                                            nestedScrollEnabled={true}
                                        >
                                            <CustomMultiPicker
                                                options={genders}
                                                placeholder={
                                                    ClientFormFieldLabels[ClientFormFields.gender]
                                                }
                                                placeholderTextColor={themeColors.blueBgLight}
                                                returnValue={"Gender"}
                                                callback={(values) => {
                                                    formikProps.setFieldValue(
                                                        ClientFormFields.gender,
                                                        values[0]
                                                    );
                                                    setClientGender(values[0]);
                                                }}
                                                rowBackgroundColor={"#eee"}
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
                            <Text> Gender</Text>
                            <View style={styles.buttonZoneStyles}>
                                {clientGender == Gender.MALE ? (
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
                        <Text style={styles.errorText}>{formikProps.errors.gender}</Text>

                        <TextInput
                            style={styles.clientTextStyle}
                            label={ClientFormFieldLabels[ClientFormFields.village]}
                            placeholder={ClientFormFieldLabels[ClientFormFields.village]}
                            onChangeText={formikProps.handleChange(ClientFormFields.village)}
                            value={formikProps.values.village}
                            disabled={fieldsDisabled}
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
                                                options={zoneObj}
                                                placeholder={"Zones"}
                                                placeholderTextColor={themeColors.blueBgLight}
                                                returnValue={"zone_name"}
                                                callback={(values) => {
                                                    console.log(values);
                                                    formikProps.setFieldValue(
                                                        "zone",
                                                        values.map(Number)
                                                    );
                                                    setPresentZone(zoneObj[values.map(Number)]);
                                                    setSelectedZone(values);
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
                                        disabled={fieldsDisabled}
                                        onPress={closeZonesMenu}
                                    >
                                        Save
                                    </Button>
                                </Modal>
                            </Portal>
                            <Text> Zone</Text>
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
                        <Text style={styles.errorText}>{formikProps.errors.zone}</Text>

                        <TextInput
                            style={styles.clientTextStyle}
                            label={ClientFormFieldLabels[ClientFormFields.phone]}
                            placeholder={ClientFormFieldLabels[ClientFormFields.phone]}
                            onChangeText={formikProps.handleChange(ClientFormFields.phone)}
                            value={formikProps.values.phone}
                            disabled={fieldsDisabled}
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
                                                options={disabilityObj}
                                                multiple={true}
                                                placeholder={"Disability"}
                                                placeholderTextColor={themeColors.blueBgLight}
                                                returnValue={"disability_type"}
                                                callback={(values) => {
                                                    formikProps.setFieldValue(
                                                        "clientDisability",
                                                        values.map(Number)
                                                    );
                                                    updateDisabilityList(
                                                        values.map(Number),
                                                        formikProps.values.otherDisability
                                                    );
                                                }}
                                                rowBackgroundColor={"#eee"}
                                                iconSize={30}
                                                selectedIconName={"checkmark-circle"}
                                                unselectedIconName={"radio-button-off"}
                                                selected={formikProps.values.clientDisability?.map(
                                                    String
                                                )}
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
                                            disabled={fieldsDisabled}
                                            onPress={closeDisabilityMenu}
                                        >
                                            Save
                                        </Button>
                                    </View>
                                </Modal>
                            </Portal>
                            <Text> Disability</Text>
                            {selectedDisabilityList.map((item) => {
                                return (
                                    <Text key={item} style={styles.valueText}>
                                        {item}
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
                        <Text style={styles.errorText}>{formikProps.errors.clientDisability}</Text>

                        <View style={styles.carePresentView}>
                            <Text style={styles.carePresentCheckBox}>Caregiver Present</Text>
                            <Checkbox
                                status={caregiverPresent ? "checked" : "unchecked"}
                                onPress={() => {
                                    setCaregiverPresent(!caregiverPresent);
                                    formikProps.setFieldValue("caregiverPresent", caregiverPresent);
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
                                    onChangeText={formikProps.handleChange("caregiverName")}
                                    value={formikProps.values.caregiverName}
                                    disabled={fieldsDisabled}
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
                                    disabled={fieldsDisabled}
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
                                    disabled={fieldsDisabled}
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
                                    onPress={() => {
                                        if (fieldsDisabled) toggleButtons(true);
                                        else {
                                            formikProps.handleSubmit();
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
                                                                formikProps.resetForm();
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
                )}
            </Formik>
        </View>
    );
};
