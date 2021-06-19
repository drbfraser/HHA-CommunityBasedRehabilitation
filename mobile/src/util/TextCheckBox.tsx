import React from "react";
import { View } from "react-native";
import useStyles from "../screens/Todo/BaseSurvey/baseSurvey.style";
import { Checkbox, Paragraph, TouchableRipple } from "react-native-paper";
import { fieldLabels, FormField } from "../screens/Todo/BaseSurvey/formFields";
import { string } from "yup";
import { Field, Form, Formik, FormikHelpers, FormikProps } from "formik";

type Props = {
    field: string;
    formikProps: FormikProps<any>;
};

const TextCheckBox = ({ field, formikProps }: Props) => {
    const styles = useStyles();
    const temp = field.toString;
    return (
        <TouchableRipple onPress={() => formikProps.setFieldValue(field, !formikProps.values)}>
            <View style={styles.checkBoxText}>
                <View pointerEvents="none">
                    <Checkbox status={formikProps.values ? "checked" : "unchecked"} />
                </View>
                <Paragraph>{field}</Paragraph>
            </View>
        </TouchableRipple>
    );
};

export default TextCheckBox;
