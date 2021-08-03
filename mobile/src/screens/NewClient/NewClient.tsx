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
import React, { LegacyRef, RefObject, useRef } from "react";
import { Ref } from "react";
import { useCallback } from "react";
import { SafeAreaView, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Text, Button, Card, Checkbox, Divider } from "react-native-paper";
import { ClientForm } from "../../components/ClientForm/ClientForm";
import FormikExposedDropdownMenu from "../../components/ExposedDropdownMenu/FormikExposedDropdownMenu";
import FormikTextInput from "../../components/FormikTextInput/FormikTextInput";
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
            />
            <FormikTextInput
                style={styles.field}
                multiline
                numberOfLines={NUMBER_OF_LINES}
                disabled={props.formikProps.isSubmitting}
                fieldLabels={clientFieldLabels}
                field={`${props.riskPrefix}Goals`}
                formikProps={props.formikProps}
                returnKeyType="next"
                mode="outlined"
            />
        </View>
    );
};

const NewClient = () => {
    const navigation = useNavigation<AppStackNavProp>();
    const styles = useStyles();
    const scrollRef = React.createRef<KeyboardAwareScrollView>();

    const scrollToTop = useCallback(
        () => scrollRef?.current?.scrollToPosition(0, 0, false),
        [scrollRef]
    );

    return (
        <SafeAreaView>
            <KeyboardAwareScrollView ref={scrollRef}>
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
                                <Card.Cover
                                    style={styles.image}
                                    source={{
                                        uri: "https://cbrs.cradleplatform.com/api/uploads/images/7cm5m2urohgbet8ew1kjggdw2fd9ts.png",
                                    }}
                                />
                            </View>
                            <ClientForm isNewClient={true} formikProps={formikProps} />
                            <Divider style={styles.divider} />
                            {Object.keys(RiskType).map((riskType) => (
                                <RiskForm
                                    key={riskType}
                                    riskPrefix={riskType.toLowerCase()}
                                    formikProps={formikProps}
                                />
                            ))}
                            <View style={styles.checkboxContainer}>
                                <Checkbox
                                    status={
                                        formikProps.values.interviewConsent
                                            ? "checked"
                                            : "unchecked"
                                    }
                                    onPress={() => {
                                        formikProps.setFieldTouched(
                                            ClientField.interviewConsent,
                                            true
                                        );
                                        formikProps.setFieldValue(
                                            ClientField.interviewConsent,
                                            !formikProps.values.interviewConsent
                                        );
                                    }}
                                />
                                <Text style={styles.checkboxLabel}>
                                    {clientFieldLabels[ClientField.interviewConsent]}
                                </Text>
                            </View>
                            <FieldError
                                formikProps={formikProps}
                                field={ClientField.interviewConsent}
                            />
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
