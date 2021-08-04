import { IReferral, IRisk, ISurvey, IVisit, IVisitSummary, Validation } from "@cbr/common";
import { FormikProps } from "formik";
import * as Yup from "yup";
import { Platform, ToastAndroid, AlertIOS } from "react-native";

export const showValidationErrorToast = () => {
    const msg = "Please check one or more fields.";
    if (Platform.OS === "android") {
        ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
        AlertIOS.alert(msg);
    }
};

export interface IFormProps {
    isNewClient?: boolean;
    formikProps?: FormikProps<IClientFormProps>;
}

export interface IClientFormProps {
    id?: number;
    firstName?: string;
    lastName?: string;
    birthDate?: Date;
    gender?: string;
    village?: string;
    zone?: number;
    phone?: string;
    caregiverPresent?: boolean;
    caregiverName?: string;
    caregiverEmail?: string;
    caregiverPhone?: string;
    clientDisability?: number[];
    otherDisability?: string;
    disabilityString?: string[];
    initialDisabilityArray?: string[];
    createdDate?: number;
    createdByUser: number;
    longitude?: string;
    latitude?: string;
    caregiverPicture?: string;
    risks?: IRisk[];
    visits?: IVisitSummary[];
    referrals?: IReferral[];
    surveys?: ISurvey[];
}

export enum ClientFormFields {
    first_name = "firstName",
    last_name = "lastName",
    birthDate = "birthDate",
    phone = "phone",
    disability = "clientDisability",
    other_disability = "otherDisability",
    gender = "gender",
    village = "village",
    zone = "zone",
    caregiver_name = "caregiverName",
    caregiver_phone = "caregiverPhone",
    caregiver_email = "caregiverEmail",
    createdDate = "createdDate",
    createdByUser = "createdByUser",
    longitude = "longitde",
    latitude = "latitude",
    caregiverPicture = "caregiverPicture",
    risks = "risks",
    visits = "visits",
    referrals = "referrals",
    surveys = "surveys",
}

export const ClientFormFieldLabels = {
    [ClientFormFields.first_name]: "First Name",
    [ClientFormFields.last_name]: "Last Name",
    [ClientFormFields.birthDate]: "Birthdate",
    [ClientFormFields.phone]: "Phone Number",
    [ClientFormFields.disability]: "Disability",
    [ClientFormFields.other_disability]: "Other Disability",
    [ClientFormFields.gender]: "Gender",
    [ClientFormFields.village]: "Village",
    [ClientFormFields.zone]: "Zone",
    [ClientFormFields.caregiver_name]: "Caregiver Name",
    [ClientFormFields.caregiver_phone]: "Caregiver Phone",
    [ClientFormFields.caregiver_email]: "Caregiver Email",
};

export const initialValues: IClientFormProps = {
    [ClientFormFields.first_name]: "",
    [ClientFormFields.last_name]: "",
    [ClientFormFields.phone]: "",
    [ClientFormFields.disability]: [],
    [ClientFormFields.other_disability]: "",
    [ClientFormFields.gender]: "",
    [ClientFormFields.village]: "",
    [ClientFormFields.zone]: 0,
    [ClientFormFields.caregiver_name]: "",
    [ClientFormFields.caregiver_phone]: "",
    [ClientFormFields.caregiver_email]: "",
    [ClientFormFields.createdByUser]: 0,
    [ClientFormFields.latitude]: "",
    [ClientFormFields.caregiverPicture]: "",
    [ClientFormFields.risks]: [],
    [ClientFormFields.visits]: [],
    [ClientFormFields.referrals]: [],
    [ClientFormFields.surveys]: [],
};

export interface FormValues {
    id?: number;
    firstName?: string;
    lastName?: string;
    birthDate?: Date;
    gender?: string;
    village?: string;
    zone?: number;
    phone?: string;
    caregiverPresent?: boolean;
    caregiverName?: string;
    caregiverEmail?: string;
    caregiverPhone?: string;
    clientDisability?: number[];
    otherDisability?: string;
}

export const setFormInitialValues = (props: IClientFormProps, isNewClient?: boolean) => {
    if (isNewClient) {
        return initialValues;
    } else {
        const loadedInitialValues: FormValues = {
            id: props.id,
            firstName: props.firstName,
            lastName: props.lastName,
            birthDate: props.birthDate,
            gender: props.gender,
            village: props.village,
            zone: props.zone,
            phone: props.phone,
            caregiverPresent: props.caregiverPresent,
            caregiverName: props.caregiverName,
            caregiverEmail: props.caregiverEmail,
            caregiverPhone: props.caregiverPhone,
            clientDisability: props.clientDisability,
            otherDisability: props.otherDisability,
        };
        return loadedInitialValues;
    }
};

export const validationSchema = () =>
    Yup.object().shape({
        [ClientFormFields.first_name]: Yup.string()
            .label(ClientFormFieldLabels[ClientFormFields.first_name])
            .required()
            .max(50)
            .min(1),
        [ClientFormFields.last_name]: Yup.string()
            .label(ClientFormFieldLabels[ClientFormFields.last_name])
            .required()
            .max(50)
            .min(1),
        [ClientFormFields.birthDate]: Yup.date()
            .label(ClientFormFieldLabels[ClientFormFields.birthDate])
            .max(new Date(), "Birthdate cannot be in the future")
            .required(),
        [ClientFormFields.phone]: Yup.string()
            .label(ClientFormFieldLabels[ClientFormFields.phone])
            .max(50)
            .matches(Validation.phoneRegExp, "Phone number is not valid."),
        [ClientFormFields.disability]: Yup.array()
            .label(ClientFormFieldLabels[ClientFormFields.disability])
            .required()
            .min(1, "You must input at least 1 disability"),
        [ClientFormFields.other_disability]: Yup.string()
            .label(ClientFormFieldLabels[ClientFormFields.other_disability])
            .trim()
            .test(
                "require-if-other-selected",
                "Other Disability is required",
                async (other_disability, schema) =>
                    !(await Validation.otherDisabilitySelected(schema.parent.clientDisability)) ||
                    (other_disability !== undefined && other_disability.length > 0)
            )
            .test(
                "require-if-other-selected",
                "Other Disability must be at most 100 characters",
                async (other_disability, schema) =>
                    !(await Validation.otherDisabilitySelected(schema.parent.clientDisability)) ||
                    (other_disability !== undefined && other_disability.length <= 100)
            ),
        [ClientFormFields.gender]: Yup.string()
            .label(ClientFormFieldLabels[ClientFormFields.gender])
            .required(),
        [ClientFormFields.village]: Yup.string()
            .label(ClientFormFieldLabels[ClientFormFields.village])
            .required(),
        [ClientFormFields.zone]: Yup.number()
            .label(ClientFormFieldLabels[ClientFormFields.zone])
            .required()
            .typeError("Zone is a required field"),
        [ClientFormFields.caregiver_name]: Yup.string()
            .label(ClientFormFieldLabels[ClientFormFields.caregiver_name])
            .max(101),
        [ClientFormFields.caregiver_phone]: Yup.string()
            .label(ClientFormFieldLabels[ClientFormFields.caregiver_phone])
            .max(50)
            .matches(Validation.phoneRegExp, "Phone number is not valid"),
        [ClientFormFields.caregiver_email]: Yup.string()
            .label(ClientFormFieldLabels[ClientFormFields.caregiver_email])
            .max(50)
            .matches(Validation.emailRegExp, "Email Address is not valid"),
    });
