import { useEffect, useState } from "react";
import { apiFetch, Endpoint } from "util/endpoints";

export type TZoneMap = Map<number, string>;
const emptyValue: TZoneMap = new Map<number, string>();

let cachedPromise: Promise<TZoneMap> | undefined = undefined;
let cachedValue: TZoneMap | undefined = undefined;

export const getZones = async () => {
    if (!cachedPromise) {
        interface IZone {
            id: number;
            zone_name: string;
        }

        cachedPromise = apiFetch(Endpoint.ZONES)
            .then((resp) => resp.json())
            .then((zones: IZone[]) => {
                cachedValue = new Map(zones.map((z) => [z.id, z.zone_name]));
                return cachedValue;
            })
            .catch(() => {
                cachedPromise = undefined;
                return emptyValue;
            });
    }

    return cachedPromise ?? emptyValue;
};

export const useZones = (): TZoneMap => {
    const [zones, setZones] = useState<TZoneMap | undefined>(cachedValue);

    useEffect(() => {
        if (!zones) {
            getZones().then((zones) => setZones(zones));
        }
    }, [zones]);

    return zones ?? emptyValue;
};
