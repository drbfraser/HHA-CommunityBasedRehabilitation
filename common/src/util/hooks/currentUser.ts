// TODO: Remove or rework cachedAPI calls. The mobile app should probably be caching data in a
//  database for proper persistence, not caching in TypeScript variables
import { apiFetch, APILoadError, Endpoint, TAPILoadError } from "../endpoints";
import { IUser } from "../users";
import { APICacheData } from "./cachedAPI";

const cache = new APICacheData<IUser, undefined, TAPILoadError>(
    "cache_user",
    () => apiFetch(Endpoint.USER_CURRENT),
    (user: IUser) => user,
    undefined,
    APILoadError
);

export const getCurrentUser = async (refreshValue: boolean = false) =>
    cache.getCachedValue(refreshValue);
export const useCurrentUser = cache.useCacheHook();
