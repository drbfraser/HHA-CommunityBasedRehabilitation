import React, { useEffect, useRef, useState } from "react";
import { commonConfiguration } from "../../init";
import EventEmitter from "events";

export type InvalidationListener = () => void;

const allCaches: APICacheData<any, any, any>[] = [];

/**
 * @internal For test purposes only.
 */
export const untrackAllCaches = () => {
    while (allCaches.length != 0) {
        allCaches.pop();
    }
};

/**
 * Invalidates all cached API and forces any active listeners of all caches to refetch API data
 * from the server.
 *
 * @return A Promise that resolves once all caches have been invalidated. If `reFetch` is true,
 * this will end up waiting until all caches have attempted a fetch with the server.
 * @param clearValues Whether to clear the current in-memory values of all caches. The consequence
 * of this is that if a cache is invalidated and a subsequent API fetch and backup retrieval (if
 * configured) both fail, the error value will be used instead of the previous in-memory value.
 * @param clearBackups Whether to clear the backed up values of all caches. This only takes effect
 * if {@link CommonConfiguration.useKeyValStorageForCachedAPIBackup} is set.
 * @param reFetch Whether to re-fetch the value from the server.
 * @param notifyListeners Whether to notify listeners that the cache has been invalidated. This is
 * useful when logging out to avoid React state updates. By default, this is true.
 */
export const invalidateAllCachedAPI = async (
    clearValues: boolean,
    clearBackups: boolean,
    reFetch: boolean,
    notifyListeners: boolean = true
): Promise<void> => {
    await Promise.all(
        allCaches.map((cache) =>
            cache.invalidate(clearValues, clearBackups, reFetch, notifyListeners)
        )
    );
};

const INVALIDATION_EVENT = "cacheInvalidation";

export class APICacheData<TValue, TLoading, TError> {
    /**
     * This placeholder value will be used if the cached API data isn't ready on the first render of
     * a {@link useCacheHook}.
     */
    readonly loadingValue: Readonly<TLoading>;

    readonly errorValue: Readonly<TError>;

    get promise(): Promise<CachedAPIResult<TValue, TError>> | undefined {
        return this._promise;
    }

    private _promise: Promise<CachedAPIResult<TValue, TError>> | undefined;

    /**
     * A key used for cache data backup storage. Must be unique across all instances of
     * {@link APICacheData}.
     *
     * @see CommonConfiguration.useKeyValStorageForCachedAPIBackup
     * @see getCachedValueInner
     */
    private readonly cacheBackupKey: string;
    private readonly doFetch: () => Promise<Response>;
    /**
     * A function to transform the response data into the `TValue` type.
     *
     * @param data Data from {@link doFetch}'s JSON body response (the result from
     * {@link Response.json})
     */
    private readonly transformData: (data: any) => TValue;

    private invalidationEventEmitter = new EventEmitter();

    constructor(
        cacheBackupKey: string,
        doFetch: () => Promise<Response>,
        transformData: (data: any) => TValue,
        loadingValue: TLoading,
        errorValue: TError
    ) {
        this.cacheBackupKey = cacheBackupKey;
        this.doFetch = doFetch;
        this.transformData = transformData;
        this.loadingValue = loadingValue;
        this.errorValue = errorValue;

        allCaches.push(this);
    }

    private _value: TValue | undefined;

    get value(): TValue | undefined {
        return this._value;
    }

    addInvalidationListener(listener: InvalidationListener) {
        this.invalidationEventEmitter.addListener(INVALIDATION_EVENT, listener);
    }

    removeInvalidationListener(listener: InvalidationListener) {
        this.invalidationEventEmitter.removeListener(INVALIDATION_EVENT, listener);
    }

