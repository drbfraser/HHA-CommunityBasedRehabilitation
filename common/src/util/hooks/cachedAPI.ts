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
 * @return A Promise that resolves once all caches have been invalidated.
 */
export const invalidateAllCachedAPI = async (
    invalidationType: "login" | "refresh" | "logout"
): Promise<void> => {
    switch (invalidationType) {
        case "login":
            return invalidateAllCachedAPIInternal(true, true, true, true);
        case "refresh":
            return invalidateAllCachedAPIInternal(false, false, true, true);
        case "logout":
            return invalidateAllCachedAPIInternal(true, true, true, false);
        default:
            console.warn(`warning: unknown invalidation type: ${invalidationType}`);
            return invalidateAllCachedAPIInternal(false, false, false, false);
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
 *
 * @internal
 */
export const invalidateAllCachedAPIInternal = async (
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
const DEFAULT_FETCH_TIMEOUT_MILLIS = 15000;

/**
 * @internal
 */
export class APICacheData<TValue, TLoading, TError> {
    /**
     * This placeholder value will be used if the cached API data isn't ready on the first render of
     * a {@link useCacheHook}.
     */
    readonly loadingValue: Readonly<TLoading>;

    readonly errorValue: Readonly<TError>;

    get promise(): Promise<Readonly<ICachedAPIResult<TValue, TError>>> | undefined {
        return this._promise;
    }

    /**
     * The promise for an attempt at refreshing the cache, If this is undefined, it means the cache
     * has been invalidated, and a refresh attempt should be made at the next retrieval.
     *
     * Promises are created by {@link createCacheLoadPromise}.
     */
    private _promise: Promise<ICachedAPIResult<TValue, TError>> | undefined;

    /**
     * A key used for cache data backup storage. Must be unique across all instances of
     * {@link APICacheData}.
     *
     * @see CommonConfiguration.useKeyValStorageForCachedAPIBackup
     * @see getCachedValueInner
     */
    readonly cacheBackupKey: string;
    private readonly doFetch: (abortController: AbortController) => Promise<Response>;
    /**
     * A function to transform the response data into the `TValue` type.
     *
     * @param data Data from {@link doFetch}'s JSON body response (the result from
     * {@link Response.json})
     */
    private readonly transformData: (data: any) => TValue;

    private readonly invalidationEventEmitter = new EventEmitter();

    private abortController = new AbortController();

    private readonly fetchTimeoutMs: number;

    constructor(
        cacheBackupKey: string,
        doFetch: (abortController: AbortController) => Promise<Response>,
        transformData: (data: any) => TValue,
        loadingValue: TLoading,
        errorValue: TError,
        fetchTimeoutMs: number = DEFAULT_FETCH_TIMEOUT_MILLIS
    ) {
        this.cacheBackupKey = cacheBackupKey;
        this.doFetch = doFetch;
        this.transformData = transformData;
        this.loadingValue = loadingValue;
        this.errorValue = errorValue;
        this.fetchTimeoutMs = fetchTimeoutMs > 0 ? fetchTimeoutMs : DEFAULT_FETCH_TIMEOUT_MILLIS;

        allCaches.push(this);
    }

    private _value: TValue | undefined;

    /**
     * @internal Outside callers should only be using this in tests.
     */
    get value(): TValue | undefined {
        return this._value;
    }

    addInvalidationListener(listener: InvalidationListener) {
        this.invalidationEventEmitter.addListener(INVALIDATION_EVENT, listener);
    }

    removeInvalidationListener(listener: InvalidationListener) {
        this.invalidationEventEmitter.removeListener(INVALIDATION_EVENT, listener);
    }

    private async clearExistingPromise() {
        const currentPromise = this._promise;
        if (currentPromise) {
            // If we invalidate while a promise is still active, invalidation might not do anything,
            // e.g. if clearBackup is true, we might run the removeItem code below; however, the
            // leftover promise might still need to run `setItem`, resulting in the backup not being
            // invalidated at all. Could be an issue on logout.
            //
            // So we abort it and then wait for it to resolve.
            this.abortController.abort();
            await currentPromise;
        }
        this._promise = undefined;
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
     * This is useful to set to false when logging out to avoid React state updates. By default,
     * this is true.
     */
    async invalidate(
        clearValue: boolean,
        clearBackup: boolean,
        reFetch: boolean = false,
        notifyListeners: boolean = true
    ): Promise<void> {
        await this.clearExistingPromise();

        if (clearValue) {
            this._value = undefined;
        }
        if (clearBackup && commonConfiguration.useKeyValStorageForCachedAPIBackup) {
            try {
                await commonConfiguration.keyValStorageProvider.removeItem(this.cacheBackupKey);
            } catch (e) {
                console.error(
                    `invalidate(${this.cacheBackupKey}): error clearing value in backup: ${e}`
                );
            }
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
    async getCachedValue(refreshValue: boolean = false): Promise<TValue | TError> {
        if (refreshValue) {
            await this.clearExistingPromise();
        }

        const result = await this.getCachedValueInner();
        if (refreshValue) {
            this.notifyListenersAsync().catch();
        }
        return result.value;
    }

    useCacheHook(): (listenForChanges?: boolean) => TValue | TLoading | TError {
        return (listenForChanges: boolean = true) => {
            const [value, setValue] = useState<TValue | TError | undefined>(this._value);
            const isMounted = useRef(false);

            useEffect(() => {
                isMounted.current = true;

                this.getCachedValueInner().then((v) => {
                    if (isMounted.current) {
                        setValue(v.value);
                    }
                });

                if (!listenForChanges) {
                    return () => {
                        isMounted.current = false;
                    };
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

    private notifyListeners() {
        this.invalidationEventEmitter.emit(INVALIDATION_EVENT);
    }

    private async notifyListenersAsync() {
        this.invalidationEventEmitter.emit(INVALIDATION_EVENT);
    }

    private getCachedValueInner(): Promise<ICachedAPIResult<TValue, TError>> {
        // Store into a local variable to maintain consistent state (i.e. make sure we don't return
        // undefined if some other thread changes it).
        const currentPromise = this._promise;
        if (currentPromise) {
            return currentPromise;
        }

        const newPromise = this.createCacheLoadPromise();
        this._promise = newPromise;
        return newPromise;
    }

    private async createCacheLoadPromise(): Promise<ICachedAPIResult<TValue, TError>> {
        let abortController = this.abortController;
        if (abortController.signal.aborted) {
            abortController = new AbortController();
            this.abortController = abortController;
        }

        try {
            const timeoutId: any = setTimeout(() => abortController.abort(), this.fetchTimeoutMs);
            let data: any;
            try {
                const resp = await this.doFetch(abortController);
                data = await resp.json();
            } finally {
                clearTimeout(timeoutId);
            }
            // Allow the transform to happen first before deciding whether to store as
            // a backup to ensure errors from transformation happen first.
            const transformedData = this.transformData(data);
            this._value = transformedData;

            const result = this.makeCachedAPIResult(true, transformedData);
            if (commonConfiguration.useKeyValStorageForCachedAPIBackup) {
                if (abortController.signal.aborted) {
                    console.warn(`cachedAPIGet(${this.cacheBackupKey}): previous promise aborted`);
                    return this.makeCachedAPIResult(false, this.errorValue);
                }

                try {
                    await commonConfiguration.keyValStorageProvider.setItem(
                        this.cacheBackupKey,
                        JSON.stringify(data)
                    );
                } catch (e) {
                    console.error(
                        `cachedAPIGetInner(${this.cacheBackupKey}): Error saving result to key-value storage: ${e}`
                    );
                }
            }
            return result;
        } catch (e) {
            // Invalidate to force subsequent calls to attempt another network call
            // to get a fresh value. We only set the promise to undefined here; don't
            // trigger listeners, lest we enter into a loop of attempt -> fail -> notify ->
            // attempt.
            this._promise = undefined;

            const baseErrorMsg = `cachedAPIGet(${this.cacheBackupKey}): API fetch failed (${e})`;
            const existingValue = this._value;
            if (existingValue) {
                console.error(`${baseErrorMsg}; using existing value`);
                return this.makeCachedAPIResult(false, existingValue);
            }

            if (commonConfiguration.useKeyValStorageForCachedAPIBackup) {
                try {
                    const backup = await commonConfiguration.keyValStorageProvider.getItem(
                        this.cacheBackupKey
                    );
                    if (backup) {
                        const transformedBackup = this.transformData(JSON.parse(backup));
                        this._value = transformedBackup;
                        console.error(`${baseErrorMsg}; using backup`);
                        return this.makeCachedAPIResult(false, transformedBackup);
                    } else {
                        console.error(`${baseErrorMsg} and no backup; using error value"`);
                        return this.makeCachedAPIResult(false, this.errorValue);
                    }
                } catch (backupError) {
                    console.error(
                        `${baseErrorMsg} and backup retrieval failed due to ${backupError}; using error value`
                    );
                    return this.makeCachedAPIResult(false, this.errorValue);
                }
            }

            console.error(`${baseErrorMsg}; using error value`);
            return this.makeCachedAPIResult(false, this.errorValue);
        }
    }

    private makeCachedAPIResult(
        isFresh: boolean,
        value: TValue | TError
    ): ICachedAPIResult<TValue, TError> {
        return { isFresh: isFresh, value: value } as ICachedAPIResult<TValue, TError>;
    }
}

/**
 * An interface to help distinguish fresh, recent-from-the-server results from non-fresh results.
 * Fresh results are obviously never error results; this provides type-safety convenience.
 */
interface IFreshCachedAPIResult<TValue, TError> {
    readonly isFresh: true;
    readonly value: Readonly<TValue>;
}

/**
 * An interface to help distinguish stale results from fresh results.
 */
interface IStaleCachedAPIResult<TValue, TError> {
    readonly isFresh: false;
    readonly value: Readonly<TValue | TError>;
}

type ICachedAPIResult<TValue, TError> =
    | IFreshCachedAPIResult<TValue, TError>
    | IStaleCachedAPIResult<TValue, TError>;
