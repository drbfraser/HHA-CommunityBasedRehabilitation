import { apiFetch, Endpoint } from "./endpoints";

export interface IZone {
    id: number;
    zone_name: string;
}

let zones: IZone[] | undefined = undefined;
let zoneMap: Map<number, string> | undefined = undefined;

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
