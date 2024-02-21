import React from "react";
import { View } from "react-native";
import { HelperText, Text, TextInput } from "react-native-paper";
import { baseFieldLabels, BaseSurveyFormField, IFormProps, isSelfEmployed } from "@cbr/common";
import useStyles from "../baseSurvey.style";
import TextCheckBox from "../../../components/TextCheckBox/TextCheckBox";
import FormikExposedDropdownMenu from "../../../components/ExposedDropdownMenu/FormikExposedDropdownMenu";
import { useTranslation } from "react-i18next";

const LivelihoodForm = (props: IFormProps) => {
    const styles = useStyles();
    const { t } = useTranslation();

    return (
        <View>
            <TextCheckBox
                field={BaseSurveyFormField.isWorking}
                value={props.formikProps.values[BaseSurveyFormField.isWorking]}
                label={baseFieldLabels[BaseSurveyFormField.isWorking]}
                setFieldValue={props.formikProps.setFieldValue}
                setFieldTouched={props.formikProps.setFieldTouched}
            />

            {props.formikProps.values[BaseSurveyFormField.isWorking] && (
                <View>
                    <Text style={styles.pickerQuestion}>{t("survey.occupationStatus")}</Text>
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
                            {t("survey.employmentStatus")}
                        </Text>

                        <FormikExposedDropdownMenu
                            field={BaseSurveyFormField.isSelfEmployed}
                            valuesType="record-string"
                            values={isSelfEmployed}
                            formikProps={props.formikProps}
                            fieldLabels={baseFieldLabels}
                            mode="outlined"
                        />
                    </View>
                </View>
            )}

            <TextCheckBox
                field={BaseSurveyFormField.meetFinanceNeeds}
                value={props.formikProps.values[BaseSurveyFormField.meetFinanceNeeds]}
                label={baseFieldLabels[BaseSurveyFormField.meetFinanceNeeds]}
                setFieldValue={props.formikProps.setFieldValue}
                setFieldTouched={props.formikProps.setFieldTouched}
            />

            <TextCheckBox
                field={BaseSurveyFormField.disabiAffectWork}
                value={props.formikProps.values[BaseSurveyFormField.disabiAffectWork]}
                label={baseFieldLabels[BaseSurveyFormField.disabiAffectWork]}
                setFieldValue={props.formikProps.setFieldValue}
                setFieldTouched={props.formikProps.setFieldTouched}
            />

            <TextCheckBox
                field={BaseSurveyFormField.wantWork}
                value={props.formikProps.values[BaseSurveyFormField.wantWork]}
                label={baseFieldLabels[BaseSurveyFormField.wantWork]}
                setFieldValue={props.formikProps.setFieldValue}
                setFieldTouched={props.formikProps.setFieldTouched}
            />
        </View>
    );
};

export default LivelihoodForm;
