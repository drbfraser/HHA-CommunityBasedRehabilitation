import { apiFetch, Endpoint, IReferral, ISurvey } from "@cbr/common";
import { IClient } from "@cbr/common";
import { IVisitSummary } from "@cbr/common";

// export type IClient = {
//     id: number;
//     first_name: string;
//     last_name: string;
//     birthdate: number | string;
//     village: string;
//     gender: string;
//     phoneNumber: string;
//     zone: number;
//     disabilities: number[];
//     careGiverPresent: boolean;
//     careGiverName: string;
//     careGiverEmail: string;
//     careGiverPhoneNumber: string;
//     clientCreatedDate: number;
//     clientVisits?: IVisitSummary[];
//     clientReferrals?: IReferral[];
//     clientSurveys?: ISurvey[];
//     otherDisability: string;
// };

export const fetchClientDetailsFromApi = async (clientId: number): Promise<IClient> => {
    const urlParams = "" + clientId;
    const resp = await apiFetch(Endpoint.CLIENT, urlParams);
    const response: IClient = await resp.json();
    return {
        id: response.id,
        first_name: response.first_name,
        last_name: response.last_name,
        birth_date: response.birth_date,
        gender: response.gender,
        phone_number: response.phone_number,
        disability: response.disability,
        other_disability: response.other_disability,
        created_by_user: response.created_by_user,
        created_date: response.created_date,
        longitude: response.longitude,
        latitude: response.latitude,
        zone: response.zone,
        village: response.village,
        picture: response.picture,
        caregiver_present: response.caregiver_present,
        caregiver_name: response.caregiver_name,
        caregiver_email: response.caregiver_email,
        caregiver_phone: response.caregiver_phone,
        caregiver_picture: response.caregiver_picture,
        risks: response.risks,
        visits: response.visits,
        referrals: response.referrals,
        baseline_surveys: response.baseline_surveys,
    };
};
