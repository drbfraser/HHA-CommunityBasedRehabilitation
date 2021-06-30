import React from "react";
import { View } from "react-native";
import { HelperText, Text } from "react-native-paper";
import { fieldLabels, FormField, IFormProps } from "@cbr/common";
import { deviceTypes, rateLevel } from "@cbr/common";
import useStyles from "../baseSurvey.style";
import TextCheckBox from "../../../components/TextCheckBox/TextCheckBox";
import TextPicker from "../../../components/TextPicker/TextPicker";
import DicTextPicker from "../../../components/TextPicker/DicTextPicker";

const HealthForm = (props: IFormProps) => {
    const styles = useStyles();

    return (
        <View>
            <Text style={styles.pickerQuestion}>{"\n"}Rate your general health </Text>

            <TextPicker
                field={FormField.rateLevel}
                choices={rateLevel}
                values={props.formikProps.values[FormField.rateLevel]}
                setFieldValue={props.formikProps.setFieldValue}
                setFieldTouched={props.formikProps.setFieldTouched}
            />

            <HelperText
                style={styles.errorText}
                type="error"
                visible={!!props.formikProps.errors[FormField.rateLevel]}
            >
                {props.formikProps.errors[FormField.rateLevel]}
            </HelperText>

            <TextCheckBox
                field={FormField.getService}
                value={props.formikProps.values[FormField.getService]}
                label={fieldLabels[FormField.getService]}
                setFieldValue={props.formikProps.setFieldValue}
            />
            <TextCheckBox
                field={FormField.needService}
                value={props.formikProps.values[FormField.needService]}
                label={fieldLabels[FormField.needService]}
                setFieldValue={props.formikProps.setFieldValue}
            />
            <TextCheckBox
                field={FormField.haveDevice}
                value={props.formikProps.values[FormField.haveDevice]}
                label={fieldLabels[FormField.haveDevice]}
                setFieldValue={props.formikProps.setFieldValue}
            />

            <TextCheckBox
                field={FormField.deviceWorking}
                value={props.formikProps.values[FormField.deviceWorking]}
                label={fieldLabels[FormField.deviceWorking]}
                setFieldValue={props.formikProps.setFieldValue}
            />

            <TextCheckBox
                field={FormField.needDevice}
                value={props.formikProps.values[FormField.needDevice]}
                label={fieldLabels[FormField.needDevice]}
                setFieldValue={props.formikProps.setFieldValue}
            />

            {props.formikProps.values[FormField.needDevice] && (
                <View>
                    <Text style={styles.pickerQuestion}>
                        {"\n"} What assistive device do you need?
                    </Text>
                    <DicTextPicker
                        field={FormField.deviceType}
                        choices={deviceTypes}
                        values={props.formikProps.values[FormField.deviceType]}
                        setFieldValue={props.formikProps.setFieldValue}
                        setFieldTouched={props.formikProps.setFieldTouched}
                    />

                    <HelperText
                        style={styles.errorText}
                        type="error"
                        visible={!!props.formikProps.errors[FormField.deviceType]}
                    >
                        {props.formikProps.errors[FormField.deviceType]}
                    </HelperText>
                </View>
            )}
            <Text style={styles.pickerQuestion}>
                {"\n"}Are you satisfied with the health services you receive?
            </Text>

            <TextPicker
                field={FormField.serviceSatisf}
                choices={rateLevel}
                values={props.formikProps.values[FormField.serviceSatisf]}
                setFieldValue={props.formikProps.setFieldValue}
                setFieldTouched={props.formikProps.setFieldTouched}
            />

            <HelperText
                style={styles.errorText}
                type="error"
                visible={!!props.formikProps.errors[FormField.serviceSatisf]}
            >
                {props.formikProps.errors[FormField.serviceSatisf]}
            </HelperText>
        </View>
    );
};

export default HealthForm;
