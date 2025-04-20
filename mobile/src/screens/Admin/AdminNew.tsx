import { StackScreenProps } from "@react-navigation/stack";
import { Formik, FormikProps } from "formik";
import { StackParamList } from "../../util/stackScreens";
import { StackScreenName } from "../../util/StackScreenName";
import React, { useContext, useRef, useState } from "react";
import { Button } from "react-native-paper";
import {
    StyleSheet,
    TextInput as NativeTextInput,
    View,
    GestureResponderEvent,
} from "react-native";
import {
    AdminField,
    adminUserFieldLabels,
    adminUserInitialValues,
    APIFetchFailError,
    countObjectKeys,
    newUserValidationSchema,
    themeColors,
    TNewUserValues,
    userRolesToLabelMap,
    useZones,
} from "@cbr/common";
import FormikTextInput from "../../components/FormikTextInput/FormikTextInput";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Alert from "../../components/Alert/Alert";
import FormikExposedDropdownMenu from "../../components/ExposedDropdownMenu/FormikExposedDropdownMenu";
import ConfirmDialogWithNavListener from "../../components/DiscardDialogs/ConfirmDialogWithNavListener";
import passwordTextInputProps from "../../components/PasswordTextInput/passwordTextInputProps";
import { useDatabase } from "@nozbe/watermelondb/hooks";
import { handleNewUserSubmit } from "./AdminFormHandler";
import { SyncContext } from "../../context/SyncContext/SyncContext";
import { useTranslation } from "react-i18next";

