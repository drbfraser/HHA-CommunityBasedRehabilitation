// TODO: Remove or rework cachedAPI calls. The mobile app should probably be caching data in a
//  database for proper persistence, not caching in TypeScript variables
import { apiFetch, Endpoint } from "../endpoints";
import emptyMap from "../internal/emptyMap";
import { APICacheData } from "./cachedAPI";

export interface IDisability {
    id: number;
    disability_type: string;
}

export type TDisabilityMap = ReadonlyMap<number, string>;

const cache = new APICacheData<TDisabilityMap, TDisabilityMap, TDisabilityMap>(
    "cache_disabilities",
    () => apiFetch(Endpoint.DISABILITIES),
    (ds: IDisability[]) => new Map(ds.map((d) => [d.id, d.disability_type])),
    emptyMap,
    emptyMap
);

const OTHER_DISABILITY_LABEL = "Other";

export const getOtherDisabilityId = (disabilities: TDisabilityMap): number => {
    const iterator = disabilities.entries();
    let item: IteratorResult<[number, string]> = iterator.next();
    while (!item.done) {
        if (item.value[1] === OTHER_DISABILITY_LABEL) {
            return item.value[0];
        }
        item = iterator.next();
    }
    return 0;
};

export const getDisabilities = async () => cache.getCachedValue();
export const useDisabilities = cache.useCacheHook();
