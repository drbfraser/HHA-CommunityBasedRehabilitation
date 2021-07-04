import { apiFetch, APILoadError, Endpoint, getZones, IZone, TZoneMap, useZones } from "@cbr/common";

export type fetchZones = {
    id: number;
    zone: string;
};

export const fetchZonesFromApi = async (): //possible search conditions
Promise<fetchZones[]> => {
    const zones = await getZones();
    const urlParams = new URLSearchParams();
    const resp = await apiFetch(Endpoint.ZONES, "?" + urlParams.toString());
    const responseRows: IZone[] = await resp.json();
    //var fetchedList = new Array<fetchZones>();
    return responseRows.map((responseRow: IZone) => ({
        id: responseRow.id,
        zone: zones.get(responseRow.id) ?? "",
    }));
};
