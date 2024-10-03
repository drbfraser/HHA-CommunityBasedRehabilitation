// TODO: Remove or rework cachedAPI calls. The mobile app should probably be caching data in a
//  database for proper persistence, not caching in TypeScript variables
import { TFunction } from "i18next";
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
// export const useDisabilities = cache.useCacheHook();

export const useDisabilities = (t: TFunction) => {
    const translations: { [key: string]: string } = {
        Amputee: t("disabilities.amputee"),
        Polio: t("disabilities.polio"),
        "Spinal cord injury": t("disabilities.spinalCordInjury"),
        "Cerebral palsy": t("disabilities.cerebralPalsy"),
        "Spina bifida": t("disabilities.spinaBifida"),
        Hydrocephalus: t("disabilities.hydrocephalus"),
        "Congenital Abnormalities": t("disabilities.congenitalAbnormality"),
        "Paralysis Cases": t("disabilities.paralysisCases"),
        "Don’t know": t("disabilities.dontKnow"),
        Other: t("disabilities.other"),
    };

    const disabilities = cache.useCacheHook()();
    const translatedDisabilities = new Map();

    disabilities.forEach((name, key) => {
        const translation = translations[name];
        if (!translation) {
            console.error(`unknown disability name: ${name}`);
            return;
        }

        translatedDisabilities.set(key, translation);
    });

    return translatedDisabilities;
};
