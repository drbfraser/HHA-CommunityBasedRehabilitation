import React, { useRef, useState } from "react";
import { Alert, SafeAreaView, ScrollView, TouchableOpacity, View } from "react-native";
import {
    Text,
    Title,
    Button,
    Checkbox,
    Dialog,
    Portal,
    Paragraph,
    Appbar,
    Menu,
    TextInput,
    TouchableRipple,
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
import { Picker } from "@react-native-community/picker";
// import Checkbox from "@react-native-community/checkbox";
import useStyles, { defaultScrollViewProps, progressStepsStyle } from "./baseSurvey.style";
import DialogWithRadioBtns from "../../../util/DialogWithRadioBtn";
import TextCheckBox from "../../../util/TextCheckBox";
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
type ButtonVisibility = {
    [key: string]: boolean | undefined;
};

const HealthForm = (props: IFormProps) => {
    const [visible, setVisible] = React.useState<ButtonVisibility>({});
    const styles = useStyles();
    const _toggleDialog = (name: string) => () =>
        setVisible({ ...visible, [name]: !visible[name] });
    const _getVisible = (name: string) => !!visible[name];

    return (
        <View style={{ flex: 1, position: "relative" }}>
            <Text style={{ fontSize: 15 }}>Rate your general health {"\n"}</Text>
            <Button mode="contained" onPress={_toggleDialog("dialog2")}>
                Choose Health Rate
            </Button>
            <Text />
            <DialogWithRadioBtns
                visible={_getVisible("dialog2")}
                close={_toggleDialog("dialog2")}
            />
            <TouchableRipple
                onPress={() =>
                    props.formikProps.setFieldValue(
                        FormField.getService,
                        !props.formikProps.values.get_service
                    )
                }
            >
                <View style={styles.checkBoxText}>
                    <View pointerEvents="none">
                        <Checkbox
                            status={props.formikProps.values.get_service ? "checked" : "unchecked"}
                        />
                    </View>
                    <Paragraph>{fieldLabels[FormField.getService]}</Paragraph>
                </View>
            </TouchableRipple>
            <TouchableRipple
                onPress={() =>
                    props.formikProps.setFieldValue(
                        FormField.needService,
                        !props.formikProps.values.need_service
                    )
                }
            >
                <View style={styles.checkBoxText}>
                    <View pointerEvents="none">
                        <Checkbox
                            status={props.formikProps.values.need_service ? "checked" : "unchecked"}
                        />
                    </View>
                    <Paragraph>{fieldLabels[FormField.needService]}</Paragraph>
                </View>
            </TouchableRipple>
            <TouchableRipple
                onPress={() =>
                    props.formikProps.setFieldValue(
                        FormField.haveDevice,
                        !props.formikProps.values.have_device
                    )
                }
            >
                <View style={styles.checkBoxText}>
                    <View pointerEvents="none">
                        <Checkbox
                            status={props.formikProps.values.have_device ? "checked" : "unchecked"}
                        />
                    </View>
                    <Paragraph>{fieldLabels[FormField.haveDevice]}</Paragraph>
                </View>
            </TouchableRipple>
            <TouchableRipple
                onPress={() =>
                    props.formikProps.setFieldValue(
                        FormField.deviceWorking,
                        !props.formikProps.values.device_working
                    )
                }
            >
                <View style={styles.checkBoxText}>
                    <View pointerEvents="none">
                        <Checkbox
                            status={
                                props.formikProps.values.device_working ? "checked" : "unchecked"
                            }
                        />
                    </View>
                    <Paragraph>{fieldLabels[FormField.deviceWorking]}</Paragraph>
                </View>
            </TouchableRipple>
            <TouchableRipple
                onPress={() =>
                    props.formikProps.setFieldValue(
                        FormField.needDevice,
                        !props.formikProps.values.need_device
                    )
                }
            >
                <View style={styles.checkBoxText}>
                    <View pointerEvents="none">
                        <Checkbox
                            status={props.formikProps.values.need_device ? "checked" : "unchecked"}
                        />
                    </View>
                    <Paragraph>{fieldLabels[FormField.needDevice]}</Paragraph>
                </View>
            </TouchableRipple>
            <Text />

            {props.formikProps.values[FormField.needDevice] && (
                <View>
                    <Text style={{ fontSize: 15 }}>What assistive device do you need? {"\n"}</Text>
                    <Button mode="contained" onPress={_toggleDialog("dialog2")}>
                        Choose device type
                    </Button>
                    <DialogWithRadioBtns
                        visible={_getVisible("dialog3")}
                        close={_toggleDialog("dialog3")}
                    />
                </View>
            )}

            <Text />
            <Text style={{ fontSize: 15 }}>
                Are you satisfied with the health services you receive?{"\n"}
            </Text>

            <Button mode="contained" onPress={_toggleDialog("dialog2")}>
                Choose Satisfied Rate
            </Button>
            <DialogWithRadioBtns
                visible={_getVisible("dialog2")}
                close={_toggleDialog("dialog2")}
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
                    {/* <TextCheckBox field={FormField.needDevice} formikProps={formikProps} /> */}
                    {/* <TouchableRipple
                        onPress={() =>
                            formikProps.setFieldValue(
                                FormField.needDevice,
                                !formikProps.values.need_device
                            )
                        }
                    >
                        <View style={styles.checkBoxText}>
                            <Paragraph>{fieldLabels[FormField.needDevice]}</Paragraph>
                            <View pointerEvents="none">
                                <Checkbox
                                    status={
                                        formikProps.values.need_device ? "checked" : "unchecked"
                                    }
                                />
                            </View>
                        </View>
                    </TouchableRipple> */}

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
