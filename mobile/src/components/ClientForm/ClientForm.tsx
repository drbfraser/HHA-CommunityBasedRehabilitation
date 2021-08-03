import * as React from "react";
import { useState } from "react";
import { useZones } from "@cbr/common/src/util/hooks/zones";
import { useDisabilities, getOtherDisabilityId } from "@cbr/common/src/util/hooks/disabilities";
import { View, Platform, Alert, KeyboardAvoidingView } from "react-native";
import { Button, Checkbox, Portal, TextInput, Modal, Text } from "react-native-paper";
import useStyles from "../../screens/ClientDetails/ClientDetails.styles";
import DateTimePicker from "@react-native-community/datetimepicker";
import CustomMultiPicker from "react-native-multiple-select-list";
import {
    ClientField,
    clientFieldLabels,
    genders,
    TClientValues,
    themeColors,
    timestampFromFormDate,
    timestampToDate,
    timestampToDateObj,
} from "@cbr/common";
import { objectFromMap } from "../../util/ObjectFromMap";
import { FormikProps } from "formik";
import FormikTextInput from "../FormikTextInput/FormikTextInput";
import { FieldError } from "../../util/formikUtil";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import FormikExposedDropdownMenu from "../FormikExposedDropdownMenu/FormikExposedDropdownMenu";
import { useCallback } from "react";

export interface IClientFormProps {
    isNewClient: boolean;
    formikProps: FormikProps<TClientValues>;
}

