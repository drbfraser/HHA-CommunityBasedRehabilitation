import { StackScreenProps } from "@react-navigation/stack";
import { Formik, FormikProps } from "formik";
import { StackParamList } from "../../util/stackScreens";
import { StackScreenName } from "../../util/StackScreenName";
import React, { useEffect, useRef, useState } from "react";
import { Appbar, Button, Subheading, Text } from "react-native-paper";
import { Keyboard, StyleSheet, TextInput as NativeTextInput, View } from "react-native";
import {
    AdminField,
    adminUserFieldLabels,
    APIFetchFailError,
    editUserValidationSchema,
    handleUserEditSubmit,
    IUser,
    themeColors,
    userRolesToLabelMap,
    useZones,
} from "@cbr/common";
import FormikTextInput from "../../components/FormikTextInput/FormikTextInput";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Alert from "../../components/Alert/Alert";
import FormikExposedDropdownMenu from "../../components/FormikExposedDropdownMenu/FormikExposedDropdownMenu";

const AdminEdit = ({
    navigation,
    route,
}: StackScreenProps<StackParamList, StackScreenName.ADMIN_EDIT>) => {
    const user = route.params.user;

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            header: (stackHeaderProps) => (
                <Appbar.Header statusBarHeight={0}>
                    <Appbar.BackAction onPress={() => stackHeaderProps.navigation.goBack()} />
                    <Appbar.Content title="Edit user" />
                </Appbar.Header>
            ),
        });
    }, []);

    const zones = useZones();

    const [saveError, setSaveError] = useState<string>();

    const lastNameRef = useRef<NativeTextInput>(null);
    const phoneNumberRef = useRef<NativeTextInput>(null);

    return (
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
                        handleUserEditSubmit(values, formikHelpers)
                            .then((user) => {
                                navigation.navigate(StackScreenName.ADMIN_VIEW, {
                                    userID: user.id,
                                    userInfo: { isNewUser: false, user: user },
                                });
                            })
                            .catch((e) => {
                                if (!(e instanceof APIFetchFailError)) {
                                    setSaveError(`${e}`);
                                    return;
                                }
                                setSaveError(e.buildFormError(adminUserFieldLabels));
                            });
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
                                numericKey
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
                                numericKey={false}
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
                                        Object.keys(formikProps.errors).length !== 0
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
