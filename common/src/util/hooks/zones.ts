// TODO: Remove or rework cachedAPI calls. The mobile app should probably be caching data in a
//  database for proper persistence, not caching in TypeScript variables
import { apiFetch, Endpoint } from "../endpoints";
import emptyMap from "../internal/emptyMap";
import { APICacheData } from "./cachedAPI";

export interface IZone {
    id: number;
    zone_name: string;
}

export type TZoneMap = ReadonlyMap<number, string>;

const cache = new APICacheData<TZoneMap, TZoneMap, TZoneMap>(
    "cache_zones",
    () => apiFetch(Endpoint.ZONES),
    (zones: IZone[]) =>
        new Map(
            zones
                .sort((a, b) => a.zone_name.localeCompare(b.zone_name)) // sort alphabetically
                .map((z) => [z.id, z.zone_name]),
        ),
    emptyMap,
    emptyMap,
);

export const getZones = async () => cache.getCachedValue();
export const useZones = cache.useCacheHook();
