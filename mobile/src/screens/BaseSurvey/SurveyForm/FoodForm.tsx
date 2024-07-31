import React, { useCallback, useState } from "react";
import { View } from "react-native";
import { Button, Dialog, Paragraph, Portal, Text } from "react-native-paper";
import {
    baseFieldLabels,
    BaseSurveyFormField,
    childNourish,
    ChildNourish,
    IFormProps,
    rateLevel,
} from "@cbr/common";
import useStyles from "../baseSurvey.style";
import TextCheckBox from "../../../components/TextCheckBox/TextCheckBox";
import FormikExposedDropdownMenu from "../../../components/ExposedDropdownMenu/FormikExposedDropdownMenu";
import { useTranslation } from "react-i18next";

const FoodForm = (props: IFormProps) => {
    const [alertInfo, setAlertError] = useState(false);
    const styles = useStyles();
    const hideAlert = () => setAlertError(false);
    const showAlert = () => setAlertError(true);
    const { t } = useTranslation();

    const otherDropdownKeyChangeCallback = useCallback(
        (key: any) => (key === ChildNourish.MALNOURISHED ? showAlert() : hideAlert()),
        []
    );

    return (
        <View>
            <Text style={styles.pickerQuestion}>{t("survey.foodSecurity")}</Text>
            <FormikExposedDropdownMenu
                field={BaseSurveyFormField.foodSecurityRate}
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
                field={BaseSurveyFormField.enoughFoodPerMonth}
                value={props.formikProps.values[BaseSurveyFormField.enoughFoodPerMonth]}
                label={baseFieldLabels[BaseSurveyFormField.enoughFoodPerMonth]}
                setFieldValue={props.formikProps.setFieldValue}
                setFieldTouched={props.formikProps.setFieldTouched}
            />
            <TextCheckBox
                field={BaseSurveyFormField.isChild}
                value={props.formikProps.values[BaseSurveyFormField.isChild]}
                label={baseFieldLabels[BaseSurveyFormField.isChild]}
                setFieldValue={props.formikProps.setFieldValue}
                setFieldTouched={props.formikProps.setFieldTouched}
            />
            {props.formikProps.values[BaseSurveyFormField.isChild] && (
                <View>
                    <Text style={styles.pickerQuestion}>
                        {t("survey.whatsNutritionStatus")}
                    </Text>

                    <FormikExposedDropdownMenu
                        field={BaseSurveyFormField.childNourish}
                        valuesType="record-string"
                        values={childNourish}
                        formikProps={props.formikProps}
                        otherOnKeyChange={otherDropdownKeyChangeCallback}
                        fieldLabels={baseFieldLabels}
                        mode="outlined"
                    />

                    <Portal>
                        <Dialog visible={alertInfo} onDismiss={hideAlert}>
                            <Dialog.Title>{t("general.reminder")}</Dialog.Title>
                            <Dialog.Content>
                                <Paragraph>{t("survey.referralRequired")}</Paragraph>
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={hideAlert}>{t("general.ok")}</Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>
                </View>
            )}
        </View>
    );
};

export default FoodForm;
