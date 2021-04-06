import { apiFetch, Endpoint } from "util/endpoints";
import { cachedAPIGet, cachedAPIHook, IAPICacheData } from "./cachedAPI";

interface IDisability {
    id: number;
    disability_type: string;
}

export type TDisabilityMap = Map<number, string>;

const cache: IAPICacheData<TDisabilityMap, TDisabilityMap, TDisabilityMap> = {
    doFetch: () => apiFetch(Endpoint.DISABILITIES),
    transformData: (ds: IDisability[]) => new Map(ds.map((d) => [d.id, d.disability_type])),
    promise: undefined,
    value: undefined,
    loadingValue: new Map<number, string>(),
    errorValue: new Map<number, string>(),
};

export const getDisabilities = async () => cachedAPIGet(cache);
export const useDisabilities = cachedAPIHook(cache);
