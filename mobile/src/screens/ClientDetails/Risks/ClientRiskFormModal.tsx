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
    getRiskRequirementsTranslationKey,
    getRiskGoalsTranslationKey,
} from "@cbr/common";
import { SyncContext } from "../../../context/SyncContext/SyncContext";
import useStyles, { riskRadioButtonStyles } from "./ClientRiskForm.styles";
import FormikExposedDropdownMenu from "@/src/components/ExposedDropdownMenu/FormikExposedDropdownMenu";

import { handleRiskSubmit } from "./ClientRiskFormHandler";
import GoalStatusChip from "@/src/components/GoalStatusChip/GoalStatusChip";
import Icon from "react-native-vector-icons/MaterialIcons";
import { database } from "@/src/util/watermelonDatabase";
import UpdateGoalStatusModal from "./UpdateGoalStatusModal";

interface ClientRiskFormModalProps {
    showModal: boolean;
    setShowModal: (v: boolean) => void;
    riskType: RiskType;
    riskData: any; // ideally typed better
    setRisk: (risk: any) => void;
}

// reusable text input component for risk form
interface FormikTextInputProps {
    formikProps: FormikProps<IRisk>;
    field: FormField;
    label: string;
    style?: any;
}

const toastValidationError = () => {
    const msg = "Please check one or more fields.";
    if (Platform.OS === "android") {
        ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
        Alert.alert(msg);
    }
};

export const FormikTextInput: React.FC<FormikTextInputProps> = ({
    formikProps,
    field,
    label,
    style,
}) => {
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

export const ClientRiskFormModal = (props: ClientRiskFormModalProps) => {
    const styles = useStyles();
    const { autoSync, cellularSync } = useContext(SyncContext);
    const [showGoalStatusModal, setShowGoalStatusModal] = useState(false);
    const [pendingGoalStatus, setPendingGoalStatus] = useState<OutcomeGoalMet>(
        props.riskData.goal_status as OutcomeGoalMet
    );
    const { t } = useTranslation();

    const requirementKey = getRiskRequirementsTranslationKey(props.riskData.risk_type);
    const goalKey = getRiskGoalsTranslationKey(props.riskData.risk_type);

    const translatedRequirements = t(requirementKey, { returnObjects: true });
    const translatedGoals = t(goalKey, { returnObjects: true });

    const localizedRequirements =
        typeof translatedRequirements === "object" ? translatedRequirements : {};
    const localizedGoals = typeof translatedGoals === "object" ? translatedGoals : {};

    const getHeaderText = () => {
        switch (props.riskType) {
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
                console.error("Unknown risk type:", props.riskType);
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
        props.setShowModal(false);
    };

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

    return (
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
                            visible={props.showModal}
                            onDismiss={() => {
                                props.setShowModal(false);
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

                                <UpdateGoalStatusModal
                                    visible={showGoalStatusModal}
                                    onClose={handleGoalStatusModalClose}
                                    onDismiss={() => setShowGoalStatusModal(false)}
                                    pendingGoalStatus={pendingGoalStatus}
                                    setPendingGoalStatus={setPendingGoalStatus}
                                    formik={formikProps}
                                />

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

                                <FormikExposedDropdownMenu
                                    style={styles.riskInputStyle}
                                    valuesType="record-string"
                                    values={localizedRequirements}
                                    fieldLabels={fieldLabels}
                                    field={FormField.requirement}
                                    formikProps={formikProps}
                                    mode="outlined"
                                />

                                <FormikExposedDropdownMenu
                                    style={styles.riskInputStyle}
                                    valuesType="record-string"
                                    values={localizedGoals}
                                    fieldLabels={fieldLabels}
                                    field={FormField.goal_name}
                                    formikProps={formikProps}
                                    mode="outlined"
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
    );
};
