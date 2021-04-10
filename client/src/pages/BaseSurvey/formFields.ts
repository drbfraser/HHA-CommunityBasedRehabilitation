import * as Yup from "yup";

export enum FormField {
    client = "client",

    health = "health",
    rateLevel = "rate_level",
    getService = "get_service",
    needService = "need_service",
    haveDevice = "have_device",
    deviceWorking = "device_working",
    needDevice = "need_device",
    deviceType = "device_type",
    serviceSatisf = "service_satisf",

    education = "education",
    goSchool = "go_school",
    grade = "grade",
    reasonNotSchool = "reason_not_school",
    beenSchool = "been_school",
    wantSchool = "want_school",

    social = "social",
    feelValue = "feel_value",
    feelIndependent = "feel_independent",
    ableInSocial = "able_in_social",
    disabiAffectSocial = "disability_affect_social",
    disabiDiscrimination = "disability_discrimination",

    livelihood = "livelihood",
    isWorking = "is_working",
    job = "job",
    isSelfEmployed = "is_employed",
    meetFinanceNeeds = "meet_finance_needs",
    disabiAffectWork = "disability_affect_work",
    wantWork = "want_work",

    foodAndNutrition = "food_nutrition",
    foodSecurityRate = "food_security",
    enoughFoodPerMonth = "enough_food_per_month",
    isChild = "is_child",
    childNourish = "child_nourish",

    empowerment = "empowerment",
    memOfOrgan = "mem_of_organ",
    organization = "organization",
    awareRight = "aware_right",
    ableInfluence = "able_influence",

    shelterAndCare = "shelter_care",
    haveShelter = "have_shelter",
    accessItem = "access_item",
}
export const servicesTypes = [FormField.health, FormField.education, FormField.social];

export const fieldLabels = {
    [FormField.client]: "Client",
    [FormField.rateLevel]: "Health Level",

    [FormField.health]: "Health",
    [FormField.getService]:
        "I have access to rehabilitation services (e.g physiotherapy, speech therapy, training how to use assistive device)",
    [FormField.needService]: "I need access to rehabilitation services",
    [FormField.haveDevice]:
        "I have an assistive device (e.g wheelchair, crutches, prosthetic limbs, hearing aid)",
    [FormField.deviceWorking]: "My assistive device is working well",
    [FormField.needDevice]: "I need an assistive device",
    [FormField.deviceType]: "Assistive Device",
    [FormField.serviceSatisf]: "Satisfied Rate",

    [FormField.education]: "Education",
    [FormField.goSchool]: "I go to school",
    [FormField.grade]: "Grade",
    [FormField.reasonNotSchool]: "Reason",
    [FormField.beenSchool]: "I have been to school before",
    [FormField.wantSchool]: "I want to go to school",

    [FormField.social]: "Social",
    [FormField.feelValue]: "I feel valued as a member of my community",
    [FormField.feelIndependent]: "I feel independent",
    [FormField.ableInSocial]:
        "I am able to participate in community/social events (going to church, market, meeting friends)",
    [FormField.disabiAffectSocial]: "My disability affects my ability to interact socially",
    [FormField.disabiDiscrimination]: "I have experienced discrimination because of my disability",

    [FormField.livelihood]: "Livelihood",
    [FormField.isWorking]: "I am working",
    [FormField.job]: "Job",
    [FormField.meetFinanceNeeds]: "This meets my financial needs",
    [FormField.disabiAffectWork]: "My disability affects my ability to go to work",
    [FormField.wantWork]: "I want to work",
    [FormField.isSelfEmployed]: "I am",

    [FormField.foodAndNutrition]: "Food and Nutrition",
    [FormField.foodSecurityRate]: "Rate",
    [FormField.enoughFoodPerMonth]: "I have enough food every month",
    [FormField.isChild]: "I am a child or have a child",
    [FormField.childNourish]: "Nourishment",

    [FormField.empowerment]: "Empowerment",
    [FormField.memOfOrgan]:
        "I am a member of some organisations which assist people with disabilities",
    [FormField.organization]: "Organization",
    [FormField.awareRight]: "I am aware of my rights as a citizen living with disabilities",
    [FormField.ableInfluence]: "I feel like I am able to influence people around me",

    [FormField.shelterAndCare]: "Shelter and Care",
    [FormField.haveShelter]: "I have adequate shelter",
    [FormField.accessItem]: "I have access to essential items for my household",
};

export const initialValues = {
    [FormField.client]: 0,

    [FormField.rateLevel]: "",
    [FormField.getService]: false,
    [FormField.needService]: false,
    [FormField.haveDevice]: false,
    [FormField.deviceWorking]: false,
    [FormField.needDevice]: false,
    [FormField.deviceType]: "",
    [FormField.serviceSatisf]: "",

    [FormField.goSchool]: false,
    [FormField.grade]: 0,
    [FormField.reasonNotSchool]: "",
    [FormField.beenSchool]: false,
    [FormField.wantSchool]: false,

    [FormField.feelValue]: false,
    [FormField.feelIndependent]: false,
    [FormField.ableInSocial]: false,
    [FormField.disabiAffectSocial]: false,
    [FormField.disabiDiscrimination]: false,

    [FormField.isWorking]: false,
    [FormField.job]: "",
    [FormField.isSelfEmployed]: "",
    [FormField.meetFinanceNeeds]: false,
    [FormField.disabiAffectWork]: false,
    [FormField.wantWork]: false,

    [FormField.foodSecurityRate]: "",
    [FormField.enoughFoodPerMonth]: false,
    [FormField.isChild]: false,
    [FormField.childNourish]: "",

    [FormField.memOfOrgan]: false,
    [FormField.organization]: "",
    [FormField.awareRight]: false,
    [FormField.ableInfluence]: false,

    [FormField.haveShelter]: false,
    [FormField.accessItem]: false,
};

export const emptyValidationSchema = () => Yup.object().shape({});

export const healthValidationSchema = () =>
    Yup.object().shape({
        [FormField.deviceType]: Yup.string().label(fieldLabels[FormField.deviceType]),
        [FormField.rateLevel]: Yup.string().label(fieldLabels[FormField.rateLevel]),
    });

export const educationValidationSchema = () =>
    Yup.object().shape({
        [FormField.grade]: Yup.string().label(fieldLabels[FormField.grade]),
        [FormField.reasonNotSchool]: Yup.string().label(fieldLabels[FormField.reasonNotSchool]),
    });

export const livelihoodValidationSchema = () =>
    Yup.object().shape({
        [FormField.job]: Yup.string().label(fieldLabels[FormField.job]).max(50),
        [FormField.isSelfEmployed]: Yup.string().label(fieldLabels[FormField.isSelfEmployed]),
    });

export const foodValidationSchema = () =>
    Yup.object().shape({
        [FormField.rateLevel]: Yup.string().label(fieldLabels[FormField.rateLevel]),
        [FormField.childNourish]: Yup.string().label(fieldLabels[FormField.rateLevel]),
    });

export const empowermentValidationSchema = () =>
    Yup.object().shape({
        [FormField.organization]: Yup.string().label(fieldLabels[FormField.organization]).max(50),
    });

export type TFormValues = typeof initialValues;
