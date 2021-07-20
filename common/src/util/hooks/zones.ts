// TODO: Remove or rework cachedAPI calls. The mobile app should probably be caching data in a
//  database for proper persistence, not caching in TypeScript variables
import { apiFetch, Endpoint } from "../endpoints";
import { cachedAPIGet, IAPICacheData, cachedAPIHook } from "./cachedAPI";
import emptyMap from "../internal/emptyMap";

export interface IZone {
    id: number;
    zone_name: string;
}

export type TZoneMap = ReadonlyMap<number, string>;

const cache: IAPICacheData<TZoneMap, TZoneMap, TZoneMap> = {
    doFetch: () => apiFetch(Endpoint.ZONES),
    transformData: (zones: IZone[]) => new Map(zones.map((z) => [z.id, z.zone_name])),
    promise: undefined,
    value: undefined,
    loadingValue: emptyMap,
    errorValue: emptyMap,
};

export const getZones = async () => cachedAPIGet(cache);
export const useZones = cachedAPIHook(cache);
