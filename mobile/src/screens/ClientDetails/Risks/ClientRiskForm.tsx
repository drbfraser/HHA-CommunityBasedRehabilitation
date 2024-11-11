import React, { useContext, useState } from "react";
import { View, Platform, ToastAndroid, AlertIOS } from "react-native";
import { Button, Modal, Portal, TextInput, Text, RadioButton } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { Formik } from "formik";
import { useDatabase } from "@nozbe/watermelondb/hooks";

import {
    fieldLabels,
    FormField,
    IRisk,
    RiskLevel,
    riskLevels,
    RiskType,
    validationSchema,
} from "@cbr/common";
import { SyncContext } from "../../../context/SyncContext/SyncContext";
import { handleRiskSubmit } from "./ClientRiskFormHandler";
import useStyles, { riskStyles } from "./ClientRisk.styles";
import ModalForm from "../../../components/ModalForm/ModalForm";

export interface ClientRiskFormProps {
    riskData: any;
    setRisk: (risk: any) => void;
    clientArchived: boolean;
}

export const toastValidationError = () => {
    const msg = "Please check one or more fields.";
    if (Platform.OS === "android") {
        ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
        AlertIOS.alert(msg);
    }
};

export const ClientRiskForm = (props: ClientRiskFormProps) => {
    const styles = useStyles();
    const [showModal, setShowModal] = useState(false);
    const database = useDatabase();
    const { t } = useTranslation();
    const { autoSync, cellularSync } = useContext(SyncContext);

    const getRiskFormInitialValues = () => {
        const risk = props.riskData;
        const riskFormProps: IRisk = {
            id: risk.id,
            client_id: risk.client.id,
            timestamp: risk.timestamp,
            risk_type: risk.risk_type,
            risk_level: risk.risk_level,
            requirement: risk.requirement,
            goal: risk.goal,
        };
        return riskFormProps;
    };

    const headerText = (() => {
        const riskType = props.riskData.risk_type;
        switch (riskType) {
            case RiskType.HEALTH:
                return t("riskAttr.update", { context: "health" });
            case RiskType.EDUCATION:
                return t("riskAttr.update", { context: "education" });
            case RiskType.SOCIAL:
                return t("riskAttr.update", { context: "social" });
            case RiskType.NUTRITION:
                return t("riskAttr.update", { context: "nutrition" });
            case RiskType.MENTAL:
                return ""; // TODO: missing mental header text
            default:
                console.error("Unknown risk type:", riskType);
                return "";
        }
    })();

    return (
        <View style={styles.riskModalStyle}>
            <Button
                mode="contained"
                style={styles.modalUpdateButton}
                disabled={!props.clientArchived}
                onPress={() => {
                    setShowModal(true);
                }}
            >
                {t("general.update")}
            </Button>

            <Text>Helloooo</Text>

            <Formik
                initialValues={getRiskFormInitialValues()}
                onSubmit={(values) => {
                    handleRiskSubmit(
                        values,
                        props.riskData,
                        props.setRisk,
                        database,
                        autoSync,
                        cellularSync
                    );
                }}
                validationSchema={validationSchema}
            >
                {(formikProps) => (
                    <Portal>
                        <Modal
                            style={styles.modalStyle}
                            visible={showModal}
                            onDismiss={() => {
                                setShowModal(false);
                                formikProps.resetForm();
                            }}
                        >
                            <Text style={styles.riskHeaderStyle}>{headerText}</Text>

                            <RadioButton.Group
                                onValueChange={(newValue) =>
                                    formikProps.setFieldValue(FormField.risk_level, newValue)
                                }
                                value={formikProps.values.risk_level}
                            >
                                <View style={styles.menuField}>
                                    {[
                                        [RiskLevel.LOW, t("riskLevelsAbbreviated.low")],
                                        [RiskLevel.MEDIUM, t("riskLevelsAbbreviated.medium")],
                                        [RiskLevel.HIGH, t("riskLevelsAbbreviated.high")],
                                        [RiskLevel.CRITICAL, t("riskLevelsAbbreviated.critical")],
                                    ].map(([level, abbreviation]) => (
                                        <View style={styles.radioIndividual}>
                                            <Text
                                                style={
                                                    riskStyles(riskLevels[level].color)
                                                        .riskRadioStyle
                                                }
                                            >
                                                {abbreviation}
                                            </Text>
                                            <RadioButton value={level} />
                                        </View>
                                    ))}
                                </View>
                            </RadioButton.Group>

                            {/* <TextInput
                                style={styles.riskTextStyle}
                                label={fieldLabels[FormField.requirement]}
                                defaultValue={formikProps.values.requirement}
                                onChangeText={formikProps.handleChange(FormField.requirement)}
                                multiline={true}
                                textAlignVertical={"top"}
                                mode={"outlined"}
                            /> */}
                            <Text style={styles.formikErrorStyle}>
                                {(() => {
                                    console.log(formikProps.values.requirement);
                                    return <></>;
                                })()}
                                {formikProps.errors.requirement}
                            </Text>

                            <ModalForm
                                label={fieldLabels[FormField.requirement]}
                                formikField={FormField.requirement}
                                formikProps={formikProps}
                                canonicalFields={["a"]}
                                localizedFields={["b"]}
                                hasFreeformText
                            />

                            <TextInput
                                style={styles.riskTextStyle}
                                label={fieldLabels[FormField.goal]}
                                defaultValue={formikProps.values.goal}
                                onChangeText={formikProps.handleChange(FormField.goal)}
                                placeholder={FormField.goal}
                                multiline={true}
                                textAlignVertical={"top"}
                                mode={"outlined"}
                            />
                            <Text style={styles.formikErrorStyle}>{formikProps.errors.goal}</Text>

                            <Button
                                style={styles.submitButtonStyle}
                                mode={"contained"}
                                onPress={() => {
                                    if (formikProps.isValid) {
                                        formikProps.handleSubmit();
                                        setShowModal(false);
                                    } else {
                                        toastValidationError();
                                    }
                                }}
                            >
                                {t("general.save")}
                            </Button>
                        </Modal>
                    </Portal>
                )}
            </Formik>
        </View>
    );
};
