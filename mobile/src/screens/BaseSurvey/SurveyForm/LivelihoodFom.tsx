import React from "react";
import { View } from "react-native";
import { HelperText, Text, TextInput } from "react-native-paper";
import { fieldLabels, FormField, IFormProps } from "@cbr/common";
import { isSelfEmployed } from "@cbr/common";
import useStyles from "../baseSurvey.style";
import TextCheckBox from "../../../components/TextCheckBox/TextCheckBox";
import DicTextPicker from "../../../components/TextPicker/DicTextPicker";

const LivelihoodForm = (props: IFormProps) => {
    const styles = useStyles();

    return (
        <View>
            <TextCheckBox
                field={FormField.isWorking}
                value={props.formikProps.values[FormField.isWorking]}
                label={fieldLabels[FormField.isWorking]}
                setFieldValue={props.formikProps.setFieldValue}
            />

            {props.formikProps.values[FormField.isWorking] && (
                <View>
                    <Text style={styles.pickerQuestion}>What do you do?</Text>
                    <TextInput
                        mode="outlined"
                        label={FormField.job}
                        value={props.formikProps.values[FormField.job]}
                        onChangeText={(value) =>
                            props.formikProps.setFieldValue(FormField.job, value)
                        }
                    />
                    <HelperText
                        style={styles.errorText}
                        type="error"
                        visible={!!props.formikProps.errors[FormField.job]}
                    >
                        {props.formikProps.errors[FormField.job]}
                    </HelperText>

                    <View>
                        <Text />
                        <Text style={styles.pickerQuestion}>
                            Are you employed or self-employed?
                        </Text>
                        <DicTextPicker
                            field={FormField.isSelfEmployed}
                            choices={isSelfEmployed}
                            values={props.formikProps.values[FormField.isSelfEmployed]}
                            setFieldValue={props.formikProps.setFieldValue}
                            setFieldTouched={props.formikProps.setFieldTouched}
                        />

                        <HelperText
                            style={styles.errorText}
                            type="error"
                            visible={!!props.formikProps.errors[FormField.isSelfEmployed]}
                        >
                            Self Employed is a required field
                        </HelperText>
                    </View>
                </View>
            )}

            <TextCheckBox
                field={FormField.meetFinanceNeeds}
                value={props.formikProps.values[FormField.meetFinanceNeeds]}
                label={fieldLabels[FormField.meetFinanceNeeds]}
                setFieldValue={props.formikProps.setFieldValue}
            />

            <TextCheckBox
                field={FormField.disabiAffectWork}
                value={props.formikProps.values[FormField.disabiAffectWork]}
                label={fieldLabels[FormField.disabiAffectWork]}
                setFieldValue={props.formikProps.setFieldValue}
            />

            <TextCheckBox
                field={FormField.wantWork}
                value={props.formikProps.values[FormField.wantWork]}
                label={fieldLabels[FormField.wantWork]}
                setFieldValue={props.formikProps.setFieldValue}
            />
        </View>
    );
};

export default LivelihoodForm;
