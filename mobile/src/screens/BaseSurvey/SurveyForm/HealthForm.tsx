import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import {
    baseFieldLabels,
    BaseSurveyFormField,
    deviceTypes,
    IFormProps,
    rateLevel,
} from "@cbr/common";
import useStyles from "../baseSurvey.style";
import TextCheckBox from "../../../components/TextCheckBox/TextCheckBox";
import FormikExposedDropdownMenu from "../../../components/ExposedDropdownMenu/FormikExposedDropdownMenu";
import { useTranslation } from "react-i18next";

const HealthForm = (props: IFormProps) => {
    const styles = useStyles();
    const { t } = useTranslation();

    return (
        <View>
            <Text style={styles.pickerQuestion}>
                {"\n"}
                {t("survey.rateHealth")}{" "}
            </Text>
            <FormikExposedDropdownMenu
                field={BaseSurveyFormField.rateLevel}
                valuesType="record-string"
                values={Object.entries(rateLevel).reduce((accumulator, [value, { name }]) => {
                    accumulator[value] = name;
                    return accumulator;
                }, {})}
                formikProps={props.formikProps}
                fieldLabels={baseFieldLabels}
                mode="outlined"
            />

            <TextCheckBox
                field={BaseSurveyFormField.getService}
                value={props.formikProps.values[BaseSurveyFormField.getService]}
                label={baseFieldLabels[BaseSurveyFormField.getService]}
                setFieldValue={props.formikProps.setFieldValue}
                setFieldTouched={props.formikProps.setFieldTouched}
            />
            <TextCheckBox
                field={BaseSurveyFormField.needService}
                value={props.formikProps.values[BaseSurveyFormField.needService]}
                label={baseFieldLabels[BaseSurveyFormField.needService]}
                setFieldValue={props.formikProps.setFieldValue}
                setFieldTouched={props.formikProps.setFieldTouched}
            />
            <TextCheckBox
                field={BaseSurveyFormField.mentalHealth}
                value={props.formikProps.values[BaseSurveyFormField.mentalHealth]}
                label={baseFieldLabels[BaseSurveyFormField.mentalHealth]}
                setFieldValue={props.formikProps.setFieldValue}
                setFieldTouched={props.formikProps.setFieldTouched}
            />
            <TextCheckBox
                field={BaseSurveyFormField.haveDevice}
                value={props.formikProps.values[BaseSurveyFormField.haveDevice]}
                label={baseFieldLabels[BaseSurveyFormField.haveDevice]}
                setFieldValue={props.formikProps.setFieldValue}
                setFieldTouched={props.formikProps.setFieldTouched}
            />

            <TextCheckBox
                field={BaseSurveyFormField.deviceWorking}
                value={props.formikProps.values[BaseSurveyFormField.deviceWorking]}
                label={baseFieldLabels[BaseSurveyFormField.deviceWorking]}
                setFieldValue={props.formikProps.setFieldValue}
                setFieldTouched={props.formikProps.setFieldTouched}
            />

            <TextCheckBox
                field={BaseSurveyFormField.needDevice}
                value={props.formikProps.values[BaseSurveyFormField.needDevice]}
                label={baseFieldLabels[BaseSurveyFormField.needDevice]}
                setFieldValue={props.formikProps.setFieldValue}
                setFieldTouched={props.formikProps.setFieldTouched}
            />

            {props.formikProps.values[BaseSurveyFormField.needDevice] && (
                <View>
                    <Text style={styles.pickerQuestion}>
                        {"\n"} {t("survey.assistiveDeviceNeeds")}
                    </Text>
                    <FormikExposedDropdownMenu
                        field={BaseSurveyFormField.deviceType}
                        valuesType="record-string"
                        values={deviceTypes}
                        formikProps={props.formikProps}
                        fieldLabels={baseFieldLabels}
                        mode="outlined"
                    />
                </View>
            )}
            <Text style={styles.pickerQuestion}>
                {"\n"}
                {t("survey.satisfiedWithHealthService")}
            </Text>

            <FormikExposedDropdownMenu
                field={BaseSurveyFormField.serviceSatisf}
                valuesType="record-string"
                values={Object.entries(rateLevel).reduce((accumulator, [value, { name }]) => {
                    accumulator[value] = name;
                    return accumulator;
                }, {})}
                formikProps={props.formikProps}
                fieldLabels={baseFieldLabels}
                mode="outlined"
            />
        </View>
    );
};

export default HealthForm;
