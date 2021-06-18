import React, { useRef, useState } from "react";
import { Alert, SafeAreaView, ScrollView, TouchableOpacity, View } from "react-native";
import {
    Text,
    Title,
    Checkbox,
    Button,
    Dialog,
    Portal,
    Paragraph,
    Appbar,
    Menu,
    TextInput,
} from "react-native-paper";
import {
    educationValidationSchema,
    empowermentValidationSchema,
    emptyValidationSchema,
    fieldLabels,
    foodValidationSchema,
    FormField,
    healthValidationSchema,
    initialValues,
    livelihoodValidationSchema,
} from "./formFields";
import { Field, Form, Formik, FormikHelpers, FormikProps } from "formik";
import { useHistory, useParams } from "react-router-dom";
import { handleSubmit } from "./formHandler";
import { MaterialIcons } from "@expo/vector-icons";
import { ProgressSteps, ProgressStep } from "react-native-progress-steps";
import DropDownPicker from "react-native-dropdown-picker";
import { themeColors } from "@cbr/common";
import useStyles, { defaultScrollViewProps, progressStepsStyle } from "./baseSurvey.style";
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

const HealthForm = (props: IFormProps) => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        { label: "Very Poor", value: "VP" },
        { label: "Poor", value: "P" },
        { label: "Fine", value: "F" },
        { label: "Good", value: "G" },
    ]);
    const [satisfyOpen, setSatisfyOpen] = useState(false);
    const [satisfyValue, setSatisfyValue] = useState(null);
    const [needDeviceOpen, setNeedDeviceOpen] = useState(false);
    const [needDeviceValue, setNeedDeviceValue] = useState(null);
    const [needDeviceItems, setNeedDeviceItems] = useState([
        { label: "Very Poor", value: "VP" },
        { label: "Poor", value: "P" },
        { label: "Fine", value: "F" },
        { label: "Good", value: "G" },
    ]);
    return (
        <View style={{ flex: 1, position: "relative" }}>
            <Text>Rate your general health {"\n"}</Text>
            <DropDownPicker
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
            />
            <Checkbox.Item
                key={FormField.getService}
                label={fieldLabels[FormField.getService]}
                status={initialValues[FormField.getService] ? "checked" : "unchecked"}
            />
            <Checkbox.Item
                key={FormField.needService}
                label={fieldLabels[FormField.needService]}
                status={initialValues[FormField.needService] ? "checked" : "unchecked"}
            />
            <Checkbox.Item
                key={FormField.haveDevice}
                label={fieldLabels[FormField.haveDevice]}
                status={initialValues[FormField.haveDevice] ? "checked" : "unchecked"}
            />
            <Checkbox.Item
                key={FormField.deviceWorking}
                label={fieldLabels[FormField.deviceWorking]}
                status={initialValues[FormField.deviceWorking] ? "checked" : "unchecked"}
            />
            <Checkbox.Item
                key={FormField.needDevice}
                label={fieldLabels[FormField.needDevice]}
                status={initialValues[FormField.needDevice] ? "checked" : "unchecked"}
            />
            <Text>What assistive device do you need? {"\n"}</Text>
            <DropDownPicker
                open={satisfyOpen}
                value={satisfyValue}
                items={items}
                setOpen={setSatisfyOpen}
                setValue={setSatisfyValue}
                setItems={setItems}
            />

            <Text>Are you satisfied with the health services you receive?{"\n"}</Text>

            <DropDownPicker
                open={needDeviceOpen}
                value={needDeviceValue}
                items={needDeviceItems}
                setOpen={setNeedDeviceOpen}
                setValue={setNeedDeviceValue}
                setItems={setNeedDeviceItems}
                badgeColors={themeColors.blueBgDark}
            />
        </View>
    );
};
const EducationForm = (props: IFormProps) => {
    return (
        <View>
            <Text>This is the test!</Text>
        </View>
    );
};

const SocialForm = () => {
    return <Text>This is the test!</Text>;
};

const FoodForm = (props: IFormProps) => {
    return <Text>This is the test!</Text>;
};

const LivelihoodForm = (props: IFormProps) => {
    return <Text>This is the test!</Text>;
};

const EmpowermentForm = (props: IFormProps) => {
    return <Text>This is the test!</Text>;
};

const ShelterForm = () => {
    return <Text>This is the test!</Text>;
};

const BaseSurvey = () => {
    const [step, setStep] = useState<number>(0);
    const [submissionError, setSubmissionError] = useState(false);
    const history = useHistory();
    const styles = useStyles();
    const hideAlert = () => setSubmissionError(false);
    const showAlert = () => setSubmissionError(true);

    const isFinalStep = step + 1 === surveyTypes.length && step !== 0;
    const prevStep = () => setStep(step - 1);
    const nextStep = (values: any, helpers: FormikHelpers<any>) => {
        if (isFinalStep) {
            handleSubmit(values, helpers, setSubmissionError);
        } else {
            if (step === 0) {
                // helpers.setFieldValue(`${[FormField.client]}`, clientId);
            }
            setStep(step + 1);
            helpers.setSubmitting(false);
            helpers.setTouched({});
        }
    };

    const surveySteps: ISurvey[] = [
        {
            label: "Health",
            Form: (formikProps) => HealthForm(formikProps),
            validationSchema: healthValidationSchema,
        },
        {
            label: "Education (under 18)",
            Form: (formikProps) => EducationForm(formikProps),
            validationSchema: educationValidationSchema,
        },
        {
            label: "Social",
            Form: () => SocialForm(),
            validationSchema: emptyValidationSchema,
        },
        {
            label: "Livelihood (over 16)",
            Form: (formikProps) => LivelihoodForm(formikProps),
            validationSchema: livelihoodValidationSchema,
        },
        {
            label: "Food and Nutrition",
            Form: (formikProps) => FoodForm(formikProps),
            validationSchema: foodValidationSchema,
        },
        {
            label: "Empowerment",
            Form: (formikProps) => EmpowermentForm(formikProps),
            validationSchema: empowermentValidationSchema,
        },
        {
            label: "Shelter and Care",
            Form: () => ShelterForm(),
            validationSchema: emptyValidationSchema,
        },
    ];
    return (
        <Formik
            initialValues={initialValues}
            // validationSchema={surveySteps[step].validationSchema}
            onSubmit={nextStep}
            enableReinitialize
        >
            {(formikProps) => (
                <View style={styles.container}>
                    <ProgressSteps {...progressStepsStyle}>
                        {surveySteps.map((surveyStep, index) => (
                            <ProgressStep
                                label={surveyStep.label}
                                scrollViewProps={defaultScrollViewProps}
                                previousBtnTextStyle={styles.buttonTextStyle}
                                nextBtnTextStyle={styles.buttonTextStyle}
                                nextBtnStyle={styles.nextButton}
                                previousBtnStyle={styles.prevButton}
                            >
                                <ScrollView>
                                    <surveyStep.Form formikProps={formikProps} />
                                </ScrollView>
                            </ProgressStep>
                        ))}
                    </ProgressSteps>
                </View>
            )}
        </Formik>
    );
};

export default BaseSurvey;
