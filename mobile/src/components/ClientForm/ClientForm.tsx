import * as React from "react";
import { useEffect, useState } from "react";
import { useZones } from "@cbr/common/src/util/hooks/zones";
import { useDisabilities, getOtherDisabilityId } from "@cbr/common/src/util/hooks/disabilities";
import { View, Platform, Alert } from "react-native";
import { Button, Portal, Modal, Text } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import CustomMultiPicker from "react-native-multiple-select-list";
import {
    ClientField,
    clientFieldLabels,
    genders,
    hcrTypes,
    HCRType,
    TClientValues,
    themeColors,
    timestampFromFormDate,
    timestampToDate,
    timestampToDateObj,
    useCurrentUser,
    UserRole,
} from "@cbr/common";
import { objectFromMap } from "../../util/ObjectFromMap";
import { FormikProps } from "formik";
import FormikTextInput from "../FormikTextInput/FormikTextInput";
import { FieldError } from "../../util/formikUtil";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useCallback } from "react";
import { useNavigation } from "@react-navigation/core";
import ConfirmDialog from "../DiscardDialogs/ConfirmDialog";
import { AppStackNavProp } from "../../util/stackScreens";
import DefaultHeader from "../DefaultHeader/DefaultHeader";
import FormikExposedDropdownMenu from "../ExposedDropdownMenu/FormikExposedDropdownMenu";
import TextCheckBox from "../TextCheckBox/TextCheckBox";
import { showValidationErrorToast } from "../../util/validationToast";
import { useTranslation } from "react-i18next";
import useStyles from "./ClientForm.styles";

export interface IClientFormProps {
    isNewClient: boolean;
    formikProps: FormikProps<TClientValues>;
    clientId?: string;
    disabled?: boolean;
    touchDisable?: (editPressed: boolean) => void;
    resetImage?: () => void;
    imageSave?: () => void;
}