    /**
     * Invalidates all cached API and forces any active listeners of all caches to refetch API data
     * from the server.
     *
     * @param clearValue Whether to clear the current in-memory value of the cache. The consequence
     * of this is that if the cache is invalidated and a subsequent API fetch and backup retrieval
     * (if configured) both fail, the error value will be used instead of the previous in-memory
     * value.
     * @param clearBackup Whether to clear the backed up value for this cache. This only takes
     * effect if {@link CommonConfiguration.useKeyValStorageForCachedAPIBackup} is set.
     * @param reFetch Whether to re-fetch the value from the server. By default, this is false.
     * @param notifyListeners Whether to notify listeners that the cache has been invalidated.
     * This is useful when logging out to avoid React state updates. By default, this is true.
     */
    async invalidate(
        clearValue: boolean,
        clearBackup: boolean,
        reFetch: boolean = false,
        notifyListeners: boolean = true
    ): Promise<void> {
        console.log(
            `${this.cacheBackupKey}: invalidating cache (clearValue: ${clearValue}, clearBackup: ${clearBackup}, reFetch: ${reFetch}, notifyListeners: ${notifyListeners})`
        );

        this._promise = undefined;

        if (clearValue) {
            this._value = undefined;
        }
        if (clearBackup && commonConfiguration.useKeyValStorageForCachedAPIBackup) {
            await commonConfiguration.keyValStorageProvider
                .removeItem(this.cacheBackupKey)
                .catch((e) =>
                    console.log(
                        `invalidate(${this.cacheBackupKey}): error clearing value in backup: ${e}`
                    )
                );
        }

        if (reFetch) {
            // Wait until we've attempted to re-fetch before notifying listeners.
            await this.getCachedValueInner();
        }

        if (notifyListeners) {
            this.notifyListeners();
        }
    }

    /**
     * Retrieves the cached value. If the cache doesn't have any value loaded in memory (i.e.
     * {@link value} is undefined because first-time usage or {@link invalidate} was called), then
     * the in-memory value will be initialized.
     *
     * Initialization is done in the following manner:
     *
     * - {@link doFetch} and {@link transformData} are invoked. Typically, this causes a
     *   network call. On a successful fetch, the backup value is updated.
     * - If the network fetch or transformation fail for any reason, the previous {@link _value} is
     *   used if {@link invalidate} was called with `clearValue` false. Otherwise, the backup value
     *   will be used if {@link CommonConfiguration.useKeyValStorageForCachedAPIBackup} is true.
     * - If backup isn't configured or backup retrieval fails (no backup available, the
     *   storage provider returns an error, etc.), then the Promise will resolve to the
     *   {@link errorValue}.
     *
     * @param refreshValue Whether to refresh the cache's value by attempting a refetch from the
     * server. This will notify listeners. By default, this is false.
     */
    getCachedValue(refreshValue: boolean = false): Promise<TValue | TError> {
        if (refreshValue) {
            this._promise = undefined;
        }

        return this.getCachedValueInner().then((result) => {
            if (refreshValue) {
                this.notifyListenersAsync().catch();
            }

            return result.value;
        });
    }

    useCacheHook(): () => TValue | TLoading | TError {
        return () => {
            const [value, setValue] = useState<TValue | TError | undefined>(this._value);
            const isMounted = useRef(false);

            useEffect(() => {
                isMounted.current = true;

                if (this.isInvalidated) {
                    this.getCachedValueInner().then((v) => {
                        if (isMounted.current) {
                            setValue(v.value);
                        }
                    });
                }

                const listener: InvalidationListener = () => {
                    this.getCachedValueInner().then((v) => {
                        if (isMounted.current) {
                            setValue(v.value);
                        }
                    });
                };
                this.addInvalidationListener(listener);
                return () => {
                    isMounted.current = false;
                    this.removeInvalidationListener(listener);
                };
            }, []);

            return value ?? this.loadingValue;
        };
    }

    get isInvalidated(): boolean {
        return this._promise === undefined;
    }

    private notifyListeners() {
        this.invalidationEventEmitter.emit(INVALIDATION_EVENT);
    }

