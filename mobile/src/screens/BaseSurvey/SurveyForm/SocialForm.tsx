import React from "react";
import { fieldLabels, FormField, IFormProps } from "../formFields";
import TextCheckBox from "../../../components/TextCheckBox";
import { View } from "react-native";

const SocialForm = (props: IFormProps) => {
    return (
        <View>
            <TextCheckBox
                field={FormField.feelValue}
                value={props.formikProps.values[FormField.feelValue]}
                label={fieldLabels[FormField.feelValue]}
                setFieldValue={props.formikProps.setFieldValue}
            />
            <View
                style={{
                    paddingRight: 130,
                }}
            >
                <TextCheckBox
                    field={FormField.feelIndependent}
                    value={props.formikProps.values[FormField.feelIndependent]}
                    label={fieldLabels[FormField.feelIndependent]}
                    setFieldValue={props.formikProps.setFieldValue}
                />
            </View>

            <TextCheckBox
                field={FormField.ableInSocial}
                value={props.formikProps.values[FormField.ableInSocial]}
                label={fieldLabels[FormField.ableInSocial]}
                setFieldValue={props.formikProps.setFieldValue}
            />
            <TextCheckBox
                field={FormField.disabiAffectSocial}
                value={props.formikProps.values[FormField.disabiAffectSocial]}
                label={fieldLabels[FormField.disabiAffectSocial]}
                setFieldValue={props.formikProps.setFieldValue}
            />

            <TextCheckBox
                field={FormField.disabiDiscrimination}
                value={props.formikProps.values[FormField.disabiDiscrimination]}
                label={fieldLabels[FormField.disabiDiscrimination]}
                setFieldValue={props.formikProps.setFieldValue}
            />
        </View>
    );
};

export default SocialForm;
