import React from "react";
import { View } from "react-native";
import { HelperText, Text } from "react-native-paper";
import { baseFieldLabels, BaseSurveyFormField, IFormProps } from "@cbr/common";
import { deviceTypes, rateLevel } from "@cbr/common";
import useStyles from "../baseSurvey.style";
import TextCheckBox from "../../../components/TextCheckBox/TextCheckBox";
import TextPicker, { IPickerChoice } from "../../../components/TextPicker/TextPicker";

const HealthForm = (props: IFormProps) => {
    const styles = useStyles();

    return (
        <View>
            <Text style={styles.pickerQuestion}>{"\n"}Rate your general health </Text>
            <TextPicker
                field={BaseSurveyFormField.rateLevel}
                choices={Object.entries(rateLevel).map(
                    (key) =>
                        ({
                            value: key[0],
                            label: key[1].name,
                        } as IPickerChoice)
                )}
                selectedValue={props.formikProps.values[BaseSurveyFormField.rateLevel]}
                setFieldValue={props.formikProps.setFieldValue}
                setFieldTouched={props.formikProps.setFieldTouched}
            />

            <HelperText
                style={styles.errorText}
                type="error"
                visible={!!props.formikProps.errors[BaseSurveyFormField.rateLevel]}
            >
                {props.formikProps.errors[BaseSurveyFormField.rateLevel]}
            </HelperText>

            <TextCheckBox
                field={BaseSurveyFormField.getService}
                value={props.formikProps.values[BaseSurveyFormField.getService]}
                label={baseFieldLabels[BaseSurveyFormField.getService]}
                setFieldValue={props.formikProps.setFieldValue}
            />
            <TextCheckBox
                field={BaseSurveyFormField.needService}
                value={props.formikProps.values[BaseSurveyFormField.needService]}
                label={baseFieldLabels[BaseSurveyFormField.needService]}
                setFieldValue={props.formikProps.setFieldValue}
            />
            <TextCheckBox
                field={BaseSurveyFormField.haveDevice}
                value={props.formikProps.values[BaseSurveyFormField.haveDevice]}
                label={baseFieldLabels[BaseSurveyFormField.haveDevice]}
                setFieldValue={props.formikProps.setFieldValue}
            />

            <TextCheckBox
                field={BaseSurveyFormField.deviceWorking}
                value={props.formikProps.values[BaseSurveyFormField.deviceWorking]}
                label={baseFieldLabels[BaseSurveyFormField.deviceWorking]}
                setFieldValue={props.formikProps.setFieldValue}
            />

            <TextCheckBox
                field={BaseSurveyFormField.needDevice}
                value={props.formikProps.values[BaseSurveyFormField.needDevice]}
                label={baseFieldLabels[BaseSurveyFormField.needDevice]}
                setFieldValue={props.formikProps.setFieldValue}
            />

            {props.formikProps.values[BaseSurveyFormField.needDevice] && (
                <View>
                    <Text style={styles.pickerQuestion}>
                        {"\n"} What assistive device do you need?
                    </Text>
                    <TextPicker
                        field={BaseSurveyFormField.deviceType}
                        choices={Object.entries(deviceTypes).map(
                            (key) =>
                                ({
                                    value: key[0],
                                    label: key[1],
                                } as IPickerChoice)
                        )}
                        selectedValue={props.formikProps.values[BaseSurveyFormField.deviceType]}
                        setFieldValue={props.formikProps.setFieldValue}
                        setFieldTouched={props.formikProps.setFieldTouched}
                    />

                    <HelperText
                        style={styles.errorText}
                        type="error"
                        visible={!!props.formikProps.errors[BaseSurveyFormField.deviceType]}
                    >
                        {props.formikProps.errors[BaseSurveyFormField.deviceType]}
                    </HelperText>
                </View>
            )}
            <Text style={styles.pickerQuestion}>
                {"\n"}Are you satisfied with the health services you receive?
            </Text>

            <TextPicker
                field={BaseSurveyFormField.serviceSatisf}
                choices={Object.entries(rateLevel).map(
                    (key) =>
                        ({
                            value: key[0],
                            label: key[1].name,
                        } as IPickerChoice)
                )}
                selectedValue={props.formikProps.values[BaseSurveyFormField.serviceSatisf]}
                setFieldValue={props.formikProps.setFieldValue}
                setFieldTouched={props.formikProps.setFieldTouched}
            />

            <HelperText
                style={styles.errorText}
                type="error"
                visible={!!props.formikProps.errors[BaseSurveyFormField.serviceSatisf]}
            >
                {props.formikProps.errors[BaseSurveyFormField.serviceSatisf]}
            </HelperText>
        </View>
    );
};

export default HealthForm;
