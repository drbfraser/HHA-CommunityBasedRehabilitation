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
import { useTranslation } from "react-i18next";

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
    const { t } = useTranslation();

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
            [OutcomeField.outcome]: t("general.outcome"),
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
                        t("referralAttr.referralResolutionFailureAlert")
                    );
                });

            AutoSyncDB(database, autoSync, cellularSync);
        };

        return (
            <List.Accordion title={t("referralAttr.resolveVerb")}>
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
                                        {t("referralAttr.markResolved")}
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
                        {referral.resolved 
                        ? t('referralAttr.resolutionStatus', {context: 'resolved'}) 
                        : t('referralAttr.resolutionStatus', {context: 'pending'})}
                        {"\n\n"}
                        {referral.wheelchair && <ReasonChip label={t("general.wheelchair")} />}
                        {referral.physiotherapy && <ReasonChip label={t("general.physiotherapy")} />}
                        {referral.prosthetic && <ReasonChip label={t("general.prosthetic")} />}
                        {referral.orthotic && <ReasonChip label={t("general.orthotic")} />}
                        {referral.hha_nutrition_and_agriculture_project && <ReasonChip label={t("general.nutrition")} />}
                        {referral.mental_health && <ReasonChip label={t("general.mental")} />}
                        {referral.services_other && <ReasonChip label={t("referral.other")} />}
                    </Dialog.Title>
                    <Dialog.Content>
                        <Text>
                            <Text style={styles.labelBold}>{t("referralAttr.referralDate")}: </Text>
                            {timestampToDateTime(referral.date_referred)}
                        </Text>
                        {referral.resolved && (
                            <>
                                <Text />
                                <Text>
                                    <Text style={styles.labelBold}>{t("referralAttr.resolutionDate")}: </Text>
                                    {timestampToDateTime(referral.date_resolved)}
                                </Text>
                                <Text>
                                    <Text style={styles.labelBold}>{t("general.outcome")}: </Text>
                                    {referral.outcome}
                                </Text>
                            </>
                        )}
                        {referral.wheelchair && (
                            <>
                                <Text />
                                <Text>
                                    <Text style={styles.labelBold}>{t("referral.experience")}: </Text>
                                    {wheelchairExperiences[referral.wheelchair_experience]}
                                </Text>
                                <Text>
                                    <Text style={styles.labelBold}>{t("referral.hipWidth")}: </Text>
                                    {referral.hip_width} inches
                                </Text>
                                <Text>
                                    <Text style={styles.labelBold}>{t("referral.ownership")}? </Text>
                                    {referral.wheelchair_owned ? t("general.yes") : t("general.no")}
                                </Text>
                                <Text>
                                    <Text style={styles.labelBold}>{t("referral.repairability")}? </Text>
                                    {referral.wheelchair_repairable ? t("general.yes") : t("general.no")}
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
                                <Text />
                                <Text>
                                    <Text style={styles.labelBold}>{t('referralAttr.condition', {context: "physiotherapy"})}: </Text>
                                    {referral.condition}
                                </Text>
                                <Text />
                            </>
                        )}
                        {referral.prosthetic && (
                            <>
                                <Text />
                                <Text>
                                    <Text style={styles.labelBold}>
                                        {t('referralAttr.injuryLocation', {context: "prosthetic"})}: </Text>
                                    {prostheticInjuryLocations[referral.prosthetic_injury_location]}
                                </Text>
                            </>
                        )}
                        {referral.orthotic && (
                            <>
                                <Text />
                                <Text>
                                    <Text style={styles.labelBold}>{t('referralAttr.injuryLocation', {context: "orthotic"})}: </Text>
                                    {orthoticInjuryLocations[referral.orthotic_injury_location]}
                                </Text>
                            </>
                        )}
                        {referral.hha_nutrition_and_agriculture_project && (
                            <>                            
                                <Text />
                                <Text>
                                    <Text style={styles.labelBold}>{t("referral.emergencyFoodAidRequired")}? </Text>
                                    {referral.emergency_food_aid ? t("general.yes") : t("general.no")}
                                </Text>
                                <Text>
                                <Text style={styles.labelBold}>{t("referral.agricultureLivelihoodProgramEnrollment")}? </Text>
                                    {referral.agriculture_livelihood_program_enrollment ? t("general.yes") : t("general.no")}
                                </Text>
                            </>
                        )}
                        {referral.mental_health && (
                            <>
                                <Text />
                                <Text>
                                    <Text style={styles.labelBold}>{t('referralAttr.condition', {context: "mental"})}: </Text>
                                    <Text>{referral.mental_health_condition}</Text>
                                </Text>
                            </>
                        )}
                        {Boolean(referral.services_other.trim().length) && (
                            <>
                                <Text />
                                <Text>
                                    <Text style={styles.labelBold}>{t("referralAttr.otherServiceRequired")}: </Text>
                                    {referral.services_other}
                                </Text>
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
                            {t("general.close")}
                        </Button>
                    </Dialog.Actions>
                </>
            )}
        </ScrollView>
    );
};

export default ReferralEntry;