const AdminNew = ({ navigation }: StackScreenProps<StackParamList, StackScreenName.ADMIN_NEW>) => {
    const database = useDatabase();
    const zones = useZones();
    const [saveError, setSaveError] = useState<string>();
    const passwordRef = useRef<NativeTextInput>(null);
    const confirmPasswordRef = useRef<NativeTextInput>(null);
    const firstNameRef = useRef<NativeTextInput>(null);
    const lastNameRef = useRef<NativeTextInput>(null);
    const phoneNumberRef = useRef<NativeTextInput>(null);
    const { autoSync, cellularSync } = useContext(SyncContext);

    const [hasSubmitted, setHasSubmitted] = useState(false);
    const { t } = useTranslation();

    return (
        <>
            <ConfirmDialogWithNavListener
                bypassDialog={hasSubmitted}
                confirmButtonText={t("general.discard")}
                dialogContent={t("general.discardChanges")}
            />
            <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
                <View style={styles.container}>
                    {saveError ? (
                        <Alert
                            style={styles.errorAlert}
                            severity={"error"}
                            text={saveError}
                            onClose={() => setSaveError(undefined)}
                        />
                    ) : null}

                    <Formik
                        initialValues={adminUserInitialValues}
                        validationSchema={newUserValidationSchema}
                        onSubmit={(values, formikHelpers) => {
                            setSaveError(undefined);
                            handleNewUserSubmit(
                                values,
                                database,
                                formikHelpers,
                                autoSync,
                                cellularSync
                            )
                                .then((id) => {
                                    setHasSubmitted(true);
                                    navigation.replace(StackScreenName.ADMIN_VIEW, {
                                        userID: id,
                                    });
                                })
                                .catch((e) =>
                                    setSaveError(
                                        e instanceof APIFetchFailError
                                            ? e.buildFormError(adminUserFieldLabels)
                                            : `${e}`
                                    )
                                );
                        }}
                    >
                        {(formikProps: FormikProps<TNewUserValues>) => (
                            <>
                                <FormikTextInput
                                    style={styles.textInput}
                                    disabled={formikProps.isSubmitting}
                                    fieldLabels={adminUserFieldLabels}
                                    field={AdminField.username}
                                    onSubmitEditing={() => passwordRef.current?.focus()}
                                    formikProps={formikProps}
                                    returnKeyType="next"
                                    mode="outlined"
                                />

                                <FormikExposedDropdownMenu
                                    style={styles.textInput}
                                    valuesType="map"
                                    values={userRolesToLabelMap}
                                    fieldLabels={adminUserFieldLabels}
                                    field={AdminField.role}
                                    formikProps={formikProps}
                                    mode="outlined"
                                />

                                <FormikTextInput
                                    {...passwordTextInputProps}
                                    style={styles.textInput}
                                    ref={passwordRef}
                                    fieldLabels={adminUserFieldLabels}
                                    field={AdminField.password}
                                    onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                                    formikProps={formikProps}
                                    returnKeyType="next"
                                />

                                <FormikTextInput
                                    {...passwordTextInputProps}
                                    style={styles.textInput}
                                    ref={confirmPasswordRef}
                                    fieldLabels={adminUserFieldLabels}
                                    field={AdminField.confirmPassword}
                                    onSubmitEditing={() => firstNameRef.current?.focus()}
                                    formikProps={formikProps}
                                    returnKeyType="next"
                                />

                                <FormikTextInput
                                    style={styles.textInput}
                                    ref={firstNameRef}
                                    disabled={formikProps.isSubmitting}
                                    fieldLabels={adminUserFieldLabels}
                                    field={AdminField.first_name}
                                    onSubmitEditing={() => lastNameRef.current?.focus()}
                                    formikProps={formikProps}
                                    returnKeyType="next"
                                    mode="outlined"
                                />

                                <FormikTextInput
                                    style={styles.textInput}
                                    ref={lastNameRef}
                                    disabled={formikProps.isSubmitting}
                                    fieldLabels={adminUserFieldLabels}
                                    field={AdminField.last_name}
                                    onSubmitEditing={() => phoneNumberRef.current?.focus()}
                                    formikProps={formikProps}
                                    returnKeyType="next"
                                    mode="outlined"
                                />

                                <FormikExposedDropdownMenu
                                    style={styles.textInput}
                                    valuesType="map"
                                    values={zones}
                                    fieldLabels={adminUserFieldLabels}
                                    field={AdminField.zone}
                                    formikProps={formikProps}
                                    mode="outlined"
                                />

                                <FormikTextInput
                                    style={styles.textInput}
                                    ref={phoneNumberRef}
                                    disabled={formikProps.isSubmitting}
                                    fieldLabels={adminUserFieldLabels}
                                    field={AdminField.phone_number}
                                    formikProps={formikProps}
                                    onSubmitEditing={() => formikProps.handleSubmit()}
                                    keyboardType="phone-pad"
                                    returnKeyType="done"
                                    mode="outlined"
                                />

                                <View style={styles.bottomButtonContainer}>
                                    <Button
                                        disabled={
                                            formikProps.isSubmitting ||
                                            countObjectKeys(formikProps.errors) !== 0 ||
                                            countObjectKeys(formikProps.touched) === 0
                                        }
                                        loading={formikProps.isSubmitting}
                                        onPress={
                                            formikProps.handleSubmit as (
                                                e?: GestureResponderEvent
                                            ) => void
                                        }
                                        mode="contained"
                                    >
                                        {t("general.save")}
                                    </Button>
                                </View>
                            </>
                        )}
                    </Formik>
                </View>
            </KeyboardAwareScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 30,
        marginHorizontal: 30,
        flex: 1,
    },
    errorAlert: {
        marginBottom: 10,
    },
    profileInfoHeader: { fontWeight: "bold", fontSize: 18, marginBottom: 5 },
    profileInfoText: { fontSize: 18, marginBottom: 5 },
    textInput: { marginVertical: 5 },
    disableBtn: {
        backgroundColor: themeColors.riskRed,
        color: "white",
    },
    activeBtn: {
        backgroundColor: themeColors.riskGreen,
        color: "white",
    },
    bottomButtonContainer: {
        marginVertical: 10,
        flexDirection: "row",
        justifyContent: "flex-end",
        alignContent: "flex-end",
    },
});

export default AdminNew;
