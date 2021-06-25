// TODO: Remove or rework cachedAPI calls. The mobile app should probably be caching data in a
//  database for proper persistence, not caching in TypeScript variables
import { useEffect, useState } from "react";

export interface IAPICacheData<TValue, TLoading, TError> {
    doFetch: () => Promise<Response>;
    transformData: (data: any) => TValue;
    promise: Promise<TValue | TError> | undefined;
    value: TValue | undefined;
    loadingValue: TLoading;
    errorValue: TError;
}

export function cachedAPIGet<TValue, TLoading, TError>(
    cache: IAPICacheData<TValue, TLoading, TError>
): Promise<TValue | TError> {
    if (!cache.promise) {
        cache.promise = cache
            .doFetch()
            .then((resp) => resp.json())
            .then((data) => {
                cache.value = cache.transformData(data);
                return cache.value;
            })
            .catch(() => {
                cache.promise = undefined;
                return cache.errorValue;
            });
    }

    return cache.promise ?? Promise.resolve(cache.errorValue);
}

export function cachedAPIHook<TValue, TLoading, TError>(
    cache: IAPICacheData<TValue, TLoading, TError>
): () => TValue | TLoading | TError {
    return () => {
        const [value, setValue] = useState<TValue | TError | undefined>(cache.value);

        useEffect(() => {
            if (!value) {
                cachedAPIGet(cache).then((v) => setValue(v));
            }
        }, [value]);

        return value ?? cache.loadingValue;
    };
}
