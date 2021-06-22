import React, { Component, useEffect, useState } from "react";
import { SafeAreaView, TextInput, View, Button, ScrollView } from "react-native";
import useStyles from "./visitSurvey.style";
import { Text, Title, List, Appbar, Checkbox } from "react-native-paper";
import { ProgressSteps, ProgressStep } from "react-native-progress-steps";
import { Field, FieldArray, Form, Formik, FormikHelpers, FormikProps } from "formik";
import { Picker } from "@react-native-community/picker";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import {
    fieldLabels,
    FormField,
    ImprovementFormField,
    OutcomeFormField,
    initialValues,
    provisionals,
    initialValidationSchema,
    visitTypeValidationSchema,
    GoalStatus,
} from "./formFields";

const NewVisit = () => {
    const [activeStep, setActiveStep] = useState<number>(0);
    const [enabledSteps, setEnabledSteps] = useState<FormField[]>([]);
    // const [risks, setRisks] = useState<IRisk[]>([]);
    const [submissionError, setSubmissionError] = useState(false);
    const [loadingError, setLoadingError] = useState(false);
    // const zones = useZones();
    const { clientId } = useParams<{ clientId: string }>();

    const isFinalStep = activeStep === enabledSteps.length && activeStep !== 0;

    const nextStep = (values: any, helpers: FormikHelpers<any>) => {
        if (isFinalStep) {
            // form handler
            // handleSubmit(values, helpers, setSubmissionError);
            return;
        } else {
            if (activeStep === 0) {
                helpers.setFieldValue(`${[FormField.client]}`, clientId);
            }
            setActiveStep(activeStep + 1);
            helpers.setSubmitting(false);
            helpers.setTouched({});
        }
    };

    const prevStep = () => {
        setActiveStep(activeStep - 1);
    };
};

export default NewVisit;

// class ExampleOne extends Component {
//     static navigationOptions = {
//         header: null,
//     };

//     defaultScrollViewProps = {
//         keyboardShouldPersistTaps: "handled",
//         contentContainerStyle: {
//             flex: 1,
//             justifyContent: "center",
//         },
//     };

//     onNextStep = () => {
//         console.log("called next step");
//     };

//     onPaymentStepComplete = () => {
//         alert("Visit Focus step completed!");
//     };

//     onPrevStep = () => {
//         console.log("called previous step");
//     };

//     onSubmitSteps = () => {
//         console.log("called on submit step.");
//     };

//     state = {
//         isValid: false,
//         errors: true,
//         removeBtnRow: true,
//         activeStep: 1,
//         disabledStepIconColor: "#2400A2",
//         isComplete: false,
//     };

//     render() {
//         return (
//             <View style={{ flex: 1, marginTop: 50 }}>
//                 <ProgressSteps
//                     activeStep={this.state.activeStep}
//                     disabledStepIconColor={this.state.disabledStepIconColor}
//                     isComplete={this.state.isComplete}
//                 >
//                     <ProgressStep
//                         label="Visit Focus"
//                         onNext={this.onPaymentStepComplete}
//                         onPrevious={this.onPrevStep}
//                         scrollViewProps={this.defaultScrollViewProps}
//                     >
//                         <View style={{ alignItems: "center" }}>
//                             <Text>Visit Focus step content</Text>
//                         </View>
//                     </ProgressStep>

//                     <ProgressStep
//                         label="Health Visit"
//                         onNext={this.onNextStep}
//                         onPrevious={this.onPrevStep}
//                         scrollViewProps={this.defaultScrollViewProps}
//                     >
//                         <View style={{ alignItems: "center" }}>
//                             <Text>Health Visit step content</Text>
//                         </View>
//                     </ProgressStep>
//                     <ProgressStep
//                         label="Education Visit"
//                         onNext={this.onNextStep}
//                         onPrevious={this.onPrevStep}
//                         scrollViewProps={this.defaultScrollViewProps}
//                     >
//                         <View style={{ alignItems: "center" }}>
//                             <Text>Education Visit step content</Text>
//                         </View>
//                     </ProgressStep>
//                     <ProgressStep
//                         label="Social Visit"
//                         onPrevious={this.onPrevStep}
//                         onSubmit={this.onSubmitSteps}
//                         scrollViewProps={this.defaultScrollViewProps}
//                     >
//                         <View style={{ alignItems: "center" }}>
//                             <Text>Social Visit step content</Text>
//                         </View>
//                     </ProgressStep>
//                 </ProgressSteps>
//             </View>
//         );
//     }
// }

// export default ExampleOne;
