import { apiFetch, APILoadError, Endpoint, getZones, IReferral, ISurvey } from "@cbr/common";
import { IClient } from "../../util/clients";
import { IVisitSummary } from "../../util/visits";

export type ClientDTO = {
    id: number;
    first_name: string;
    last_name: string;
    birthdate: number | string;
    village: string;
    gender: string;
    phoneNumber: string;
    zone: number;
    disabilities: number[];
    careGiverPresent: boolean;
    careGiverName: string;
    careGiverEmail: string;
    careGiverPhoneNumber: string;
    clientCreatedDate: number;
    clientVisits: IVisitSummary[];
    clientReferrals: IReferral[];
    clientSurveys: ISurvey[];
};

export const fetchClientDetailsFromApi = async (clientId: number): Promise<ClientDTO> => {
    const urlParams = "" + clientId;
    const resp = await apiFetch(Endpoint.CLIENT, urlParams);
    const response: IClient = await resp.json();
    return {
        id: response.id,
        first_name: response.first_name,
        last_name: response.last_name,
        birthdate: response.birth_date,
        village: response.village,
        gender: response.gender,
        phoneNumber: response.phone_number,
        zone: response.zone,
        disabilities: response.disability,
        careGiverPresent: response.caregiver_present,
        careGiverName: response.caregiver_name,
        careGiverEmail: response.caregiver_email,
        careGiverPhoneNumber: response.caregiver_phone,
        clientCreatedDate: response.created_date,
        clientVisits: response.visits,
        clientReferrals: response.referrals,
        clientSurveys: response.baseline_surveys,
    };
};
