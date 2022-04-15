import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { IFormProps, referralFieldLabels, ReferralFormField, useDisabilities } from "@cbr/common";
import useStyles from "../NewReferral.styles";
import TextCheckBox from "../../../components/TextCheckBox/TextCheckBox";

const HHANutritionAndAgricultureProjectForm = (props: IFormProps) => {
    const styles = useStyles();

    return (
        <View>
            <Text />
            <Text style={styles.question}>What does the client need?</Text>
            <TextCheckBox
                field={ReferralFormField.agricultureLivelihoodProgramEnrollment}
                label={referralFieldLabels[ReferralFormField.agricultureLivelihoodProgramEnrollment]}
                value={props.formikProps.values[ReferralFormField.agricultureLivelihoodProgramEnrollment]}
                setFieldValue={props.formikProps.setFieldValue}
            />
            <TextCheckBox
                field={ReferralFormField.emergencyFoodAidRequired}
                label={referralFieldLabels[ReferralFormField.emergencyFoodAidRequired]}
                value={props.formikProps.values[ReferralFormField.emergencyFoodAidRequired]}
                setFieldValue={props.formikProps.setFieldValue}
            />
            
        </View>
    );
};

export default HHANutritionAndAgricultureProjectForm;

