import { Formik, Form as MyInput } from "formik";
import * as React from "react";
import { Component, useState } from "react";
import { View, Text } from "react-native";
import { TextInput } from "react-native-paper";
import clientStyle from "./Client.styles";

interface FormProps {
    firstName: string;
    lastName: string;
}
interface FormValues {
    firstName: string;
    lastName: string;
}

export const ClientDetails = (props: FormProps) => {
    const styles = clientStyle();
    const [clientFirstName, setClientFirstName] = useState(props.firstName);
    const [clientLastName, setClientLastName] = useState(props.lastName);

    const initialValues: FormValues = { firstName: clientFirstName, lastName: clientLastName };

    return (
        <View>
            <Formik
                initialValues={initialValues}
                onSubmit={(values) => {
                    console.log(values);
                }}
            >
                {(formikProps) => (
                    <View>
                        <TextInput
                            style={styles.clientTextStyle}
                            label="First Name: "
                            placeholder="Name"
                            onChangeText={formikProps.handleChange("firstName")}
                        ></TextInput>
                    </View>
                )}
            </Formik>
        </View>
    );
};
