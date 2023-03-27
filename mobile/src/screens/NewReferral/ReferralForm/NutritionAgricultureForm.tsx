import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Text, Paragraph, RadioButton, List, Checkbox } from "react-native-paper";
import useStyles from "../NewReferral.styles";
import { IFormProps, referralFieldLabels, ReferralFormField } from "@cbr/common";

const NutritionAgricultureForm = (props: IFormProps) => {
    const [foodAid, setFoodAid] = useState(false);
    const [agricultureProgram, setAgricultureProgram] = useState(false);
    const styles = useStyles();

    useEffect(() => {
        if (foodAid || agricultureProgram) {
            props.formikProps.setFieldTouched(
                ReferralFormField.hhaNutritionAndAgricultureProject,
                true
            );

            props.formikProps.setFieldValue(
                ReferralFormField.hhaNutritionAndAgricultureProject,
                true
            );
        } else {
            props.formikProps.resetForm({
                values: { [ReferralFormField.hhaNutritionAndAgricultureProject]: false },
            });
        }
    }, [foodAid, agricultureProgram]);
    return (
        <View>
            <Text />
            <Text style={styles.question}>What does the client need?</Text>
            <List.Section>
                <View style={styles.row} key={referralFieldLabels.emergency_food_aid}>
                    <Paragraph>{referralFieldLabels.emergency_food_aid}</Paragraph>
                    <Checkbox
                        status={foodAid ? "checked" : "unchecked"}
                        onPress={() => {
                            setFoodAid(!foodAid);
                            props.formikProps.setFieldValue(
                                ReferralFormField.emergencyFoodAidRequired,
                                foodAid
                            );
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
                            setAgricultureProgram(!agricultureProgram);
                            props.formikProps.setFieldValue(
                                ReferralFormField.agricultureLivelihoodProgramEnrollment,
                                agricultureProgram
                            );
                        }}
                    />
                </View>
            </List.Section>
        </View>
    );
};

export default NutritionAgricultureForm;
