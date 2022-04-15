import React, { useState } from "react";
import { View } from "react-native";
import TextCheckBox from "../../../components/TextCheckBox/TextCheckBox";
import {
    Text,
    HelperText,
    TextInput,
    Paragraph,
    RadioButton,
    List,
    Card,
} from "react-native-paper";
import useStyles from "../NewReferral.styles";
import { ReferralFormField, referralFieldLabels } from "@cbr/common";
import { IFormProps, wheelchairExperiences } from "@cbr/common";
import { TouchableOpacity } from "react-native-gesture-handler";
import FormikImageModal from "../../../components/FormikImageModal/FormikImageModal";

const WheelchairForm = (props: IFormProps) => {
    const styles = useStyles();
    const [showImagePickerModal, setShowImagePickerModal] = useState<boolean>(false);
    return (
        <View>
            <Text />
            <Text style={styles.question}>What type of wheelchair user?</Text>
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

            <Text style={styles.question}>What is the client's hip width?</Text>
            <View style={styles.hipWidthContainer}>
                <TextInput
                    style={styles.hipWidthInput}
                    keyboardType="numeric"
                    value={props.formikProps.values[ReferralFormField.hipWidth]}
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
            <Text style={styles.question}>Wheelchair information</Text>
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
            {props.formikProps.values[ReferralFormField.wheelchairOwned] &&
                props.formikProps.values[ReferralFormField.wheelchairRepairable] && (
                    <View style={styles.container}>
                        <View style={styles.imageContainer}>
                            {props.formikProps.values[ReferralFormField.picture] ? (
                                <Card.Cover
                                    style={styles.image}
                                    source={{
                                        uri: props.formikProps.values[ReferralFormField.picture],
                                    }}
                                />
                            ) : (
                                <></>
                            )}
                            <TouchableOpacity
                                style={styles.uploadButton}
                                onPress={() => {
                                    setShowImagePickerModal(true);
                                }}
                            >
                                <Text style={styles.buttonTextStyle}>choose a photo to upload</Text>
                            </TouchableOpacity>
                        </View>
                        <FormikImageModal
                            field={ReferralFormField.picture}
                            fieldLabels={referralFieldLabels}
                            formikProps={props.formikProps}
                            visible={showImagePickerModal}
                            onPictureChange={() => {}}
                            onDismiss={() => setShowImagePickerModal(false)}
                        />
                    </View>
                )}
        </View>
    );
};

export default WheelchairForm;
