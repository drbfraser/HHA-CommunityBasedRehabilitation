import { apiFetch, Endpoint, IReferral, ISurvey } from "@cbr/common";
import { IClient } from "@cbr/common";

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
        user_id: response.user_id,
        created_at: response.created_at,
        updated_at: response.updated_at,
        longitude: response.longitude,
        latitude: response.latitude,
        zone: response.zone,
        village: response.village,
        picture: response.picture,
        caregiver_present: response.caregiver_present,
        caregiver_name: response.caregiver_name,
        caregiver_email: response.caregiver_email,
        caregiver_phone: response.caregiver_phone,
        risks: response.risks,
        visits: response.visits,
        referrals: response.referrals,
        baseline_surveys: response.baseline_surveys,
    };
};
