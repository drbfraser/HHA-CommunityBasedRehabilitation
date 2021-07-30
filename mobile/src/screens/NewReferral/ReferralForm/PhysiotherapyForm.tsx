import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { IFormProps, referralFieldLabels, ReferralFormField, useDisabilities } from "@cbr/common";
import useStyles from "../NewReferral.styles";
import FormikExposedDropdownMenu from "../../../components/FormikExposedDropdownMenu/FormikExposedDropdownMenu";

const PhysiotherapyForm = (props: IFormProps) => {
    const styles = useStyles();
    const disabilities = useDisabilities();

    return (
        <View>
            <Text />
            <Text style={styles.question}>What condition does the client have?</Text>
            <FormikExposedDropdownMenu
                field={ReferralFormField.condition}
                valuesType="map"
                values={disabilities}
                formikProps={props.formikProps}
                fieldLabels={referralFieldLabels}
                mode="outlined"
            />
        </View>
    );
};

export default PhysiotherapyForm;
