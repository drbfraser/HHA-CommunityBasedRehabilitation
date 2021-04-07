import * as Yup from "yup";

export enum FormField {
    client = "client",

    health = "health",
    rateLevel = "rate_level",
    getService = "get_service",
    needService = "need_service",
    haveDevice = "have_device",
    deviceWoking = "device_working",
    needDevice = "need_device",
    deviceType = "device_type",
    deviceSatisf = "device_satisf",

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
        "Do you have access to rehabilitation services (e.g physiotherapy, speech therapy, training how to use assistive device)?",
    [FormField.needService]: "Do you need access to rehabilitation services?",
    [FormField.haveDevice]:
        "Do you have an assistive device(e.g wheelchair, crutches, prosthetic limbs, hearing aid)?",
    [FormField.deviceWoking]: "Is your assistive device working well?",
    [FormField.needDevice]: "Do you need an assistive device?",
    [FormField.deviceType]: "Assistive Device",
    [FormField.deviceSatisf]: "Satisfied Rate",

    [FormField.education]: "Education",
    [FormField.goSchool]: "Do you go to school?",
    [FormField.grade]: "Grade",
    [FormField.reasonNotSchool]: "Reason",
    [FormField.beenSchool]: "Have you ever been to school before?",
    [FormField.wantSchool]: "Do you want to go to school?",

    [FormField.social]: "Social",
    [FormField.feelValue]: "Do you feel valued as a member of your community?",
    [FormField.feelIndependent]: "Do you feel independent?",
    [FormField.ableInSocial]:
        "Are you able to participate in community/social events (going to church, market, meeting friends)?",
    [FormField.disabiAffectSocial]:
        "Does your disability affect your ability to interact socially?",
    [FormField.disabiDiscrimination]:
        "Have you experienced discrimination because of your disability?",

    [FormField.livelihood]: "Livelihood",
    [FormField.isWorking]: "Are you working?",
    [FormField.job]: "Job",
    [FormField.meetFinanceNeeds]: "Does this meet your financial needs?",
    [FormField.disabiAffectWork]: "Does your disability affect your ability to go to work?",
    [FormField.wantWork]: "Do you want to work?",
    [FormField.isSelfEmployed]: "",

    [FormField.foodAndNutrition]: "Food and Nutrition",
    [FormField.foodSecurityRate]: "Rate",
    [FormField.enoughFoodPerMonth]: "Do you have enough food every month",
    [FormField.isChild]: "Is the client child?",
    [FormField.childNourish]: "Nourishment",

    [FormField.empowerment]: "Empowerment",
    [FormField.memOfOrgan]:
        "Are you member of any organisations which assist people with disabilities?",
    [FormField.awareRight]: "Are you aware of your rights as a citizen living with disabilities?",
    [FormField.ableInfluence]: "Do you feel like you are able to influence people around you?",

    [FormField.shelterAndCare]: "Shelter and Care",
    [FormField.haveShelter]: "Do you have adequate shelter?",
    [FormField.accessItem]: "Do you have access to essential items for your household?",
};

export const initialValues = {
    [FormField.client]: 0,

    [FormField.rateLevel]: "",
    [FormField.getService]: false,
    [FormField.needService]: false,
    [FormField.haveDevice]: false,
    [FormField.deviceWoking]: false,
    [FormField.needDevice]: false,
    [FormField.deviceType]: "",

    [FormField.goSchool]: false,
    [FormField.grade]: "",
    [FormField.reasonNotSchool]: "",
    [FormField.beenSchool]: false,
    [FormField.wantSchool]: false,

    [FormField.feelValue]: false,
    [FormField.feelIndependent]: "",
    [FormField.ableInSocial]: "",
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
    [FormField.awareRight]: false,
    [FormField.ableInfluence]: false,

    [FormField.haveShelter]: false,
    [FormField.accessItem]: false,
};

export const initialValidationSchema = () => Yup.object().shape({});

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

export type TFormValues = typeof initialValues;
