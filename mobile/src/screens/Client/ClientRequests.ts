import { apiFetch, APILoadError, Endpoint, getZones } from "@cbr/common";
import { IClient } from "../../util/clients";
import { riskLevels } from "../../util/risks";
export type Client = {
    id: number,
    first_name: string,
    last_name: string,
    //birthdate: number,
    village: string,
    phoneNumber: string,
    //disabilities: string,
}

export const fetchClientDetailsFromApi = async (clientId: number):Promise<Client> => {
    const urlParams = ""+clientId;
    const resp = await apiFetch(Endpoint.CLIENT, urlParams);
    const response: IClient = await resp.json();
    return ({
        id: response.id,
        first_name: response.first_name,
        last_name: response.last_name,
        //birthdate: response.birth_date,
        village: response.village,
        phoneNumber: response.phone_number,
        //disabilities: response.disability,
      })
};