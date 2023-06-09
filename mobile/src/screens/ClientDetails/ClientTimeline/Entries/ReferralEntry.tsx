import React, { useContext, useEffect, useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import {
    countObjectKeys,
    IReferral,
    orthoticInjuryLocations,
    prostheticInjuryLocations,
    themeColors,
    timestampToDateTime,
    wheelchairExperiences,
} from "@cbr/common";
import { ActivityIndicator, Button, Card, Chip, Dialog, List, Text } from "react-native-paper";
import useStyles from "./Entry.styles";
import { ScrollView, View } from "react-native";
import * as Yup from "yup";
import { Formik, FormikProps } from "formik";
import FormikTextInput from "../../../../components/FormikTextInput/FormikTextInput";
import { dbType } from "../../../../util/watermelonDatabase";
import { AutoSyncDB } from "../../../../util/syncHandler";
import { SyncContext } from "../../../../context/SyncContext/SyncContext";

interface IEntryProps {
    referral: IReferral;
    database: dbType;
    close: () => void;
    refreshClient: () => void;
}

const ReferralEntry = ({ referral, database, close, refreshClient }: IEntryProps) => {
    const styles = useStyles();
    const [uri, setUri] = useState<string>("");
    const [hasImage, setHasImage] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const { autoSync, cellularSync } = useContext(SyncContext);

    useEffect(() => {
        if (referral.picture && referral.picture !== null) {
            setUri(referral.picture);
            setHasImage(true);
        }
    });

    const onClose = () => {
        close();
    };

    const handleUpdate = () => {
        setLoading(false);
        refreshClient();
    };

    const ReasonChip = ({ label }: { label: string }) => (
        <View style={styles.referralChip}>
            <Chip style={styles.smallChip} mode="outlined" selectedColor={themeColors.blueBgDark}>
                {label}
            </Chip>
        </View>
    );

    const ResolveForm = () => {
        const OutcomeField = {
            outcome: "outcome",
        };
        const initialValues = {
            [OutcomeField.outcome]: "",
        };

        const outcomeFieldLabels = {
            [OutcomeField.outcome]: "Outcome",
        };
        type TOutcomeValues = typeof initialValues;

        const validationSchema = Yup.object().shape({
            [OutcomeField.outcome]: Yup.string()
                .label(outcomeFieldLabels[OutcomeField.outcome])
                .max(100)
                .trim()
                .required(),
        });

        const handleSubmit = async (values: typeof initialValues) => {
            const referralToUpdate = await database.get("referrals").find(referral.id.toString());
            await referralToUpdate
                .updateReferral(values[OutcomeField.outcome])
                .then(() => handleUpdate())
                .catch(() => {
                    alert(
                        "Something went wrong when submitting the outcome and resolving the referral. Please try that again."
                    );
                });

            AutoSyncDB(database, autoSync, cellularSync);
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
                                    <FormikTextInput
                                        field={OutcomeField.outcome}
                                        fieldLabels={outcomeFieldLabels}
                                        formikProps={formikProps}
                                        returnKeyType="done"
                                        mode="outlined"
                                        touchOnChangeText
                                    />

                                    <Button
                                        disabled={
                                            formikProps.isSubmitting ||
                                            countObjectKeys(formikProps.errors) !== 0 ||
                                            countObjectKeys(formikProps.touched) === 0
                                        }
                                        onPress={() => {
                                            formikProps.handleSubmit();
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
        <ScrollView style={styles.referralBoard} keyboardShouldPersistTaps="always">
            {loading ? (
                <ActivityIndicator size="small" color={themeColors.blueAccent} />
            ) : (
                <>
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
                        {referral.mental_health && <ReasonChip label="Mental" />}
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
                                {hasImage ? (
                                    <Card.Cover
                                        style={styles.referralCardImageStyle}
                                        source={{ uri: uri }}
                                    />
                                ) : (
                                    <></>
                                )}
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
                                    <Text style={styles.labelBold}>
                                        Prosthetic Injury Location:{" "}
                                    </Text>
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
                        {referral.mental_health && (
                            <>
                                <Text>
                                    <Text style={styles.labelBold}>Mental Health Condition: </Text>
                                    <Text>{referral.mental_health_condition}</Text>
                                </Text>
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
                        <Button
                            style={styles.closeBtn}
                            onPress={onClose}
                            color={themeColors.blueBgDark}
                        >
                            Close
                        </Button>
                    </Dialog.Actions>
                </>
            )}
        </ScrollView>
    );
};

export default ReferralEntry;
