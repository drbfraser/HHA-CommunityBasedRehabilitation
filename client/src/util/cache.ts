import { apiFetch, Endpoint } from "./endpoints";

export interface IZone {
    id: number;
    zone_name: string;
}

let zones: IZone[] | undefined = undefined;

export const getAllZones = async (): Promise<IZone[]> => {
    if (zones === undefined) {
        zones = await apiFetch(Endpoint.ZONES)
            .then(async (response: Response) => await response.json())
            .catch(() => []);
    }
    return zones!;
};
