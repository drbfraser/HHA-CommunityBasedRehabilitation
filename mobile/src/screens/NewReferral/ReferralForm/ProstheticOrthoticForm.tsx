import React from "react";
import { View } from "react-native";
import TextCheckBox from "../../../components/TextCheckBox/TextCheckBox";
import { Text, Paragraph, RadioButton, List, HelperText } from "react-native-paper";
import useStyles from "../NewReferral.styles";
import { FormField } from "../formFields";
import { IFormProps, orthoticInjuryLocations, prostheticInjuryLocations } from "@cbr/common";

const ProstheticOrthoticForm = (props: IFormProps, serviceType: FormField) => {
    const injuryLocations =
        serviceType === FormField.prosthetic ? prostheticInjuryLocations : orthoticInjuryLocations;
    const styles = useStyles();

    return (
        <View>
            <Text />
            <Text>Where is the injury?</Text>
            <List.Section>
                <RadioButton.Group
                    value={
                        props.formikProps.values[serviceType]
                            ? props.formikProps.values[serviceType]
                            : "BEL"
                    }
                    onValueChange={(value: string) =>
                        props.formikProps.setFieldValue(serviceType, value)
                    }
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
