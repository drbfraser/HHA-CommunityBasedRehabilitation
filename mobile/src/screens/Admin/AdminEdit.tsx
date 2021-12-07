import { StackScreenProps } from "@react-navigation/stack";
import { Formik, FormikProps } from "formik";
import { StackParamList } from "../../util/stackScreens";
import { StackScreenName } from "../../util/StackScreenName";
import React, { useContext, useRef, useState } from "react";
import { Button, Subheading, Text } from "react-native-paper";
import { Keyboard, StyleSheet, TextInput as NativeTextInput, View } from "react-native";
import {
    AdminField,
    adminUserFieldLabels,
    APIFetchFailError,
    countObjectKeys,
    editUserValidationSchema,
    IUser,
    themeColors,
    userRolesToLabelMap,
    useZones,
} from "@cbr/common";
import FormikTextInput from "../../components/FormikTextInput/FormikTextInput";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Alert from "../../components/Alert/Alert";
import FormikExposedDropdownMenu from "../../components/ExposedDropdownMenu/FormikExposedDropdownMenu";
import ConfirmDialogWithNavListener from "../../components/DiscardDialogs/ConfirmDialogWithNavListener";
import { useDatabase } from "@nozbe/watermelondb/hooks";
import { handleUserEditSubmit } from "./AdminFormHandler";
import { SyncContext } from "../../context/SyncContext/SyncContext";

const AdminEdit = ({
    navigation,
    route,
}: StackScreenProps<StackParamList, StackScreenName.ADMIN_EDIT>) => {
    const user = route.params.user;

    const zones = useZones();
    const database = useDatabase();
    const [saveError, setSaveError] = useState<string>();

    const lastNameRef = useRef<NativeTextInput>(null);
    const phoneNumberRef = useRef<NativeTextInput>(null);

    const [hasSubmitted, setHasSubmitted] = useState(false);

    const { autoSync, cellularSync } = useContext(SyncContext);

    return (
        <>
            <ConfirmDialogWithNavListener
                confirmButtonText="Discard"
                dialogContent="Discard your changes?"
                bypassDialog={hasSubmitted}
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

                    <Subheading style={styles.profileInfoHeader}>Username</Subheading>
                    <Text style={styles.profileInfoText}>{user.username}</Text>

                    <Subheading style={styles.profileInfoHeader}>ID</Subheading>
                    <Text style={styles.profileInfoText}>{user.id}</Text>

                    <Formik
                        initialValues={user}
                        validationSchema={editUserValidationSchema}
                        onSubmit={(values, formikHelpers) => {
                            setSaveError(undefined);
                            handleUserEditSubmit(
                                values,
                                database,
                                formikHelpers,
                                autoSync,
                                cellularSync
                            )
                                .then((id) => {
                                    setHasSubmitted(true);
                                    navigation.navigate(StackScreenName.ADMIN_VIEW, {
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
                        {(formikProps: FormikProps<IUser>) => (
                            <>
                                <FormikTextInput
                                    style={styles.textInput}
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
                                    disabled={formikProps.isSubmitting}
                                    fieldLabels={adminUserFieldLabels}
                                    field={AdminField.last_name}
                                    ref={lastNameRef}
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
                                    onSubmitEditing={Keyboard.dismiss}
                                    formikProps={formikProps}
                                    keyboardType="phone-pad"
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

                                <Subheading style={styles.profileInfoHeader}>Status</Subheading>
                                <Text style={styles.profileInfoText}>
                                    {formikProps.values.is_active ? "Active" : "Disabled"}
                                </Text>

                                <View style={styles.bottomButtonContainer}>
                                    <Button
                                        style={
                                            formikProps.values.is_active
                                                ? styles.disableBtn
                                                : styles.activeBtn
                                        }
                                        disabled={formikProps.isSubmitting}
                                        onPress={() => {
                                            formikProps.setFieldValue(
                                                AdminField.is_active,
                                                !formikProps.values.is_active
                                            );
                                            formikProps.setFieldTouched(AdminField.is_active, true);
                                        }}
                                        mode="contained"
                                    >
                                        {formikProps.values.is_active ? "Disable" : "Activate"}
                                    </Button>

                                    <Button
                                        disabled={
                                            formikProps.isSubmitting ||
                                            countObjectKeys(formikProps.errors) !== 0
                                        }
                                        loading={formikProps.isSubmitting}
                                        onPress={formikProps.handleSubmit}
                                        mode="contained"
                                    >
                                        Save
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
        justifyContent: "space-between",
        alignContent: "space-between",
    },
});

export default AdminEdit;
