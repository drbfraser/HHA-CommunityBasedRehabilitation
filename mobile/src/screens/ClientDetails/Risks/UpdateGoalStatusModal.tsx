// UpdateGoalStatusModal.tsx
import React from "react";
import { View, Text } from "react-native";
import { RadioButton } from "react-native-paper";
import { useTranslation } from "react-i18next";
import ModalWindow from "../../../components/ModalForm/components/ModalWindow";
import { OutcomeGoalMet, FormField, fieldLabels, clientFieldLabels } from "@cbr/common";
import { FormikTextInput } from "./ClientRiskFormModal"; // import your shared component
import type { FormikProps } from "formik";
import type { IRisk } from "@cbr/common";
import useStyles from "./ClientRiskForm.styles";
import FormikExposedDropdownMenu from "@/src/components/ExposedDropdownMenu/FormikExposedDropdownMenu";

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
    const [showOtherInput, setShowOtherInput] = React.useState(false);

    const handleCancellationChange = (key: string) => {
        if (key === "other") {
            setShowOtherInput(true);
            formik.setFieldValue(FormField.cancellation_reason, "");
        } else {
            setShowOtherInput(false);
            formik.setFieldValue(FormField.cancellation_reason, key);
        }
    };

    const goalStatusOptions = [
        { value: OutcomeGoalMet.ONGOING, label: t("newVisit.ongoing") },
        { value: OutcomeGoalMet.CONCLUDED, label: t("newVisit.PLACEHOLDER-socialGoals.0") },
        { value: OutcomeGoalMet.CANCELLED, label: t("newVisit.cancelled") },
    ];

    const cancellationOptions = t("cancellation", { returnObjects: true });
    const cancellationOptionsWithOther = {
        ...cancellationOptions,
        other: t("disabilities.other"),
    };

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
                <FormikExposedDropdownMenu
                    style={styles.cancellationReasonInput}
                    valuesType="record-string"
                    values={cancellationOptionsWithOther}
                    fieldLabels={clientFieldLabels}
                    field={FormField.cancellation_reason}
                    formikProps={formik}
                    otherOnKeyChange={handleCancellationChange}
                    currentValueOverride={showOtherInput ? "other" : undefined}
                />
            )}

            {showOtherInput && (
                <FormikTextInput
                    formikProps={formik}
                    field={FormField.cancellation_reason}
                    label={t("risks.specify")}
                    style={styles.cancellationReasonInput}
                />
            )}
        </ModalWindow>
    );
};

export default UpdateGoalStatusModal;
