import React from "react";
import { View } from "react-native";
import TextCheckBox from "../../../components/TextCheckBox/TextCheckBox";
import { Text, HelperText, TextInput, Paragraph, RadioButton, List } from "react-native-paper";
import useStyles from "../NewReferral.styles";
import { FormField, fieldLabels } from "../formFields";
import { IFormProps, wheelchairExperiences } from "@cbr/common";

const WheelchairForm = (props: IFormProps) => {
    const styles = useStyles();

    return (
        <View>
            <Text />
            <Text>What type of wheelchair user?</Text>
            <List.Section>
                <RadioButton.Group
                    value={props.formikProps.values[FormField.wheelchairExperience]}
                    onValueChange={(value: string) =>
                        props.formikProps.setFieldValue(FormField.wheelchairExperience, value)
                    }
                >
                    {Object.entries(wheelchairExperiences).map(([value, name]) => (
                        <View style={styles.row} key={name}>
                            <Paragraph>{name}</Paragraph>
                            <RadioButton value={value} />
                        </View>
                    ))}
                </RadioButton.Group>
            </List.Section>

            <Text>What is the client's hip width?</Text>
            <View style={styles.hipWidthContainer}>
                <TextInput
                    style={styles.hipWidthInput}
                    keyboardType="numeric"
                    value={props.formikProps.values[FormField.hipWidth]}
                    // error={!_isUsernameValid(nameNoPadding)}
                    onChangeText={(value) => {
                        props.formikProps.setFieldTouched(FormField.hipWidth, true);
                        props.formikProps.setFieldValue(FormField.hipWidth, value);
                    }}
                />
                <Text>inches</Text>
            </View>

            <HelperText
                style={styles.errorText}
                type="error"
                visible={!!props.formikProps.errors[FormField.hipWidth]}
            >
                {props.formikProps.errors[FormField.hipWidth]}
            </HelperText>
            <Text>Wheelchair information</Text>
            <TextCheckBox
                field={FormField.wheelchairOwned}
                value={props.formikProps.values[FormField.wheelchairOwned]}
                label={fieldLabels[FormField.wheelchairOwned]}
                setFieldValue={props.formikProps.setFieldValue}
            />
            {props.formikProps.values[FormField.wheelchairOwned] && (
                <View>
                    <TextCheckBox
                        field={FormField.wheelchairRepairable}
                        value={props.formikProps.values[FormField.wheelchairRepairable]}
                        label={fieldLabels[FormField.wheelchairRepairable]}
                        setFieldValue={props.formikProps.setFieldValue}
                    />
                </View>
            )}
        </View>
    );
};

export default WheelchairForm;
