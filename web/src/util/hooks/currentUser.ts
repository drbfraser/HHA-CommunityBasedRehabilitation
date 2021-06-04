import { apiFetch, APILoadError, Endpoint, TAPILoadError } from "util/endpoints";
import { IUser } from "util/users";
import { cachedAPIGet, cachedAPIHook, IAPICacheData } from "./cachedAPI";

const cache: IAPICacheData<IUser, undefined, TAPILoadError> = {
    doFetch: () => apiFetch(Endpoint.USER_CURRENT),
    transformData: (user: IUser) => user,
    promise: undefined,
    value: undefined,
    loadingValue: undefined,
    errorValue: APILoadError,
};

export const getCurrentUser = async () => cachedAPIGet(cache);
export const useCurrentUser = cachedAPIHook(cache);
