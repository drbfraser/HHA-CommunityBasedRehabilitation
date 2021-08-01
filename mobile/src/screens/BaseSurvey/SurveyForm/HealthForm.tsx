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

const HealthForm = (props: IFormProps) => {
    const styles = useStyles();

    return (
        <View>
            <Text style={styles.pickerQuestion}>{"\n"}Rate your general health </Text>
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
                {"\n"}Are you satisfied with the health services you receive?
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
