import { apiFetch, APILoadError, Endpoint, getZones } from "@cbr/common";
import { IClientSummary } from "@cbr/common";
import { riskLevels } from "@cbr/common";
export type ClientTest = {
    id: number;
    full_name: string;
    zone: string;
    HealthLevel: string;
    EducationLevel: string;
    SocialLevel: string;
};

export const fetchClientsFromApi = async (selectedSearchOption, searchQuery:string): //possible search conditions
Promise<ClientTest[]> => {

    const zones = await getZones();
    const urlParams = new URLSearchParams();
    const resp = await apiFetch(Endpoint.CLIENTS, "?" + urlParams.toString());
    const responseRows: IClientSummary[] = await resp.json();
    var resultRow = responseRows.map((responseRow: IClientSummary) => ({
        id: responseRow.id,
        full_name: responseRow.full_name,
        zone: zones.get(responseRow.zone) ?? "",
        HealthLevel: riskLevels[responseRow.health_risk_level].color,
        EducationLevel: riskLevels[responseRow.educat_risk_level].color,
        SocialLevel: riskLevels[responseRow.social_risk_level].color,
    }));
    console.log(resultRow.length)
    if(selectedSearchOption == "full_name" || selectedSearchOption =="zone" && searchQuery.length!=0){
        var resultRow = resultRow.filter(function(value, index, arr){ 
            return value[selectedSearchOption].includes(searchQuery);
        })
    }
    else if(selectedSearchOption == "id" && searchQuery.length!=0){
        const selectedId = Number(searchQuery)
        if(selectedId != NaN){
            var resultRow = resultRow.filter(function(value, index, arr){ 
                return value.id == selectedId;
            });
        }
    }
    return resultRow
};