    private async notifyListenersAsync() {
        this.invalidationEventEmitter.emit(INVALIDATION_EVENT);
    }

    private getCachedValueInner(): Promise<CachedAPIResult<TValue, TError>> {
        // Store into a local variable to maintain consistent state (i.e. make sure we don't return
        // undefined if some other thread changes it).
        const currentPromise = this._promise;
        if (currentPromise) {
            return currentPromise;
        }

        const newPromise = this.doFetch()
            .then((resp) => resp.json())
            .then((data) => {
                // Allow the transform to happen first before deciding whether to store as
                // a backup to ensure errors from transformation happen first.
                const transformedData = this.transformData(data);
                this._value = transformedData;

                const result = this.makeCachedAPIResult(true, transformedData);
                return commonConfiguration.useKeyValStorageForCachedAPIBackup
                    ? commonConfiguration.keyValStorageProvider
                          .setItem(this.cacheBackupKey, JSON.stringify(data))
                          .catch((e) => {
                              console.error(
                                  `cachedAPIGetInner(${this.cacheBackupKey}): Error saving result to key-value storage: ${e}`
                              );
                          })
                          .then(() => result)
                    : result;
            })
            .catch((e) => {
                // Invalidate to force subsequent calls to attempt another network call
                // to get a fresh value. We only set the promise to undefined to prevent
                // listeners from being triggered.
                this._promise = undefined;

                const existingValue = this._value;
                if (existingValue) {
                    console.log(
                        `cachedAPIGet(${this.cacheBackupKey}): API fetch failed (${e}); using existing value`
                    );
                    return this.makeCachedAPIResult(false, existingValue);
                }

                if (commonConfiguration.useKeyValStorageForCachedAPIBackup) {
                    return this.loadBackupValue();
                }

                console.log(
                    `cachedAPIGet(${this.cacheBackupKey}): API fetch failed (${e}); using error value`
                );
                return this.makeCachedAPIResult(false, this.errorValue);
            });
        this._promise = newPromise;
        return newPromise;
    }

    /**
     * Loads a backup value for the cache for use when the device is offline / can't connect to
     * the server.
     */
    private async loadBackupValue(): Promise<CachedAPIResult<TValue, TError>> {
        const baseErrorMsg = `cachedAPIGet(${this.cacheBackupKey}): API fetch failed`;
        try {
            const cachedItem = await commonConfiguration.keyValStorageProvider.getItem(
                this.cacheBackupKey
            );
            if (cachedItem) {
                this._value = this.transformData(JSON.parse(cachedItem));
                console.log(baseErrorMsg + "; using backup");
                return this.makeCachedAPIResult(false, this._value);
            } else {
                console.log(baseErrorMsg + " and no backup; using error value");
                return this.makeCachedAPIResult(false, this.errorValue);
            }
        } catch (e) {
            console.log(
                baseErrorMsg + ` and backup retrieval failed due to ${e}; using error value`
            );
            return this.makeCachedAPIResult(false, this.errorValue);
        }
    }

    private makeCachedAPIResult(
        isFresh: boolean,
        value: TValue | TError
    ): CachedAPIResult<TValue, TError> {
        return { isFresh: isFresh, value: value } as CachedAPIResult<TValue, TError>;
    }
}

/**
 * An interface to help distinguish fresh, recent-from-the-server results from non-fresh results.
 * Fresh results are obviously never error results; this provides type-safety convenience.
 */
interface FreshCachedAPIResult<TValue, TError> {
    readonly isFresh: true;
    readonly value: TValue;
}

/**
 * An interface to help distinguish stale results from fresh results.
 */
interface NonFreshCachedAPIResult<TValue, TError> {
    readonly isFresh: false;
    readonly value: TValue | TError;
}

type CachedAPIResult<TValue, TError> =
    | FreshCachedAPIResult<TValue, TError>
    | NonFreshCachedAPIResult<TValue, TError>;
