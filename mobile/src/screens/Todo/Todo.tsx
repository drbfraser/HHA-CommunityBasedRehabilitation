import React, { useRef, useState } from "react";
import { Alert, SafeAreaView, TouchableOpacity, View } from "react-native";
import {
    Text,
    Title,
    Checkbox,
    Button,
    Dialog,
    Portal,
    Paragraph,
    Appbar,
} from "react-native-paper";
import { fieldLabels, FormField, initialValues } from "./BaseSurvey/formFields";
import useStyles from "./Todo.styles";
import { Field, Form, Formik, FormikHelpers, FormikProps } from "formik";
import { useHistory, useParams } from "react-router-dom";
import { handleSubmit } from "./BaseSurvey/formHandler";
import { MaterialIcons } from "@expo/vector-icons";
import StepIndicator from "react-native-step-indicator/lib/typescript/src/types";
import { ProgressSteps, ProgressStep } from "react-native-progress-steps";
interface IFormProps {
    formikProps: FormikProps<any>;
}

const surveyTypes: FormField[] = [
    FormField.health,
    FormField.education,
    FormField.social,
    FormField.livelihood,
    FormField.foodAndNutrition,
    FormField.empowerment,
    FormField.shelterAndCare,
];

interface ISurvey {
    label: string;
    Form: (props: IFormProps) => JSX.Element;
    validationSchema: () => any;
}

const Todo = () => {
    const [step, setStep] = useState<number>(0);
    const [submissionError, setSubmissionError] = useState(false);
    const history = useHistory();
    const styles = useStyles();
    const hideAlert = () => setSubmissionError(false);
    const showAlert = () => setSubmissionError(true);
    const handleClick = () => history.push("/home");
    const progressStepsStyle = {
        activeStepIconBorderColor: "#686868",
        activeLabelColor: "#686868",
        activeStepNumColor: "white",
        activeStepIconColor: "#686868",
        completedStepIconColor: "#686868",
        completedProgressBarColor: "#686868",
        completedCheckColor: "#4bb543",
    };

    const buttonTextStyle = {
        color: "#686868",
        fontWeight: "bold",
    };
    return (
        <Formik
            initialValues={initialValues}
            // validationSchema={surveySteps[step].validationSchema}
            onSubmit={showAlert}
            // enableReinitialize
        >
            <View style={styles.container}>
                <ProgressSteps {...progressStepsStyle}>
                    <ProgressStep label="First Step">
                        <View style={{ alignItems: "center" }}>
                            <Text>This is the content within step 1!</Text>
                        </View>
                    </ProgressStep>
                    <ProgressStep label="Second Step">
                        <View style={{ alignItems: "center" }}>
                            <TouchableOpacity
                                style={[styles.centerElement, { width: 50, height: 50 }]}
                                onPress={() => {}}
                            >
                                <MaterialIcons name="arrow-back" size={25} color="#000" />
                            </TouchableOpacity>
                            <Portal>
                                <Dialog visible={submissionError} onDismiss={showAlert}>
                                    <Dialog.Title>Error</Dialog.Title>
                                    <Dialog.Content>
                                        <Paragraph>
                                            Something went wrong submitting the survey. Please try
                                            again.
                                        </Paragraph>
                                    </Dialog.Content>
                                    <Dialog.Actions>
                                        <Button onPress={hideAlert}>OK</Button>
                                    </Dialog.Actions>
                                </Dialog>
                            </Portal>
                            <Button onPress={showAlert} mode="contained">
                                Show Dialog
                            </Button>

                            <Field
                                component={Checkbox}
                                type="checkbox"
                                name={FormField.surveyConsent}
                                Label={{ label: fieldLabels[FormField.surveyConsent] }}
                            />
                            <Field
                                component={Checkbox}
                                type="checkbox"
                                name={FormField.getService}
                                Label={{ label: fieldLabels[FormField.getService] }}
                            />
                            <Text>This is the content within step 2!</Text>
                        </View>
                    </ProgressStep>
                    <ProgressStep label="Third Step">
                        <View style={{ alignItems: "center" }}>
                            <Text>This is the content within step 3!</Text>
                        </View>
                    </ProgressStep>
                </ProgressSteps>
            </View>
        </Formik>
    );
};

export default Todo;
