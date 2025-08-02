import { useDatabase } from "@nozbe/watermelondb/hooks";
import { Formik, FormikProps, getIn } from "formik";
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
    RiskChangeType,
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

// reusable text input component for risk form
interface FormikTextInputProps {
    formikProps: FormikProps<IRisk>;
    field: FormField;
    label: string;
    style?: any;
}

const FormikTextInput: React.FC<FormikTextInputProps> = ({ formikProps, field, label, style }) => {
    const value = getIn(formikProps.values, field);
    const errorMsg = getIn(formikProps.errors, field);
    const touched = getIn(formikProps.touched, field);
    const showError = !!(touched && errorMsg);
    return (
        <>
            <TextInput
                mode="outlined"
                label={label}
                value={value}
                onChangeText={formikProps.handleChange(field)}
                onBlur={() => formikProps.setFieldTouched(field)}
                error={showError}
                style={style}
            />
            <HelperText type="error" visible={showError}>
                {errorMsg as string}
            </HelperText>
        </>
    );
};

export const ClientRiskForm = (props: ClientRiskFormProps) => {
    const styles = useStyles();
    const [showModal, setShowModal] = useState(false);
    const [showGoalStatusModal, setShowGoalStatusModal] = useState(false);
    const [pendingGoalStatus, setPendingGoalStatus] = useState<OutcomeGoalMet>(
        props.riskData.goal_status as OutcomeGoalMet
    );
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
        if (risk.goal_status === OutcomeGoalMet.ONGOING) {
            const riskFormProps: IRisk = {
                id: risk.id,
                client_id: risk.client.id,
                timestamp: risk.timestamp,
                risk_type: risk.risk_type,
                risk_level: risk.risk_level,
                requirement: risk.requirement,
                goal: risk.goal,
                goal_name: risk.goal_name,
                goal_status: risk.goal_status,
                start_date: risk.start_date,
                end_date: risk.end_date,
                cancellation_reason: risk.cancellation_reason,
                change_type: risk.change_type,
            };
            return riskFormProps;
        } else {
            const riskFormProps: IRisk = {
                id: "",
                client_id: risk.client.id,
                timestamp: risk.timestamp,
                risk_type: risk.risk_type,
                risk_level: RiskLevel.LOW,
                requirement: "",
                goal: "",
                goal_name: "",
                goal_status: OutcomeGoalMet.ONGOING,
                start_date: risk.start_date,
                end_date: 0,
                cancellation_reason: "",
                change_type: RiskChangeType.INITIAL,
            };
            return riskFormProps;
        }
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

    const onSave = async (formikProps: FormikProps<IRisk>) => {
        formikProps.setTouched({
            requirement: true,
            goal_name: true,
        });

        const errors = await formikProps.validateForm();

        if (Object.keys(errors).length > 0) {
            toastValidationError();
            return;
        }
        await formikProps.submitForm();
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
                {props.riskData.goal_status === OutcomeGoalMet.ONGOING
                    ? t("general.update")
                    : t("goals.createNewGoal")}
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
                {(formikProps) => {
                    const openGoalStatusModal = () => {
                        setPendingGoalStatus(formikProps.values.goal_status);
                        setShowGoalStatusModal(true);
                    };
                    const handleGoalStatusModalClose = async () => {
                        formikProps.setFieldTouched(FormField.cancellation_reason, true);
                        const errors = await formikProps.validateForm({
                            ...formikProps.values,
                            [FormField.goal_status]: pendingGoalStatus,
                        });
                        if (
                            pendingGoalStatus === OutcomeGoalMet.CANCELLED &&
                            errors.cancellation_reason
                        ) {
                            return; // do NOT close the update goal status modal if there are validation errors
                        }
                        formikProps.setFieldValue(FormField.goal_status, pendingGoalStatus);
                        setShowGoalStatusModal(false);
                    };
                    return (
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
                                        <Text style={styles.goalStatusText}>
                                            {t("goals.goalStatus")}:
                                        </Text>
                                        <TouchableRipple onPress={openGoalStatusModal}>
                                            <View
                                                style={{
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                }}
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
                                        label={fieldLabels[FormField.update_goal_status]}
                                        visible={showGoalStatusModal}
                                        onClose={handleGoalStatusModalClose}
                                        isDismissable={true}
                                        onDismiss={() => setShowGoalStatusModal(false)}
                                    >
                                        <RadioButton.Group
                                            value={pendingGoalStatus}
                                            onValueChange={(value) =>
                                                setPendingGoalStatus(value as OutcomeGoalMet)
                                            }
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

                                        {pendingGoalStatus === OutcomeGoalMet.CANCELLED && (
                                            <FormikTextInput
                                                formikProps={formikProps}
                                                field={FormField.cancellation_reason}
                                                label={fieldLabels[FormField.cancellation_reason]}
                                                style={styles.cancellationReasonInput}
                                            />
                                        )}
                                    </ModalWindow>

                                    <RadioButton.Group
                                        value={formikProps.values.risk_level}
                                        onValueChange={(value) =>
                                            onRiskLevelChange(formikProps, value)
                                        }
                                    >
                                        <View style={styles.menuField}>
                                            {[
                                                [RiskLevel.LOW, t("riskLevelsAbbreviated.low")],
                                                [
                                                    RiskLevel.MEDIUM,
                                                    t("riskLevelsAbbreviated.medium"),
                                                ],
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
                                                    <View
                                                        key={index}
                                                        style={styles.radioIndividual}
                                                    >
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

                                    <FormikTextInput
                                        formikProps={formikProps}
                                        field={FormField.requirement}
                                        label={fieldLabels[FormField.requirement]}
                                        style={styles.riskInputStyle}
                                    />

                                    <FormikTextInput
                                        formikProps={formikProps}
                                        field={FormField.goal_name}
                                        label={fieldLabels[FormField.goal_name]}
                                        style={styles.riskInputStyle}
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
                    );
                }}
            </Formik>
        </View>
    );
};
