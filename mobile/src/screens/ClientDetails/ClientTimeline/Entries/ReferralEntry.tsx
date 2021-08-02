import React from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import {
    apiFetch,
    Endpoint,
    IReferral,
    orthoticInjuryLocations,
    prostheticInjuryLocations,
    themeColors,
    timestampToDateTime,
    wheelchairExperiences,
} from "@cbr/common";
import { Button, Card, Chip, Dialog, HelperText, List, Text, TextInput } from "react-native-paper";
import useStyles from "./Entry.styles";
import { ScrollView, View } from "react-native";
import * as Yup from "yup";
import { Formik, FormikProps } from "formik";

interface IEntryProps {
    referral: IReferral;
    close: () => void;
}

const ReferralEntry = ({ referral, close }: IEntryProps) => {
    const styles = useStyles();
    const onClose = () => {
        close();
    };
    const ReasonChip = ({ label }: { label: string }) => (
        <View style={styles.referralChip}>
            <Chip style={styles.smallChip} mode="outlined" selectedColor={themeColors.blueBgDark}>
                {label}
            </Chip>
        </View>
    );
    const ResolveForm = () => {
        const outcomeField = {
            key: "outcome",
            label: "Outcome",
        };
        const initialValues = {
            [outcomeField.key]: "",
        };
        type TOutcomeValues = typeof initialValues;

        const validationSchema = Yup.object().shape({
            [outcomeField.key]: Yup.string().label(outcomeField.label).max(100).trim().required(),
        });

        const handleSubmit = (values: typeof initialValues) => {
            apiFetch(Endpoint.REFERRAL, `${referral.id}`, {
                method: "PUT",
                body: JSON.stringify({
                    resolved: true,
                    [outcomeField.key]: values[outcomeField.key],
                }),
            })
                .then(() => onClose())
                .catch(() => alert("Something went wrong. Please try that again."));
        };

        return (
            <List.Accordion title={"Resolve"}>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {(formikProps: FormikProps<TOutcomeValues>) => (
                        <View>
                            <Card>
                                <Card.Content>
                                    <TextInput
                                        mode="outlined"
                                        label={outcomeField.label}
                                        onChangeText={(value) => {
                                            formikProps.setFieldValue("outcome", value);
                                        }}
                                    />
                                    <HelperText
                                        type="error"
                                        visible={!!formikProps.errors[outcomeField.key]}
                                    >
                                        {formikProps.errors[outcomeField.key]}
                                    </HelperText>
                                    <Text />
                                    <Button
                                        disabled={formikProps.isSubmitting}
                                        onPress={() => {
                                            handleSubmit(formikProps.values);
                                        }}
                                        mode="outlined"
                                    >
                                        Mark Resolved
                                    </Button>
                                </Card.Content>
                            </Card>
                        </View>
                    )}
                </Formik>
            </List.Accordion>
        );
    };

    return (
        <ScrollView style={styles.referralBoard}>
            <Dialog.Title>
                {referral.resolved ? (
                    <Icon name="check-circle" size={15} color={themeColors.riskGreen} />
                ) : (
                    <Icon name="clock-o" size={15} color={themeColors.riskRed} />
                )}{" "}
                Referral {referral.resolved ? "Resolved" : "Pending"}
                {"\n\n"}
                {referral.wheelchair && <ReasonChip label="Wheelchair" />}
                {referral.physiotherapy && <ReasonChip label="Physiotherapy" />}
                {referral.prosthetic && <ReasonChip label="Prosthetic" />}
                {referral.orthotic && <ReasonChip label="Orthotic" />}
            </Dialog.Title>
            <Dialog.Content>
                <Text>
                    <Text style={styles.labelBold}>Referral Date: </Text>
                    {timestampToDateTime(referral.date_referred)}
                </Text>
                {referral.resolved && (
                    <>
                        <Text />
                        <Text>
                            <Text style={styles.labelBold}>Resolution Date: </Text>
                            {timestampToDateTime(referral.date_resolved)}
                        </Text>
                        <Text>
                            <Text style={styles.labelBold}>Outcome: </Text>
                            {referral.outcome}
                        </Text>
                    </>
                )}
                {referral.wheelchair && (
                    <>
                        <Text />
                        <Text>
                            <Text style={styles.labelBold}>Wheelchair Experience: </Text>
                            {wheelchairExperiences[referral.wheelchair_experience]}
                        </Text>
                        <Text>
                            <Text style={styles.labelBold}>Hip Width: </Text>
                            {referral.hip_width} inches
                        </Text>
                        <Text>
                            <Text style={styles.labelBold}>Wheelchair Owned? </Text>
                            {referral.wheelchair_owned ? "Yes" : "No"}
                        </Text>
                        <Text>
                            <Text style={styles.labelBold}>Wheelchair Repairable? </Text>
                            {referral.wheelchair_repairable ? "Yes" : "No"}
                        </Text>
                        <Text />
                    </>
                )}
                {referral.physiotherapy && (
                    <>
                        <Text>
                            <Text style={styles.labelBold}>Physiotherapy Condition: </Text>
                            {referral.condition}
                        </Text>
                        <Text />
                    </>
                )}
                {referral.prosthetic && (
                    <>
                        <Text>
                            <Text style={styles.labelBold}>Prosthetic Injury Location: </Text>
                            {prostheticInjuryLocations[referral.prosthetic_injury_location]}
                        </Text>
                        <Text />
                    </>
                )}
                {referral.orthotic && (
                    <>
                        <Text>
                            <Text style={styles.labelBold}>Orthotic Injury Location: </Text>
                            {orthoticInjuryLocations[referral.orthotic_injury_location]}
                        </Text>
                        <Text />
                    </>
                )}
                {Boolean(referral.services_other.trim().length) && (
                    <>
                        <Text>
                            <Text style={styles.labelBold}>Other Services Required: </Text>
                            {referral.services_other}
                        </Text>
                        <Text />
                    </>
                )}
                {!referral.resolved && <ResolveForm />}
            </Dialog.Content>
            <Dialog.Actions>
                <Button onPress={onClose} color={themeColors.blueBgDark}>
                    Close
                </Button>
            </Dialog.Actions>
        </ScrollView>
    );
};

export default ReferralEntry;
