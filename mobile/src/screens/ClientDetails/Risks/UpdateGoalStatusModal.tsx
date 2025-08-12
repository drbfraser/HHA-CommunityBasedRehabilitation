// UpdateGoalStatusModal.tsx
import React from "react";
import { View, Text } from "react-native";
import { RadioButton } from "react-native-paper";
import { useTranslation } from "react-i18next";
import ModalWindow from "../../../components/ModalForm/components/ModalWindow";
import { OutcomeGoalMet, FormField, fieldLabels } from "@cbr/common";
import { FormikTextInput } from "./ClientRiskFormModal"; // import your shared component
import type { FormikProps } from "formik";
import type { IRisk } from "@cbr/common";
import useStyles from "./ClientRiskForm.styles";

interface UpdateGoalStatusModalProps {
    visible: boolean;
    onClose: () => Promise<void>;
    onDismiss: () => void;
    pendingGoalStatus: OutcomeGoalMet;
    setPendingGoalStatus: (status: OutcomeGoalMet) => void;
    formik: FormikProps<IRisk>;
}

const UpdateGoalStatusModal: React.FC<UpdateGoalStatusModalProps> = ({
    visible,
    onClose,
    onDismiss,
    pendingGoalStatus,
    setPendingGoalStatus,
    formik,
}) => {
    const { t } = useTranslation();
    const styles = useStyles();

    const goalStatusOptions = [
        { value: OutcomeGoalMet.ONGOING, label: t("newVisit.ongoing") },
        { value: OutcomeGoalMet.CONCLUDED, label: t("newVisit.PLACEHOLDER-socialGoals.0") },
        { value: OutcomeGoalMet.CANCELLED, label: t("newVisit.cancelled") },
    ];

    return (
        <ModalWindow
            label={fieldLabels[FormField.update_goal_status]}
            visible={visible}
            onClose={onClose}
            isDismissable
            onDismiss={onDismiss}
        >
            <RadioButton.Group
                value={pendingGoalStatus}
                onValueChange={(value) => setPendingGoalStatus(value as OutcomeGoalMet)}
            >
                {goalStatusOptions.map((option, index) => (
                    <View key={index} style={{ flexDirection: "row", alignItems: "center" }}>
                        <RadioButton value={option.value} />
                        <Text>{option.label}</Text>
                    </View>
                ))}
            </RadioButton.Group>

            {pendingGoalStatus === OutcomeGoalMet.CANCELLED && (
                <FormikTextInput
                    formikProps={formik}
                    field={FormField.cancellation_reason}
                    label={fieldLabels[FormField.cancellation_reason]}
                    style={styles.cancellationReasonInput}
                />
            )}
        </ModalWindow>
    );
};

export default UpdateGoalStatusModal;
