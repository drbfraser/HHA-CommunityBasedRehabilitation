import { useDatabase } from "@nozbe/watermelondb/hooks";
import { Formik, FormikProps } from "formik";
import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Platform, ScrollView, ToastAndroid, View } from "react-native";
import {
    Button,
    HelperText,
    Modal,
    Portal,
    RadioButton,
    Text,
    TextInput,
    TouchableRipple,
} from "react-native-paper";

import {
    fieldLabels,
    FormField,
    IRisk,
    OutcomeGoalMet,
    RiskLevel,
    riskLevels,
    RiskType,
    validationSchema,
} from "@cbr/common";
import { SyncContext } from "../../../context/SyncContext/SyncContext";
import useStyles, { riskRadioButtonStyles } from "./ClientRiskForm.styles";

import { handleRiskSubmit } from "./ClientRiskFormHandler";
import GoalStatusChip from "@/src/components/GoalStatusChip/GoalStatusChip";
import Icon from "react-native-vector-icons/MaterialIcons";
import ModalWindow from "../../../components/ModalForm/components/ModalWindow";

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
    const [showGoalStatusModal, setShowGoalStatusModal] = useState(false);
    const openGoalStatusModal = () => setShowGoalStatusModal(true);
    const closeGoalStatusModal = () => setShowGoalStatusModal(false);
    const { autoSync, cellularSync } = useContext(SyncContext);
    const database = useDatabase();
    const { t } = useTranslation();

    const goalStatusOptions = [
        { value: "GO", label: t("newVisit.ongoing") },
        { value: "CON", label: t("newVisit.PLACEHOLDER-socialGoals.0") },
        { value: "CAN", label: t("newVisit.cancelled") },
    ];

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
                                    <TouchableRipple onPress={openGoalStatusModal}>
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

                                <ModalWindow
                                    label={"Update Goal Status"}
                                    visible={showGoalStatusModal}
                                    onClose={closeGoalStatusModal}
                                >
                                    <RadioButton.Group
                                        onValueChange={(value) => {
                                            formikProps.setFieldValue(FormField.goal_status, value);
                                        }}
                                        value={formikProps.values.goal_status}
                                    >
                                        {goalStatusOptions.map((option, index) => (
                                            <View
                                                key={index}
                                                style={{
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <RadioButton value={option.value} />
                                                <Text>{option.label}</Text>
                                            </View>
                                        ))}
                                    </RadioButton.Group>

                                    {formikProps.values.goal_status ===
                                        OutcomeGoalMet.CANCELLED && (
                                        <TextInput
                                            style={styles.cancellationReasonInput}
                                            mode="outlined"
                                            label={fieldLabels[FormField.cancellation_reason]}
                                            value={formikProps.values.cancellation_reason}
                                            onChangeText={(text) =>
                                                formikProps.setFieldValue(
                                                    FormField.cancellation_reason,
                                                    text
                                                )
                                            }
                                        />
                                    )}
                                </ModalWindow>

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

                                <TextInput
                                    mode="outlined"
                                    label={fieldLabels[FormField.requirement]}
                                    value={formikProps.values.requirement}
                                    onChangeText={formikProps.handleChange(FormField.requirement)}
                                    onBlur={() =>
                                        formikProps.setFieldTouched(FormField.requirement)
                                    }
                                    error={
                                        !!(
                                            formikProps.touched.requirement &&
                                            formikProps.errors.requirement
                                        )
                                    }
                                    style={styles.riskInputStyle}
                                />
                                <HelperText
                                    type="error"
                                    visible={
                                        !!(
                                            formikProps.touched.requirement &&
                                            formikProps.errors.requirement
                                        )
                                    }
                                >
                                    {formikProps.errors.requirement as string}
                                </HelperText>

                                <TextInput
                                    mode="outlined"
                                    label={fieldLabels[FormField.goal_name]}
                                    value={formikProps.values.goal_name}
                                    onChangeText={formikProps.handleChange(FormField.goal_name)}
                                    onBlur={() => formikProps.setFieldTouched(FormField.goal_name)}
                                    error={
                                        !!(
                                            formikProps.touched.goal_name &&
                                            formikProps.errors.goal_name
                                        )
                                    }
                                    style={styles.riskInputStyle}
                                />
                                <HelperText
                                    type="error"
                                    visible={
                                        !!(
                                            formikProps.touched.goal_name &&
                                            formikProps.errors.goal_name
                                        )
                                    }
                                >
                                    {formikProps.errors.goal_name as string}
                                </HelperText>

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
