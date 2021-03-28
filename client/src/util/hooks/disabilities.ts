import { useEffect, useState } from "react";
import { apiFetch, Endpoint } from "util/endpoints";

export type TDisabilityMap = Map<number, string>;
const emptyValue: TDisabilityMap = new Map<number, string>();

let cachedPromise: Promise<TDisabilityMap> | undefined = undefined;
let cachedValue: TDisabilityMap | undefined = undefined;

export const getDisabilities = async () => {
    if (!cachedPromise) {
        interface IDisability {
            id: number;
            disability_type: string;
        }

        cachedPromise = apiFetch(Endpoint.DISABILITIES)
            .then((resp) => resp.json())
            .then((disabilities: IDisability[]) => {
                cachedValue = new Map(disabilities.map((d) => [d.id, d.disability_type]));
                return cachedValue;
            })
            .catch(() => {
                cachedPromise = undefined;
                return emptyValue;
            });
    }

    return cachedPromise ?? emptyValue;
};

export const useDisabilities = (): TDisabilityMap => {
    const [disabilities, setDisabilities] = useState<TDisabilityMap | undefined>(cachedValue);

    useEffect(() => {
        if (!disabilities) {
            getDisabilities().then((disabilities) => setDisabilities(disabilities));
        }
    }, [disabilities]);

    return disabilities ?? emptyValue;
};
