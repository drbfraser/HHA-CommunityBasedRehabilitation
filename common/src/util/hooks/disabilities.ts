// TODO: Remove or rework cachedAPI calls. The mobile app should probably be caching data in a
//  database for proper persistence, not caching in TypeScript variables
import { apiFetch, Endpoint } from "../endpoints";
import { cachedAPIGet, cachedAPIHook, IAPICacheData } from "./cachedAPI";

export interface IDisability {
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

const OTHER_DISABILITY_LABEL = "Other";

export const getOtherDisabilityId = (disabilities: TDisabilityMap): number => {
    return (
        Array.from(disabilities).find(
            ([, disabilityType]) => disabilityType === OTHER_DISABILITY_LABEL
        )?.[0] ?? 0
    );
};

export const getDisabilities = async () => cachedAPIGet(cache);
export const useDisabilities = cachedAPIHook(cache);
