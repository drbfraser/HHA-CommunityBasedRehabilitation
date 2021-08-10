import { FormikHelpers } from "formik";
import { ReferralFormField, ReferralFormValues } from "./referralFields";
import { apiFetch, Endpoint } from "../../util/endpoints";
import { getDisabilities, getOtherDisabilityId } from "../../util/hooks/disabilities";

const addReferral = async (referralInfo: string) => {
    const init: RequestInit = {
        method: "POST",
        body: referralInfo,
    };

    return await apiFetch(Endpoint.REFERRALS, "", init)
        .then((res) => res.json())
        .then((res) => res);
};

export const referralHandleSubmit = async (values: ReferralFormValues) => {
    const disabilities = await getDisabilities();

    const newReferral = JSON.stringify({
        client: values[ReferralFormField.client],
        wheelchair: values[ReferralFormField.wheelchair],
        wheelchair_experience: values[ReferralFormField.wheelchair]
            ? values[ReferralFormField.wheelchairExperience]
            : "",
        hip_width: values[ReferralFormField.wheelchair] ? values[ReferralFormField.hipWidth] : 0,
        wheelchair_owned: values[ReferralFormField.wheelchair]
            ? values[ReferralFormField.wheelchairOwned]
            : false,
        wheelchair_repairable:
            values[ReferralFormField.wheelchair] && values[ReferralFormField.wheelchairOwned]
                ? values[ReferralFormField.wheelchairRepairable]
                : false,
        physiotherapy: values[ReferralFormField.physiotherapy],
        condition: values[ReferralFormField.physiotherapy]
            ? Number(values[ReferralFormField.condition]) === getOtherDisabilityId(disabilities)
                ? values[ReferralFormField.conditionOther]
                : disabilities.get(Number(values[ReferralFormField.condition]))
            : "",
        prosthetic: values[ReferralFormField.prosthetic],
        prosthetic_injury_location: values[ReferralFormField.prosthetic]
            ? values[ReferralFormField.prostheticInjuryLocation]
            : "",
        orthotic: values[ReferralFormField.orthotic],
        orthotic_injury_location: values[ReferralFormField.orthotic]
            ? values[ReferralFormField.orthoticInjuryLocation]
            : "",
        services_other: values[ReferralFormField.servicesOther]
            ? values[ReferralFormField.otherDescription]
            : "",
    });

    return await addReferral(newReferral);
};
