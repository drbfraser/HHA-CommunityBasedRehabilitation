import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { Text, Divider, Appbar } from "react-native-paper";
import {
    educationValidationSchema,
    empowermentValidationSchema,
    emptyValidationSchema,
    foodValidationSchema,
    BaseSurveyFormField,
    healthValidationSchema,
    IFormProps,
    baseInitialValues,
    livelihoodValidationSchema,
    surveyTypes,
    themeColors,
} from "@cbr/common";
import { Formik, FormikHelpers } from "formik";
import { ProgressSteps, ProgressStep } from "react-native-progress-steps";
import useStyles, { defaultScrollViewProps, progressStepsStyle } from "./baseSurvey.style";
import HealthForm from "./SurveyForm/HealthForm";
import EducationForm from "./SurveyForm/EducationForm";
import SocialForm from "./SurveyForm/SocialForm";
import LivelihoodForm from "./SurveyForm/LivelihoodFom";
import EmpowermentForm from "./SurveyForm/EmpowermentForm";
import ShelterForm from "./SurveyForm/ShelterForm";
import FoodForm from "./SurveyForm/FoodForm";
import { handleSubmit } from "./formHandler";
import { useParams } from "react-router-dom";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { StackParamList } from "../../util/stackScreens";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackScreenName } from "../../util/StackScreenName";

interface ISurvey {
    label: string;
    Form: (props: IFormProps) => JSX.Element;
    validationSchema: () => any;
}
interface IBaseSurveyProps {
    clientID: number;
    route: RouteProp<StackParamList, StackScreenName.BASE_SURVEY>;
    navigation: StackNavigationProp<StackParamList, StackScreenName.BASE_SURVEY>;
}

const BaseSurvey = (props: IBaseSurveyProps) => {
    const [step, setStep] = useState<number>(0);
    const [submissionError, setSubmissionError] = useState(false);
    const styles = useStyles();
    const [stepChecked, setStepChecked] = useState([false]);
    const isFinalStep = step + 1 === surveyTypes.length && step !== 0;
    const clientId = props.route.params.clientID;
    useEffect(() => {
        props.navigation.setOptions({
            headerShown: true,
            header: (stackHeaderProps) => (
                <Appbar.Header statusBarHeight={0}>
                    <Appbar.BackAction onPress={() => stackHeaderProps.navigation.goBack()} />
                    <Appbar.Content title="Baseline Survey" />
                </Appbar.Header>
            ),
        });
    }, []);

    const prevStep = () => {
        setStep(step - 1);
    };

    const nextStep = (values: any, helpers: FormikHelpers<any>) => {
        if (isFinalStep) {
            handleSubmit(values, helpers, setSubmissionError).then(() => {
                props.navigation.pop(1);
                props.navigation.navigate(StackScreenName.CLIENT, {
                    clientID: clientId,
                });
            });
        } else {
            if (step === 0) {
                if (stepChecked.length < surveySteps.length - 1) {
                    for (let i = 1; i < surveySteps.length - 1; i++) {
                        stepChecked.push(false);
                    }
                }
                helpers.setFieldValue(`${[BaseSurveyFormField.client]}`, clientId);
            }
            if ((step === 0 || step === 3) && !stepChecked[step]) {
                helpers.setTouched({});
            }
            let newArr = [...stepChecked];
            newArr[step] = true;
            setStepChecked(newArr);
            setStep(step + 1);
            helpers.setSubmitting(false);
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
            Form: (formikProps) => SocialForm(formikProps),
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
            Form: (formikProps) => ShelterForm(formikProps),
            validationSchema: emptyValidationSchema,
        },
    ];

    return (
        <Formik
            initialValues={baseInitialValues}
            validationSchema={surveySteps[step].validationSchema}
            onSubmit={nextStep}
            enableReinitialize
        >
            {(formikProps) => (
                <>
                    <View style={styles.container}>
                        <ProgressSteps {...progressStepsStyle}>
                            {surveySteps.map((surveyStep, index) => (
                                <ProgressStep
                                    key={index}
                                    scrollViewProps={defaultScrollViewProps}
                                    previousBtnTextStyle={styles.buttonTextStyle}
                                    nextBtnTextStyle={styles.buttonTextStyle}
                                    nextBtnStyle={styles.nextButton}
                                    onNext={() => {
                                        nextStep(formikProps.values, formikProps);
                                    }}
                                    nextBtnDisabled={
                                        Object.keys(formikProps.errors).length !== 0 ||
                                        (Object.keys(formikProps.touched).length === 0 &&
                                            !stepChecked[step])
                                    }
                                    onPrevious={prevStep}
                                    previousBtnStyle={styles.prevButton}
                                    onSubmit={() => nextStep(formikProps.values, formikProps)}
                                >
                                    <Text style={styles.stepLabelText}>{surveyStep.label}</Text>
                                    <Divider style={{ backgroundColor: themeColors.blueBgDark }} />
                                    <ScrollView>
                                        <surveyStep.Form formikProps={formikProps} />
                                    </ScrollView>
                                </ProgressStep>
                            ))}
                        </ProgressSteps>
                    </View>
                </>
            )}
        </Formik>
    );
};

export default BaseSurvey;
