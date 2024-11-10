import React, { useCallback, useContext, useEffect, useState } from "react";
import { SafeAreaView, View, ViewStyle } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, Card, Divider, TouchableRipple } from "react-native-paper";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { Formik, FormikProps } from "formik";
import { useDatabase } from "@nozbe/watermelondb/hooks";

import {
    ClientField,
    clientFieldLabels,
    clientInitialValues,
    newClientValidationSchema,
    RiskLevel,
    riskLevels,
    RiskType,
    TClientValues,
} from "@cbr/common";
import { ClientForm } from "../../components/ClientForm/ClientForm";
import FormikExposedDropdownMenu from "../../components/ExposedDropdownMenu/FormikExposedDropdownMenu";
import FormikImageModal from "../../components/FormikImageModal/FormikImageModal";
import TextCheckBox from "../../components/TextCheckBox/TextCheckBox";
import ModalForm from "../../components/ModalForm/ModalForm";
import defaultProfilePicture from "../../util/defaultProfilePicture";
import { FieldError } from "../../util/formikUtil";
import { AppStackNavProp } from "../../util/stackScreens";
import { checkUnsyncedChanges } from "../../util/syncHandler";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import { SyncContext } from "../../context/SyncContext/SyncContext";
import { handleSubmit } from "./formHandler";
import useStyles from "./NewClient.styles";

const riskMap: Map<RiskLevel, string> = new Map(
    Object.entries(riskLevels).map(([riskKey, riskLevel]) => [riskKey as RiskLevel, riskLevel.name])
);

const RiskForm = (props: {
    formikProps: FormikProps<TClientValues>;
    riskPrefix: string;
    containerStyle?: ViewStyle | false;
}) => {
    const { t } = useTranslation();
    const styles = useStyles();

    const isFieldDisabled = useCallback(
        () => props.formikProps.isSubmitting || !props.formikProps.values.interviewConsent,
        [props.formikProps.isSubmitting, props.formikProps.values.interviewConsent]
    );

    return (
        <View style={props.containerStyle}>
            <FormikExposedDropdownMenu
                style={styles.field}
                valuesType="map"
                values={riskMap}
                fieldLabels={clientFieldLabels}
                field={`${props.riskPrefix}Risk`}
                formikProps={props.formikProps}
                mode="outlined"
                disabled={isFieldDisabled()}
            />
            <ModalForm
                fieldName={`${props.riskPrefix}Requirements`}
                formikProps={props.formikProps}
                canonicalFields={t("newVisit.socialRequirements", {
                    returnObjects: true,
                    lng: "en",
                })}
                localizedFields={t("newVisit.socialRequirements", { returnObjects: true })}
                disabled={isFieldDisabled()}
                hasFreeformText
            />
            <ModalForm
                fieldName={`${props.riskPrefix}Goals`}
                formikProps={props.formikProps}
                // TODO: replace with real values
                canonicalFields={["Organize Events", "Make Friends", "Volunteer"]}
                localizedFields={["Organize Events", "Make Friends", "Volunteer"]}
                disabled={isFieldDisabled()}
                hasFreeformText
            />
        </View>
    );
};

const NewClient = () => {
    const authContext = useContext(AuthContext);
    const navigation = useNavigation<AppStackNavProp>();
    const { setUnSyncedChanges } = useContext(SyncContext);
    const { autoSync, cellularSync } = useContext(SyncContext);
    const [showImagePickerModal, setShowImagePickerModal] = useState<boolean>(false);
    const { t } = useTranslation();
    const styles = useStyles();
    const database = useDatabase();
    const isFocused = useIsFocused();
    const user =
        authContext.authState.state === "loggedIn" ? authContext.authState.currentUser : null;

    const scrollRef = React.createRef<KeyboardAwareScrollView>();
    const scrollToTop = useCallback(
        () => scrollRef?.current?.scrollToPosition(0, 0, false),
        [scrollRef]
    );

    useEffect(() => {
        authContext.requireLoggedIn(true);
    }, []);
    useEffect(() => {
        if (isFocused) {
            checkUnsyncedChanges().then((res) => {
                setUnSyncedChanges(res);
            });
        }
    }, [isFocused]);

    return (
        <SafeAreaView>
            <KeyboardAwareScrollView keyboardShouldPersistTaps={"always"} ref={scrollRef}>
                <Formik
                    initialValues={clientInitialValues}
                    validationSchema={newClientValidationSchema}
                    onSubmit={(values, helpers) =>
                        handleSubmit(
                            values,
                            helpers,
                            navigation,
                            scrollToTop,
                            database,
                            user!.id,
                            autoSync,
                            cellularSync
                        )
                    }
                    enableReinitialize
                >
                    {(formikProps) => (
                        <View style={styles.container}>
                            <View style={styles.imageContainer}>
                                <TouchableRipple onPress={() => setShowImagePickerModal(true)}>
                                    <Card.Cover
                                        style={styles.image}
                                        source={
                                            formikProps.values.picture
                                                ? {
                                                      uri: formikProps.values.picture,
                                                  }
                                                : defaultProfilePicture
                                        }
                                    />
                                </TouchableRipple>
                            </View>
                            <FormikImageModal
                                field={ClientField.picture}
                                fieldLabels={clientFieldLabels}
                                formikProps={formikProps}
                                visible={showImagePickerModal}
                                onPictureChange={() => {}}
                                onDismiss={() => setShowImagePickerModal(false)}
                            />
                            <TextCheckBox
                                field={ClientField.interviewConsent}
                                label={clientFieldLabels[ClientField.interviewConsent]}
                                setFieldTouched={formikProps.setFieldTouched}
                                setFieldValue={formikProps.setFieldValue}
                                value={formikProps.values.interviewConsent}
                                disabled={formikProps.isSubmitting}
                            />
                            <FieldError
                                formikProps={formikProps}
                                field={ClientField.interviewConsent}
                            />
                            <ClientForm
                                isNewClient={true}
                                formikProps={formikProps}
                                disabled={!formikProps.values.interviewConsent}
                            />
                            <Divider style={styles.divider} />
                            {Object.keys(RiskType).map((riskType, i) => (
                                <RiskForm
                                    key={riskType}
                                    riskPrefix={riskType.toLowerCase()}
                                    formikProps={formikProps}
                                    containerStyle={i !== 0 && styles.section}
                                />
                            ))}
                            <View style={styles.submitButtonContainer}>
                                <View style={styles.submitButtonWrapper}>
                                    <Button
                                        labelStyle={styles.submitButtonLabel}
                                        mode="contained"
                                        disabled={formikProps.isSubmitting}
                                        onPress={() => formikProps.submitForm()}
                                    >
                                        {t("general.create")}
                                    </Button>
                                </View>
                            </View>
                        </View>
                    )}
                </Formik>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
};

export default NewClient;
