// TODO: Remove or rework cachedAPI calls. The mobile app should probably be caching data in a
//  database for proper persistence, not caching in TypeScript variables
import { apiFetch, Endpoint } from "../endpoints";
import { cachedAPIGet, cachedAPIHook, IAPICacheData } from "./cachedAPI";
import emptyMap from "../internal/emptyMap";

export interface IDisability {
    id: number;
    disability_type: string;
}

export type TDisabilityMap = ReadonlyMap<number, string>;

const cache: IAPICacheData<TDisabilityMap, TDisabilityMap, TDisabilityMap> = {
    doFetch: () => apiFetch(Endpoint.DISABILITIES),
    transformData: (ds: IDisability[]) => new Map(ds.map((d) => [d.id, d.disability_type])),
    promise: undefined,
    value: undefined,
    loadingValue: emptyMap,
    errorValue: emptyMap,
};

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

export const getDisabilities = async () => cachedAPIGet(cache);
export const useDisabilities = cachedAPIHook(cache);
