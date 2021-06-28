import { apiFetch, APILoadError, Endpoint, getZones } from "@cbr/common";
import { IClientSummary } from "../../util/clients";
import { riskLevels } from "../../util/risks";
export type ClientTest = {
    id: number;
    full_name: string;
    zone: string;
    HealthLevel: string;
    EducationLevel: string;
    SocialLevel: string;
};

export const fetchClientsFromApi = async (): //possible search conditions
Promise<ClientTest[]> => {
    const zones = await getZones();
    const urlParams = new URLSearchParams();
    const resp = await apiFetch(Endpoint.CLIENTS, "?" + urlParams.toString());
    const responseRows: IClientSummary[] = await resp.json();
    //var fetchedList = new Array<ClientTest>();
    return responseRows.map((responseRow: IClientSummary) => ({
        id: responseRow.id,
        full_name: responseRow.full_name,
        zone: zones.get(responseRow.zone) ?? "",
        HealthLevel: riskLevels[responseRow.health_risk_level].color,
        EducationLevel: riskLevels[responseRow.educat_risk_level].color,
        SocialLevel: riskLevels[responseRow.social_risk_level].color,
    }));
};
