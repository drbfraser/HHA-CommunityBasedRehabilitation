import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Button } from "react-native-paper";

import { OutcomeGoalMet } from "@cbr/common";
import useStyles from "./ClientRiskForm.styles";

import { ClientRiskFormModal } from "./ClientRiskFormModal";

export interface ClientRiskFormProps {
    riskData: any;
    setRisk: (risk: any) => void;
    clientArchived: boolean;
}

export const ClientRiskForm = (props: ClientRiskFormProps) => {
    const styles = useStyles();
    const [showModal, setShowModal] = useState(false);
    const { t } = useTranslation();

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
                    : "Create new goal"}
            </Button>

            <ClientRiskFormModal
                riskData={props.riskData}
                setRisk={props.setRisk}
                showModal={showModal}
                setShowModal={setShowModal}
                riskType={props.riskData.risk_type}
            />
        </View>
    );
};
