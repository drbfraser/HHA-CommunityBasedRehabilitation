import React from "react";
import { View } from "react-native";
import { HelperText, Text, TextInput } from "react-native-paper";
import { baseFieldLabels, BaseSurveyFormField, IFormProps } from "@cbr/common";
import { isSelfEmployed } from "@cbr/common";
import useStyles from "../baseSurvey.style";
import TextCheckBox from "../../../components/TextCheckBox/TextCheckBox";
import TextPicker, { IPickerChoice } from "../../../components/TextPicker/TextPicker";

const LivelihoodForm = (props: IFormProps) => {
    const styles = useStyles();

    return (
        <View>
            <TextCheckBox
                field={BaseSurveyFormField.isWorking}
                value={props.formikProps.values[BaseSurveyFormField.isWorking]}
                label={baseFieldLabels[BaseSurveyFormField.isWorking]}
                setFieldValue={props.formikProps.setFieldValue}
            />

            {props.formikProps.values[BaseSurveyFormField.isWorking] && (
                <View>
                    <Text style={styles.pickerQuestion}>What do you do?</Text>
                    <TextInput
                        mode="outlined"
                        label={BaseSurveyFormField.job}
                        value={props.formikProps.values[BaseSurveyFormField.job]}
                        onChangeText={(value) =>
                            props.formikProps.setFieldValue(BaseSurveyFormField.job, value)
                        }
                    />
                    <HelperText
                        style={styles.errorText}
                        type="error"
                        visible={!!props.formikProps.errors[BaseSurveyFormField.job]}
                    >
                        {props.formikProps.errors[BaseSurveyFormField.job]}
                    </HelperText>

                    <View>
                        <Text />
                        <Text style={styles.pickerQuestion}>
                            Are you employed or self-employed?
                        </Text>
                        <TextPicker
                            field={BaseSurveyFormField.isSelfEmployed}
                            choices={Object.entries(isSelfEmployed).map(
                                (key) =>
                                    ({
                                        value: key[0],
                                        label: key[1],
                                    } as IPickerChoice)
                            )}
                            selectedValue={
                                props.formikProps.values[BaseSurveyFormField.isSelfEmployed]
                            }
                            setFieldValue={props.formikProps.setFieldValue}
                            setFieldTouched={props.formikProps.setFieldTouched}
                        />

                        <HelperText
                            style={styles.errorText}
                            type="error"
                            visible={!!props.formikProps.errors[BaseSurveyFormField.isSelfEmployed]}
                        >
                            Self Employed is a required field
                        </HelperText>
                    </View>
                </View>
            )}

            <TextCheckBox
                field={BaseSurveyFormField.meetFinanceNeeds}
                value={props.formikProps.values[BaseSurveyFormField.meetFinanceNeeds]}
                label={baseFieldLabels[BaseSurveyFormField.meetFinanceNeeds]}
                setFieldValue={props.formikProps.setFieldValue}
            />

            <TextCheckBox
                field={BaseSurveyFormField.disabiAffectWork}
                value={props.formikProps.values[BaseSurveyFormField.disabiAffectWork]}
                label={baseFieldLabels[BaseSurveyFormField.disabiAffectWork]}
                setFieldValue={props.formikProps.setFieldValue}
            />

            <TextCheckBox
                field={BaseSurveyFormField.wantWork}
                value={props.formikProps.values[BaseSurveyFormField.wantWork]}
                label={baseFieldLabels[BaseSurveyFormField.wantWork]}
                setFieldValue={props.formikProps.setFieldValue}
            />
        </View>
    );
};

export default LivelihoodForm;
