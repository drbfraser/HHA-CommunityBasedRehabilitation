import React from "react";
import { View } from "react-native";
import { Text, Paragraph, RadioButton, List } from "react-native-paper";
import useStyles from "../NewReferral.styles";
import { ReferralFormField } from "@cbr/common";
import { IFormProps, orthoticInjuryLocations, prostheticInjuryLocations } from "@cbr/common";

const ProstheticOrthoticForm = (props: IFormProps, serviceType: ReferralFormField) => {
    const injuryLocations =
        serviceType === ReferralFormField.prosthetic
            ? prostheticInjuryLocations
            : orthoticInjuryLocations;
    const styles = useStyles();
    return (
        <View>
            <Text />
            <Text style={styles.question}>Where is the injury?</Text>
            <List.Section>
                <RadioButton.Group
                    value={props.formikProps.values[`${serviceType}_injury_location`]}
                    onValueChange={(value: string) => {
                        props.formikProps.setFieldTouched(`${serviceType}_injury_location`, true);
                        props.formikProps.setFieldValue(`${serviceType}_injury_location`, value);
                    }}
                >
                    {Object.entries(injuryLocations).map(([value, name]) => (
                        <View style={styles.row} key={name}>
                            <Paragraph>{name}</Paragraph>
                            <RadioButton value={value} />
                        </View>
                    ))}
                </RadioButton.Group>
            </List.Section>
        </View>
    );
};

export default ProstheticOrthoticForm;