export const ClientForm = (props: IClientFormProps) => {
    const styles = useStyles();
    const otherDisabilityId = getOtherDisabilityId(useDisabilities());
    const disabilityMap = useDisabilities();
    const disabilityObj = objectFromMap(disabilityMap);
    const zoneObj = objectFromMap(useZones());

    const [otherDisability, showOtherDisability] = useState(false);
    const [fieldsDisabled, setFieldsDisabled] = useState(!props.isNewClient);
    const [cancelButtonType, setCancelButtonType] = useState<"outlined" | "contained">("outlined");
    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const [disabilityPickerVisible, setDisabilityPickerVisible] = useState(false);

    const openDisabilityMenu = () => setDisabilityPickerVisible(true);
    const closeDisabilityMenu = () => setDisabilityPickerVisible(false);

    const updateDisabilityList = (values: number[] | undefined) => {
        let otherDisabilityFound = false;
        let newList: string[] = [];
        if (!values) return newList;
        else {
            for (let index of values) {
                if (index === otherDisabilityId) {
                    otherDisabilityFound = true;
                    newList.push("Other");
                } else {
                    newList.push(disabilityObj[index]);
                }
            }
        }
        showOtherDisability(otherDisabilityFound);
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

    const isFieldDisabled = useCallback(
        () => props.formikProps.isSubmitting || fieldsDisabled,
        [fieldsDisabled]
    );

    return (
        <View>
            <FormikTextInput
                style={styles.field}
                field={ClientField.firstName}
                fieldLabels={clientFieldLabels}
                formikProps={props.formikProps}
                returnKeyType="next"
                mode="outlined"
                disabled={isFieldDisabled()}
            />
            <FormikTextInput
                style={styles.field}
                field={ClientField.lastName}
                fieldLabels={clientFieldLabels}
                formikProps={props.formikProps}
                returnKeyType="next"
                mode="outlined"
                disabled={isFieldDisabled()}
            />
            <Text style={styles.field}>{clientFieldLabels[ClientField.birthDate]}</Text>
            <View style={styles.clientBirthdayView}>
                <Text style={styles.valueText}>
                    {props.formikProps.values.birthDate
                        ? timestampToDate(timestampFromFormDate(props.formikProps.values.birthDate))
                        : "--/--/--"}
                </Text>
                <View style={styles.clientBirthdayButtons}>
                    <View>
                        {!fieldsDisabled ? (
                            <Button
                                disabled={isFieldDisabled()}
                                mode="contained"
                                onPress={showDatepicker}
                            >
                                Edit
                            </Button>
                        ) : (
                            <></>
                        )}
                    </View>
                    {datePickerVisible && (
                        <DateTimePicker
                            value={
                                props.formikProps.values.birthDate
                                    ? timestampToDateObj(
                                          timestampFromFormDate(props.formikProps.values.birthDate)
                                      )
                                    : new Date()
                            }
                            mode="date"
                            display="default"
                            neutralButtonLabel="Today"
                            onChange={(event, date) => {
                                setDatePickerVisible(Platform.OS === "ios");
                                if (event.type === "neutralButtonPressed") {
                                    const todayDate = new Date();
                                    props.formikProps.setFieldValue(
                                        ClientField.birthDate,
                                        todayDate
                                    );
                                } else {
                                    if (date) {
                                        props.formikProps.setFieldValue(
                                            ClientField.birthDate,
                                            date
                                        );
                                    }
                                }
                                setDatePickerVisible(false);
                            }}
                        />
                    )}
                </View>
            </View>
            <FieldError formikProps={props.formikProps} field={ClientField.birthDate} />
            <FormikExposedDropdownMenu
                style={styles.field}
                field={ClientField.gender}
                fieldLabels={clientFieldLabels}
                formikProps={props.formikProps}
                valuesType="record"
                values={genders}
                mode="outlined"
                disabled={isFieldDisabled()}
                numericKey={false}
            />
            <FormikTextInput
                style={styles.field}
                field={ClientField.village}
                fieldLabels={clientFieldLabels}
                formikProps={props.formikProps}
                returnKeyType="next"
                mode="outlined"
                disabled={isFieldDisabled()}
            />
            <FormikExposedDropdownMenu
                style={styles.field}
                field={ClientField.zone}
                fieldLabels={clientFieldLabels}
                formikProps={props.formikProps}
                valuesType="record"
                values={zoneObj}
                mode="outlined"
                disabled={isFieldDisabled()}
                numericKey={false}
            />
            <FormikTextInput
                style={styles.field}
                field={ClientField.phoneNumber}
                fieldLabels={clientFieldLabels}
                formikProps={props.formikProps}
                keyboardType="number-pad"
                returnKeyType="next"
                mode="outlined"
                disabled={isFieldDisabled()}
            />
            <View style={styles.field}>
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
                            <KeyboardAwareScrollView
                                style={styles.nestedScrollStyle}
                                nestedScrollEnabled={true}
                                extraScrollHeight={100}
                            >
                                <CustomMultiPicker
                                    options={disabilityObj}
                                    multiple={true}
                                    placeholder={"Disability"}
                                    placeholderTextColor={themeColors.blueBgLight}
                                    returnValue={"disability_type"}
                                    callback={(values) => {
                                        props.formikProps.setFieldValue(
                                            ClientField.disability,
                                            values.map(Number)
                                        );
                                        updateDisabilityList(values.map(Number));
                                    }}
                                    rowBackgroundColor={themeColors.blueBgLight}
                                    iconSize={30}
                                    selectedIconName={"checkmark-circle"}
                                    unselectedIconName={"radio-button-off"}
                                    selected={props.formikProps.values.disability?.map(String)}
                                />
                                {otherDisability ? (
                                    <View>
                                        <TextInput
                                            style={styles.otherDisabilityStyle}
                                            label="Other Disability "
                                            placeholder="Other Disability"
                                            onChangeText={props.formikProps.handleChange(
                                                ClientField.otherDisability
                                            )}
                                            value={props.formikProps.values.otherDisability}
                                        />
                                        <FieldError
                                            formikProps={props.formikProps}
                                            field={ClientField.otherDisability}
                                        />
                                    </View>
                                ) : (
                                    <></>
                                )}
                            </KeyboardAwareScrollView>
                            <Button
                                mode="contained"
                                style={styles.modalSelectorButton}
                                disabled={isFieldDisabled()}
                                onPress={closeDisabilityMenu}
                            >
                                Save
                            </Button>
                        </View>
                    </Modal>
                </Portal>
                <Text>Disability</Text>
                <View style={styles.disabilityContainer}>
                    <View>
                        {props.formikProps.values.disability?.map((item) => {
                            return (
                                <Text key={item} style={styles.valueText}>
                                    {disabilityMap.get(item)}
                                </Text>
                            );
                        })}
                    </View>
                    <View>
                        {!fieldsDisabled ? (
                            <Button
                                mode="contained"
                                disabled={isFieldDisabled()}
                                onPress={openDisabilityMenu}
                            >
                                Edit
                            </Button>
                        ) : (
                            <></>
                        )}
                    </View>
                </View>
            </View>
            <FieldError formikProps={props.formikProps} field={ClientField.disability} />
            <View style={styles.carePresentView}>
                <Checkbox
                    status={props.formikProps.values.caregiverPresent ? "checked" : "unchecked"}
                    onPress={() => {
                        props.formikProps.setFieldValue(
                            ClientField.caregiverPresent,
                            !props.formikProps.values.caregiverPresent
                        );
                    }}
                    disabled={isFieldDisabled()}
                />
                <Text style={styles.carePresentCheckBox}>Caregiver Present</Text>
            </View>
            {props.formikProps.values.caregiverPresent ? (
                <View>
                    <FormikTextInput
                        style={styles.field}
                        field={ClientField.caregiverName}
                        fieldLabels={clientFieldLabels}
                        formikProps={props.formikProps}
                        returnKeyType="next"
                        mode="outlined"
                        disabled={isFieldDisabled()}
                    />
                    <FormikTextInput
                        style={styles.field}
                        field={ClientField.caregiverPhone}
                        fieldLabels={clientFieldLabels}
                        formikProps={props.formikProps}
                        keyboardType="number-pad"
                        returnKeyType="next"
                        mode="outlined"
                        disabled={isFieldDisabled()}
                    />
                    <FormikTextInput
                        style={styles.field}
                        field={ClientField.caregiverEmail}
                        fieldLabels={clientFieldLabels}
                        formikProps={props.formikProps}
                        keyboardType="email-address"
                        returnKeyType="next"
                        mode="outlined"
                        disabled={isFieldDisabled()}
                    />
                </View>
            ) : (
                <></>
            )}
            {!props.isNewClient ? (
                <View style={styles.clientDetailsFinalView}>
                    <Button
                        mode="contained"
                        style={styles.clientDetailsFinalButtons}
                        disabled={props.formikProps.isSubmitting}
                        onPress={() => {
                            if (fieldsDisabled) toggleButtons(true);
                            else {
                                props.formikProps.handleSubmit();
                                toggleButtons(false);
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
                            disabled={isFieldDisabled()}
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
                                                    props.formikProps.resetForm();
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
            ) : (
                <></>
            )}
        </View>
    );
};
