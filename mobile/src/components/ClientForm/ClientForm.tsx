import { Formik } from "formik";
import * as React from "react";
import { Component, useEffect, useRef, useState } from "react";
import { useZones } from "@cbr/common/src/util/hooks/zones";
import {
    TDisabilityMap,
    getDisabilities,
    useDisabilities,
    getOtherDisabilityId,
} from "@cbr/common/src/util/hooks/disabilities";
import { View, Platform, ScrollView, TextInput as NativeTextInput } from "react-native";
import { Button, Checkbox, Portal, TextInput, Modal, Text } from "react-native-paper";
import clientStyle from "../../screens/ClientDetails/ClientDetails.styles";
import DateTimePicker from "@react-native-community/datetimepicker";
import CustomMultiPicker from "react-native-multiple-select-list";
import {
    FormValues,
    ClientFormProps,
    validationSchema,
    InitialValues as InitialValues,
    ClientFormFieldLabels,
    ClientFormFields,
    setFormInitialValues,
    FormProps,
} from "./ClientFormFields";
import * as Yup from "yup";
import { FormField, IClient } from "@cbr/common";
import { handleSubmit } from "./ClientSubmitHandler";
import { themeColors } from "@cbr/common";
import FormikTextInput from "../FormikTextInput/FormikTextInput";

export const ClientForm = (props: FormProps) => {
    const styles = clientStyle();
    let zoneMap = useZones();
    let disabilityMap = useDisabilities();
    let otherDisabilityId = getOtherDisabilityId(disabilityMap);

    let initialDisabilityArray: string[] = props.clientFormProps.initialDisabilityArray
        ? props.clientFormProps.initialDisabilityArray
        : [];
    let initialZone: number = props.clientFormProps.zone ? props.clientFormProps.zone - 1 : 0;

    //Client Details Usestates
    const [date, setDate] = useState(new Date(props.clientFormProps.date));
    const [caregiverPresent, setCaregiverPresent] = useState(
        props.clientFormProps.caregiverPresent
    );
    const [selectedZone, setSelectedZone] = useState<Number>(initialZone);
    const [otherDisability, showOtherDisability] = useState(false);
    const [fieldsDisabled, setFieldsDisabled] = useState(!props.clientFormProps.isNewClient);
    const [cancelButtonType, setCancelButtonType] = useState("outlined");
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [disabilityVisible, setDisabilityVisible] = useState(false);
    const [zonesVisible, setZonesVisible] = useState(false);
    const [selectedDisabilityList, setSelectedDisabilityList] =
        useState<string[]>(initialDisabilityArray);
    const [presentZone, setPresentZone] = useState<String>(
        Array.from(zoneMap.values())[initialZone]
    );

    const initialFormValues = setFormInitialValues(props.clientFormProps, props.isNewClient);
    const openDisabilityMenu = () => setDisabilityVisible(true);
    const closeDisabilityMenu = () => setDisabilityVisible(false);
    const openZonesMenu = () => setZonesVisible(true);
    const closeZonesMenu = () => setZonesVisible(false);

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
    const disabilityObj = objectFromMap(useDisabilities());

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
    const toggleButtons = () => {
        if (fieldsDisabled == true) {
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

    return (
        <View>
            <Formik
                initialValues={initialFormValues}
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

                        <TextInput
                            style={styles.clientTextStyle}
                            label={ClientFormFieldLabels[ClientFormFields.gender]}
                            placeholder={ClientFormFieldLabels[ClientFormFields.gender]}
                            onChangeText={formikProps.handleChange(ClientFormFields.gender)}
                            value={formikProps.values.gender}
                            disabled={fieldsDisabled}
                        />
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
                                                options={Array.from(zoneMap.values())}
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
                                                        Array.from(zoneMap.values())[
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
                                        disabled={fieldsDisabled}
                                        onPress={closeZonesMenu}
                                    >
                                        Save
                                    </Button>
                                </Modal>
                            </Portal>
                            <Text> Zone</Text>
                            <View style={styles.buttonZoneStyles}>
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

                                <Text style={styles.valueText}>{presentZone}</Text>
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

                            {selectedDisabilityList.map((item) => {
                                return (
                                    <Text key={item} style={styles.valueText}>
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
                                        if (fieldsDisabled) toggleButtons();
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
                                            cancelEdit();
                                            formikProps.resetForm();
                                            resetFormState();
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
