import { useEffect, useState } from "react";
import { apiFetch, APILoadError, Endpoint, TAPILoadError } from "util/endpoints";
import { IUser } from "util/users";

let cachedPromise: Promise<IUser | TAPILoadError> | undefined = undefined;
let cachedValue: IUser | undefined = undefined;

export const getUser = async () => {
    if (!cachedPromise) {
        cachedPromise = apiFetch(Endpoint.USER_CURRENT)
            .then((resp) => resp.json())
            .then((user: IUser) => {
                cachedValue = user;
                return user;
            })
            .catch(() => {
                cachedPromise = undefined;
                return APILoadError;
            });
    }

    return cachedPromise ?? APILoadError;
};

export const useUser = () => {
    const [user, setUser] = useState<IUser | TAPILoadError | undefined>(cachedValue);

    useEffect(() => {
        if (!user) {
            getUser().then((user) => setUser(user));
        }
    }, [user]);

    return user;
};
