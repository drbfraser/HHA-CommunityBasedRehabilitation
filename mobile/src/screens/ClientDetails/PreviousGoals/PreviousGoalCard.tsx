import {
    fieldLabels,
    FormField,
    getRiskGoalsTranslationKey,
    getRiskRequirementsTranslationKey,
    IRisk,
    OutcomeGoalMet,
    riskLevels,
    RiskType,
    timestampToFormDate,
} from "@cbr/common";
import React from "react";
import { ScrollView, View } from "react-native";
import { Button, Dialog, Portal, Text, TextInput } from "react-native-paper";
import { useTranslation } from "react-i18next";
import GoalStatusChip from "@/src/components/GoalStatusChip/GoalStatusChip";
import styles from "./PreviousGoalsModal.styles";

interface PreviousGoalCardProps {
    open: boolean;
    risk: IRisk | null;
    close: () => void;
}

const PreviousGoalCard = ({ open, risk, close }: PreviousGoalCardProps) => {
    const { t } = useTranslation();

    if (!risk) {
        return null;
    }

    const getRiskTypeLabel = (riskType: RiskType): string => {
        switch (riskType) {
            case RiskType.HEALTH:
                return t("general.health");
            case RiskType.EDUCATION:
                return t("general.education");
            case RiskType.SOCIAL:
                return t("general.social");
            case RiskType.NUTRITION:
                return t("general.nutrition");
            case RiskType.MENTAL:
                return t("general.mental");
            default:
                console.error("Unknown risk type.");
                return "";
        }
    };

    const translatedRequirement = t(
        `${getRiskRequirementsTranslationKey(risk.risk_type)}.${risk.requirement}`,
        { defaultValue: risk.requirement }
    );

    const translatedGoalName = t(
        `${getRiskGoalsTranslationKey(risk.risk_type)}.${risk.goal_name}`,
        {
            defaultValue: risk.goal_name,
        }
    );

    const translatedCancellationReason = t(`cancellation.${risk.cancellation_reason}`, {
        defaultValue: risk.cancellation_reason,
    });
    const riskWithComments = risk as IRisk & { comments?: string };
    const commentsValue =
        riskWithComments.comments?.trim() ||
        riskLevels[risk.risk_level]?.name ||
        risk.risk_level ||
        "";

    return (
        <Portal>
            <Dialog visible={open} onDismiss={close} style={[styles.dialog, styles.detailDialog]}>
                <Dialog.Title>{t("goals.viewingPreviousGoals")}</Dialog.Title>
                <Dialog.Content>
                    <ScrollView style={styles.detailScroll}>
                        <View style={styles.detailMetaSection}>
                            <View style={styles.detailMetaRow}>
                                <Text style={styles.detailMetaLabel}>{t("goals.goalStatus")}:</Text>
                                <GoalStatusChip goalStatus={risk.goal_status} />
                            </View>
                            <View style={styles.detailMetaRow}>
                                <Text style={styles.detailMetaLabel}>{t("general.type")}:</Text>
                                <Text>{getRiskTypeLabel(risk.risk_type)}</Text>
                            </View>
                            <View style={styles.detailMetaRow}>
                                <Text style={styles.detailMetaLabel}>
                                    {t("general.startDate")}:
                                </Text>
                                <Text>{timestampToFormDate(risk.start_date, true)}</Text>
                            </View>
                            <View style={styles.detailMetaRow}>
                                <Text style={styles.detailMetaLabel}>{t("general.endDate")}:</Text>
                                <Text>{timestampToFormDate(risk.end_date, true)}</Text>
                            </View>
                        </View>
                        <TextInput
                            mode="outlined"
                            label={fieldLabels[FormField.risk_level]}
                            value={riskLevels[risk.risk_level]?.name ?? risk.risk_level}
                            editable={false}
                            style={styles.detailInput}
                        />
                        <TextInput
                            mode="outlined"
                            label={fieldLabels[FormField.requirement]}
                            value={translatedRequirement}
                            editable={false}
                            style={styles.detailInput}
                        />
                        <TextInput
                            mode="outlined"
                            label={fieldLabels[FormField.goal_name]}
                            value={translatedGoalName}
                            editable={false}
                            style={styles.detailInput}
                        />
                        <TextInput
                            mode="outlined"
                            label={fieldLabels[FormField.comments]}
                            value={commentsValue}
                            editable={false}
                            style={styles.detailInput}
                        />
                        {risk.goal_status === OutcomeGoalMet.CANCELLED && (
                            <TextInput
                                mode="outlined"
                                label={fieldLabels[FormField.cancellation_reason]}
                                value={translatedCancellationReason}
                                editable={false}
                                style={styles.detailInput}
                            />
                        )}
                    </ScrollView>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button
                        mode="outlined"
                        style={styles.goBackButton}
                        labelStyle={styles.goBackButtonText}
                        onPress={close}
                    >
                        {t("general.goBack")}
                    </Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
};

export default PreviousGoalCard;
