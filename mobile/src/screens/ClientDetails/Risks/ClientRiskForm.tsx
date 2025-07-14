import { useDatabase } from "@nozbe/watermelondb/hooks";
import { Formik, FormikProps } from "formik";
import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Platform, ScrollView, ToastAndroid, View } from "react-native";
import { Button, Modal, Portal, RadioButton, Text, TouchableRipple } from "react-native-paper";

import {
    fieldLabels,
    FormField,
    getRiskGoalsTranslationKey,
    getRiskRequirementsTranslationKey,
    IRisk,
    OutcomeGoalMet,
    RiskLevel,
    riskLevels,
    RiskType,
    validationSchema,
} from "@cbr/common";
import ModalForm from "../../../components/ModalForm/ModalForm";
import { SyncContext } from "../../../context/SyncContext/SyncContext";
import useStyles, { riskRadioButtonStyles } from "./ClientRiskForm.styles";

import { handleRiskSubmit } from "./ClientRiskFormHandler";
import GoalStatusChip from "@/src/components/GoalStatusChip/GoalStatusChip";
import Icon from "react-native-vector-icons/MaterialIcons";

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
        Alert.alert(msg);
    }
};

export const ClientRiskForm = (props: ClientRiskFormProps) => {
    const styles = useStyles();
    const [showModal, setShowModal] = useState(false);
    const { autoSync, cellularSync } = useContext(SyncContext);
    const database = useDatabase();
    const { t } = useTranslation();

    const riskType: RiskType = props.riskData.risk_type;

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
            // TODO: update the following accordingly
            goal_name: risk.goal_name || risk.goal || "No goal set",
            goal_status: risk.goal_status || OutcomeGoalMet.NOTSET,
            start_date: risk.start_date || risk.timestamp || 0,
            end_date: risk.end_date || 0,
            cancellation_reason: risk.cancellation_reason || "",
            change_type: risk.change_type || "",
        };
        return riskFormProps;
    };

    const getHeaderText = () => {
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
                return t("riskAttr.update", { context: "mental" });
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
                onPress={() => setShowModal(true)}
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
                enableReinitialize={true}
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

                                <View style={styles.goalStatusContainer}>
                                    <Text style={styles.goalStatusText}>Goal Status:</Text>
                                    <TouchableRipple>
                                        <View
                                            style={{ flexDirection: "row", alignItems: "center" }}
                                        >
                                            <GoalStatusChip
                                                goalStatus={formikProps.values.goal_status}
                                            />
                                            <Icon
                                                name="edit-note"
                                                size={20}
                                                style={{ marginLeft: 8 }}
                                            />
                                        </View>
                                    </TouchableRipple>
                                </View>

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
                                            const style = riskRadioButtonStyles(
                                                riskLevels[level].color
                                            ).riskRadioStyle;
                                            const textColour = riskRadioButtonStyles(
                                                riskLevels[level].color
                                            ).radioSubtitleText;
                                            return (
                                                <View key={index} style={styles.radioIndividual}>
                                                    <View style={style}>
                                                        <Text style={textColour}>
                                                            {abbreviation}
                                                        </Text>
                                                    </View>
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
                                    transKey={getRiskRequirementsTranslationKey(riskType)}
                                    defaultValue={formikProps.values.requirement}
                                />
                                <ModalForm
                                    style={styles.riskInputStyle}
                                    label={fieldLabels[FormField.goal_name]}
                                    formikField={FormField.goal}
                                    formikProps={formikProps}
                                    transKey={getRiskGoalsTranslationKey(riskType)}
                                    defaultValue={formikProps.values.goal}
                                />

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
