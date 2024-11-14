import React, { useContext, useState } from "react";
import { View, Platform, ToastAndroid, AlertIOS, ScrollView } from "react-native";
import { Button, Modal, Portal, Text, RadioButton } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { Formik, FormikProps } from "formik";
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

const toastValidationError = () => {
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
    const { autoSync, cellularSync } = useContext(SyncContext);
    const database = useDatabase();
    const { t } = useTranslation();

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

    const getHeaderText = () => {
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
    };

    const onRiskLevelChange = (formikProps: FormikProps<IRisk>, value: string) => {
        formikProps.setFieldValue(FormField.risk_level, value);
    };

    const onSave = (formikProps: FormikProps<IRisk>) => {
        if (!formikProps.isValid) {
            toastValidationError();
            return;
        }
        formikProps.handleSubmit();
        setShowModal(false);
    };

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
                            contentContainerStyle={styles.modalStyle}
                            visible={showModal}
                            onDismiss={() => {
                                setShowModal(false);
                                formikProps.resetForm();
                            }}
                        >
                            {/* Scroll view needed for modal to dynamically grow in height when textarea inputs being to take up more lines */}
                            <ScrollView contentContainerStyle={styles.modalContentStyle}>
                                <Text style={styles.riskHeaderStyle}>{getHeaderText()}</Text>

                                <RadioButton.Group
                                    value={formikProps.values.risk_level}
                                    onValueChange={(value) => onRiskLevelChange(formikProps, value)}
                                >
                                    <View style={styles.menuField}>
                                        {[
                                            [RiskLevel.LOW, t("riskLevelsAbbreviated.low")],
                                            [RiskLevel.MEDIUM, t("riskLevelsAbbreviated.medium")],
                                            [RiskLevel.HIGH, t("riskLevelsAbbreviated.high")],
                                            // prettier-ignore
                                            [RiskLevel.CRITICAL, t("riskLevelsAbbreviated.critical"),],
                                        ].map(([level, abbreviation], index) => {
                                            const style = riskStyles(
                                                riskLevels[level].color
                                            ).riskRadioStyle;
                                            return (
                                                <View key={index} style={styles.radioIndividual}>
                                                    <Text style={style}>{abbreviation}</Text>
                                                    <RadioButton value={level} />
                                                </View>
                                            );
                                        })}
                                    </View>
                                </RadioButton.Group>

                                <ModalForm
                                    style={styles.riskInputStyle}
                                    label={fieldLabels[FormField.requirement]}
                                    formikField={FormField.requirement}
                                    formikProps={formikProps}
                                    canonicalFields={t("newVisit.healthRequirements", {
                                        returnObjects: true,
                                        lng: "en",
                                    })}
                                    localizedFields={t("newVisit.healthRequirements", {
                                        returnObjects: true,
                                    })}
                                    defaultValue={formikProps.values.requirement}
                                    hasFreeformText
                                />
                                {/* <ModalForm
                                    style={styles.riskInputStyle}
                                    label={fieldLabels[FormField.goal]}
                                    formikField={FormField.goal}
                                    formikProps={formikProps}
                                    canonicalFields={["c"]}
                                    localizedFields={["d"]}
                                    defaultValue={formikProps.values.goal}
                                    hasFreeformText
                                /> */}

                                <Button
                                    style={styles.submitButtonStyle}
                                    mode={"contained"}
                                    onPress={() => onSave(formikProps)}
                                >
                                    {t("general.save")}
                                </Button>
                            </ScrollView>
                        </Modal>
                    </Portal>
                )}
            </Formik>
        </View>
    );
};
