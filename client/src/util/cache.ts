import { apiFetch, Endpoint } from "./endpoints";

export interface IZone {
    id: number;
    zone_name: string;
}

export interface IDisability {
    id: number;
    disability_type: string;
}

let zones: IZone[] | undefined = undefined;
let zoneMap: Map<number, string> | undefined = undefined;

let disabilities: IDisability[] | undefined = undefined;
let disabilityMap: Map<number, string> | undefined = undefined;

export const getAllZones = async (): Promise<IZone[]> => {
    if (zones === undefined) {
        zones = await apiFetch(Endpoint.ZONES)
            .then(async (response: Response) => await response.json())
            .catch(() => []);
    }
    return zones!;
};

export const getZoneMap = async (): Promise<Map<number, string>> => {
    if (zoneMap === undefined) {
        let zones = await getAllZones();
        zoneMap = new Map(
            zones.map<[number, string]>((zone) => [zone.id, zone.zone_name])
        );
    }
    return zoneMap;
};

export const getAllDisabilities = async(): Promise<IDisability[]> => {
    if (disabilities === undefined) {
        disabilities = await apiFetch(Endpoint.DISABILITIES)
            .then(async (response:Response) => await response.json())
            .catch(()=> []);
    }
    return disabilities!;
}

export const getDisabilitiesMap = async (): Promise<Map<number,string>> => {
    if (disabilityMap === undefined) {
        let disabilities = await getAllDisabilities();
        disabilityMap = new Map(
            disabilities.map<[number, string]>((disabilities) => [disabilities.id, disabilities.disability_type])
        );
    }
    return disabilityMap;
}