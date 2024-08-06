import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Text, Paragraph, RadioButton, List, Checkbox } from "react-native-paper";
import useStyles from "../NewReferral.styles";
import { IFormProps, referralFieldLabels, ReferralFormField } from "@cbr/common";
import { useTranslation } from "react-i18next";

const NutritionAgricultureForm = (props: IFormProps) => {
    const [foodAid, setFoodAid] = useState(false);
    const [agricultureProgram, setAgricultureProgram] = useState(false);
    const styles = useStyles();
    const { t } = useTranslation();

    return (
        <View>
            <Text />
            <Text style={styles.question}>{t('referral.whatDoesClientNeed')}</Text>
            <List.Section>
                <View style={styles.row} key={referralFieldLabels.emergency_food_aid}>
                    <Paragraph>{referralFieldLabels.emergency_food_aid}</Paragraph>
                    <Checkbox
                        status={foodAid ? "checked" : "unchecked"}
                        onPress={() => {
                            props.formikProps.setFieldTouched(
                                ReferralFormField.emergencyFoodAidRequired,
                                !foodAid
                            );
                            props.formikProps.setFieldValue(
                                ReferralFormField.emergencyFoodAidRequired,
                                !foodAid
                            );
                            setFoodAid(!foodAid);
                        }}
                    />
                </View>
                <View
                    style={styles.row}
                    key={referralFieldLabels.agriculture_livelihood_program_enrollment}
                >
                    <Paragraph>
                        {referralFieldLabels.agriculture_livelihood_program_enrollment}
                    </Paragraph>
                    <Checkbox
                        status={agricultureProgram ? "checked" : "unchecked"}
                        onPress={() => {
                            props.formikProps.setFieldTouched(
                                ReferralFormField.agricultureLivelihoodProgramEnrollment,
                                !agricultureProgram
                            );
                            props.formikProps.setFieldValue(
                                ReferralFormField.agricultureLivelihoodProgramEnrollment,
                                !agricultureProgram
                            );
                            setAgricultureProgram(!agricultureProgram);
                        }}
                    />
                </View>
            </List.Section>
        </View>
    );
};

export default NutritionAgricultureForm;
