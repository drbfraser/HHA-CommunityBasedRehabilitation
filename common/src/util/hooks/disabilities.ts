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
    emptyMap,
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
    const dict = physiotherapyConditions(t);
    const desiredOrder = Object.keys(dict);

    const items = Array.from(disabilities.entries()).map(([id, name]) => {
        const rawName = String(name);
        const normalized = rawName.toLowerCase().replace(/[’]/g, "'");
        const translation = dict[normalized];
        const label = translation ?? rawName;
        if (!translation) {
            console.warn(`unknown disability name: ${normalized}`);
        }
        const idx = desiredOrder.indexOf(normalized);
        const weight = idx === -1 ? Number.MAX_SAFE_INTEGER : idx;
        return { id, label, weight } as { id: number; label: string; weight: number };
    });

    items.sort((a, b) =>
        a.weight !== b.weight ? a.weight - b.weight : a.label.localeCompare(b.label),
    );

    const orderedMap = new Map<number, string>();
    items.forEach(({ id, label }) => orderedMap.set(id, label));
    return orderedMap;
};
