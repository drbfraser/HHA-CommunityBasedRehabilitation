import { apiFetch, APILoadError, Endpoint, getZones } from "@cbr/common";
import { IClient } from "../../util/clients";
import { riskLevels } from "../../util/risks";
export type ClientDTO = {
    id: number;
    first_name: string;
    last_name: string;
    birthdate: number | string;
    village: string;
    phoneNumber: string;
    zone: number;
    //disabilities: string,
    careGiverPresent: boolean;
    careGiverName: string;
    careGiverEmail: string;
    careGiverPhoneNumber: string;
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
        phoneNumber: response.phone_number,
        zone: response.zone,
        //disabilities: response.disability,
        careGiverPresent: response.caregiver_present,
        careGiverName: response.caregiver_name,
        careGiverEmail: response.caregiver_email,
        careGiverPhoneNumber: response.caregiver_phone,
    };
};
