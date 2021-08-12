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
import { useNavigation } from "@react-navigation/native";
import { Formik, FormikProps } from "formik";
import React, { useCallback, useState } from "react";
import { SafeAreaView, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, Card, Divider, TouchableRipple } from "react-native-paper";
import { ClientForm } from "../../components/ClientForm/ClientForm";
import FormikExposedDropdownMenu from "../../components/ExposedDropdownMenu/FormikExposedDropdownMenu";
import FormikImageModal from "../../components/FormikImageModal/FormikImageModal";
import FormikTextInput from "../../components/FormikTextInput/FormikTextInput";
import TextCheckBox from "../../components/TextCheckBox/TextCheckBox";
import { FieldError } from "../../util/formikUtil";
import { AppStackNavProp } from "../../util/stackScreens";
import { handleSubmit } from "./formHandler";
import useStyles from "./NewClient.styles";

const riskMap: Map<RiskLevel, string> = new Map(
    Object.entries(riskLevels).map(([riskKey, riskLevel]) => [riskKey as RiskLevel, riskLevel.name])
);

const RiskForm = (props: { formikProps: FormikProps<TClientValues>; riskPrefix: string }) => {
    const styles = useStyles();
    const NUMBER_OF_LINES = 4;

    const isFieldDisabled = useCallback(
        () => props.formikProps.isSubmitting || !props.formikProps.values.interviewConsent,
        [props.formikProps.isSubmitting, props.formikProps.values.interviewConsent]
    );

    return (
        <View>
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
            <FormikTextInput
                style={styles.field}
                multiline
                numberOfLines={NUMBER_OF_LINES}
                fieldLabels={clientFieldLabels}
                field={`${props.riskPrefix}Requirements`}
                formikProps={props.formikProps}
                returnKeyType="next"
                mode="outlined"
                disabled={isFieldDisabled()}
            />
            <FormikTextInput
                style={styles.field}
                multiline
                numberOfLines={NUMBER_OF_LINES}
                fieldLabels={clientFieldLabels}
                field={`${props.riskPrefix}Goals`}
                formikProps={props.formikProps}
                returnKeyType="next"
                mode="outlined"
                disabled={isFieldDisabled()}
            />
        </View>
    );
};

const NewClient = () => {
    const navigation = useNavigation<AppStackNavProp>();
    const styles = useStyles();
    const scrollRef = React.createRef<KeyboardAwareScrollView>();
    const [showImagePickerModal, setShowImagePickerModal] = useState<boolean>(false);

    const scrollToTop = useCallback(
        () => scrollRef?.current?.scrollToPosition(0, 0, false),
        [scrollRef]
    );

    return (
        <SafeAreaView>
            <KeyboardAwareScrollView keyboardShouldPersistTaps={"always"} ref={scrollRef}>
                <Formik
                    initialValues={clientInitialValues}
                    validationSchema={newClientValidationSchema}
                    onSubmit={(values, helpers) =>
                        handleSubmit(values, helpers, navigation, scrollToTop)
                    }
                    enableReinitialize
                >
                    {(formikProps) => (
                        <View style={styles.container}>
                            <View style={styles.imageContainer}>
                                <TouchableRipple onPress={() => setShowImagePickerModal(true)}>
                                    <Card.Cover
                                        style={styles.image}
                                        source={{
                                            uri: formikProps.values.picture
                                                ? formikProps.values.picture
                                                : "https://cbrs.cradleplatform.com/api/uploads/images/7cm5m2urohgbet8ew1kjggdw2fd9ts.png",
                                        }}
                                    />
                                </TouchableRipple>
                            </View>
                            <FormikImageModal
                                field={ClientField.picture}
                                fieldLabels={clientFieldLabels}
                                formikProps={formikProps}
                                visible={showImagePickerModal}
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
                            {Object.keys(RiskType).map((riskType) => (
                                <RiskForm
                                    key={riskType}
                                    riskPrefix={riskType.toLowerCase()}
                                    formikProps={formikProps}
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
                                        CREATE
                                    </Button>
                                </View>
                                <Button
                                    labelStyle={styles.submitButtonLabel}
                                    mode="outlined"
                                    onPress={() => formikProps.resetForm()}
                                >
                                    CLEAR
                                </Button>
                            </View>
                        </View>
                    )}
                </Formik>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
};

export default NewClient;
