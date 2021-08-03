import * as React from "react";
import { useState } from "react";
import { View } from "react-native";
import { IRisk, riskLevels, RiskType } from "@cbr/common";
import { Button, Card, Divider, Modal, Portal, Text } from "react-native-paper";
import clientStyle, { riskStyles } from "./ClientRisk.styles";
import { ClientRiskForm } from "./ClientRiskForm";
import { Formik } from "formik";

interface riskProps {
    clientRisks: IRisk[];
}

const getLatestRisk = (riskType: RiskType, clientRisk: IRisk[]) => {
    //Get the latest Risk for each type and pass the values on so they can be displayed initially
    const filteredRisks: IRisk[] = clientRisk.filter(
        (presentRisk) => presentRisk.risk_type === riskType
    );
    let latestRisk = filteredRisks.reduce(function (prev, current) {
        return prev.timestamp > current.timestamp ? prev : current;
    });
    return latestRisk;
};

export const ClientRisk = (props: riskProps) => {
    const styles = clientStyle();
    const [showHealthModal, setShowHealthModal] = useState(false);
    const [showEducationModal, setShowEducationModal] = useState(false);
    const [showSocialModal, setShowSocialModal] = useState(false);
    const [healthRisk, setHealthRisk] = useState<IRisk>(
        getLatestRisk(RiskType.HEALTH, props.clientRisks)
    );
    const [educationRisk, setEducationRisk] = useState<IRisk>(
        getLatestRisk(RiskType.EDUCATION, props.clientRisks)
    );
    const [socialRisk, setSocialRisk] = useState<IRisk>(
        getLatestRisk(RiskType.SOCIAL, props.clientRisks)
    );
    const closeModal = (modalType: RiskType) => {
        if (modalType === RiskType.HEALTH) {
            setShowHealthModal(false);
        } else if (modalType === RiskType.EDUCATION) {
            setShowEducationModal(false);
        } else {
            setShowSocialModal(false);
        }
    };

    return (
        <View>
            <Text style={styles.cardSectionTitle}>Client Risks</Text>
            <Divider></Divider>
            <Card style={styles.riskCardStyle}>
                <View style={styles.riskCardContentStyle}>
                    <Text style={styles.riskTitleStyle}>Health</Text>
                    <Text
                        style={
                            riskStyles(riskLevels[healthRisk.risk_level].color).riskSubtitleStyle
                        }
                    >
                        {riskLevels[healthRisk.risk_level].name}
                    </Text>
                </View>
                <View>
                    <Text style={styles.riskHeaderStyle}>Requirements: </Text>
                    <Text style={styles.riskRequirementStyle}>{healthRisk.requirement}</Text>
                </View>
                <View>
                    <Text style={styles.riskHeaderStyle}>Goals: </Text>
                    <Text style={styles.riskRequirementStyle}>{healthRisk.goal}</Text>
                </View>
                <View style={styles.clientDetailsFinalView}>
                    <Button
                        mode="contained"
                        style={styles.clientDetailsFinalButtons}
                        onPress={() => {
                            setShowHealthModal(true);
                        }}
                    >
                        Update
                    </Button>
                </View>
                <View>
                    <Portal>
                        <Modal
                            visible={showHealthModal}
                            style={styles.modalStyle}
                            onDismiss={() => {
                                setShowHealthModal(false);
                            }}
                        >
                            <Formik
                                initialValues={healthRisk}
                                onSubmit={(values) => {
                                    console.log(values);
                                }}
                            >
                                {(formikProps) => (
                                    <View>
                                        <ClientRiskForm
                                            formikProps={formikProps}
                                            closeModal={this.closeModal(RiskType.HEALTH)}
                                        />
                                    </View>
                                )}
                            </Formik>
                        </Modal>
                    </Portal>
                </View>
            </Card>

            <Divider></Divider>
        </View>
    );
};
