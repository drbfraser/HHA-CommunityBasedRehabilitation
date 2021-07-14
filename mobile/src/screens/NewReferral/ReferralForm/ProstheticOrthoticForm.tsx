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
            <Text>Where is the injury?</Text>
            <List.Section>
                <RadioButton.Group
                    value={props.formikProps.values[serviceType] ? "BEL" : "ABO"}
                    onValueChange={(value: string) => {
                        props.formikProps.setFieldValue(serviceType, value === "BEL");
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
