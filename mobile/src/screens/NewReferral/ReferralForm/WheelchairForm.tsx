import React from "react";
import { View } from "react-native";
import TextCheckBox from "../../../components/TextCheckBox/TextCheckBox";
import { Text, HelperText, TextInput, Paragraph, RadioButton, List } from "react-native-paper";
import useStyles from "../NewReferral.styles";
import { ReferralFormField, referralFieldLabels } from "@cbr/common";
import { IFormProps, wheelchairExperiences } from "@cbr/common";

const WheelchairForm = (props: IFormProps) => {
    const styles = useStyles();

    return (
        <View>
            <Text />
            <Text>What type of wheelchair user?</Text>
            <List.Section>
                <RadioButton.Group
                    value={props.formikProps.values[ReferralFormField.wheelchairExperience]}
                    onValueChange={(value: string) =>
                        props.formikProps.setFieldValue(
                            ReferralFormField.wheelchairExperience,
                            value
                        )
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
                    value={props.formikProps.values[ReferralFormField.hipWidth]}
                    // error={!_isUsernameValid(nameNoPadding)}
                    onChangeText={(value) => {
                        props.formikProps.setFieldTouched(ReferralFormField.hipWidth, true);
                        props.formikProps.setFieldValue(ReferralFormField.hipWidth, value);
                    }}
                />
                <Text>inches</Text>
            </View>

            <HelperText
                style={styles.errorText}
                type="error"
                visible={!!props.formikProps.errors[ReferralFormField.hipWidth]}
            >
                {props.formikProps.errors[ReferralFormField.hipWidth]}
            </HelperText>
            <Text>Wheelchair information</Text>
            <TextCheckBox
                field={ReferralFormField.wheelchairOwned}
                value={props.formikProps.values[ReferralFormField.wheelchairOwned]}
                label={referralFieldLabels[ReferralFormField.wheelchairOwned]}
                setFieldValue={props.formikProps.setFieldValue}
            />
            {props.formikProps.values[ReferralFormField.wheelchairOwned] && (
                <View>
                    <TextCheckBox
                        field={ReferralFormField.wheelchairRepairable}
                        value={props.formikProps.values[ReferralFormField.wheelchairRepairable]}
                        label={referralFieldLabels[ReferralFormField.wheelchairRepairable]}
                        setFieldValue={props.formikProps.setFieldValue}
                    />
                </View>
            )}
        </View>
    );
};

export default WheelchairForm;
