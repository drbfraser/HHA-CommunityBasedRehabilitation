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

const OTHER_DISABILITY_LABEL = "Other";

export const getOtherDisabilityId = (disabilities: TDisabilityMap): number => {
    return (
        Array.from(disabilities).find(
            (disability) => disability[1] === OTHER_DISABILITY_LABEL
        )?.[0] ?? 0
    );
};

export const getDisabilities = async () => cachedAPIGet(cache);
export const useDisabilities = cachedAPIHook(cache);
