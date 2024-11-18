// TODO: Remove or rework cachedAPI calls. The mobile app should probably be caching data in a
//  database for proper persistence, not caching in TypeScript variables
import { TFunction } from "i18next";
import { apiFetch, Endpoint } from "../endpoints";
import emptyMap from "../internal/emptyMap";
import { APICacheData } from "./cachedAPI";
import { physiotherapyConditions } from "../referrals";

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

export const useDisabilities = (t: TFunction) => {
    const disabilities = cache.useCacheHook()();
    const translatedDisabilities = new Map();

    disabilities.forEach((name, key) => {
        // sanitize string before using it to lookup in common dictionary
        // also replaces non-ascii apostrophes with ascii apostrophes
        name = name.toLowerCase().replace(/[’]/g, "'");

        const translation = physiotherapyConditions(t)[name.toLowerCase()];
        if (!translation) {
            console.error(`unknown disability name: ${name.toLowerCase()}`);
            return;
        }

        translatedDisabilities.set(key, translation);
    });

    return translatedDisabilities;
};

// todosd: remove, or update common tests (disabilities.spec.ts)
export const useDisabilitiesTest = cache.useCacheHook();