export const ClientForm = (props: IClientFormProps) => {
    const styles = useStyles();
    const { t } = useTranslation();
    const disabilityMap = useDisabilities(t);
    const otherDisabilityId = getOtherDisabilityId(disabilityMap);
    const disabilityObj = objectFromMap(disabilityMap);
    const zoneMap = useZones();
    const currentUser = useCurrentUser();

    const [fieldsDisabled, setFieldsDisabled] = useState(!props.isNewClient);
    const [cancelButtonType, setCancelButtonType] = useState<"outlined" | "contained">("outlined");
    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const [disabilityPickerVisible, setDisabilityPickerVisible] = useState(false);

    const openDisabilityMenu = () => setDisabilityPickerVisible(true);
    const closeDisabilityMenu = () => setDisabilityPickerVisible(false);

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
        setDiscardDialogVisible(false);
    };

    //Date Picker
    const showDatepicker = () => {
        setDatePickerVisible(true);
    };

    //Show current HCRType value if it is 'NA' but don't allow selecting it in the dropdown
    const selectedHcrType = props.formikProps.values[ClientField.hcrType];
    const filteredHcrTypes =
        selectedHcrType === HCRType.NOT_SET
            ? hcrTypes
            : Object.fromEntries(
                  Object.entries(hcrTypes).filter(([key]) => key !== HCRType.NOT_SET)
              );

    const isFieldDisabled = useCallback(
        () => props.formikProps.isSubmitting || fieldsDisabled || props.disabled,
        [fieldsDisabled, props.disabled]
    );

    const navigation = useNavigation<AppStackNavProp>();

    const [discardDialogVisible, setDiscardDialogVisible] = useState(false);
    const [archiveDialogVisibleOk, setArchiveDialogVisibleOk] = useState(false);

    const fetchUserErrorAlert = () =>
        Alert.alert(
            t("general.alert"),
            t("alert.actionFailure", { action: t("general.fetch"), object: t("general.user") }),
            [
                {
                    text: t("general.return"),
                    style: "cancel",
                    onPress: () => {},
                },
            ],
            { cancelable: true }
        );

    const invalidUserAlert = () =>
        Alert.alert(
            t("general.alert"),
            t("alert.unauthorizedArchive"),
            [
                {
                    text: t("general.return"),
                    style: "cancel",
                    onPress: () => {},
                },
            ],
            { cancelable: true }
        );

    useEffect(() => {
        const title = props.isNewClient
            ? t("clientAttr.newClient")
            : fieldsDisabled
            ? t("clientAttr.viewClient")
            : t("clientAttr.editClient");

        const subtitle = props.clientId
            ? `${t("screenNames.clientID")}: ${props.clientId}`
            : undefined;

        navigation.setOptions({ header: DefaultHeader(title, subtitle) });

        if (fieldsDisabled) {
            return;
        }

        return navigation.addListener("beforeRemove", (e) => {
            if (fieldsDisabled) {
                return;
            }
            e.preventDefault();
            setDiscardDialogVisible(true);
        });
    }, [navigation, fieldsDisabled]);

    return (
        <View>
            <ConfirmDialog
                visible={discardDialogVisible}
                onDismiss={() => setDiscardDialogVisible(false)}
                onConfirm={() => {
                    props.touchDisable!(true);
                    cancelEdit();
                    props.formikProps.resetForm();
                    props.resetImage!();
                }}
                confirmButtonText={t("general.discard")}
                dialogContent={
                    props.isNewClient ? t("clientAttr.discardNew") : t("general.discardChanges")
                }
            />
            <ConfirmDialog
                visible={archiveDialogVisibleOk}
                onDismiss={() => setArchiveDialogVisibleOk(false)}
                onConfirm={() => {
                    props.formikProps.setFieldValue(
                        ClientField.is_active,
                        !props.formikProps.values.is_active
                    );
                    props.formikProps.handleSubmit();
                    setArchiveDialogVisibleOk(false);
                }}
                confirmButtonText={
                    props.formikProps.values.is_active
                        ? t("general.archive")
                        : t("general.dearchive")
                }
                // TODOSD: translation
                dialogContent={`Are you sure you want to ${
                    props.formikProps.values.is_active ? "archive" : "dearchive"
                } ${props.formikProps.values.firstName} ${
                    props.formikProps.values.lastName
                }? You cannot edit clients while they are archived`}
            />
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
                        ? timestampToDate(
                              /* If setting birthday for new client, we want to save date in GMT format 
                              If we are displaying the birthday of an existing client, we must do locale/
                              timezone conversion to ensure that the date format does not break. */
                              props.isNewClient
                                  ? timestampFromFormDate(props.formikProps.values.birthDate)
                                  : timestampFromFormDate(props.formikProps.values.birthDate, true)
                          )
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
                                {t("general.select")}
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
                                          props.isNewClient
                                              ? timestampFromFormDate(
                                                    props.formikProps.values.birthDate
                                                )
                                              : timestampFromFormDate(
                                                    props.formikProps.values.birthDate,
                                                    true
                                                )
                                      )
                                    : new Date()
                            }
                            mode="date"
                            display="default"
                            neutralButton={{ label: t("general.today") }}
                            negativeButton={{ label: t("general.cancel") }}
                            positiveButton={{ label: t("general.ok") }}
                            onChange={(event, date) => {
                                setDatePickerVisible(Platform.OS === "ios");
                                if (event.type === "neutralButtonPressed") {
                                    const todayDate = new Date();
                                    todayDate.setHours(0, 0, 0, 0);
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
                valuesType="record-string"
                values={genders}
                mode="outlined"
                disabled={isFieldDisabled()}
            />
            <FormikExposedDropdownMenu
                style={styles.field}
                field={ClientField.hcrType}
                fieldLabels={clientFieldLabels}
                formikProps={props.formikProps}
                valuesType="record-string"
                values={filteredHcrTypes}
                mode="outlined"
                disabled={isFieldDisabled()}
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
                valuesType="map"
                values={zoneMap}
                mode="outlined"
                disabled={isFieldDisabled()}
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
                                    {t("general.objectList")}
                                </Text>
                            </View>
                            <KeyboardAwareScrollView
                                style={styles.nestedScrollStyle}
                                nestedScrollEnabled={true}
                            >
                                <CustomMultiPicker
                                    options={disabilityObj}
                                    multiple={true}
                                    placeholder={t("general.disability")}
                                    placeholderTextColor={themeColors.blueBgLight}
                                    returnValue={"disability_type"}
                                    callback={(values) => {
                                        props.formikProps.setFieldTouched(
                                            ClientField.disability,
                                            true
                                        );
                                        props.formikProps.setFieldValue(
                                            ClientField.disability,
                                            values.map(Number)
                                        );
                                    }}
                                    rowBackgroundColor={themeColors.blueBgLight}
                                    iconSize={30}
                                    selectedIconName={"checkmark-circle"}
                                    unselectedIconName={"radio-button-off"}
                                    selected={props.formikProps.values.disability?.map(String)}
                                    labelStyle={styles.textGray} // todosd: text not correctly rendering as gray
                                    iconColor={themeColors.textGray}
                                />
                            </KeyboardAwareScrollView>
                            <Button
                                mode="contained"
                                style={styles.modalSelectorButton}
                                disabled={isFieldDisabled()}
                                onPress={closeDisabilityMenu}
                            >
                                {t("general.save")}
                            </Button>
                        </View>
                    </Modal>
                </Portal>
                <Text style={styles.field}>{clientFieldLabels[ClientField.disability]}</Text>
                <View style={styles.disabilityContainer}>
                    <View style={styles.disabilityList}>
                        {props.formikProps.values.disability.length > 0 ? (
                            <>
                                {props.formikProps.values.disability.map((item) =>
                                    item !== otherDisabilityId ? (
                                        <Text key={item} style={styles.valueText}>
                                            {disabilityMap.get(item)}
                                        </Text>
                                    ) : null
                                )}
                                {props.formikProps.values.disability.includes(otherDisabilityId) ? (
                                    <FormikTextInput
                                        field={ClientField.otherDisability}
                                        fieldLabels={clientFieldLabels}
                                        formikProps={props.formikProps}
                                        returnKeyType="next"
                                        mode="outlined"
                                        disabled={isFieldDisabled()}
                                    />
                                ) : (
                                    <></>
                                )}
                            </>
                        ) : (
                            <Text style={styles.valueText}>{t("general.noObjectSelected")}</Text>
                        )}
                    </View>
                    <View>
                        {!fieldsDisabled ? (
                            <Button
                                mode="contained"
                                disabled={isFieldDisabled()}
                                onPress={openDisabilityMenu}
                            >
                                {t("general.select")}
                            </Button>
                        ) : (
                            <></>
                        )}
                    </View>
                </View>
            </View>
            <FieldError formikProps={props.formikProps} field={ClientField.disability} />
            <TextCheckBox
                field={ClientField.caregiverPresent}
                label={clientFieldLabels[ClientField.caregiverPresent]}
                setFieldTouched={props.formikProps.setFieldTouched}
                setFieldValue={props.formikProps.setFieldValue}
                value={props.formikProps.values.caregiverPresent}
                disabled={isFieldDisabled()}
            />
            <FieldError formikProps={props.formikProps} field={ClientField.caregiverPresent} />
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
                        disabled={
                            props.formikProps.isSubmitting || !props.formikProps.values.is_active
                        }
                        onPress={() => {
                            if (fieldsDisabled) {
                                props.touchDisable!(false);
                                toggleButtons(true);
                            } else {
                                if (props.formikProps.isValid) {
                                    props.touchDisable!(true);
                                    toggleButtons(false);
                                    props.imageSave!();
                                    props.formikProps.handleSubmit();
                                } else {
                                    showValidationErrorToast();
                                }
                            }
                        }}
                    >
                        {fieldsDisabled ? t("general.edit") : t("general.save")}
                    </Button>
                    {fieldsDisabled ? (
                        <Button
                            style={styles.clientDetailsFinalButtons}
                            mode="contained"
                            onPress={() => {
                                if (currentUser === "APILoadError" || currentUser === undefined) {
                                    fetchUserErrorAlert();
                                } else if (currentUser.role === UserRole.ADMIN) {
                                    setArchiveDialogVisibleOk(true);
                                } else {
                                    invalidUserAlert();
                                }
                            }}
                        >
                            {props.formikProps.values.is_active
                                ? t("general.archive")
                                : t("general.dearchive")}
                        </Button>
                    ) : (
                        <Button
                            mode={cancelButtonType}
                            style={styles.clientDetailsFinalButtons}
                            disabled={fieldsDisabled}
                            onPress={() => setDiscardDialogVisible(true)}
                        >
                            {t("general.cancel")}
                        </Button>
                    )}
                </View>
            ) : (
                <></>
            )}
        </View>
    );
};
